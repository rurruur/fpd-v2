import React from "react";
import { PostService } from "../services/post/post.service";
import {
  List,
  ListContent,
  ListDescription,
  ListHeader,
  ListItem,
} from "semantic-ui-react";

export default function PublicIndexPage() {
  const { data, mutate, isLoading } = PostService.usePosts("P", {
    num: 20,
    page: 1,
    orderBy: "id-desc",
  });

  const { rows, total } = data ?? {};

  return (
    <>
      <List relaxed className="post-list">
        {rows?.map((e) => (
          <ListItem key={e.id} className="post-item">
            <ListContent
              as="a"
              href={`/post/${e.id}`}
              className="post-item-content"
            >
              <ListHeader className="post-item-header">{e.title}</ListHeader>
              <ListDescription className="post-item-description">
                {e.name} | {e.created_at}
              </ListDescription>
            </ListContent>
          </ListItem>
        ))}
      </List>
    </>
  );
}
