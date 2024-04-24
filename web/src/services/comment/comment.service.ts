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
import { CommentSubsetKey, CommentSubsetMapping } from "../sonamu.generated";
import {
  CommentListParams,
  CommentSaveParams,
  CommentSaveMineParams,
} from "./comment.types";

export namespace CommentService {
  export function useComment<T extends CommentSubsetKey>(
    subset: T,
    id: number,
    options?: SwrOptions
  ): SWRResponse<CommentSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/comment/findById`, { subset, id }],
        options?.conditional
      )
    );
  }
  export async function getComment<T extends CommentSubsetKey>(
    subset: T,
    id: number
  ): Promise<CommentSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/comment/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useComments<T extends CommentSubsetKey>(
    subset: T,
    params: CommentListParams = {},
    options?: SwrOptions
  ): SWRResponse<ListResult<CommentSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/comment/findMany`, { subset, params }],
        options?.conditional
      )
    );
  }
  export async function getComments<T extends CommentSubsetKey>(
    subset: T,
    params: CommentListParams = {}
  ): Promise<ListResult<CommentSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/comment/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: CommentSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/comment/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/comment/del`,
      data: { ids },
    });
  }

  export async function saveMine(smp: CommentSaveMineParams): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/comment/saveMine`,
      data: { smp },
    });
  }

  export async function delMine(id: number): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/comment/delMine`,
      data: { id },
    });
  }
}
