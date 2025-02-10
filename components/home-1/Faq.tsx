"use client";
import faq1 from "@/public/img/faq-el-1.png";
import faq2 from "@/public/img/faq-el-2.png";
import Image from "next/image";
import SubHeadingBtn from "../SubHeadingBtn";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const Faq = () => {
  const [opened, setOpened] = useState<number | null>(1);

  return (
    <section className="relative bg-white py-[60px] lg:py-[120px]">
      <Image
        src={faq1}
        className="hidden lg:block absolute top-10 right-10"
        alt="faq el"
      />
      <Image
        src={faq2}
        className="hidden lg:block absolute bottom-0 left-0"
        alt="faq el"
      />
      <div className="container">
        <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3">
          <SubHeadingBtn text="FAQs" classes="bg-[var(--primary-light)]" />
          <h2 className="h2 mt-3 leading-snug">
            If you have any questions, we have the answers
          </h2>
          <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
            Real estate can be bought, sold, leased, or rented, and can be a
            valuable investment opportunity. The value of real estate can be
          </p>
        </div>
        <div className="max-w-[856px] flex flex-col gap-4 lg:gap-6 mx-auto px-3 xl:px-0">
          {/* FAQ 1 */}
          <div
            onClick={() => setOpened((prev) => (prev === 1 ? null : 1))}
            className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
          >
            <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
              What is real estate?{" "}
              <span
                className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${
                  opened === 1 ? "rotate-180" : ""
                }`}
              >
                {opened === 1 ? (
                  <MinusIcon className="w-6 h-6" />
                ) : (
                  <PlusIcon className="w-6 h-6" />
                )}
              </span>
            </button>
            <AnimateHeight duration={300} height={opened === 1 ? "auto" : 0}>
              <p className="border-t border-dash-long pt-4 mt-4">
                Real estate refers to property consisting of land and the
                buildings on it, along with its natural resources like crops,
                minerals, or water.
              </p>
            </AnimateHeight>
          </div>

          {/* FAQ 2 */}
          <div
            onClick={() => setOpened((prev) => (prev === 2 ? null : 2))}
            className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
          >
            <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
              How do I invest in real estate?{" "}
              <span
                className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${
                  opened === 2 ? "rotate-180" : ""
                }`}
              >
                {opened === 2 ? (
                  <MinusIcon className="w-6 h-6" />
                ) : (
                  <PlusIcon className="w-6 h-6" />
                )}
              </span>
            </button>
            <AnimateHeight duration={300} height={opened === 2 ? "auto" : 0}>
              <p className="border-t border-dash-long pt-4 mt-4">
                You can invest in real estate by purchasing properties, real
                estate investment trusts (REITs), or through real estate
                crowdfunding platforms.
              </p>
            </AnimateHeight>
          </div>

          {/* FAQ 3 */}
          <div
            onClick={() => setOpened((prev) => (prev === 3 ? null : 3))}
            className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
          >
            <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
              What are the benefits of renting vs buying?{" "}
              <span
                className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${
                  opened === 3 ? "rotate-180" : ""
                }`}
              >
                {opened === 3 ? (
                  <MinusIcon className="w-6 h-6" />
                ) : (
                  <PlusIcon className="w-6 h-6" />
                )}
              </span>
            </button>
            <AnimateHeight duration={300} height={opened === 3 ? "auto" : 0}>
              <p className="border-t border-dash-long pt-4 mt-4">
                Renting offers flexibility and fewer responsibilities, while
                buying provides long-term stability and the potential for
                property value appreciation.
              </p>
            </AnimateHeight>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
