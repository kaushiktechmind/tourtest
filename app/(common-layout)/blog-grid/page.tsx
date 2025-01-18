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
import axios from "axios";

interface Category {
  id: number;
  category_name: string;
}

interface Tag {
  id: number;
  tag_name: string;
  created_at: string;
  updated_at: string;
}


const Page = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch tags from API
    axios
      .get("https://yrpitsolutions.com/tourism_api/api/get_tag")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);



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


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_category");
        const data: Category[] = await response.json(); // Directly treat response as an array
        setCategories(data); // Set the array to state
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  function decodeEntities(encodedString: string) {
    const doc = new DOMParser().parseFromString(encodedString, "text/html");
    return doc.body.textContent || "";
  }

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
                                <UserCircleIcon className="w-5 h-5" />
                                <p className="mb-0">
                                  <Link
                                    href="#"
                                    className="link text-[var(--neutral-700)] hover:text-primary">
                                    Admin
                                  </Link>
                                </p>
                              </div>
                            </li>
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
                          </ul>
                          <h3 className="h3 mb-5">
                            <Link
                              href={`/blog-details?blogId=${id}`}
                              className="link text-[var(--neutral-700)] hover:text-primary">
                              {blog_title}
                            </Link>
                          </h3>
                          <p className="mb-8">
  {decodeEntities(description.replace(/<[^>]+>/g, "")).split(" ").slice(0, 10).join(" ")}...
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
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-6">
              <h4 className="mb-6 text-2xl font-semibold">Categories</h4>

              {loading ? (
                <p>Loading...</p>
              ) : categories.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href="#"
                        className="link flex items-center gap-3 duration-300 bg-[var(--bg-2)] hover:bg-primary text-[var(--neutral-700)] hover:text-white py-3 px-5 rounded-full"
                      >
                        <span className="grid place-content-center w-8 h-8 bg-white rounded-full shrink-0">
                          <i className="las la-industry text-primary text-xl"></i>
                        </span>
                        <p className="mb-0 text-base sm:text-lg">{category.category_name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No categories found.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
              <h4 className="mb-6 text-2xl font-semibold">Recent Posts</h4>
              {blogs.slice(0, 5).map((blog) => ( // Restrict display to 5 blogs
                <div key={blog.id} className="flex gap-6 mb-6">
                  <div className="w-20 h-12 rounded-2xl shrink-0 overflow-hidden">
                    <Image
                      width={80}  // Fixed width
                      height={64} // Adjusted height to fit within the container
                      src={blog.blog_image_multiple[0]}
                      alt={blog.blog_title}
                      className="rounded-2xl object-cover" // Ensures the image covers the area without distorting
                    />
                  </div>

                  <div className="flex-grow">
                    <h5 className="mb-0">
                      <Link
                        href={`blog-details?blogId=${blog.id}`}
                        className="link text-[var(--neutral-700)] hover:text-primary"
                      >
                        {blog.blog_title}
                      </Link>
                    </h5>
                    <p className="mb-0 clr-neutral-500">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border border-dashed my-6"></div>
            </div>

            <div className="bg-white rounded-2x p-3 sm:p-4 lg:p-6">
              <h4 className="mb-6 text-2xl font-semibold">Popular Tags</h4>
              <ul className="flex flex-wrap gap-3">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href="#"
                        className="link inline-block text-center px-4 py-2 border border-neutral-40 rounded-full bg-white clr-neutral-500 hover:bg-primary hover:text-white"
                      >
                        {tag.tag_name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-neutral-500">No tags available.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
