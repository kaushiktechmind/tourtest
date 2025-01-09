"use client";

import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import { Dialog, Transition } from "@headlessui/react";


interface Policy {
  id: number;
  policy_title: string;
  created_at: string;
}

const Page = () => {
  const [description, setDescription] = useState<string>("");
  const [policyTitle, setPolicyTitle] = useState<string>("");
  const [policy, setPolicy] = useState<Policy[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]); // New state for filtered policies
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isOpen, setIsOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_policy"
        );
        const data: Policy[] = await response.json();
        setPolicy(data);
        setFilteredPolicies(data); // Initialize filtered policies with all policies
      } catch (error) {
        console.error("Error fetching Policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  // Handle search query change
  useEffect(() => {
    if (searchQuery) {
      const filtered = policy.filter((p) =>
        p.policy_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPolicies(filtered);
    } else {
      setFilteredPolicies(policy); // Reset to all policies when search query is empty
    }
    setCurrentPage(1); // Reset to the first page
  }, [searchQuery, policy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolicies = filteredPolicies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddPolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
        tempElement.textContent || tempElement.innerText || "";

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_policy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            policy_title: policyTitle,
            policy_decription: plainTextDescription,
          }),
        }
      );

      const result = await response.json();

      if (result.data) {
        const newPolicy: Policy = {
          id: result.data.id,
          policy_title: result.data.policy_title,
          created_at: result.data.created_at,
        };
        setPolicy((prevPolicy) => [newPolicy, ...prevPolicy]);
        setFilteredPolicies((prevPolicies) => [newPolicy, ...prevPolicies]);
        setPolicyTitle("");
        setDescription("");
      }
      alert("Policy Added Successfully");
    } catch (error) {
      console.error("Error adding Policy:", error);
    }
  };

  const openModal = (id: number) => {
    setPolicyToDelete(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPolicyToDelete(null);
  };


  const handleDeletePolicy = async () => {
    if (policyToDelete === null) return;
    console.log("Deleting policy with id:", policyToDelete);  // Ensure it's correct here
    const accessToken = localStorage.getItem("access_token");
  
    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_policy_by_id/${policyToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.ok) {
        alert("Policy deleted successfully.");
        setPolicy((prevPolicy) =>
          prevPolicy.filter((policy) => policy.id !== policyToDelete)
        );
        setFilteredPolicies((prevPolicies) =>
          prevPolicies.filter((policy) => policy.id !== policyToDelete)
        );
      } else {
        console.error("Failed to delete Policy:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting Policy:", error);
    } finally {
      closeModal();
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
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                  value={searchQuery} // Bind search query state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
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
                {currentPolicies.map(({ id, policy_title, created_at }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[300px] whitespace-normal">
                      {policy_title}
                    </td>
                    <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                      <Link
                        href={`/hotel/edit-hotel-policy?policyId=${id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button onClick={() => openModal(id)} className="text-[var(--secondary-500)]">

                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Confirm Deletion
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this policy? This action cannot
                          be undone.
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end gap-4">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleDeletePolicy}
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredPolicies.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
