
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePosts, Post } from "../contexts/PostsContext";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { likePost, unlikePost, addComment } = usePosts();
  const isLiked = user && post.likes.includes(user.id);

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    addComment(post.id, comment);
    setComment("");
  };

  return (
    <Card className="max-w-md mx-auto mb-6 post-animation">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.userImage} alt={post.username} />
            <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Link to={`/profile/${post.userId}`} className="font-medium">
            {post.username}
          </Link>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="object-cover w-full h-full img-filter"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-0 h-auto" 
              onClick={handleLikeToggle}
            >
              <Heart 
                className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''} ${isLiked ? 'heart-animation' : ''}`} 
              />
              <span className="sr-only">{isLiked ? 'Unlike' : 'Like'}</span>
            </Button>
            <Button variant="ghost" size="icon" className="p-0 h-auto">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon" className="p-0 h-auto">
              <Send className="h-6 w-6" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          <div className="font-medium mb-1">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </div>
          <div className="space-y-1">
            <p>
              <Link to={`/profile/${post.userId}`} className="font-medium mr-2">
                {post.username}
              </Link>
              {post.caption}
            </p>
            {post.comments.length > 0 && (
              <Link 
                to={`/post/${post.id}`} 
                className="text-muted-foreground text-sm"
              >
                View all {post.comments.length} comments
              </Link>
            )}
            {post.comments.slice(0, 2).map((comment) => (
              <p key={comment.id} className="text-sm">
                <Link to={`/profile/${comment.userId}`} className="font-medium mr-2">
                  {comment.username}
                </Link>
                {comment.text}
              </p>
            ))}
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="py-3 px-4 border-t">
        <form onSubmit={handleCommentSubmit} className="w-full flex items-center">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            disabled={!comment.trim()} 
            className={`text-primary font-medium ${!comment.trim() && 'opacity-50'}`}
          >
            Post
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
