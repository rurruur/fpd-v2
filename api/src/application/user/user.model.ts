import bcrypt from "bcrypt";
import {
  BaseModelClass,
  ListResult,
  asArray,
  NotFoundException,
  BadRequestException,
  api,
  Context,
} from "sonamu";
import {
  UserSubsetKey,
  UserSubsetMapping,
  UserSubsetSS,
} from "../sonamu.generated";
import { userSubsetQueries } from "../sonamu.generated.sso";
import {
  UserJoinParams,
  UserListParams,
  UserLoginParams,
  UserSaveParams,
} from "./user.types";
import { validatePassword, validatePhone } from "./user.functions";

/*
  User Model
*/
class UserModelClass extends BaseModelClass {
  modelName = "User";

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "User",
    guards: ["admin"],
  })
  async findById<T extends UserSubsetKey>(
    subset: T,
    id: number
  ): Promise<UserSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 User ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends UserSubsetKey>(
    subset: T,
    listParams: UserListParams
  ): Promise<UserSubsetMapping[T] | null> {
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
    resourceName: "Users",
    guards: ["admin"],
  })
  async findMany<T extends UserSubsetKey>(
    subset: T,
    params: UserListParams = {}
  ): Promise<ListResult<UserSubsetMapping[T]>> {
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
      subsetQuery: userSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("users.id", asArray(params.id));
        }
        // phone
        if (params.phone) {
          qb.whereIn("users.phone", asArray(params.phone));
        }
        // name
        if (params.name) {
          qb.whereIn("users.name", asArray(params.name));
        }
        // nickname
        if (params.nickname) {
          qb.whereIn("users.nickname", asArray(params.nickname));
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("users.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("users.field", "like", `%${params.keyword}%`);
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
          qb.orderBy("users." + orderByField, orderByDirec);
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
  async save(spa: UserSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("users", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "users");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("users").whereIn("users.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "GET", clients: ["swr"] })
  async me({ user }: Context): Promise<UserSubsetSS | null> {
    if (!user) {
      return null;
    }

    return this.findById("SS", user.id);
  }

  @api({ httpMethod: "POST" })
  async join(params: UserJoinParams): Promise<number> {
    const wdb = this.getDB("w");

    const exists = await wdb("users")
      .where("phone", params.phone)
      .orWhere("name", params.name)
      .orWhere("nickname", params.nickname)
      .select("phone", "name", "nickname");
    if (exists.some((e) => e.phone === params.phone)) {
      throw new BadRequestException("이미 가입된 전화번호입니다.");
    }
    if (exists.some((e) => e.name === params.name)) {
      throw new BadRequestException("이미 가입된 이름입니다.");
    }
    if (exists.some((e) => e.nickname === params.nickname)) {
      throw new BadRequestException("이미 가입된 닉네임입니다.");
    }

    if (!validatePhone(params.phone)) {
      throw new BadRequestException("휴대폰번호 형식이 올바르지 않습니다.");
    }
    if (!validatePassword(params.password)) {
      throw new BadRequestException("비밀번호는 8자 이상이어야 합니다.");
    }

    const sp: UserSaveParams = {
      ...params,
      phone: params.phone.replace(/-/g, ""),
      password: await this.hashPassword(params.password),
      role: "pending",
    };

    const [id] = await this.save([sp]);

    return id;
  }

  @api({ httpMethod: "POST" })
  async login(
    params: UserLoginParams,
    context: Context
  ): Promise<UserSubsetSS> {
    const { phone, password } = params;

    const wdb = this.getDB("w");
    const [found] = await wdb("users")
      .select("id", "password")
      .where("phone", phone)
      .limit(1);
    if (!found) {
      throw new NotFoundException("존재하지 않는 전화번호입니다.");
    }
    if (!(await this.verifyPassword(password, found.password))) {
      throw new BadRequestException("비밀번호가 일치하지 않습니다.");
    }

    const userSS = await this.findById("SS", found.id);
    await context.passport.login(userSS);

    return userSS;
  }

  @api({ httpMethod: "POST", guards: ["pending"] })
  async logout(context: Context): Promise<void> {
    await context.passport.logout();
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async approve(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("users").whereIn("id", ids).update({
        role: "normal",
      });
    });

    return ids.length;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const UserModel = new UserModelClass();
