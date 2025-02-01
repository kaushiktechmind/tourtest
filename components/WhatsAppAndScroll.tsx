"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";  // Import WhatsApp icon
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const WhatsAppAndScroll = ({ whatsappNumber }: { whatsappNumber: string }) => {
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
    <div className="fixed bottom-16 right-3 flex flex-col space-y-3 z-50">
      {/* WhatsApp Icon */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <FaWhatsapp className="h-6 w-6" /> {/* WhatsApp icon */}
      </a>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default WhatsAppAndScroll;
