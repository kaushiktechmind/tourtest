import "./globals.css";
import { Inter } from "next/font/google";
import "@/public/styles/styles.scss";
import "@/public/styles/line-awesome.min.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Andman Mangroves Holydays",
  description: "A nextjs template for online booking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" /> */}
      <body
        className={`${inter.className} bg-[var(--bg-1)] text-[var(--neutral-700)]`}>
        {children}
      </body>
    </html>
  );
}
