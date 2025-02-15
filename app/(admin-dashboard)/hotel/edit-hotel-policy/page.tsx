"use client";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

const EditHotelPolicy = () => {
  const [policyTitle, setPolicyTitle] = useState<string>(""); // State for Policy Title
  const [description, setDescription] = useState<string>(
    "This is a default description"
  ); // for testing

  const router = useRouter();
  const searchParams = useSearchParams();
  const policyId = searchParams.get("policyId"); // Get Policy ID from URL params

  // Fetch Policy data from API
  useEffect(() => {
    const fetchPolicyData = async () => {
      if (policyId) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/get_policy_by_id/${policyId}`
          );
          const data = await response.json();

          // Set the values for title and description
          setPolicyTitle(data.policy_title);
          setDescription(data.policy_description);
          console.log("Description from API:", data.policy_description);
        } catch (error) {
          console.error("Error fetching policy data:", error);
        }
      }
    };

    fetchPolicyData();
  }, [policyId]);

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const accessToken = localStorage.getItem("access_token");
  
    if (!accessToken) {
      alert("Failed to update policy");
      return;
    }
  
    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
        tempElement.textContent || tempElement.innerText || "";
  
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_policy_by_id/${policyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            policy_title: policyTitle,
            policy_description: plainTextDescription,
          }),
        }
      );
  
      if (response.ok) {
        alert("Policy Updated Successfully");
        router.push("/hotel/hotel-policy");
      } else {
        alert("Failed to update policy.");
      }
    } catch (error) {
      alert("Failed to update policy.");
    }
  };
  

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Policy</h2>
        <Link href="/hotel/hotel-policy" className="btn-primary">
          View All Policies
        </Link>
      </div>

      {/* Form Section */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative pb-10 xxl:pb-0 ">
        <div className="col-span-12 flex justify-center -mt-3">
        
          <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Policy Details</h3>
            <form onSubmit={handleUpdatePolicy}>
              {/* Policy Title */}
              <label
                htmlFor="policyTitle"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
              >
                Policy Title:
              </label>
              <input
                type="text"
                id="policyTitle"
                value={policyTitle}
                onChange={(e) => setPolicyTitle(e.target.value)} // Update title state
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />

              {/* Policy Description */}
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
    <EditHotelPolicy />
  </Suspense>
);

export default Page;
