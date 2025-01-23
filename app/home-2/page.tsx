"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import Category from "@/components/home-1/Category";
import Agents from "@/components/home-2/Agents";
import Counter from "@/components/home-2/Counter";
import Header2 from "@/components/home-2/Header2";
import Hero from "@/components/home-2/Hero";
import HowItWork from "@/components/home-2/HowItWork";
import Property from "@/components/home-2/Property";
import Testimonial from "@/components/home-2/Testimonial";
import Featured from "@/components/home-2/Featured";
import { useEffect, useState } from "react";

const page = () => {
  const [showScroll, setShowScroll] = useState(false);

  // Show scroll to top button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header2 />
      <MobileMenu />
      <main>
        <Hero />
        <Category />
        <Property />
        <Featured />
        <HowItWork />
        <Counter />
        <Testimonial />
        <Agents />
      </main>
      <Footer />

      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/9306288532"  // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </a>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 right-16 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faArrowUp} size="2x" />
        </button>
      )}
    </>
  );
};

export default page;
