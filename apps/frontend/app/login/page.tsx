"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { NotificationContext } from "@/context/notification-context";
import api from "@/utils/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setIsAuthenticated } = useAuth();
  const router = useRouter();
  const notification = useContext(NotificationContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      router.push("/lists");
    } catch (error) {
      notification?.updateNotification("Invalid credentials", "error");
      console.log(error);
    }
  };

  return (
    <div>
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
