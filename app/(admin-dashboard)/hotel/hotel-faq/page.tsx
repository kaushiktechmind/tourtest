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

interface Faq {
  id: number;
  faq_title: string;
  created_at: string;
}

const Page = () => {
  const [description, setDescription] = useState<string>("");
  const [faqTitle, setFaqTitle] = useState<string>("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [filteredFAQs, setFilteredFAQs] = useState<Faq[]>([]); // Filtered FAQs

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFAQs = filteredFAQs.slice(indexOfFirstItem, indexOfLastItem);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);


  // Fetch FAQs from the API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_faq"
        );
        const data: Faq[] = await response.json();
        setFaqs(data);
        setFilteredFAQs(data); // Initialize filtered FAQs
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  // Filter FAQs based on search query
  useEffect(() => {
    const filtered = faqs.filter((faq) =>
      faq.faq_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFAQs(filtered);
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, faqs]);

  const handleAddFAQ = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("access_token");

    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = description;
      const plainTextDescription =
        tempElement.textContent || tempElement.innerText || "";

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_faq",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            faq_title: faqTitle,
            faq_description: plainTextDescription,
          }),
        }
      );

      const result = await response.json();

      if (result.data) {
        const newFaq: Faq = {
          id: result.data.id,
          faq_title: result.data.faq_title,
          created_at: result.data.created_at,
        };
        setFaqs((prevFaqs) => [newFaq, ...prevFaqs]);
        setFaqTitle("");
        setDescription("");
        alert("FAQ added Successfully");
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_faq_by_id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
        alert("FAQ deleted successfully.");
      } else {
        console.error("Failed to delete FAQ:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Hotel FAQs</h2>
        <Link href="/add-property" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Hotel
        </Link>
      </div>
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add FAQs</h3>
          <form onSubmit={handleAddFAQ}>
            <p className="mt-6 mb-4 text-xl font-medium">Name :</p>
            <input
              type="text"
              className="w-full border p-2 focus:outline-none rounded-md text-base"
              placeholder="FAQ"
              value={faqTitle}
              onChange={(e) => setFaqTitle(e.target.value)}
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
                {currentFAQs.map(({ id, faq_title, created_at }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[300px] whitespace-normal">
                      {faq_title}
                    </td>
                    <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                      <Link
                        href={`/hotel/edit-hotel-faq?faqId=${id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setFaqToDelete(id);
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
              totalItems={filteredFAQs.length}
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
                      Are you sure you want to delete this FAQ? This action cannot be undone.
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
                          if (faqToDelete !== null) {
                            handleDeleteFAQ(faqToDelete);  // Call delete function
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
