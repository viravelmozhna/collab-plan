"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-provider";
import { NotificationContext } from "@/context/notification-context";
import api from "@/utils/api";
import WakingUpNotice from "./waking-up-notice";

interface TryDemoButtonProps {
  label?: string;
}

// Creates a throwaway guest account so the app can be tried without signing
// up. Used from both the landing page and the login form.
const TryDemoButton = ({ label = "Try the demo" }: TryDemoButtonProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const { setIsAuthenticated } = useAuth();
  const router = useRouter();
  const notification = useContext(NotificationContext);

  const handleStartDemo = async () => {
    setIsStarting(true);
    try {
      const response = await api.post("/auth/guest");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      setIsAuthenticated(true);
      router.push("/lists");
    } catch (error) {
      notification?.updateNotification("Could not start the demo", "error");
      console.log(error);
      setIsStarting(false);
    }
  };

  return (
    <>
      <button type="button" onClick={handleStartDemo} disabled={isStarting}>
        {isStarting ? "Setting up your demo..." : label}
      </button>
      <WakingUpNotice isActive={isStarting} />
    </>
  );
};

export default TryDemoButton;
