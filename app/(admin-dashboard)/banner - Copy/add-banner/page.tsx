"use client";

import {
  ChevronDownIcon,
  CloudArrowUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Accordion from "@/components/Accordion";
import Link from "next/link";
import React, { useState, ChangeEvent, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddNewBanner = () => {
  const router = useRouter();
  const [desktopBanner, setDesktopBanner] = useState<File | null>(null);
  const [mobileBanner, setMobileBanner] = useState<File | null>(null);
  const [desktopBannerPreview, setDesktopBannerPreview] = useState<string | null>(null);
  const [mobileBannerPreview, setMobileBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setBanner: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0] || null;
    setBanner(file);
    if (file) {
      setPreview(URL.createObjectURL(file));  // Create a preview URL for the image
    }
  };

  const handleSubmit = async () => {
    if (!desktopBanner && !mobileBanner) {
      alert("Please upload at least one banner (desktop or mobile).");
      return;
    }

    const formData = new FormData();
    if (desktopBanner) formData.append("desktop_banner", desktopBanner);
    if (mobileBanner) formData.append("mobile_banner", mobileBanner);

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_home_banner",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      setTimeout(() => {
        alert("Banner Added Successfully!");
        router.push("/banner/all-banner");
      }, 100);
      router.push("/banner/all-banner");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading banner:", error);
      setTimeout(() => {
        alert("Failed to Upload Banner, try again");
      }, 100);
    }

  };


  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)] pb-6">
        <h2 className="h2 text-white">Add New Banner</h2>
        <Link href="/banner/all-banner" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Banners
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-4 lg:gap-6 px-3 md:px-6 pb-10 mt-[-20px]">
        {["Desktop", "Mobile"].map((type, index) => (
          <div key={type} className="col-span-12 lg:col-span-6">
            <div className="rounded-2xl bg-white border p-6">
              <Accordion
                buttonContent={(open) => (
                  <div className="rounded-2xl flex items-center justify-between">
                    <h3 className="h3">{type} Banner</h3>
                    <ChevronDownIcon className={`w-5 h-5 duration-300 ${open ? "rotate-180" : ""}`} />
                  </div>
                )}
                initialOpen={true}
              >
                <div className="pt-6">
                  <label className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed py-12">
                    <CloudArrowUpIcon className="w-12 h-12" />
                    <span className="h3 text-center mt-4 mb-3">Drag & Drop</span>
                    <span className="block text-center mb-6">OR</span>
                    <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-4">Select File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(
                          event,
                          index === 0 ? setDesktopBanner : setMobileBanner,
                          index === 0 ? setDesktopBannerPreview : setMobileBannerPreview
                        )
                      }
                    />
                  </label>
                  {index === 0 && desktopBannerPreview && (
                    <div className="mt-4">
                      <img src={desktopBannerPreview} alt="Desktop Banner Preview" className="w-full h-auto rounded-lg" />
                    </div>
                  )}
                  {index === 1 && mobileBannerPreview && (
                    <div className="mt-4">
                      <img src={mobileBannerPreview} alt="Mobile Banner Preview" className="w-full h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="btn-primary font-semibold ml-6 mb-6" disabled={loading}>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Uploading...</span>
          </div>
        ) : (
          "Save & Preview"
        )}
      </button>
      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AddNewBanner />
  </Suspense>
);

export default Page;
