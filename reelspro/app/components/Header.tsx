"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Plus, Search, Heart } from "lucide-react";
import { useNotification } from "./Notification";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto">
        {/* Brand */}
        <div className="flex-1">
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold normal-case hover:bg-transparent"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ReelsPro
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/"
                className={`btn btn-ghost btn-sm gap-2 ${
                  isActive("/") ? "text-primary" : ""
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              
              <Link
                href="/upload"
                className={`btn btn-ghost btn-sm gap-2 ${
                  isActive("/upload") ? "text-primary" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                Create
              </Link>

              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  aria-label="User menu"
                  className="btn btn-ghost btn-circle avatar placeholder"
                >
                  <div className="bg-primary text-primary-content w-8 h-8 rounded-full">
                    <span className="text-xs font-bold">
                      {session.user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-box w-52 mt-2"
                >
                  <li className="menu-title">
                    <span>{session.user?.email}</span>
                  </li>
                  <li><div className="divider my-1"></div></li>
                  <li>
                    <Link href="/profile">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut} className="text-error">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Mobile menu"
                className="btn btn-ghost btn-circle"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-box w-52 mt-2"
              >
                <li>
                  <Link href="/" className={isActive("/") ? "active" : ""}>
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className={isActive("/upload") ? "active" : ""}>
                    <Plus className="w-4 h-4" />
                    Create
                  </Link>
                </li>
                <li><div className="divider my-1"></div></li>
                <li>
                  <span className="text-xs opacity-70">{session.user?.email}</span>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-error">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Auth menu"
                className="btn btn-ghost btn-circle"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-box w-52 mt-2"
              >
                <li>
                  <Link href="/login">Sign In</Link>
                </li>
                <li>
                  <Link href="/register">Get Started</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}