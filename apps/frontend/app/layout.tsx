import "./globals.css";
import Navbar from "@/components/navbar";
import Notification from "@/components/notification";
import { AuthProvider } from "@/context/auth-provider";
import { NotificationProvider } from "@/context/notification-context";

export const metadata = {
  title: "Collaborative To-Do List",
  description: "A real-time collaborative to-do app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-row h-100vh relative">
              <Navbar />
              <main className="grow p-20 overflow-y-scroll">{children}</main>
              <Notification />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
