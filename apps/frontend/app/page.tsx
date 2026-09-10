"use client";

import { useAuth } from "@/context/auth-provider";

const HomePage = () => {
  const { isAuthenticated, username } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>{`Welcome to your Dashboard, ${username}`}</h1>
    </div>
  );
};

export default HomePage;
