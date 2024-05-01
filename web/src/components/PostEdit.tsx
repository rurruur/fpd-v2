import { useTypeForm } from "@sonamu-kit/react-sui";
import { useNavigate } from "react-router-dom";
import { Form, FormField, Input, TextArea, Button } from "semantic-ui-react";
import { PostService } from "../services/post/post.service";
import { PostWriteParams } from "../services/post/post.types";
import { defaultCatch } from "../services/sonamu.shared";

export default function PostForm(props?: Partial<PostWriteParams>) {
  const navigate = useNavigate();

  const defForm = {
    id: props?.id,
    title: props?.title ?? "",
    content: props?.content ?? "",
    name: props?.name ?? "",
  };
  const { form, setForm, register } = useTypeForm(PostWriteParams, defForm);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 1) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (form.name.trim().length < 1) {
      alert("작성자를 입력해주세요.");
      return;
    }
    if (form.content.trim().length < 1) {
      alert("내용을 입력해주세요.");
      return;
    }

    PostService.write(form)
      .then((id) => navigate(`/post/${id}`))
      .catch(defaultCatch);
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormField>
          <label>제목</label>
          <Input {...register("title")} />
        </FormField>
        <FormField>
          <label>작성자</label>
          <Input {...register("name")} />
        </FormField>
        <FormField>
          <label>내용</label>
          <TextArea {...register("content")} />
        </FormField>
        <Button type="submit">작성</Button>
      </Form>
    </>
  );
}
