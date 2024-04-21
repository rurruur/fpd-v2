import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem } from "semantic-ui-react";
import { atomUserInfoState } from "../function/atom";
import { UserService } from "../services/user/user.service";

export default function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useAtom(atomUserInfoState);

  const logout = () => {
    UserService.logout();
    setUserInfo({ id: undefined, name: "" });
    navigate("/login");
  };

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
          <MenuItem name="로그인" onClick={() => navigate("/login")} />
        )}
      </Menu>
    </header>
  );
}
