"use client";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  HandThumbUpIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, Suspense, useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { StarIcon } from "@heroicons/react/20/solid";
import { SearchIcon } from "@/public/data/icons";
import axios from "axios";

interface Category {
  id: Key | null | undefined;
  category_name: string;
}

interface Tag {
  id: number;
  tag_name: string;
  created_at: string;
  updated_at: string;
}


interface Blog {
  blog_title: string;
  created_at: Date;
  category: Category; // Specify category as Category type
  blog_heading: string;
  description: string;
  tags: string;
  blog_image_multiple?: string[]; // Assuming it's an array of strings, update if needed
}

const BlogDetails = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);



  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/get_blog_by_id/${blogId}`);
        const data = await response.json();
        if (response.ok) {
          setBlog(data.data);
        } else {
          setError(data.message || 'Failed to fetch blog');
        }
      } catch (err) {
        setError('An error occurred while fetching the blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

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


  const blogImages = blog?.blog_image_multiple || [];

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


  return (
    <div className="py-[60px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12">
            <div className="flex gap-2 items-center">
              <CalendarDaysIcon className="w-5 h-5" />
              <p className="text-gray-500">
                {new Date(blog?.created_at || new Date()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

            </div>
            <h2 className="h2 font-semibold my-6">
              {blog?.blog_title}
            </h2>
            <ul className="flex flex-wrap items-center mb-10 gap-3 gap-md-0">
              <li>
                <div className="flex gap-2 items-center">
                  <li className="text-primary">•</li>
                  <p className="mb-0">
                    {blog?.category.category_name}
                  </p>
                </div>
              </li>
            </ul>
            <Swiper
              loop={true}
              slidesPerView={1}
              spaceBetween={24}
              navigation={{
                nextEl: '.btn-next',
                prevEl: '.btn-prev',
              }}
              modules={[Navigation]}
              className="swiper blog-details-slider mb-10"
            >
              {blogImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    width={1296}
                    height={600}
                    src={image}
                    alt={`blog-image-${index + 1}`}
                    className="w-full h-[600px] rounded-2xl object-cover"
                  />
                </SwiperSlide>
              ))}


              <div className="absolute bottom-0 right-0 p-3 sm:p-4 md:p-5 lg:px-10 lg:py-6 bg-primary z-10 flex gap-3 text-white rounded-tl-2xl rounded-br-2xl">
                <div className="btn-prev border border-white w-10 h-10 flex items-center justify-center rounded-full text-2xl hover:bg-white hover:text-neutral-800 duration-300 cursor-pointer">
                  <i className="las la-angle-left"></i>
                </div>
                <div className="btn-next border border-white w-10 h-10 flex items-center justify-center rounded-full text-2xl hover:bg-white hover:text-neutral-800 duration-300 cursor-pointer">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Swiper>
            <div className="container">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-10">
                    <h2 className="h2 mb-8">
                      {blog?.blog_heading}
                    </h2>
                    <p className="clr-neutral-500 mb-6" dangerouslySetInnerHTML={{ __html: blog?.description || "" }} />



                    <div className="hr-dashed mb-6"></div>

                  </div>

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
                              href={`blog-details/${blog.id}`}
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
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BlogDetails />
  </Suspense>
);

export default Page;
