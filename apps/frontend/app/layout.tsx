import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/auth-provider";

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
          <div className="container">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
