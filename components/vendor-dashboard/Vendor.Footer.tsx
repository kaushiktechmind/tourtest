import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 flex justify-between bg-white items-center flex-wrap px-3 gap-5 lg:px-6">
      <span>
      © <span>{new Date().getFullYear()}</span>{" "}
        <Link className="text-primary" href="/">
          Andaman Mangroves Holidays
        </Link>{" "}
        Designed By{" "}
        <Link href="https://techmindscape.in/" className="text-[var(--secondary-500)]">
          Techmindscape
        </Link>
      </span>
      <ul className="flex gap-3 items-center text-xl">
        <li className="w-10 h-10 rounded-full border-primary text-primary flex items-center justify-center border hover:bg-primary hover:text-white duration-300">
          {" "}
          <Link href="#">
            <i className="lab la-facebook-f"></i>
          </Link>
        </li>
        <li className="w-10 h-10 rounded-full border-primary text-primary flex items-center justify-center border hover:bg-primary hover:text-white duration-300">
          {" "}
          <Link href="#">
            <i className="lab la-instagram"></i>
          </Link>
        </li>
        <li className="w-10 h-10 rounded-full border-primary text-primary flex items-center justify-center border hover:bg-primary hover:text-white duration-300">
          {" "}
          <Link href="#">
            <i className="lab la-twitter"></i>
          </Link>
        </li>
        <li className="w-10 h-10 rounded-full border-primary text-primary flex items-center justify-center border hover:bg-primary hover:text-white duration-300">
          {" "}
          <Link href="#">
            <i className="lab la-linkedin-in"></i>
          </Link>
        </li>
        <li className="w-10 h-10 rounded-full border-primary text-primary flex items-center justify-center border hover:bg-primary hover:text-white duration-300">
          {" "}
          <Link href="#">
            <i className="lab la-dribbble"></i>
          </Link>
        </li>
      </ul>
      <ul className="flex items-center flex-wrap gap-3">
        <li>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/terms-of-service">Terms of Service</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
