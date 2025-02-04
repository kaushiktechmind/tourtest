"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname for route detection
import LangDropdown from "../LangDropdown";
import ProfileDropdown from "../ProfileDropdown";
import Image from "next/image";
import logo from "@/public/img/logo.png";
import Navbar from "../Navbar";
import Link from "next/link";

const Header2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname(); // Get current route
  const isHomePage = pathname === "/"; // Check if the current route is the home page

  useEffect(() => {
    // Function to check token presence in localStorage
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token); // Update state based on token presence
    };

    checkLoginStatus(); // Initial check

    // Listen to storage changes for real-time login/logout detection
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    if (!isHomePage) {
      setScrolled(true);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    // Add scroll listener only for the home page
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isHomePage]);

  return (
    <header
      className={`z-30 fixed w-full ${
        scrolled || !isHomePage ? "z-50 shadow-md bg-[white]" : "bg-transparent"
      } duration-300`}
    >
      <div className="container flex justify-between items-center relative px-3 py-2 lg:py-0 lg:px-0">
        <Link href="/" className="">
          <Image src={logo} alt="logo" className="h-13 w-40" />
        </Link>
        <div className="lg:order-2 flex gap-2 items-center">
          {!isLoggedIn && (
            <Link href="/sign-in" className="btn-primary-lg hidden md:block">
              Signin
            </Link>
          )}
          {isLoggedIn && <ProfileDropdown />}
        </div>
        <div className="lg:order-1">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden border py-1 px-2 rounded-md bg-[var(--btn-bg)]"
          >
            <i className="las la-bars text-2xl"></i>
          </button>
          <div
            className={`lg:block ${menuOpen ? "block" : "hidden"} text-white`}
          >
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
