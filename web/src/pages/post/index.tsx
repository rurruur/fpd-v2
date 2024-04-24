import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../../services/post/post.service";
import { useEffect } from "react";
import { useAuth } from "../../auth";
import PostDetail from "src/components/PostDetail";
import CommentEdit from "src/components/CommentEdit";
import CommentList from "src/components/CommentList";

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postId = Number(id);

  const { user, loading } = useAuth();

  const { data, isLoading: postLoading } = PostService.usePost("P", postId);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (user?.role === "pending") {
      navigate("/pending");
    }
  }, [user, loading]);

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <>
      {postLoading || loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <PostDetail post={data} />
          <CommentEdit postId={postId} />
          <CommentList postId={postId} />
        </>
      )}
    </>
  );
}
