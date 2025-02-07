"use client";

import {
  MapPinIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
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
import WhyChoose from "@/components/home-2/WhyChoose";
import TravelMemory from "@/components/home-2/TravelMemory";

const Page = () => {
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
        <Property />
        <WhyChoose />
        <Featured />
        <Testimonial />
        <TravelMemory/>
      </main>
      <Footer />

    </>
  );
};

export default Page;
