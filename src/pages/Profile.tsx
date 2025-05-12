
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, User } from "../contexts/AuthContext";
import { usePosts } from "../contexts/PostsContext";
import { Grid3X3, Bookmark, Settings } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { getUserPosts } = usePosts();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState([]);
  const isOwnProfile = !id || (currentUser && id === currentUser.id);
  
  useEffect(() => {
    // In a real app, we would fetch the user data from an API
    // For this demo, we'll just use the current user if it's their profile
    if (isOwnProfile && currentUser) {
      setProfileUser(currentUser);
      const posts = getUserPosts(currentUser.id);
      setUserPosts(posts);
    } else if (id) {
      // Mock fetching another user
      const mockUser = {
        id,
        username: id === "1" ? "johndoe" : "janedoe",
        email: id === "1" ? "john@example.com" : "jane@example.com",
        name: id === "1" ? "John Doe" : "Jane Doe",
        bio: id === "1" ? "Photography enthusiast | Travel lover" : "Digital artist | Creating beautiful things",
        profileImage: id === "1" 
          ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150" 
          : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150"
      };
      setProfileUser(mockUser);
      const posts = getUserPosts(id);
      setUserPosts(posts);
    }
  }, [id, isOwnProfile, currentUser, getUserPosts]);

  if (!profileUser) {
    return (
      <div className="container py-10 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <Avatar className="h-20 w-20 md:h-32 md:w-32">
          <AvatarImage src={profileUser.profileImage} alt={profileUser.username} />
          <AvatarFallback>{profileUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            {isOwnProfile ? (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/settings">Edit Profile</Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button>Follow</Button>
            )}
          </div>
          
          <div className="flex justify-center md:justify-start space-x-6 mb-4">
            <div>
              <span className="font-medium">{userPosts.length}</span> posts
            </div>
            <div>
              <span className="font-medium">1.2k</span> followers
            </div>
            <div>
              <span className="font-medium">458</span> following
            </div>
          </div>
          
          <div>
            <h2 className="font-medium">{profileUser.name}</h2>
            <p className="whitespace-pre-wrap">{profileUser.bio}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline">Saved</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={`Post by ${profileUser.username}`} 
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-medium">No Posts Yet</h2>
              {isOwnProfile && (
                <p className="text-muted-foreground">
                  When you post, your content will appear here.
                </p>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-medium">No Saved Posts</h2>
            <p className="text-muted-foreground">
              Save posts to view them later.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
