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

const ITEMS_PER_PAGE = 10; // Customize the number of items per page

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [activityIdToDelete, setActivityIdToDelete] = useState<string | null>(null);
  const [acts, setActs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = (act: { name: string; id: string }) => {
    setActivityToDelete(act.name);
    setActivityIdToDelete(act.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActivityToDelete(null);
    setActivityIdToDelete(null);
  };

  const handleDelete = async () => {
    if (activityIdToDelete) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/delete_activity_by_id/${activityIdToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setActs((prevActs) =>
            prevActs.filter((act) => act.id !== activityIdToDelete)
          );
          alert("Activity Deleted");
        } else {
          console.error("Error deleting activity:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting activity:", error);
      } finally {
        closeModal();
      }
    }
  };

  useEffect(() => {
    const fetchActs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_all_activity"
        );
        const data = await response.json();
        if (data) {
          setActs(data);
        }
      } catch (error) {
        console.error("Error fetching acts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActs();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedActs = acts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Activities</h2>
        <Link href="/activity/add-new-activity" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Activity
        </Link>
      </div>

      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
          <div className="overflow-x-auto">
          {acts.length === 0 ? (
              <div className="text-center py-5 text-gray-500">
                No activity found
              </div>
            ) : (
              <table className="w-full table-auto whitespace-nowrap">
                <thead>
                  <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                    <th className="py-3 lg:py-4 px-2">Date</th>
                    <th className="py-3 lg:py-4 px-2">Location</th>
                    <th className="py-3 lg:py-4 px-2 md:px-5">Activity Name</th>
                    <th className="py-3 lg:py-4 px-2">Sale Price</th>
                    <th className="py-3 lg:py-4 px-2">Duration</th>
                    <th className="py-3 lg:py-4 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActs.map((act) => (
                    <tr
                      key={act.id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                    >
                      <td className="py-3 lg:py-4 px-2">
                        {act.created_at.split("T")[0]}
                      </td>
                      <td className="py-3 lg:py-4 px-2">
                        {act.location_name}
                      </td>
                      <td className="py-3 lg:py-4 px-2 md:px-5">
                        <Link
                          href={`/activity/edit-activity?activityId=${act.id}`}
                          className="text-primary"
                        >
                          {act.activity_title}
                        </Link>
                      </td>
                      <td className="py-3 lg:py-4 px-2 max-w-[200px] overflow-hidden whitespace-normal break-words">
                        {act.sale_price}
                      </td>

                      <td className="py-3 lg:py-4 px-2">
                        <span className="flex gap-1 items-center">
                          {act.duration}
                        </span>
                      </td>
                      <td className="py-3 lg:py-7 px-2 flex gap-2 items-center">
                        <a
                          href={`/activity/edit-activity?activityId=${act.id}`}
                          className="text-primary"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </a>
                        <button
                          className="text-[var(--secondary-500)]"
                          onClick={() =>
                            openModal({ name: act.activity_name, id: act.id })
                          }
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <Pagination
              totalItems={acts.length}
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
                    Delete Activity
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the activity{" "}
                      <span className="font-bold">{activityToDelete}</span>? This
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
