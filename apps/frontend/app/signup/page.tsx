"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@/context/notification-context";
import api from "@/utils/api";
import WakingUpNotice from "@/components/waking-up-notice";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const notification = useContext(NotificationContext);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/auth/signup", {
        username,
        password,
      });
      router.push("/login");
    } catch (error) {
      notification?.updateNotification("Registration failed", "error");
      console.log(error);
      setIsSubmitting(false);
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>
        <WakingUpNotice isActive={isSubmitting} />
      </form>
    </div>
  );
};

export default SignupPage;
