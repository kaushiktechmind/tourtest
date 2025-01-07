"use client";
import Accordion from "@/components/Accordion";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import {
  ChevronDownIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const Page = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("/img/team-1.jpg");
  const [adminSetting, setAdminSetting] = useState<any>(null); // State for fetched data
  const [formData, setFormData] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    profile_photo: "",
    logo: "",
    favicon: "",
  });

  // Fetch Admin Settings on Component Mount
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_admin_setting/1"
        );
        const data = await response.json();
        if (data.message === "Admin Setting fetched successfully.") {
          setAdminSetting(data.data);
          setFormData({
            full_name: data.data.full_name,
            email: data.data.email,
            phone: data.data.phone,
            profile_photo: data.data.profile_photo,
            logo: data.data.logo,
            favicon: data.data.favicon,
          });
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
      }
    };
    fetchAdminSettings();
  }, []);

  const handleImageClick = (field: string) => {
    // Store which image field was clicked
    if (inputFileRef.current) {
      inputFileRef.current.dataset.field = field;
      inputFileRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const field = event.target?.dataset?.field;
      if (field) {
        const file = files[0];
        const imageUrl = URL.createObjectURL(file); // Generate temporary URL
        setFormData((prevData) => ({
          ...prevData,
          [field]: imageUrl, // Set the generated URL as the image src
        }));
      }
    }
  };
  

  // Handle form data change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission to update settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Authorization token not found.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      for (const key in formData) {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);  // Append file as binary
        } else {
          formDataToSend.append(key, formData[key]);  // Append other fields as normal
        }
      }

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/update_admin_setting/1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the Bearer token
          },
          body: formDataToSend,  // Send FormData with binary data
        }
      );
      const data = await response.json();
      if (data.message) {
        alert("Settings updated successfully");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating admin settings:", error);
    }
  };


  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Admin Settings </h2>
      </div>

      <section className="z-[1] gap-4 mb-6 lg:gap-6 px-3 sm:px-5 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-6">
            <div className="col-span-12 xl:col-span-6">
              <div className="bg-[#FBFBFF] border rounded-2xl p-3 md:p-5 lg:py-8 lg:px-10 mb-6">
                <Accordion
                  buttonContent={(open) => (
                    <div className="rounded-2xl flex justify-between items-center">
                      <h3 className="h3">Basic Info </h3>
                      <ChevronDownIcon
                        className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  )}
                  initialOpen={true}
                >
                  <div className="pt-4 lg:pt-6">
                    <div>
                      <div className="relative mx-auto ms-md-0 mb-6">
                        <div className="avatar-upload__edit">
                          <input
                            type="file"
                            id="imageUpload"
                            accept=".png, .jpg, .jpeg"
                            className="hidden"
                            ref={inputFileRef}
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="imageUpload"
                            className="avatar-upload__label"
                          ></label>
                        </div>
                        <div className="relative w-[180px] h-[180px]">
                          <Image
                            onClick={() => handleImageClick("profile_photo")}
                            width={180}
                            height={180}
                            className="rounded-full border-[6px] border-[#F5F5FE] shadow-md"
                            src={formData.profile_photo || imageSrc}
                            alt="avatar"
                          />
                          <span className="w-8 h-8 absolute cursor-pointer text-primary top-4 right-4 hover:bg-primary duration-300 hover:text-white rounded-full bg-white flex justify-center items-center border border-primary">
                            <PencilIcon className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-6">
                          <label
                            htmlFor="full-name"
                            className="block mb-2 font-medium clr-neutral-500"
                          >
                            Full name :
                          </label>
                          <input
                            type="text"
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="border w-full focus:outline-none py-3 px-6 rounded-2xl"
                            placeholder="Enter name"
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                          <label
                            htmlFor="user-email"
                            className="block mb-2 font-medium clr-neutral-500"
                          >
                            Email :
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border w-full focus:outline-none py-3 px-6 rounded-2xl"
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-12">
                          <label
                            htmlFor="user-phone"
                            className="block mb-2 font-medium clr-neutral-500"
                          >
                            Phone :
                          </label>
                          <input
                            type="text"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border w-full focus:outline-none py-3 px-6 rounded-2xl"
                            placeholder="Enter number"
                          />
                        </div>
                        <div className="col-span-12">
                          <button
                            type="submit"
                            className="btn btn-primary w-full mt-4"
                          >
                            Update Settings
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Accordion>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-6">
              <div className="bg-[#FBFBFF] border rounded-2xl p-3 md:p-5 lg:py-8 lg:px-10 mb-6">
                <Accordion
                  buttonContent={(open) => (
                    <div className="rounded-2xl flex justify-between items-center">
                      <h3 className="h3">Logo and Favicon</h3>
                      <ChevronDownIcon
                        className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </div>
                  )}
                  initialOpen={true}
                >
                  <div className="flex space-x-6 mt-6">
                    {/* First Image Upload */}
                    <div className="relative w-[100px] h-[100px] flex-shrink-0">
                      <div className="avatar-upload__edit">
                        <input
                          type="file"
                          id="imageUpload1"
                          accept=".png, .jpg, .jpeg"
                          className="hidden"
                          ref={inputFileRef}
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="imageUpload1"
                          className="avatar-upload__label"
                        ></label>
                      </div>
                      <div className="relative w-[100px] h-[100px]">
                        <Image
                          onClick={() => handleImageClick("logo")}
                          width={180}
                          height={180}
                          className="rounded-full border-[6px] border-[#F5F5FE] shadow-md"
                          src={formData.logo || imageSrc}
                          alt="logo"
                        />
                        <span className="w-5 h-5 absolute cursor-pointer text-primary top-4 right-4 hover:bg-primary duration-300 hover:text-white rounded-full bg-white flex justify-center items-center border border-primary">
                          <PencilIcon className="w-5 h-5" />
                        </span>
                      </div>
                    </div>

                    {/* Second Image Upload */}
                    <div className="relative w-[100px] h-[100px] flex-shrink-0">
                      <div className="avatar-upload__edit">
                        <input
                          type="file"
                          id="imageUpload2"
                          accept=".png, .jpg, .jpeg"
                          className="hidden"
                          ref={inputFileRef}
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="imageUpload2"
                          className="avatar-upload__label"
                        ></label>
                      </div>
                      <div className="relative w-[100px] h-[100px]">
                        <Image
                          onClick={() => handleImageClick("favicon")}
                          width={180}
                          height={180}
                          className="rounded-full border-[6px] border-[#F5F5FE] shadow-md"
                          src={formData.favicon || imageSrc}
                          alt="favicon"
                        />
                        <span className="w-5 h-5 absolute cursor-pointer text-primary top-4 right-4 hover:bg-primary duration-300 hover:text-white rounded-full bg-white flex justify-center items-center border border-primary">
                          <PencilIcon className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
