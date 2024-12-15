"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-provider";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.log("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
