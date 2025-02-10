"use client";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

const EditActivityPOLICY = () => {
  const [policyTitle, setPolicyTitle] = useState<string>(""); // State for POLICY Title
  const [description, setDescription] = useState<string>(
    "This is a default description"
  ); // for testing

  const router = useRouter();
  const searchParams = useSearchParams();
  const policyId = searchParams.get("policyId"); // Get POLICY ID from URL params

  // Fetch POLICY data from API
  useEffect(() => {
    const fetchPolicyData = async () => {
      if (policyId) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/get_activity_policy_by_id/${policyId}`
          );
          const data = await response.json();

          // Set the values for title and description
          setPolicyTitle(data.activity_policy_title);
          setDescription(data.activity_policy_decription);
          console.log("Description from API:", data.activity_policy_decription);
        } catch (error) {
          console.error("Error fetching POLICY data:", error);
        }
      }
    };

    fetchPolicyData();
  }, [policyId]);

  // Function to handle POLICY update
  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access_token"); // Get the bearer token from localStorage

    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
      tempElement.textContent || tempElement.innerText || "";
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_activity_policy_by_id/${policyId}`,
        {
          method: "PUT", // Changed from POST to PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Pass the token in Authorization header
          },
          body: JSON.stringify({
            activity_policy_title: policyTitle,
            activity_policy_decription: plainTextDescription,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("POLICY Updated Successfully");
        // Redirect or show success message here
        router.push("/activity/activity-policy");
      } else {
        console.error("Error updating POLICY:", data.message);
      }
    } catch (error) {
      console.error("Error updating POLICY:", error);
    }
  };

  return (
  
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Policy</h2>
        <Link href="/activity/activity-policy" className="btn-primary">
          View All Policies
        </Link>
      </div>

      {/* Form Section */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
      <div className="col-span-12 flex justify-center">
          <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Polciy Details</h3>
            <form onSubmit={handleUpdatePolicy}>
              {/* POLICY Title */}
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

              {/* POLICY Description */}
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
    <EditActivityPOLICY />
  </Suspense>
);

export default Page;
