import { useTypeForm } from "@sonamu-kit/react-sui";
import { Button, Form, FormTextArea, Input, Label } from "semantic-ui-react";
import { useAuth } from "src/auth";
import { CommentService } from "src/services/comment/comment.service";
import { CommentSaveMineParams } from "src/services/comment/comment.types";
import { defaultCatch } from "src/services/sonamu.shared";

type CommentEditProps = { postId: number };
export default function CommentEdit(props: CommentEditProps) {
  const { postId } = props;

  const { user } = useAuth();
  const { form, register } = useTypeForm(CommentSaveMineParams, {
    post_id: postId,
    name: user?.nickname ?? "",
    content: "",
  });

  const handleSubmit = () => {
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
        window.location.reload();
      })
      .catch(defaultCatch);
  };

  return (
    <Form className="comment-form">
      <Input className="input-name" placeholder="이름" {...register("name")} />
      <Input placeholder="댓글" {...register("content")} />
      <Button onClick={handleSubmit}>등록</Button>
    </Form>
  );
}
