import { z } from "zod";
import qs from "qs";
import useSWR, { SWRResponse } from "swr";
import {
  fetch,
  ListResult,
  SWRError,
  SwrOptions,
  handleConditional,
  swrPostFetcher,
} from "../sonamu.shared";
import { NotiSubsetKey, NotiSubsetMapping } from "../sonamu.generated";
import { NotiListParams, NotiSaveParams } from "./noti.types";

export namespace NotiService {
  export function useNoti<T extends NotiSubsetKey>(
    subset: T,
    id: number,
    options?: SwrOptions
  ): SWRResponse<NotiSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/noti/findById`, { subset, id }],
        options?.conditional
      )
    );
  }
  export async function getNoti<T extends NotiSubsetKey>(
    subset: T,
    id: number
  ): Promise<NotiSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/noti/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useNotis<T extends NotiSubsetKey>(
    subset: T,
    params: NotiListParams = {},
    options?: SwrOptions
  ): SWRResponse<ListResult<NotiSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/noti/findMany`, { subset, params }],
        options?.conditional
      )
    );
  }
  export async function getNotis<T extends NotiSubsetKey>(
    subset: T,
    params: NotiListParams = {}
  ): Promise<ListResult<NotiSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/noti/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: NotiSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/noti/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/noti/del`,
      data: { ids },
    });
  }

  export async function read(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/noti/read`,
      data: { ids },
    });
  }
}
