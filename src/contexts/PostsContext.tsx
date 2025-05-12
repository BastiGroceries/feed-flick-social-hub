
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Mock data
const INITIAL_POSTS = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    userImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=800',
    caption: 'Working on some new code today! #coding #webdevelopment',
    likes: ['2'],
    comments: [
      { id: '1', userId: '2', username: 'janedoe', text: 'Looks great!', timestamp: '2023-05-09T14:48:00' }
    ],
    timestamp: '2023-05-09T14:48:00'
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    userImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=800',
    caption: 'Just learned about state management in React! #react #frontend',
    likes: ['1'],
    comments: [
      { id: '2', userId: '1', username: 'johndoe', text: 'Awesome! What library are you using?', timestamp: '2023-05-10T10:24:00' }
    ],
    timestamp: '2023-05-10T09:30:00'
  }
];

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  timestamp: string;
}

interface PostsContextType {
  posts: Post[];
  addPost: (imageUrl: string, caption: string) => Promise<boolean>;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  getUserPosts: (userId: string) => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('instagram-posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error("Failed to parse saved posts:", error);
        setPosts(INITIAL_POSTS);
        localStorage.setItem('instagram-posts', JSON.stringify(INITIAL_POSTS));
      }
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('instagram-posts', JSON.stringify(INITIAL_POSTS));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('instagram-posts', JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = async (imageUrl: string, caption: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return false;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userImage: user.profileImage,
      imageUrl,
      caption,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    toast.success("Post created successfully!");
    return true;
  };

  const likePost = (postId: string) => {
    if (!user) return;

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId && !post.likes.includes(user.id)) {
          return {
            ...post,
            likes: [...post.likes, user.id]
          };
        }
        return post;
      })
    );
  };

  const unlikePost = (postId: string) => {
    if (!user) return;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes.filter(id => id !== user.id)
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!user || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text,
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.userId === userId);
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      addPost, 
      likePost, 
      unlikePost, 
      addComment,
      getUserPosts
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
