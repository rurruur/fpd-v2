import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListContent, ListItem } from "semantic-ui-react";
import { useAuth } from "../../auth";
import { NotiService } from "../../services/noti/noti.service";

export default function Noti() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const { data, isLoading } = NotiService.useNotis("P", {
    user_id: user?.id,
    num: 0,
    queryMode: "list",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (user?.role === "pending") {
      navigate("/pending");
    }
  }, [user, loading]);

  if (loading || !data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <List celled className="noti-list">
      {data?.rows?.map((e) => (
        <ListItem key={e.id} className={e.read ? "" : "noti-unread"}>
          <ListContent
            onClick={async () => {
              await NotiService.read([e.id]);
              navigate(`/post/${e.post_id}`);
            }}
          >
            <ListContent>
              <pre>{e.content}</pre>
            </ListContent>
          </ListContent>
        </ListItem>
      ))}
    </List>
  );
}
