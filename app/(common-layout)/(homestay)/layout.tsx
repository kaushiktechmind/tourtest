"use client";

import { SearchIcon } from "@/public/data/icons";
import { StarIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon, ListBulletIcon, MapPinIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const loc = searchParams.get("loc");

  const noOfHotels = localStorage.getItem("noOfHotels");
  const noOfCurHotels = Number(localStorage.getItem("noOfCurHotels"));


  return (
      <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3 ">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[100px]">
            <div className="col-span-12 lg:col-span-4 order-2 order-lg-1 ">
              <div className="p-3 sm:p-4 lg:py-6 lg:px-8 bg-white rounded-2xl shadow-lg ">
                <h4 className="mb-0 text-2xl font-semibold"> Filter </h4>
                <div className="border-t border-dashed my-6"></div>
                <div className="flex items-center justify-between rounded-full border border-neutral-40 bg-[var(--bg-2)] px-5 py-3">
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 focus:outline-none"
                    placeholder="Search by homestay name"
                  />
                  <button type="button" className="border-0 bg-transparent p-0 lh-1">
                    <SearchIcon />
                  </button>
                </div>
                <div className="border-t border-dashed my-6"></div>
                <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                  Star Category
                </p>
                <ul className="flex flex-col gap-3">
                  <li className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      5 Star
                    </label>
                  </li>
                  <li className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      4 Star
                    </label>
                  </li>
                  <li className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      3 Star
                    </label>
                  </li>
                  <li className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      2 Star
                    </label>
                  </li>
                  <li className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      1 Star
                    </label>
                  </li>
                </ul>
                <div className="border-t border-dashed my-6"></div>

                <div className="border-t border-dashed my-6"></div>
                <Link
                  href="#"
                  className="btn btn-outline w-full font-semibold text-primary flex justify-center items-center gap-2">
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
                      <li className="hidden xl:block"></li>
                      <li className="flex-grow">
                        <ul className="flex flex-wrap justify-end justify-content-lg-end justify-content-xl-center gap-4">
                          <li className="flex items-center gap-4">
                            <Link
                              href={`/homestays`}
                              className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${path === "/homestays" && "text-primary"}`}>
                              <Squares2X2Icon className="w-5 h-5" />
                              <span className="inline-block font-medium">Grid</span>
                            </Link>

                            <Link
                              href={`/homestaylist`}
                              className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${path === "/homestaylist" && "text-primary"}`}>
                              <ListBulletIcon className="w-5 h-5" />
                              <span className="inline-block font-medium">List</span>
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
  );
}
