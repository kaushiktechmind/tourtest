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
import WhatsAppAndScroll from "@/components/WhatsAppAndScroll";

const Page = () => {
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
      <WhatsAppAndScroll whatsappNumber="9531898558" />

    </>
  );
};

export default Page;
