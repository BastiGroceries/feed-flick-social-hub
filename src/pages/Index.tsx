
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Just redirect to the feed - this page isn't needed
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
