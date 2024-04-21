import { useTypeForm } from "@sonamu-kit/react-sui";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { UserLoginParams } from "../../services/user/user.types";
import { useAuth } from "../../auth";
import {
  validatePassword,
  validatePhone,
} from "../../services/user/user.functions";

type LoginPageProps = {};
export default function LoginPage(props: LoginPageProps) {
  const { login } = useAuth();

  const [disabled, setDisabled] = useState(true);
  const defForm = {
    phone: "",
    password: "",
  };
  const { form, register } = useTypeForm(UserLoginParams, defForm);
  const stringIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    stringIdRef.current?.focus();
  }, []);

  useEffect(() => {
    setDisabled(
      !(validatePhone(form.phone) && validatePassword(form.password))
    );
  }, [form]);

  return (
    <div className="loginWrap">
      <div className="pageTitleWrap login top">
        <h2>로그인 페이지</h2>
      </div>
      <div className="formWrap loginForm">
        <div className="inputWrap">
          <Input
            ref={stringIdRef}
            {...register("phone")}
            type="text"
            placeholder="전화번호"
          />
        </div>
        <div className="inputWrap">
          <Input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
          />
        </div>
        <div className="btnWrap">
          <Button disabled={disabled} onClick={() => login(form)}>
            로그인
          </Button>
        </div>
        <div>
          <a href="/join">회원가입</a>
        </div>
      </div>
    </div>
  );
}
