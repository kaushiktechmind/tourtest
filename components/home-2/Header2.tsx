"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname for route detection
import LangDropdown from "../LangDropdown";
import ProfileDropdown from "../ProfileDropdown";
import Image from "next/image";
import logo from "@/public/img/logo.png";
import Navbar from "./Navbar";
import Link from "next/link";

const Header2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname(); // Get current route
  const isHomePage = pathname === "/"; // Check if the current route is the home page

  useEffect(() => {
    if (!isHomePage) {
      // Static background color for non-home pages
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll listener only for the home page
    document.addEventListener("scroll", handleScroll);

    return () => {
      // Clean up the event listener
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  return (
    <header
      className={`z-30 fixed w-full ${
        scrolled || !isHomePage ? "z-50 shadow-md bg-[#091E43]" : "bg-transparent"
      } duration-300`}
    >
      <div className="container flex justify-between items-center relative px-3 py-2 lg:py-0 lg:px-0">
        <Link href="/" className="">
          <Image src={logo} alt="logo" className="h-13 w-40" />
        </Link>
        <div className="lg:order-2 flex gap-2 items-center">
          {/* <LangDropdown /> */}
          <Link href="/sign-in" className="btn-primary-lg hidden md:block">
            Signin{" "}
          </Link>
          {/* <ProfileDropdown /> */}
        </div>
        <div className="lg:order-1">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden border py-1 px-2 rounded-md bg-[var(--btn-bg)]"
          >
            <i className="las la-bars text-2xl"></i>
          </button>
          <div className={`lg:block ${menuOpen ? "block" : "hidden"} text-white`}>
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
