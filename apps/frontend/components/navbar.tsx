"use client";

import Link from "next/link";

import { useAuth } from "../components/hooks/auth-provider";
import navbar from "./navbar.module.css";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <nav className="nav-container">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link href="/lists">My Lists</Link>
          </li>
        )}
      </ul>

      <ul className="auth-container">
        {!isAuthenticated && (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        )}

        {isAuthenticated && (
          <li>
            <div className={navbar["logout-btn"]} onClick={handleLogout}>
              Logout
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
