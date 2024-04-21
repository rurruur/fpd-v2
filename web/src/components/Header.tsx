import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "semantic-ui-react";
import { atomUserInfo } from "../function/atom";
import { UserService } from "../services/user/user.service";
import { useAuth } from "../auth";

export default function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useAtom(atomUserInfo);

  const { logout } = useAuth();

  return (
    <header className="header">
      <h2 onClick={() => navigate("/")}>FPD</h2>
      <Menu>
        {userInfo.id ? (
          <>
            <h2>{userInfo.name}</h2>
            <MenuItem name="글작성" onClick={() => navigate("/post/write")} />
            <MenuItem name="로그아웃" onClick={logout} />
          </>
        ) : (
          <>
            <MenuItem name="회원가입" onClick={() => navigate("/join")} />
            <MenuItem name="로그인" onClick={() => navigate("/login")} />
          </>
        )}
      </Menu>
    </header>
  );
}
