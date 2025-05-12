
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    match: false
  });
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    setPasswordValidation(prev => ({
      ...prev,
      length: pass.length >= 6
    }));
    
    if (confirmPassword) {
      setPasswordValidation(prev => ({
        ...prev,
        match: pass === confirmPassword
      }));
    }
    
    return pass.length >= 6;
  };
  
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordValidation(prev => ({
      ...prev,
      match: password === value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await signup(email, username, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 items-center text-center pb-2">
          <div className="font-['Segoe UI'] text-3xl font-semibold bg-gradient-to-r from-instagram-primary to-instagram-secondary text-transparent bg-clip-text mb-2">
            Instagram
          </div>
          <CardTitle className="text-xl">Create an Account</CardTitle>
          <CardDescription>
            Sign up to see photos and videos from your friends
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                  setPasswordError("");
                }}
                required
                className={passwordError ? "border-destructive" : ""}
              />
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {passwordValidation.length ? 
                  <Check size={14} className="text-green-500" /> : 
                  <X size={14} className="text-red-500" />}
                Password must be at least 6 characters
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  handleConfirmPasswordChange(e.target.value);
                  setPasswordError("");
                }}
                required
                className={passwordError ? "border-destructive" : ""}
              />
              {confirmPassword && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {passwordValidation.match ? 
                    <Check size={14} className="text-green-500" /> : 
                    <X size={14} className="text-red-500" />}
                  Passwords must match
                </div>
              )}
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              <p>By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-instagram-primary to-instagram-secondary hover:opacity-90"
              disabled={isLoading || !passwordValidation.length || (confirmPassword && !passwordValidation.match)}
              type="submit"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="flex items-center justify-center w-full">
              <div className="h-px bg-border flex-1"></div>
              <span className="px-4 text-sm text-muted-foreground">OR</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <div className="fixed bottom-4 text-center w-full text-sm text-muted-foreground">
        <span>© 2025 Instagram Clone</span>
      </div>
    </div>
  );
}
