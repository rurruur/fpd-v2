import {
  BaseModelClass,
  ListResult,
  asArray,
  NotFoundException,
  BadRequestException,
  api,
  Context,
  UnauthorizedException,
} from "sonamu";
import { PostSubsetKey, PostSubsetMapping } from "../sonamu.generated";
import { postSubsetQueries } from "../sonamu.generated.sso";
import { PostListParams, PostSaveParams, PostWriteParams } from "./post.types";
import { s3 } from "../file/uploader";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

/*
  Post Model
*/
class PostModelClass extends BaseModelClass {
  modelName = "Post";

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "Post",
    guards: ["normal"],
  })
  async findById<T extends PostSubsetKey>(
    subset: T,
    id: number
  ): Promise<PostSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Post ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends PostSubsetKey>(
    subset: T,
    listParams: PostListParams
  ): Promise<PostSubsetMapping[T] | null> {
    const { rows } = await this.findMany(subset, {
      ...listParams,
      num: 1,
      page: 1,
    });

    return rows[0] ?? null;
  }

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "Posts",
    guards: ["normal"],
  })
  async findMany<T extends PostSubsetKey>(
    subset: T,
    params: PostListParams = {}
  ): Promise<ListResult<PostSubsetMapping[T]>> {
    // params with defaults
    params = {
      num: 24,
      page: 1,
      search: "id",
      orderBy: "id-desc",
      ...params,
    };

    // build queries
    let { rows, total } = await this.runSubsetQuery({
      subset,
      params,
      subsetQuery: postSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("posts.id", asArray(params.id));
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("posts.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("posts.field", "like", `%${params.keyword}%`);
          } else {
            throw new BadRequestException(
              `구현되지 않은 검색 필드 ${params.search}`
            );
          }
        }

        // orderBy
        if (params.orderBy) {
          // default orderBy
          const [orderByField, orderByDirec] = params.orderBy.split("-");
          qb.orderBy("posts." + orderByField, orderByDirec);
        }

        return qb;
      },
      debug: false,
    });

    return {
      rows,
      total,
    };
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async save(spa: PostSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("posts", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "posts");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("posts").whereIn("posts.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async write(wp: PostWriteParams, { user }: Context): Promise<number> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    if (wp.id) {
      const post = await this.findById("A", wp.id);
      if (post.user_id !== user.id) {
        throw new UnauthorizedException("본인의 글만 수정할 수 있습니다.");
      }
    }

    const sp: PostSaveParams = {
      ...wp,
      user_id: user.id,
      views: 0,
      file_url: wp.file_url ?? null,
    };
    console.log(sp);
    const [id] = await this.save([sp]);

    return id;
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async delMine(ids: number[], { user }: Context): Promise<number> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const wdb = this.getDB("w");
    const posts = await wdb("posts")
      .whereIn("id", ids)
      .where("user_id", user.id)
      .select("id");
    if (posts.length !== ids.length) {
      throw new UnauthorizedException("본인의 글만 삭제할 수 있습니다.");
    }

    return this.del(ids);
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async increaseViews(id: number): Promise<void> {
    const wdb = this.getDB("w");
    const result = await wdb("posts").where("id", id).increment("views", 1);

    console.log(result);
  }

  @api({ httpMethod: "POST", guards: ["normal"], clients: ["axios-multipart"] })
  async uploadFile(context: Context): Promise<{ url?: string }> {
    const file = await context.file();
    const key = `${randomUUID()}.${file.mimetype.split("/")[1]}`;

    // size 제한
    if (file.size > 1024 * 1024 * 10) {
      throw new BadRequestException("파일 크기는 10MB 이하로 업로드해주세요.");
    }

    const createResult = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: "fpdiary",
        Key: key,
        ACL: "public-read",
      })
    );
    const uploadResult = await s3.send(
      new UploadPartCommand({
        Bucket: "fpdiary",
        Key: createResult.Key,
        Body: await file.toBuffer(),
        PartNumber: 1,
        UploadId: createResult.UploadId,
      })
    );
    const completeResult = await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: "fpdiary",
        Key: createResult.Key,
        UploadId: createResult.UploadId,
        MultipartUpload: {
          Parts: [
            {
              ETag: uploadResult.ETag,
              PartNumber: 1,
            },
          ],
        },
      })
    );

    return {
      url: completeResult.Location,
    };
  }
}

export const PostModel = new PostModelClass();
