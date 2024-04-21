import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../../services/post/post.service";

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postId = Number(id);

  const {
    data,
    error,
    isLoading: postLoading,
  } = PostService.usePost("P", postId);

  console.log(data);

  if (!data || error?.statusCode === 404) {
    return <div>Not Found</div>;
  }

  return (
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
        <a href="/post">목록</a>
      </div>
    </>
  );
}
