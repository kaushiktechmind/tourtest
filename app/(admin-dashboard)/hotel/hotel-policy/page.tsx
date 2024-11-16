"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import QuillEditor from "../../../../components/QuillEditor";

interface Policy {
  id: number;
  policy_title: string;
  created_at: string;
}

const Page = () => {
  const [description, setDescription] = useState<string>(""); // Type for description
  const [policyTitle, setPolicyTitle] = useState<string>(""); // Type for Policy title
  const [policy, setPolicy] = useState<Policy[]>([]); // Specify type for Policys

  // Fetch Policys from the API
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_policy"
        );
        const data: Policy[] = await response.json(); // Type assertion for the fetched data
        setPolicy(data);
      } catch (error) {
        console.error("Error fetching Policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  // Handle form submission
  const handleAddPolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const accessToken = localStorage.getItem("access_token");

    try {
      // Create a temporary DOM element to convert HTML to plain text
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
        tempElement.textContent || tempElement.innerText || ""; // Extract plain text

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_policy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Add the access token here
          },
          body: JSON.stringify({
            policy_title: policyTitle,
            policy_decription: plainTextDescription, // Use plain text description
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      // Update Policys state
      if (result.data) {
        const newPolicy: Policy = {
          id: result.data.id,
          policy_title: result.data.policy_title,
          created_at: result.data.created_at,
        };
        setPolicy((prevPolicy) => [newPolicy, ...prevPolicy]); // Prepend the new Policy
        setPolicyTitle(""); // Clear the title input
        setDescription(""); // Clear the description
      }
      alert("Policy Added Successfully");
    } catch (error) {
      console.error("Error adding Policy:", error);
    }
  };

  const handleDeletePolicy = async (id: number) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_policy_by_id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token here
          },
        }
      );

      if (response.ok) {
        alert("Policy deleted successfully.");

        // Update state to remove the deleted Policy
        setPolicy((prevPolicy) => prevPolicy.filter((policy) => policy.id !== id));
      } else {
        console.error("Failed to delete Policy:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting Policy:", error);
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Hotel Policy</h2>
        <Link href="/add-property" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Hotel
        </Link>
      </div>
      {/* statistics */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Policy</h3>
          <form onSubmit={handleAddPolicy}>
            <p className="mt-6 mb-4 text-xl font-medium">Name :</p>
            <input
              type="text"
              className="w-full border p-2 focus:outline-none rounded-md text-base"
              placeholder="Policy"
              value={policyTitle}
              onChange={(e) => setPolicyTitle(e.target.value)} // Update title state
              required
            />
            <p className="mt-6 mb-4 text-xl font-medium">Description :</p>
            <QuillEditor onChange={setDescription} value={description} />
            <div className="mt-[20px]">
              <button type="submit" className="btn-primary font-semibold">
                <span className="inline-block"> Add New </span>
              </button>
            </div>
          </form>
        </div>
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
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {policy.slice(0, 6).map(({ id, policy_title, created_at }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2">{policy_title}</td>
                    <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                      <Link
                        href={`/hotel/edit-hotel-policy?policyId=${id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeletePolicy(id)} // Attach delete handler
                        className="text-[var(--secondary-500)]"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
