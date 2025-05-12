
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StoryCircle from "./StoryCircle";
import { Card } from "@/components/ui/card";

// Mock data for stories
const mockStories = [
  {
    id: "1",
    userId: "1",
    username: "johndoe",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150",
    viewed: false,
    active: true
  },
  {
    id: "2",
    userId: "2",
    username: "janedoe",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
    viewed: false,
    active: false
  },
  {
    id: "3",
    userId: "3",
    username: "mikebrown",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    viewed: true,
    active: false
  },
  {
    id: "4",
    userId: "4",
    username: "sarahparker",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    viewed: false,
    active: false
  },
  {
    id: "5",
    userId: "5",
    username: "alexwilson",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
    viewed: true,
    active: false
  },
  {
    id: "6",
    userId: "6",
    username: "emilyjohnson",
    imageUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150",
    viewed: false,
    active: false
  },
  {
    id: "7",
    userId: "7",
    username: "thomasclark",
    imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150",
    viewed: false,
    active: false
  }
];

const StoriesSection = () => {
  const handleStoryClick = (id: string) => {
    console.log(`Story ${id} clicked`);
    // Here you would handle opening the story viewer
  };

  return (
    <Card className="p-4 mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 py-1">
          {mockStories.map((story) => (
            <StoryCircle
              key={story.id}
              imageUrl={story.imageUrl}
              username={story.username}
              viewed={story.viewed}
              active={story.active}
              onClick={() => handleStoryClick(story.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default StoriesSection;
