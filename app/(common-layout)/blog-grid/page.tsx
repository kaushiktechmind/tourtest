"use client";

import { useEffect, useState } from "react";
import {
  ArrowLongRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "@/public/data/icons";

const Page = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_blogs"
        );
        const data = await response.json();
        if (data && data.data) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-6">
          <div className="col-span-12 lg:col-span-8">
            {loading ? (
              <p>Loading blogs...</p>
            ) : (
              <ul className="flex flex-col gap-6">
                {blogs.map(
                  ({
                    id,
                    blog_title,
                    description,
                    comments,
                    created_at,
                    blog_image_multiple,
                    category,
                  }) => (
                    <li key={id}>
                      <div className="bg-white rounded-2xl p-2">
                        <Link
                          href={`/blog-details?blogId=${id}`}
                          className="link block rounded-2xl">
                          <Image
                            width={840}
                            height={500}
                            src={blog_image_multiple[0]}
                            alt={blog_title}
                            className="rounded-2xl object-cover w-full h-[300px]"
                          />
                        </Link>
                        <div className="p-3 md:p-5 pt-8">
                          <ul className="flex flex-wrap mb-5 gap-4 gap-md-0">
                            <li>
                              <div className="flex gap-2 items-center">
                              <li className="text-primary text-lg">•</li>
                                <p className="mb-0">
                                  <Link
                                    href="#"
                                    className="link text-[var(--neutral-700)] hover:text-primary">
                                    {category.category_name}
                                  </Link>
                                </p>
                              </div>
                            </li>
                            <li className="text-primary text-lg">•</li>
                            <li>
                              <div className="flex gap-2 items-center">
                                <CalendarDaysIcon className="w-5 h-5" />
                                <p className="mb-0">
                                  {new Date(created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </li>
                            
                            <li className="text-primary text-lg">•</li>
                            <li>
                              <div className="flex gap-2 items-center">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                <p className="mb-0"> {comments} Comments </p>
                              </div>
                            </li>
                          </ul>
                          <h3 className="h3 mb-5">
                            <Link
                              href={`/blog-details?blogId=${id}`}
                              className="link text-[var(--neutral-700)] hover:text-primary">
                              {blog_title}
                            </Link>
                          </h3>
                          <p className="mb-8">
                            {description.split(" ").slice(0, 10).join(" ")}...
                          </p>
                          <Link
                            href={`/blog-details?blogId=${id}`}
                            className="btn-outline text-primary inline-flex gap-2 items-center font-semibold">
                            Read More
                            <ArrowLongRightIcon className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>



          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h4 className="mb-6 text-2xl font-semibold"> Search </h4>
              <div className="flex items-center border px-6 py-3 rounded-full">
                <input
                  type="text"
                  className="w-full text-[var(--neutral-700)] border-0 focus:outline-none bg-transparent"
                  placeholder="Type Properties Name"
                />
                <SearchIcon />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-6">
              <h4 className="mb-6 text-2xl font-semibold"> Services </h4>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-industry text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Real estate sales{" "}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-city text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Property management{" "}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-taxi text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Home inspection{" "}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-building text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Real estate brokerage{" "}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-graduation-cap text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Education and Training{" "}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full">
                    <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                      <i className="las la-sliders-h text-primary text-xl"></i>
                    </span>
                    <p className="mb-0 text-base sm:text-lg">
                      {" "}
                      Consulting services{" "}
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
              <h4 className="mb-6 text-2xl font-semibold"> Recent Posts </h4>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/img/recent-post-1.jpg"
                    alt="image"
                    className=" rounded-2xl"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="mb-0">
                    <Link
                      href="blog-details"
                      className="link text-[var(--neutral-700)] hover:text-primary">
                      US Pending Home Sales Drop for Second
                    </Link>
                  </h5>
                  <p className="mb-0 clr-neutral-500"> 23 Mar, 2023 </p>
                </div>
              </div>
              <div className="border border-dashed my-6"></div>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/img/recent-post-2.jpg"
                    alt="image"
                    className=" rounded-2xl"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="mb-0">
                    <Link
                      href="blog-details"
                      className="link text-[var(--neutral-700)] hover:text-primary">
                      Home Prices in Canada Surge to Record Highs
                    </Link>
                  </h5>
                  <p className="mb-0 clr-neutral-500"> 23 Mar, 2023 </p>
                </div>
              </div>
              <div className="border border-dashed my-6"></div>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/img/recent-post-3.jpg"
                    alt="image"
                    className=" rounded-2xl"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="mb-0">
                    <Link
                      href="blog-details"
                      className="link text-[var(--neutral-700)] hover:text-primary">
                      New York City Renters Return in Droves
                    </Link>
                  </h5>
                  <p className="mb-0 clr-neutral-500"> 23 Mar, 2023 </p>
                </div>
              </div>
              <div className="border border-dashed my-6"></div>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/img/recent-post-4.jpg"
                    alt="image"
                    className=" rounded-2xl"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="mb-0">
                    <Link
                      href="blog-details"
                      className="link text-[var(--neutral-700)] hover:text-primary">
                      New York City&apos;s Luxury Real Estate Market
                    </Link>
                  </h5>
                  <p className="mb-0 clr-neutral-500"> 23 Mar, 2023 </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6">
              <h4 className="mb-6 text-2xl font-semibold"> Popular Tag </h4>
              <ul className="flex flex-wrap gap-3">
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    Real Estate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    Building
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    Apartment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    House
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    Resort
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    Studio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog-grid"
                    className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white">
                    New
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
