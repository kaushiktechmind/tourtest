"use client";
import { Key, ReactNode, useEffect, useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });

interface Room {
  blog_title: string;
  blog_heading: string;
}

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




interface HotelFormData {
  blog_title: string;
  category_id: string;
  blog_heading: string;
  tags: string;
  comments: string;
  blog_image_multiple: File[];
  // [key: string]: string | File[] | string[];
  // For multiple image uploads
}

const Page = () => {

  const [description, setDescription] = useState<string>("");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [tags, setTags] = useState<{ id: number; tag_name: string }[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);


  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [formData, setFormData] = useState<HotelFormData>({
    blog_title: "",
    category_id: "",
    blog_heading: "",
    tags: "",
    comments: "",
    blog_image_multiple: [],
  });


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('https://yrpitsolutions.com/tourism_api/api/get_tag');
        const data = await response.json();
        setTags(data); // Assuming the response is an array of tags
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTagName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedTagName, // Update tags with tag_name
    }));
  };





  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://yrpitsolutions.com/tourism_api/api/get_category');
        const data = await response.json();
        setCategories(data); // Store categories in state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;
    setSelectedCategoryId(Number(categoryId)); // Update selectedCategoryId state
    setFormData((prevFormData) => ({
      ...prevFormData,
      category_id: categoryId, // Update category_id in formData
    }));
  };





  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://yrpitsolutions.com/tourism_api/api/get_all_blogs');
        const result = await response.json();
        setBlogs(result.data); // Set blogs data in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  const handleDelete = async (blogId: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_blog_by_id/${blogId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      alert('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };






  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prevData) => ({
        ...prevData,
        blog_image_multiple: files,
      }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    const token = localStorage.getItem("access_token");
    const formDataToSend = new FormData();

    // Append all formData fields except images
    for (const key in formData) {
      if (key === "blog_image_multiple") {
        formData.blog_image_multiple.forEach((file) => {
          formDataToSend.append("blog_image_multiple[]", file);
        });
      } else {
        formDataToSend.append(key, formData[key as keyof HotelFormData] as string);
      }
    }

    // Append the plain text description
    const tempElement = document.createElement("div");
    tempElement.innerHTML = description;
    const plainTextDescription = tempElement.textContent || tempElement.innerText || "";
    formDataToSend.append("description", plainTextDescription);

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_blog",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add blog: ${errorMessage}`);
      }

      const data = await response.json();
      alert("Blog added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error occurred during blog addition:", error);
    }
  };

  <div className="mt-[20px]">
    <button
      type="submit"
      onClick={handleSubmit}
      className="btn-primary font-semibold"
    >
      Add New
    </button>
  </div>;

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
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Blog</h3>
          <form onSubmit={handleSubmit}>



            <p className="mt-6 mb-4 text-xl font-medium">
              Category: <span className="astrick">*</span>
            </p>

            <select
              id="category"
              name="category"
              value={formData.category_id}
              onChange={handleCategoryChange}
              className="w-full border p-2 focus:outline-none rounded-md text-base"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id ?? ''}>
                  {category.category_name}
                </option>
              ))}
            </select>

            {/* 
            <p className="mt-6 mb-4 text-xl font-medium">Category :<span className="astrick">*</span></p>
            <input
              type="text"
              id="category_id"
              name="category_id"
              placeholder=""
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.category_id}
              onChange={handleInputChange}
            /> */}

            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Blog Title:
            </label>
            <input
              type="text"
              id="blog_title"
              name="blog_title"
              placeholder=""
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.blog_title}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Description :</p>
            <QuillEditor onChange={setDescription} value={description} />

            
           
            <p className="mt-6 mb-4 text-xl font-medium">Tags:</p>
            <select
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleTagChange}
              className="w-full border p-2 focus:outline-none rounded-md text-base"
            >
              <option value="" disabled>
                Select a tag
              </option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.tag_name}
                </option>
              ))}
            </select>


            <label
              htmlFor="icon-upload"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Upload Images:
            </label>
            <div className="pt-6">
              <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed"
                >
                  <span className="flex flex-col items-center justify-center py-12">
                    <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                    <span className="h3 clr-neutral-500 text-center mt-4 mb-3">
                      Drag & Drop
                    </span>
                    <span className="block text-center mb-6 clr-neutral-500">
                      OR
                    </span>
                    <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                      Select Files
                    </span>
                  </span>
                  <input
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            {/* Display selected images */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {formData.blog_image_multiple.map((file, index) => (
                <div key={index} className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-[20px]">
              <Link href="#" className="btn-primary font-semibold">
                <span className="inline-block" onClick={handleSubmit}>
                  {" "}
                  Add New{" "}
                </span>
              </Link>
            </div>
          </form>
        </div>

        {/* Rooms List */}
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
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
                ) : blogs.length > 0 ? (
                  blogs.map(({ id, blog_title, blog_heading, category }) => (
                    <tr
                      key={id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                    >
                      <td className="py-3 lg:py-4 px-2">{blog_title}</td>
                      <td className="py-3 lg:py-4 px-2">
                        {category ? category.category_name : 'No Category'}
                      </td>
                      <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                        <Link
                          href={`/blogs/edit-blog?blogId=${id}`}
                          className="text-primary"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-[var(--secondary-500)]"
                        >
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
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
