"use client";
import React, { createContext, useState } from "react";

interface NotificationContextType {
  notificationMessage: string;
  notificationId: string;
  notificationType: string;
  updateNotification: (message: string, type: string) => void;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const updateNotification = (message: string, type: string) => {
    setNotificationMessage(message);
    setNotificationId(new Date().getTime().toString());
    setNotificationType(type);
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationMessage,
        notificationId,
        notificationType,
        updateNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
