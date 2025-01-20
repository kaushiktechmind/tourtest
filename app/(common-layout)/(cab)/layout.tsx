"use client";

import CheckboxCustom from "@/components/Checkbox";
import CustomRangeSlider from "@/components/RangeSlider";
import { SearchIcon } from "@/public/data/icons";
import { placeTypes } from "@/public/data/placeTypes";
import { tourtypes } from "@/public/data/tourtypes";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  ListBulletIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  return (
    <>
      <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3 ">
        <div className="container mt-[30px]">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 lg:col-span-4 order-2 lg:order-1">
              <div className="p-3 sm:p-4 lg:py-6 lg:px-8 bg-white rounded-2xl shadow-lg">
                <h4 className="mb-0 text-2xl font-semibold"> Filter </h4>
                <div className="border-t border-dashed my-6"></div>
                <div className="flex items-center justify-between rounded-full border border-neutral-40 bg-[var(--bg-2)] px-5 py-3">
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 focus:outline-none"
                    placeholder="Search by cab name"
                  />
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 lh-1">
                    <SearchIcon />
                  </button>
                </div>
               
               
                
               
                <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium my-6">
                  Star Category
                </p>
                <ul className="flex flex-col gap-3">
                  <li className="flex justify-between items-center">
                    <CheckboxCustom
                      label="5 Star"
                      img={
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      }
                    />
                    <span>425</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <CheckboxCustom
                      label="4 Star"
                      img={
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      }
                    />
                    <span>325</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <CheckboxCustom
                      label="3 Star"
                      img={
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      }
                    />
                    <span>205</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <CheckboxCustom
                      label="2 Star"
                      img={
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      }
                    />
                    <span>65</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <CheckboxCustom
                      label="1 Star"
                      img={
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      }
                    />
                    <span>21</span>
                  </li>
                </ul>
                <div className="border-t border-dashed my-6"></div>
                <Link
                  href="#"
                  className="btn-outline  w-full flex justify-center items-center text-primary gap-2">
                  <ArrowPathIcon className="w-5 h-5" />
                  Reset Filters
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 order-1 lg:order-2">
              <div className="grid grid-cols-12 gap-4 lg:gap-6">
                <div className="col-span-12">
                  <div className="bg-white rounded-lg py-2 px-6 shadow-lg">
                    <ul className="flex justify-between items-center flex-wrap gap-3 ">
                      <li className="hidden xl:block">
                        {/* <p className="mb-0 clr-neutral-500">
                          Showing 5 of 20 Results
                        </p> */}
                      </li>
                      <li className="flex-grow">
                        <ul className="flex flex-wrap justify-end justify-content-lg-start justify-content-xl-center gap-4">
                          <li>
                            <Link
                              href="/cab-listing-grid"
                              className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${
                                path === "/cab-listing-grid" && "text-primary"
                              }`}>
                              <Squares2X2Icon className="w-5 h-5" />
                              <span className="inline-block font-medium">
                                Grid
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/cab-listing"
                              className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${
                                path === "/cab-listing" && "text-primary"
                              }`}>
                              <ListBulletIcon className="w-5 h-5" />
                              <span className="inline-block font-medium">
                                List
                              </span>
                            </Link>
                          </li>
                         
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
