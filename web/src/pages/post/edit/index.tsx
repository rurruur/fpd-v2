import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../../../services/post/post.service";
import { useAuth } from "../../../auth";
import PostForm from "../../../components/PostEdit";

type PostEditProps = {};
export default function PostEdit(props: PostEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = useAuth();

  const { data: post, error, isLoading } = PostService.usePost("P", Number(id));

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (user?.role === "pending") {
      navigate("/pending");
    }
  }, [user, loading]);

  return <PostForm name={user?.nickname ?? user?.name} />;
}
