"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@/context/notification-context";
import api from "@/utils/api";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const notification = useContext(NotificationContext);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", {
        username,
        password,
      });
      router.push("/login");
    } catch (error) {
      notification?.updateNotification("Registration failed", "error");
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
