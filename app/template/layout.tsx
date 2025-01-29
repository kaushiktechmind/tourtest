"use client";
import Footer from "@/components/Footer";
import Header2 from "@/components/home-2/Header2";
import MobileMenu from "@/components/MobileMenu";
import WhatsAppAndScroll from "@/components/WhatsAppAndScroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <HeaderTop /> */}
      {/* <Header2 /> */}
      {/* <MobileMenu /> */}
      {children}
      {/* <Footer /> */}
      {/* <WhatsAppAndScroll whatsappNumber="9999999999" /> */}
    </>
  );
}
