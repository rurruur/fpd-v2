import { PostWriteParams } from "../../../services/post/post.types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../../auth";
import PostForm from "../../../components/PostEdit";

export default function PostWrite(props: PostWriteParams) {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  return <PostForm name={user?.nickname ?? user?.name} />;
}
