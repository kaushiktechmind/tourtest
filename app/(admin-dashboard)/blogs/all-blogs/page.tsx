"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";

interface Blog {
  id: number;
  category_id: number;
  blog_title: string;
  comments: string;
  blog_image_multiple: string | null;
  blog_heading: string;
  tags: string;
  description: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    category_name: string;
    created_at: string;
    updated_at: string;
  };
}

const Page = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_blogs"
        );
        const data = await response.json();
        if (response.ok) {
          setBlogs(data.data);
        } else {
          setError(data.message || "Failed to fetch blogs");
        }
      } catch (err) {
        setError("An error occurred while fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Blogs</h2>
        <Link href="/blogs/add-blog" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Blog
        </Link>
      </div>

      {/* Blog Table */}
      <section className="bg-[var(--bg-2)] px-3 lg:px-6 mb-4 lg:mb-6 relative">
        <div className="p-4 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white z-[1] relative">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <h3 className="h3">Blog Management</h3>
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                />
                <SearchIcon />
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Created At</th>
                  <th className="py-3 lg:py-4 px-2">Blog Title</th>
                  <th className="py-3 lg:py-4 px-2">Category</th>
                  <th className="py-3 lg:py-4 px-2">Tags</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">{new Date(blog.created_at).toLocaleDateString()}</td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">{blog.blog_title}</td>
                    <td className="py-3 lg:py-4 px-2">{blog.category.category_name}</td>
                    <td className="py-3 lg:py-4 px-2">{blog.tags}</td>
                    <td className="py-3 lg:py-4 px-2">
                      <button className="text-primary px-1">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button className="text-[var(--secondary-500)] px-1">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
