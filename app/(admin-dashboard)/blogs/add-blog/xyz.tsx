"use client"
import { Key, ReactNode, useEffect, useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import Link from "next/link";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("../../../../components/QuillEditor"), { ssr: false });

interface Blog {
  id: number;
  blog_title: string;
  blog_heading: string;
  category: {
    category_name: string;
  } | null;
}

interface Category {
  id: Key | null | undefined;
  category_name: ReactNode;
}

const Page = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]); // State for filtered blogs
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState<number>(5); // Number of items per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_blogs");
        const result = await response.json();
        setBlogs(result.data); // Set blogs data in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    // Filter blogs based on the search term
    if (searchTerm) {
      setFilteredBlogs(
        blogs.filter((blog) => {
          const title = blog.blog_title ? blog.blog_title.toLowerCase() : "";
          const heading = blog.blog_heading ? blog.blog_heading.toLowerCase() : "";
          return title.includes(searchTerm.toLowerCase()) || heading.includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchTerm, blogs]);
  

  const handleDelete = async (blogId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }

    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_blog_by_id/${blogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      alert("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  // Paginate filtered blogs
  const paginateBlogs = (blogs: Blog[], currentPage: number, itemsPerPage: number) => {
    const indexOfLastBlog = currentPage * itemsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
    return blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedBlogs = paginateBlogs(filteredBlogs, currentPage, itemsPerPage);

  return (
    <div className="bg-[var(--bg-2)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Blogs</h2>
        <Link href="../categories/all-categories" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> Add Category
        </Link>
      </div>

      {/* Add Room Form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        {/* Rooms List */}
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />
                <SearchIcon />
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Blog Title</th>
                  <th className="py-3 lg:py-4 px-2">Category Name</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-3">
                      Loading blogs...
                    </td>
                  </tr>
                ) : paginatedBlogs.length > 0 ? (
                  paginatedBlogs.map(({ id, blog_title, blog_heading, category }) => (
                    <tr key={id} className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                      <td className="py-3 lg:py-4 px-2">{blog_title}</td>
                      <td className="py-3 lg:py-4 px-2">
                        {category ? category.category_name : "No Category"}
                      </td>
                      <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                        <Link href={`/blogs/edit-blog?blogId=${id}`} className="text-primary">
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(id)} className="text-[var(--secondary-500)]">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-3">
                      No blogs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={filteredBlogs.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange} // Handle page change
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
