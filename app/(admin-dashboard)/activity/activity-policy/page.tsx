"use client";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import { Dialog, Transition } from "@headlessui/react";

interface Policy {
  id: number;
  activity_policy_title: string;
  created_at: string;
}

const Page = () => {
  const [description, setDescription] = useState<string>("");
  const [policyTitle, setPolicyTitle] = useState<string>("");
  const [policys, setPolicys] = useState<Policy[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [filteredPOLICYs, setFilteredPOLICYs] = useState<Policy[]>([]); // Filtered POLICYs

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPOLICYs = filteredPOLICYs.slice(indexOfFirstItem, indexOfLastItem);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<number | null>(null);


  // Fetch POLICYs from the API
  useEffect(() => {
    const fetchPOLICYs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_activity_policy"
        );
        const data: Policy[] = await response.json();
        setPolicys(data);
        setFilteredPOLICYs(data); // Initialize filtered POLICYs
      } catch (error) {
        console.error("Error fetching POLICYs:", error);
      }
    };
    fetchPOLICYs();
  }, []);

  // Filter POLICYs based on search query
  useEffect(() => {
    const filtered = policys.filter((policy) =>
      policy.activity_policy_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPOLICYs(filtered);
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, policys]);

  const handleAddPOLICY = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("access_token");

    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
        tempElement.textContent || tempElement.innerText || "";

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_activity_policy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            activity_policy_title: policyTitle,
            activity_policy_description: plainTextDescription,
          }),
        }
      );

      const result = await response.json();

      if (result.data) {
        const newPolicy: Policy = {
          id: result.data.id,
          activity_policy_title: result.data.activity_policy_title,
          created_at: result.data.created_at,
        };
        setPolicys((prevPolicys) => [newPolicy, ...prevPolicys]);
        setPolicyTitle("");
        setDescription("");
        alert("POLICY added Successfully");
      }
    } catch (error) {
      console.error("Error adding POLICY:", error);
    }
  };

  const handleDeletePOLICY = async (id: number) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_activity_policy_by_id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setPolicys((prevPolicys) => prevPolicys.filter((policy) => policy.id !== id));
        alert("POLICY deleted successfully.");
      } else {
        console.error("Failed to delete POLICY:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting POLICY:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Activity Policies</h2>
        <Link href="/activity/all-activity" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Activities
        </Link>
      </div>
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Policy</h3>
          <form onSubmit={handleAddPOLICY}>
            <p className="mt-6 mb-4 text-xl font-medium">Name :</p>
            <input
              type="text"
              className="w-full border p-2 focus:outline-none rounded-md text-base"
              placeholder="Policy Name"
              value={policyTitle}
              onChange={(e) => setPolicyTitle(e.target.value)}
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
            <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
              <input
                type="text"
                placeholder="Search"
                className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
              <SearchIcon />
            </div>
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
                {currentPOLICYs.map(({ id, activity_policy_title, created_at }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[300px] whitespace-normal">
                      {activity_policy_title}
                    </td>
                    <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                      <Link
                        href={`/activity/edit-activity-policy?policyId=${id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setPolicyToDelete(id);
                          setIsDialogOpen(true);  // Open the confirmation dialog
                        }}
                        className="text-[var(--secondary-500)]"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalItems={filteredPOLICYs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <Transition show={isDialogOpen} as={React.Fragment}>
              <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsDialogOpen(false)}>
                <div className="flex items-center justify-center min-h-screen px-4 py-12">
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75" />
                  <div className="relative bg-white rounded-lg max-w-sm w-full p-6">
                    <Dialog.Title className="text-xl font-semibold">Confirm Deletion</Dialog.Title>
                    <Dialog.Description className="mt-2">
                      Are you sure you want to delete this POLICY? This action cannot be undone.
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        onClick={() => setIsDialogOpen(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (policyToDelete !== null) {
                            handleDeletePOLICY(policyToDelete);  // Call delete function
                            setIsDialogOpen(false);  // Close dialog after deletion
                          }
                        }}
                        className="btn-primary"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition>


          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
