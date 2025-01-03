"use client";

import Link from "next/link";
import { useAuth } from "../context/auth-provider";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, username } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <nav className="nav-container">
      {isAuthenticated && (
        <ul>
          <li>
            <p>Hello, {username}!</p>
            <span>- - - - - - - - -</span>
          </li>
          <li>
            <Link href="/lists">Your projects</Link>
          </li>
        </ul>
      )}

      <ul className="auth-container">
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <li>
            <div className="logout-btn" onClick={handleLogout}>
              Logout
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
