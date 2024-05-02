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
import { PostSubsetKey, PostSubsetMapping } from "../sonamu.generated";
import { PostListParams, PostSaveParams, PostWriteParams } from "./post.types";

export namespace PostService {
  export function usePost<T extends PostSubsetKey>(
    subset: T,
    id: number,
    options?: SwrOptions
  ): SWRResponse<PostSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/post/findById`, { subset, id }],
        options?.conditional
      )
    );
  }
  export async function getPost<T extends PostSubsetKey>(
    subset: T,
    id: number
  ): Promise<PostSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/post/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function usePosts<T extends PostSubsetKey>(
    subset: T,
    params: PostListParams = {},
    options?: SwrOptions
  ): SWRResponse<ListResult<PostSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/post/findMany`, { subset, params }],
        options?.conditional
      )
    );
  }
  export async function getPosts<T extends PostSubsetKey>(
    subset: T,
    params: PostListParams = {}
  ): Promise<ListResult<PostSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/post/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: PostSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/post/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/post/del`,
      data: { ids },
    });
  }

  export async function write(wp: PostWriteParams): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/post/write`,
      data: { wp },
    });
  }

  export async function delMine(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/post/delMine`,
      data: { ids },
    });
  }

  export async function increaseViews(id: number): Promise<void> {
    return fetch({
      method: "POST",
      url: `/api/post/increaseViews`,
      data: { id },
    });
  }

  export async function uploadFile(
    file: File,
    onUploadProgress?: (pe: ProgressEvent) => void
  ): Promise<{ url?: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return fetch({
      method: "POST",
      url: `/api/post/uploadFile`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
      data: formData,
    });
  }
}
