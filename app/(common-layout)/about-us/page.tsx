"use client";

import Faq from "@/components/home-1/Faq";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const page = () => {
  return (
    <main>
      <Faq />
    </main>
  );
};

export default page;
