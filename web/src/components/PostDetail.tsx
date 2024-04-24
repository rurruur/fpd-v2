import { PostSubsetP } from "../services/sonamu.generated";

type PostDetailProps = { post: PostSubsetP };
export default function PostDetail(props: PostDetailProps) {
  const { post } = props;

  return (
    <>
      <div className="post-detail">
        <div className="post-header">
          <div className="post-title">
            <h3>{post.title}</h3>
          </div>
          <div className="post-info">
            <div className="post-user">
              <p>{post.name}</p>
            </div>
            <div className="created-at">
              <p className="date">{post.created_at}</p>
            </div>
          </div>
        </div>
        <div className="post-content">
          {post.file_url && <img src={post.file_url} alt={post.title} />}
          <p>{post.content}</p>
        </div>
      </div>
    </>
  );
}
