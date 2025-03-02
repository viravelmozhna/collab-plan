"use client";
import Link from "next/link";
import { useAuth } from "../context/auth-provider";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <nav className="min-w-176 p-20 bg-bluish text-white">
      <ul className="flex flex-col gap-8 list-none">
        {isAuthenticated ? (
          <>
            <li>
              <Link href="/lists">Your projects</Link>
            </li>
            <li>
              <span>- - - - - - - - -</span>
            </li>
            <li className="cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
