"use client";
import { Key, ReactNode, useEffect, useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import QuillEditor from "../../../../components/QuillEditor";
import { useRouter, useSearchParams } from "next/navigation";

interface Room {
  blog_title: string;
  blog_heading: string;
}


interface Blog {
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
  blog_image_multiple: File[];
  [key: string]: string | File[] | string[];
}

interface FormData {
  comments: string;
  // other fields...
}

const Page = () => {

  const [description, setDescription] = useState<string>("");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");


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
    const fetchBlogById = async () => {
      if (!blogId) return; // If no blogId, exit early

      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/get_blog_by_id/${blogId}`);
        const result = await response.json();

        if (response.ok && result.data) {
          const blogData = result.data;

          setFormData({
            blog_title: blogData.blog_title || "",
            category_id: blogData.category_id.toString() || "",
            blog_heading: blogData.blog_heading || "",
            tags: blogData.tags || "",
            comments: blogData.comments || "",
            blog_image_multiple: [], // File input can't be prefilled with URLs directly
          });

          setBannerImageUrls(blogData.blog_image_multiple);
          setDescription(blogData.description || ""); // Set description for QuillEditor
          setSelectedCategoryId(blogData.category_id); // Set selected category
        } else {
          console.error('Failed to fetch blog data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching blog by ID:', error);
      }
    };

    fetchBlogById();
  }, [blogId]);



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
    formDataToSend.append("_method", "PUT");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_blog_by_id/${blogId}`,
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
        throw new Error(`Failed to add room: ${errorMessage}`);
      }

      const data = await response.json();
      alert("Blog Updated successfully");
      router.push("/blogs/all-blogs")
    } catch (error) {
      console.error("Error occurred during room addition:", error);
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
        <Link
          href={`/hotel/room-availability`}
          className="btn-primary"
        >
          <EyeIcon className="w-5 h-5" /> Room Availability
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

            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Blog Name:
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

            <p className="mt-6 mb-4 text-xl font-medium">Blog Heading :</p>
            <input
              type="text"
              name="blog_heading"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={formData.blog_heading}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Comments :</p>
            <input
              type="text"
              name="comments"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={typeof formData.comments === "string" ? formData.comments : ""}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Tags :</p>
            <input
              type="text"
              name="tags"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={formData.tags}
              onChange={handleInputChange}
            />

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
            {/* <div className="flex flex-wrap gap-4">
              {bannerImageUrls.map((url, index) => (
                <div key={index} className="w-32 h-32">
                  <img src={url} alt={`Banner Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div> */}

            <div className="flex flex-wrap gap-4">
              {/* Only show prefilled images if no new image is selected */}
              {formData.blog_image_multiple.length === 0 && bannerImageUrls.length > 0 && (
                <div>
                  {bannerImageUrls.map((url, index) => (
                    <div key={index} className="w-32 h-32">
                      <img src={url} alt={`Banner Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
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

      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
