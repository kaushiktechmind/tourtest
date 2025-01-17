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
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [couponIdToDelete, setCouponIdToDelete] = useState<string | null>(null);
  const [coups, setCoups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (coup: { name: string; id: string }) => {
    setCouponToDelete(coup.name);
    setCouponIdToDelete(coup.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCouponToDelete(null);
    setCouponIdToDelete(null);
  };

  const handleDelete = async () => {
    if (couponIdToDelete) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          ` /admin/delete_coupon_by_id/${couponIdToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setCoups((prevCoups) =>
            prevCoups.filter((coup) => coup.id !== couponIdToDelete)
          );
          alert("Coupon Deleted");
        } else {
          console.error("Error deleting coupon:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting coupon:", error);
      } finally {
        closeModal();
      }
    }
  };

  useEffect(() => {
    const fetchCoups = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_coupon"
        );
        const data = await response.json();
        if (data) {
          setCoups(data);
        }
      } catch (error) {
        console.error("Error fetching coups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoups();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  const filteredCoups = coups.filter((coup) =>
    Object.values(coup).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedCoups = filteredCoups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Coupons</h2>
        <Link href="/coupon/add-coupon" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Coupons
        </Link>
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
                  <th className="py-3 lg:py-4 px-2">Coupon Name</th>
                  <th className="py-3 lg:py-4 px-2 md:px-5">Coupon Code</th>
                  <th className="py-3 lg:py-4 px-2">Type</th>
                  <th className="py-3 lg:py-4 px-2">Discount Price</th>
                  <th className="py-3 lg:py-4 px-2">Start Date</th>
                  <th className="py-3 lg:py-4 px-2">End Date</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoups.map((coup) => (
                  <tr
                    key={coup.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {coup.created_at.split("T")[0]}
                    </td>
                    <td className="py-3 lg:py-4 px-2">
                      {coup.coupon_name}
                    </td>
                    <td className="py-3 lg:py-4 px-2 md:px-5">
                      <Link
                        href={`/coupon/edit-coupon?couponId=${coup.id}`}
                        className="text-primary"
                      >
                        {coup.coupon_code}
                      </Link>
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[200px] overflow-hidden whitespace-normal break-words">
                      {coup.type}
                    </td>


                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        {coup.discount_price}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        {coup.start_date}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        {coup.end_date}
                      </span>
                    </td>
                    <td className="py-3 lg:py-7 px-2 flex gap-2 items-center">
                      <a
                        href={`/coupon/edit-coupon?couponId=${coup.id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </a>
                      <button
                        className="text-[var(--secondary-500)]"
                        onClick={() =>
                          openModal({ name: coup.coupon_name, id: coup.id })
                        }
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              totalItems={coups.length}
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
                    Delete Coupon
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the coupon{" "}
                      <span className="font-bold">{couponToDelete}</span>? This
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
