import React, { useEffect } from "react";
import { PostService } from "../services/post/post.service";
import {
  List,
  ListContent,
  ListDescription,
  ListHeader,
  ListItem,
  ListIcon,
  Pagination,
} from "semantic-ui-react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { useListParams } from "@sonamu-kit/react-sui";
import { PostBaseListParams } from "src/services/sonamu.generated";

export default function PublicIndexPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { register, listParams } = useListParams(PostBaseListParams, {
    num: 20,
    page: 1,
    orderBy: "id-desc",
  });

  const { data, isLoading: listLoading } = PostService.usePosts(
    "P",
    listParams
  );

  const { rows, total } = data ?? {};

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (user?.role === "pending") {
      navigate("/pending");
    }
  }, [user, loading]);

  return (
    <>
      {listLoading || loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <List relaxed className="post-list">
            {rows?.map((e) => (
              <ListItem key={e.id} className="post-item">
                <ListContent
                  as="a"
                  href={`/post/${e.id}`}
                  className="post-item-content"
                >
                  <ListHeader className="post-item-header">
                    <div>{e.title}</div>
                    {e.file_url && <ListIcon name="image outline" />}
                    <div className="post-item-comment-count">
                      {e.comments.length}
                    </div>
                  </ListHeader>
                  <ListDescription className="post-item-description">
                    {e.name} | {e.created_at}
                  </ListDescription>
                </ListContent>
              </ListItem>
            ))}
          </List>
          {total && listParams.num && (
            <Pagination
              totalPages={Math.ceil(total / listParams.num)}
              {...register("page")}
            />
          )}
        </>
      )}
    </>
  );
}
