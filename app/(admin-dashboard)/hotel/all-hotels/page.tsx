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

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
  const [hotelIdToDelete, setHotelIdToDelete] = useState<string | null>(null); // Store ID of hotel to delete
  const [hostels, setHostels] = useState<any[]>([]); // Update the type based on your data structure
  const [loading, setLoading] = useState(true);

  const openModal = (hotel: { name: string; id: string }) => {
    setHotelToDelete(hotel.name);
    setHotelIdToDelete(hotel.id); // Set the ID of the hotel to delete
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setHotelToDelete(null);
    setHotelIdToDelete(null); // Reset the ID
  };

  const handleDelete = async () => {
    if (hotelIdToDelete) {
      const token = localStorage.getItem('access_token'); // Retrieve the Bearer token
      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/hotels/${hotelIdToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the headers
          },
        });
        
        if (response.ok) {
          // Remove the deleted hotel from the state
          setHostels((prevHostels) => prevHostels.filter((hostel) => hostel.id !== hotelIdToDelete));
          console.log("Hotel deleted:", hotelToDelete);
        } else {
          console.error("Error deleting hotel:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting hotel:", error);
      } finally {
        closeModal(); // Close the modal
      }
    }
  };

 // Fetch data from the API
useEffect(() => {
  const fetchHostels = async () => {
    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/hotels");
      const data = await response.json();
      if (data.message === "Hostels retrieved successfully") {
        setHostels(data.data); // Store the hostels data in state
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  fetchHostels();
}, []);


  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Hotels</h2>
        <Link href="/hotel/add-new-hotel" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Hotel
        </Link>
      </div>

      {/* Recent bookings */}
      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2 md:px-5">Hotel Name</th>
                  <th className="py-3 lg:py-4 px-2">Location</th>
                  <th className="py-3 lg:py-4 px-2">Review</th>
                  <th className="py-3 lg:py-4 px-2">Status</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map((hostel) => (
                  <tr
                    key={hostel.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {hostel.created_at.split("T")[0]}
                    </td>
                    <td className="py-3 lg:py-4 px-2 md:px-5">
                      {hostel.hotel_name}
                    </td>
                    <td className="py-3 lg:py-4 px-2">{hostel.full_address}</td>
                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                        {hostel.ratings}
                      </span>
                    </td>
                    <td className={`py-3 lg:py-4 px-2`}>
                      <div className={`w-32`}>
                        <HeadlessList initialValue={hostel.status} />
                      </div>
                    </td>
                    <td className="py-3 lg:py-7 px-2 flex gap-2 items-center">
                      <a href="./edit-hotel" className="text-primary">
                        <PencilSquareIcon className="w-5 h-5" />
                      </a>
                      <button
                        className="text-[var(--secondary-500)]"
                        onClick={() => openModal({ name: hostel.hotel_name, id: hostel.id })}
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

      {/* Modal for deletion confirmation */}
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
                    Delete Hotel
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the hotel{" "}
                      <span className="font-bold">{hotelToDelete}</span>? This
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
