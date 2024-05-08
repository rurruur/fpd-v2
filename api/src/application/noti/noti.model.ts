import {
  BadRequestException,
  BaseModelClass,
  Context,
  ListResult,
  NotFoundException,
  api,
  asArray,
} from "sonamu";
import { NotiSubsetKey, NotiSubsetMapping } from "../sonamu.generated";
import { notiSubsetQueries } from "../sonamu.generated.sso";
import { NotiListParams, NotiSaveParams } from "./noti.types";

/*
  Noti Model
*/
class NotiModelClass extends BaseModelClass {
  modelName = "Noti";

  @api({ httpMethod: "GET", clients: ["axios", "swr"], resourceName: "Noti" })
  async findById<T extends NotiSubsetKey>(
    subset: T,
    id: number
  ): Promise<NotiSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Noti ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends NotiSubsetKey>(
    subset: T,
    listParams: NotiListParams
  ): Promise<NotiSubsetMapping[T] | null> {
    const { rows } = await this.findMany(subset, {
      ...listParams,
      num: 1,
      page: 1,
    });

    return rows[0] ?? null;
  }

  @api({ httpMethod: "GET", clients: ["axios", "swr"], resourceName: "Notis" })
  async findMany<T extends NotiSubsetKey>(
    subset: T,
    params: NotiListParams = {}
  ): Promise<ListResult<NotiSubsetMapping[T]>> {
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
      subsetQuery: notiSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("notis.id", asArray(params.id));
        }
        // user_id
        if (params.user_id) {
          qb.where("notis.user_id", params.user_id);
        }
        // read
        if (params.read !== undefined) {
          qb.where("notis.read", params.read);
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("notis.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("notis.field", "like", `%${params.keyword}%`);
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
          qb.orderBy("notis." + orderByField, orderByDirec);
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

  @api({ httpMethod: "POST" })
  async save(spa: NotiSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("notis", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "notis");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("notis").whereIn("notis.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "POST", guards: ["normal"] })
  async read(ids: number[], { user }: Context): Promise<number> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("notis")
        .whereIn("id", ids)
        .where("user_id", user.id)
        .update({ read: true });
    });

    return ids.length;
  }
}

export const NotiModel = new NotiModelClass();
