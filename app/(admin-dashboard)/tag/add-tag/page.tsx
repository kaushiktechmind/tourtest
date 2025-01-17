"use client";

import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { Dialog, Transition } from "@headlessui/react";

interface Tag{
  tag_name: string;
  id: string
}

const Page = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagTitle, setTagName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const [itemToDelete, setItemToDelete] =  useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, tags]);

  const fetchTags = async () => {
    setLoading(true);
    const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_tag");
    
    // Check if the response is ok (status code 2xx)
    if (response.ok) {
      const data = await response.json();
      setTags(data);
      setFilteredTags(data); // Initialize filteredTags
    }
  
    setLoading(false);
  };
  

  const handleSearch = () => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = tags.filter((tag) =>
      tag.tag_name.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredTags(filtered);
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleAddTag = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tag_name: tagTitle }),
      });

      if (!response.ok) throw new Error("Failed to save tag");

      setTagName("");
      await fetchTags();
      alert("Tag Added Successfully");
    } catch (err) {
     
    }
  };

  const handleDeleteTag = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_tag_by_id/${itemToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete tag");

      await fetchTags();
      alert("Deleted Successfully");
    } catch (err) {
    } finally {
      setIsDialogOpen(false); // Close dialog
      setItemToDelete(null); // Reset ID
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTags.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white"> Tags</h2>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Add Tag</h3>
            <form onSubmit={handleAddTag}>
              <label htmlFor="name" className="py-4 inline-block text-base font-medium">
                Tag Name:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Tag name"
                value={tagTitle}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full border py-3 px-3 rounded-md focus:outline-none"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5">Add New</button>
            </form>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <div className="flex justify-between mb-7">
              <div className="border rounded-full flex items-center p-1 pr-2 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left bg-[var(--bg-1)] border-b">
                    <th className="py-3 px-2">Tag Name</th>
                    <th className="py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3 text-red-500">{error}</td>
                    </tr>
                  ) : (
                    currentItems.map((tag) => (
                      <tr key={tag.id} className="border-b hover:bg-[var(--bg-1)]">
                        <td className="py-3 px-2">{tag.tag_name}</td>
                        <td className="py-3 px-2 flex gap-2">
                          <Link href={`/tag/edit-tag?tagId=${tag.id}`} className="text-primary">
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => {
                              setItemToDelete(tag.id);
                              setIsDialogOpen(true);
                            }}
                            className="text-[var(--secondary-500)]"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                totalItems={filteredTags.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Confirmation Dialog */}
      <Transition show={isDialogOpen} as="div">
        <Dialog onClose={() => setIsDialogOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75" />
            <div className="relative bg-white rounded-lg max-w-sm w-full p-6">
              <Dialog.Title className="text-xl font-semibold">Confirm Deletion</Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600">
                Are you sure you want to delete this item? This action cannot be undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Page;
