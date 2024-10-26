"use client";
import CounterElement from "@/components/CounterElement";
import SubHeadingBtn from "@/components/SubHeadingBtn";
import Author from "@/components/home-1/Authors";
import Benefit from "@/components/home-1/Benefit";
import Faq from "@/components/home-1/Faq";
import Counter from "@/components/home-2/Counter";
import Explore from "@/components/home-2/Explore";
import MobileApp from "@/components/home-2/MobileApp";
import Testimonial from "@/components/home-2/Testimonial";
import WorkingProcess from "@/components/home-6/WorkingProcess";
import aboutel1 from "@/public/img/about-el-1.png";
import aboutel2 from "@/public/img/about-el-2.png";
import AboutImg1 from "@/public/img/about/img-1.png";
import AboutImg2 from "@/public/img/about/img-2.png";
import AboutImg3 from "@/public/img/about/img-3.png";
import AboutImg4 from "@/public/img/about/img-4.png";
import Img1 from "@/public/img/why-choose-about/img-1.png";
import Img2 from "@/public/img/why-choose-about/img-2.png";
import Img3 from "@/public/img/why-choose-about/img-3.png";
import { Tab } from "@headlessui/react";
import {
  ArrowLongRightIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const page = () => {
  return (
    <main>
      <section className="py-[60px] lg:py-[120px] bg-[var(--bg-2)] relative z-[1] px-3">
        <Image
          src={aboutel1}
          alt="image"
          className="absolute hidden xl:block top-20 right-20"
        />
        <Image
          src={aboutel2}
          alt="image"
          className="absolute hidden xl:block left-20 bottom-20"
        />
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6 xl:col-span-5">
              <div className="relative text-center grid grid-cols-5 gap-4 sm:gap-6 pb-lg-0">
                <div className="col-span-3">
                  <Image
                    className="w-full rounded-md"
                    src={AboutImg1}
                    alt="about img"
                  />
                </div>
                <div className="col-span-2">
                  <Image
                    className="w-full rounded-md"
                    src={AboutImg2}
                    alt="about img"
                  />
                </div>
                <div className="col-span-2">
                  <Image
                    className="w-full rounded-md"
                    src={AboutImg4}
                    alt="about img"
                  />
                </div>
                <div className="col-span-3">
                  <Image
                    className="w-full rounded-md"
                    src={AboutImg3}
                    alt="about img"
                  />
                </div>
                <div className="grid place-content-center w-[200px] h-[200px] rounded-full bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 rounded bg-[var(--primary-light)] grid place-content-center text-primary mx-auto">
                    <HandThumbUpIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-center text-primary mt-3 h3 mb-1">
                    7.5K+
                  </h3>
                  <p className="mb-0 text-sm text-center">
                    {" "}
                    Clients Satisfied{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-10 lg:col-span-6 xl:col-start-7 mx-auto lg:ml-0">
              <SubHeadingBtn
                text="About us"
                classes="bg-[var(--primary-light)]"
              />
              <h2 className="mt-4 mb-10 h2 leading-tight">
                We build modern spaces and Apartment property
              </h2>
              <Tab.Group>
                <Tab.List className="flex gap-3 flex-wrap items-center about-tab mb-7">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "focus:outline-none py-2 mx-2 font-medium",
                        selected ? "text-primary border-b border-primary" : ""
                      )
                    }>
                    Residential
                  </Tab>{" "}
                  |
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "focus:outline-none py-2 mx-2 font-medium",
                        selected ? "text-primary border-b border-primary" : ""
                      )
                    }>
                    Apartment
                  </Tab>{" "}
                  |
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "focus:outline-none py-2 mx-2 font-medium",
                        selected ? "text-primary border-b border-primary" : ""
                      )
                    }>
                    Commercial
                  </Tab>
                </Tab.List>

                <Tab.Panels className="mb-8">
                  <Tab.Panel>
                    <p className="mb-0">
                      If you&apos;re interested in buying a residential
                      property, you may want to consider factors such as
                      location, price of the home.
                    </p>
                  </Tab.Panel>
                  <Tab.Panel>
                    <p className="mb-0">
                      If you&apos;re interested in buying a Apartment, you may
                      want to consider factors such as location, price of the
                      home.
                    </p>
                  </Tab.Panel>
                  <Tab.Panel>
                    <p className="mb-0">
                      If you&apos;re interested in buying a commercial property,
                      you may want to consider factors such as location, price
                      of the home.
                    </p>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
              <ul className="columns-1 md:columns-2 flex-wrap mb-10">
                <li className="py-2">
                  <div className="flex items-center gap-2">
                    <i className="text-2xl text-primary las la-check-square"></i>
                    <p className="mb-0"> Find your dream home </p>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center gap-2">
                    <i className="text-2xl text-[var(--secondary-500)] las la-check-square"></i>
                    <p className="mb-0"> 100% Safe transactions </p>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center gap-2">
                    <i className="text-2xl text-[var(--tertiary)] las la-check-square"></i>
                    <p className="mb-0"> Best quality guarantee </p>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center gap-2">
                    <i className="text-2xl text-primary las la-check-square"></i>
                    <p className="mb-0"> Very low cost on taxes </p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-4 gap-md-10">
                <Link
                  href="service"
                  className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium">
                  <span className="inline-block"> Read More </span>
                  <ArrowLongRightIcon className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 gap-md-4">
                  <div className="grid place-content-center w-12 h-12 rounded-full bg-[var(--primary-light)] text-primary shrink-0">
                    <i className="las la-headset text-2xl"></i>
                  </div>
                  <div className="flex-grow">
                    <p className="mb-1"> Support us </p>
                    <p className="mb-0 text-lg font-medium"> (704) 555-0127 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How it work section */}
      <WorkingProcess />

      {/* Why choose us */}
      <div className="py-[60px] md:py-[120px] bg-[var(--bg-2)] relative z-[1] px-3">
        <div className="container">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-6 xl:col-span-5">
              <div className="relative z-[1] text-center text-xxl-start h-full max-lg:min-h-[500px] pb-lg-0">
                <Image
                  src={Img1}
                  alt="image"
                  className="absolute top-0 left-3 z-[1] sm:left-10 border-4 border-[var(--bg-2)] rounded-md shadow-md"
                />
                <Image
                  src={Img2}
                  alt="image"
                  className="absolute right-0 top-1/2 z-[2] border-4 border-[var(--bg-2)] rounded-md shadow-md"
                />
                <Image
                  src={Img3}
                  alt="image"
                  className="absolute left-0 bottom-0 rounded-md shadow-md"
                />

                <Image
                  width={62}
                  height={62}
                  src="/img/why-choose-el-1.png"
                  alt="image"
                  className="absolute top-[35%] -left-10 hidden xl:block"
                />
                <Image
                  width={201}
                  height={227}
                  src="/img/why-choose-el-2.png"
                  alt="image"
                  className="absolute -left-28 -bottom-28 hidden xl:block"
                />
                <div className="inline-flex items-center gap-4 rounded p-8 bg-primary z-10 absolute top-12 left-0 xxl:-left-24">
                  <div className="w-12 h-12 rounded bg-white grid place-content-center text-primary shrink-0">
                    <i className="las la-thumbs-up text-[32px]"></i>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white mb-0 h3 text-start">
                      <CounterElement end={25} />+
                    </h3>
                    <p className="mb-0 text-sm text-white text-start">
                      years experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 xl:col-start-7">
              <SubHeadingBtn text="Why choose us" classes="bg-white" />
              <h2 className="mt-4 h2 leading-tight mb-6">
                Elevate Your Living Experience with Our Best Properties
              </h2>
              <p className="mb-10 clr-neutral-500">
                Real estate can be bought, sold, leased, or rented, and can be a
                valuable investment opportunity. The value of real estate can
                be...
              </p>
              <ul className="flex flex-col gap-6 mb-10">
                <li>
                  <div className="flex gap-6 align-items-start">
                    <div className="shrink-0">
                      <i className="las text-[40px] la-building text-primary"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="mb-3 text-2xl font-semibold">
                        {" "}
                        Buy a Property{" "}
                      </h4>
                      <span className="mb-0 clr-neutral-500">
                        Selling a property&quot; refers to the process of
                        transferring the ownership
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex gap-6 align-items-start">
                    <div className="shrink-0">
                      <i className="las text-[40px] la-store text-[var(--secondary-500)]"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="mb-3 text-2xl font-semibold">
                        {" "}
                        Rent a Property{" "}
                      </h4>
                      <span className="mb-0 clr-neutral-500">
                        Renting a property typically refers to the process of
                        paying a landlord
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex gap-6 align-items-start">
                    <div className="shrink-0">
                      <i className="las text-[40px] la-city text-[#9C742B]"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="mb-3 text-2xl font-semibold">
                        {" "}
                        Sell a Property{" "}
                      </h4>
                      <span className="mb-0 clr-neutral-500">
                        Selling a property typically refers to the process of
                        transferring
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <Link
                href="service"
                className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium">
                <span className="inline-block"> Read More </span>
                <ArrowLongRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Explore properties */}
      <Explore />
      {/* Counter */}
      <Counter />
      {/* Authors */}
      <Author />
      {/* Explore section */}
      <div className="pt-120">
        <Benefit />
      </div>
      {/* Testimonail */}
      <Testimonial />
      {/* Mobile app */}
      <MobileApp />
      {/* Faq  */}
      <Faq />
    </main>
  );
};

export default page;
