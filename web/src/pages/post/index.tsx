import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../../services/post/post.service";
import { useEffect } from "react";
import { useAuth } from "../../auth";

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
          <div className="post-detail">
            <div className="post-header">
              <div className="post-title">
                <h2>{data.title}</h2>
              </div>
              <div className="post-info">
                <div className="post-user">
                  <p>{data.name}</p>
                </div>
                <div className="created-at">
                  <p>{data.created_at}</p>
                </div>
              </div>
            </div>
            <div className="post-content">
              <p>{data.content}</p>
            </div>
          </div>
          <div>
            <a href="/">목록</a>
          </div>
        </>
      )}
    </>
  );
}
