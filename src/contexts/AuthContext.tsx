
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Mock data for development
const MOCK_USERS = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password',
    name: 'John Doe',
    bio: 'Photography enthusiast | Travel lover',
    profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150'
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password',
    name: 'Jane Doe',
    bio: 'Digital artist | Creating beautiful things',
    profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150'
  }
];

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved auth on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('instagram-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem('instagram-user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login functionality
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('instagram-user', JSON.stringify(userWithoutPassword));
      toast.success("Login successful!");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email || u.username === username)) {
      toast.error("Email or username already taken");
      return false;
    }

    // In a real app, we would make an API call to create the user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      password,
      name: username,
      bio: '',
      profileImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=150&h=150'
    };

    // For this mock version, we'll just pretend it worked
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('instagram-user', JSON.stringify(userWithoutPassword));
    toast.success("Account created successfully!");
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('instagram-user');
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('instagram-user', JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
