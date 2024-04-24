import { useTypeForm } from "@sonamu-kit/react-sui";
import { useState } from "react";
import {
  ListItem,
  ListHeader,
  ListDescription,
  ListContent,
  Button,
  TextArea,
  Input,
} from "semantic-ui-react";
import { useAuth } from "src/auth";
import { CommentService } from "src/services/comment/comment.service";
import { CommentSaveMineParams } from "src/services/comment/comment.types";
import { CommentSubsetP } from "src/services/sonamu.generated";
import { defaultCatch } from "src/services/sonamu.shared";

type CommentProps = {
  comment: CommentSubsetP;
  postId: number;
  mutate?: () => void;
};
export default function Comment(props: CommentProps) {
  const { comment, postId, mutate } = props;

  const { user } = useAuth();
  const [isEdit, setIsEdit] = useState(false);

  const { form, register } = useTypeForm(CommentSaveMineParams, {
    id: comment.id,
    name: comment.name,
    content: comment.content,
    post_id: postId,
  });

  const handleEdit = () => {
    if (form.name.trim().length < 1) {
      alert("작성자를 입력해주세요.");
      return;
    }
    if (form.content.trim().length < 1) {
      alert("내용을 입력해주세요.");
      return;
    }

    CommentService.saveMine(form)
      .then(() => {
        setIsEdit(!isEdit);
        mutate?.();
      })
      .catch(defaultCatch);
  };
  const handleDelete = () => {
    const answer = confirm("정말 삭제하시겠습니까?");
    if (!answer) return;

    CommentService.delMine(comment.id)
      .then(() => {
        mutate?.();
      })
      .catch(defaultCatch);
  };

  return (
    <ListItem key={comment.id} className="comment-item">
      <div className="comment-item-header">
        <div className="comment-item-info">
          {isEdit ? (
            <Input {...register("name")} />
          ) : (
            <div className="author-name">{comment.name}</div>
          )}
          <div className="date">{comment.created_at}</div>
        </div>
        {user?.id === comment.user_id && (
          <div className="comment-btns">
            {isEdit ? (
              <>
                <Button
                  onClick={() => setIsEdit(!isEdit)}
                  icon="cancel"
                  size="mini"
                />
                <Button onClick={handleEdit} icon="save" size="mini" />
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEdit(!isEdit)}
                  icon="edit"
                  size="mini"
                />
                <Button onClick={handleDelete} icon="trash" size="mini" />
              </>
            )}
          </div>
        )}
      </div>
      <ListContent>
        <div className="comment-content">
          {isEdit ? (
            <TextArea {...register("content")} />
          ) : (
            <p>{comment.content}</p>
          )}
        </div>
      </ListContent>
    </ListItem>
  );
}
