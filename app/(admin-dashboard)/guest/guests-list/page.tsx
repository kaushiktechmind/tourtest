"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { StarIcon } from "@heroicons/react/20/solid";
import HeadlessList from "@/components/ListBox";
import { Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@/public/data/icons";

const ITEMS_PER_PAGE = 10; // Customize the number of items per page

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  const [guestIdToDelete, setGuestIdToDelete] = useState<string | null>(null);
  const [guestItems, setGuestItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); 

  const openModal = (guestItem: { name: string; id: string }) => {
    setGuestToDelete(guestItem.name);
    setGuestIdToDelete(guestItem.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setGuestToDelete(null);
    setGuestIdToDelete(null);
  };

  const handleDelete = async () => {
    if (guestIdToDelete) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/delete_guest_by_id/${guestIdToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setGuestItems((prevGuestItems) =>
            prevGuestItems.filter((guestItem) => guestItem.id !== guestIdToDelete)
          );
          alert("Guest Deleted");
        } else {
          console.error("Error deleting guest:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting guest:", error);
      } finally {
        closeModal();
      }
    }
  };

  useEffect(() => {
    const fetchGuestItems = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Get the token from localStorage

        if (!token) {
          console.error("No access token found");
          return;
        }

        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/user/get_all_users",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
              "Content-Type": "application/json" // Optional, depending on API requirements
            }
          }
        );

        const data = await response.json();
        if (data) {
          setGuestItems(data);
        }
      } catch (error) {
        console.error("Error fetching guestItems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestItems();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredGuestItems = guestItems.filter((guestItem) =>
    Object.values(guestItem).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const paginatedGuestItems = filteredGuestItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Guest</h2>
      </div>



      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">

          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
              <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                  value={searchQuery} // Bind the search input to state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                />
                <SearchIcon />
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2 md:px-5">Guest Name</th>
                  <th className="py-3 lg:py-4 px-2">Email</th>
                  <th className="py-3 lg:py-4 px-2">Mobile Number</th>
                  <th className="py-3 lg:py-4 px-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuestItems.map((guestItem) => (
                  <tr
                    key={guestItem.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {guestItem.created_at.split("T")[0]}
                    </td>
                    
                    <td className="py-3 lg:py-4 px-2 md:px-5">
                      <Link
                        href={`/guest/edit-guest?guestId=${guestItem.id}`}
                        className="text-primary"
                      >
                        {guestItem.name}
                      </Link>
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[200px] overflow-hidden whitespace-normal break-words">
                      {guestItem.email}
                    </td>

                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        {guestItem.mobile_number}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 px-2">
                      {guestItem.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              totalItems={guestItems.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

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
                    Delete Guest
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the guest{" "}
                      <span className="font-bold">{guestToDelete}</span>? This
                      action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-4 justify-end">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Footer />
    </div>
  );
};

export default Page;
