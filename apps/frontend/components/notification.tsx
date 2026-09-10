"use client";
import { NotificationContext } from "@/context/notification-context";
import { useEffect, useState, useContext } from "react";

interface NotificationType {
  message: string;
  type: string;
}

export default function Notification() {
  const [notificationData, setNotificationData] =
    useState<NotificationType | null>(null);
  const [visible, setVisible] = useState(false);

  const notification = useContext(NotificationContext);

  useEffect(() => {
    if (!notification || !notification.notificationMessage) return;

    setNotificationData({
      message: notification.notificationMessage,
      type: notification.notificationType || "info",
    });
    setTimeout(() => setVisible(true), 50);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setNotificationData(null), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification?.notificationId]);

  if (!notificationData) return null;

  return (
    <div
      className={`fixed top-8 right-4 w-[250px] border-2 p-12 bg-white shadow-lg rounded transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      } ${notificationData.type === "success" ? "border-greenish" : ""}
        ${notificationData.type === "error" ? "border-redish" : ""}
        ${notificationData.type === "info" ? "border-greyish-3" : ""}`}
    >
      {notificationData.message}
    </div>
  );
}
