import { uniqBy } from "lodash";
import {
  BadRequestException,
  BaseModelClass,
  Context,
  ListResult,
  NotFoundException,
  UnauthorizedException,
  api,
  asArray,
} from "sonamu";
import { NotiModel } from "../noti/noti.model";
import { CommentSubsetKey, CommentSubsetMapping } from "../sonamu.generated";
import { commentSubsetQueries } from "../sonamu.generated.sso";
import {
  CommentListParams,
  CommentSaveMineParams,
  CommentSaveParams,
} from "./comment.types";

/*
  Comment Model
*/
class CommentModelClass extends BaseModelClass {
  modelName = "Comment";

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "Comment",
  })
  async findById<T extends CommentSubsetKey>(
    subset: T,
    id: number
  ): Promise<CommentSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Comment ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends CommentSubsetKey>(
    subset: T,
    listParams: CommentListParams
  ): Promise<CommentSubsetMapping[T] | null> {
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
    resourceName: "Comments",
  })
  async findMany<T extends CommentSubsetKey>(
    subset: T,
    params: CommentListParams = {}
  ): Promise<ListResult<CommentSubsetMapping[T]>> {
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
      subsetQuery: commentSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("comments.id", asArray(params.id));
        }

        // post_id
        if (params.post_id) {
          qb.whereIn("comments.post_id", asArray(params.post_id));
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("comments.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("comments.field", "like", `%${params.keyword}%`);
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
          qb.orderBy("comments." + orderByField, orderByDirec);
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
  async save(spa: CommentSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("comments", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "comments");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("comments").whereIn("comments.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async saveMine(
    smp: CommentSaveMineParams,
    { user }: Context
  ): Promise<number> {
    if (!user) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }

    if (smp.id) {
      const comment = await this.findById("A", smp.id);
      if (comment.user?.id !== user.id) {
        throw new UnauthorizedException("본인의 댓글만 수정할 수 있습니다.");
      }
    } else {
      // 새 댓글 작성 시 알림
      const wdb = this.getDB("w");

      const [author]: { user_id: number }[] = await wdb("posts as p")
        .where("p.id", smp.post_id)
        .select("p.user_id");
      const users: { user_id: number }[] = await wdb("comments as c")
        .where("c.post_id", smp.post_id)
        .select("c.user_id");
      const userIds = uniqBy([...users, author], (e) => e.user_id)
        .map((e) => e.user_id)
        .filter((e) => e !== user.id);

      await NotiModel.save(
        userIds.map((user_id) => ({
          user_id,
          post_id: smp.post_id,
          read: false,
          content: `게시글에 댓글이 달렸습니다.\n${smp.name}: ${smp.content}`,
        }))
      );
    }

    const sp: CommentSaveParams = {
      ...smp,
      user_id: user.id,
    };

    const [id] = await this.save([sp]);

    return id;
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async delMine(id: number, { user }: Context): Promise<number> {
    if (!user) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }

    const comment = await this.findById("A", id);
    if (comment.user?.id !== user.id) {
      throw new UnauthorizedException("본인의 댓글만 삭제할 수 있습니다.");
    }

    return this.del([id]);
  }
}

export const CommentModel = new CommentModelClass();
