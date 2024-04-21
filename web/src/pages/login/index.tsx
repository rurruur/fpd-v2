import { useTypeForm } from "@sonamu-kit/react-sui";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "semantic-ui-react";
import { atomUserInfo } from "../../function/atom";
import { UserLoginParams } from "../../services/user/user.types";
import { UserService } from "../../services/user/user.service";
import { defaultCatch } from "../../services/sonamu.shared";

type LoginPageProps = {};
export default function LoginPage(props: LoginPageProps) {
  const navigate = useNavigate();

  const defForm = {
    phone: "",
    password: "",
  };

  const [, setUserInfo] = useAtom(atomUserInfo);
  const [loading, setLoading] = useState(false);
  const { form, setForm, register } = useTypeForm(UserLoginParams, defForm);
  const stringIdRef = useRef<HTMLInputElement>(null);

  const login = () => {
    setLoading(true);
    UserService.login(form)
      .then((user) => {
        alert("로그인되었습니다.");
        setForm(defForm);
        navigate("/");
        setUserInfo(user);
      })
      .catch(defaultCatch)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    stringIdRef.current?.focus();
  }, []);

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
          <Button loading={loading} onClick={login}>
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
