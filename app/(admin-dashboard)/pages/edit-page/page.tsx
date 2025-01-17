"use client";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

const EditPage = () => {
  const [pageTitle, setPageTitle] = useState<string>(""); // State for PAGE Title
  const [description, setDescription] = useState<string>(
    "This is a default description"
  ); // for testing

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("pageId"); // Get PAGE ID from URL params

  // Fetch PAGE data from API
  useEffect(() => {
    const fetchPageData = async () => {
      if (pageId) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/get_page_by_id/${pageId}`
          );
          const data = await response.json();

          // Set the values for title and description
          setPageTitle(data.page_name);
          setDescription(data.page_description);
          console.log("Description from API:", data.page_description);
        } catch (error) {
          console.error("Error fetching PAGE data:", error);
        }
      }
    };

    fetchPageData();
  }, [pageId]);

  // Function to handle PAGE update
  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const accessToken = localStorage.getItem("access_token"); // Get the bearer token from localStorage
  
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }
  
    try {
      // Send the raw HTML content (description) directly, no need to strip HTML tags
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_page_by_id/${pageId}`,
        {
          method: "PUT", // Changed from POST to PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Pass the token in Authorization header
          },
          body: JSON.stringify({
            page_name: pageTitle,
            page_description: description, // Send the HTML description as is
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Page is Updated Successfully:");
        // Redirect or show success message here
        router.push("/pages/all-pages");
      } else {
        console.error("Error updating PAGE:", data.message);
      }
    } catch (error) {
      console.error("Error updating PAGE:", error);
    }
  };
  

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit PAGE</h2>
        <Link href="/hotel/attributes" className="btn-primary">
          View All PAGEs
        </Link>
      </div>

      {/* Form Section */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative pb-10 xxl:pb-0">
        <div className="col-span-12 flex justify-center">
          <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit PAGE Details</h3>
            <form onSubmit={handleUpdatePage}>
              {/* PAGE Title */}
              <label
                htmlFor="pageTitle"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
              >
                PAGE Title:
              </label>
              <input
                type="text"
                id="pageTitle"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)} // Update title state
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />

              {/* PAGE Description */}
              <p className="mt-6 mb-4 text-xl font-medium">Description:</p>
              <QuillEditor onChange={setDescription} value={description} />

              <div className="mt-[20px] text-center">
                <button type="submit" className="btn-primary font-semibold">
                  <span className="inline-block">Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditPage />
  </Suspense>
);

export default Page;
