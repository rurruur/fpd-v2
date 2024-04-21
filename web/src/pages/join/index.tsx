import { Button, Form, FormField, Input } from "semantic-ui-react";
import { UserJoinParams } from "../../services/user/user.types";
import { useTypeForm } from "@sonamu-kit/react-sui";
import {
  validatePassword,
  validatePhone,
} from "../../services/user/user.functions";
import { useEffect, useState } from "react";
import { UserService } from "../../services/user/user.service";
import { useNavigate } from "react-router-dom";
import { defaultCatch } from "../../services/sonamu.shared";

type JoinProps = {};
export default function Join(props: JoinProps) {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);

  const { form, setForm, register } = useTypeForm(UserJoinParams, {
    phone: "",
    password: "",
    name: "",
    nickname: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    UserService.join(form)
      .then(() => navigate("/login"))
      .catch(defaultCatch);
  };

  useEffect(() => {
    setDisabled(
      !(
        validatePhone(form.phone) &&
        validatePassword(form.password) &&
        form.name.length > 0 &&
        form.nickname.length > 0
      )
    );
  }, [form]);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormField>
          <label>휴대폰 번호</label>
          <Input
            {...register("phone")}
            placeholder="00000000000"
            onChange={(e) => {
              const phone = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
              setForm({ ...form, phone });
            }}
          />
        </FormField>
        <FormField>
          <label>비밀번호</label>
          <Input
            {...register("password")}
            placeholder="8자 이상"
            type="password"
          />
        </FormField>
        <FormField>
          <label>이름</label>
          <Input {...register("name")} />
        </FormField>
        <FormField>
          <label>닉네임</label>
          <Input {...register("nickname")} />
        </FormField>
        <Button type="submit" disabled={disabled}>
          회원가입
        </Button>
      </Form>
    </>
  );
}
