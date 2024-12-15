"use client";

import { SocketProvider } from "@/context/socket-provider";

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
