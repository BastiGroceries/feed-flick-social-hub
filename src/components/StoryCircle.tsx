
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StoryCircleProps {
  imageUrl: string;
  username: string;
  viewed?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const StoryCircle = ({ imageUrl, username, viewed = false, active = false, onClick }: StoryCircleProps) => {
  // Truncate username if too long
  const displayName = username.length > 10 ? username.slice(0, 9) + "..." : username;
  
  return (
    <div 
      className="flex flex-col items-center space-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "p-[2px] rounded-full", 
        active ? "bg-gradient-to-br from-instagram-primary to-instagram-secondary" : "",
        viewed ? "bg-gray-300 dark:bg-gray-600" : "bg-gradient-to-br from-instagram-primary to-instagram-secondary"
      )}>
        <Avatar className="h-16 w-16 border-2 border-background">
          <AvatarImage src={imageUrl} alt={username} />
          <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <span className="text-xs text-center">{displayName}</span>
    </div>
  );
};

export default StoryCircle;
