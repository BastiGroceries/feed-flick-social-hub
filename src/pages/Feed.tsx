
import { usePosts } from "../contexts/PostsContext";
import PostCard from "../components/PostCard";

export default function Feed() {
  const { posts } = usePosts();
  
  return (
    <div className="container py-6 max-w-3xl">
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-medium">No posts yet</h2>
            <p className="text-muted-foreground">Posts from people you follow will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
