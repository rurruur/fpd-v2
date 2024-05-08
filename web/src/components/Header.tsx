import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Icon, Menu, MenuItem } from "semantic-ui-react";
import { useAuth } from "../auth";
import { atomUserInfo } from "../function/atom";
import { NotiService } from "../services/noti/noti.service";

export default function Header() {
  const navigate = useNavigate();
  const [userInfo] = useAtom(atomUserInfo);

  const { logout } = useAuth();
  const { data } = NotiService.useNotis("P", {
    user_id: userInfo.id,
    read: false,
    queryMode: "count",
  });
  if (!data) {
    return <header className="header">Loading...</header>;
  }

  const { total } = data;

  return (
    <header className="header">
      <h2 onClick={() => navigate("/")}>FPD</h2>
      <Menu>
        {userInfo.id ? (
          <>
            <h2>{userInfo.name}</h2>
            <MenuItem onClick={() => navigate("/noti")}>
              {/* total 표시 */}
              <Icon name="bell outline" />
              {total && total > 0 && <span className="badge">{total}</span>}
            </MenuItem>
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
