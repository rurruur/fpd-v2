import { useNavigate } from "react-router-dom";
import { useAuth } from "src/auth";
import { defaultCatch } from "src/services/sonamu.shared";
import { UserService } from "src/services/user/user.service";

type AdminProps = {};
export default function Admin(props: AdminProps) {
  const navigate = useNavigate();

  const { user, loading } = useAuth();
  const { data, mutate } = UserService.useUsers("A");

  const approveUser = (id: number) => {
    UserService.approve([id])
      .then(() => {
        mutate();
      })
      .catch(defaultCatch);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (user?.role !== "admin") {
    navigate("/");
  }

  return (
    <>
      <h1>Admin</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {data?.rows?.map((user) => (
            <li key={user.id}>
              {user.phone} - {user.role}
              {user.role === "pending" && (
                <button onClick={() => approveUser(user.id)}>Approve</button>
              )}
              <ul>
                <li>
                  {user.name} - {user.nickname}
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
