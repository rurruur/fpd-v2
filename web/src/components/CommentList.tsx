import { List } from "semantic-ui-react";
import Comment from "./Comment";
import { CommentService } from "src/services/comment/comment.service";

type CommentListProps = {
  postId: number;
};
export default function CommentList(props: CommentListProps) {
  const { postId } = props;

  const { data, mutate } = CommentService.useComments("P", {
    post_id: postId,
    orderBy: "id-desc",
  });

  return (
    <List className="comment-list">
      {data?.rows.map((e) => (
        <Comment key={e.id} comment={e} postId={postId} mutate={mutate} />
      ))}
    </List>
  );
}
