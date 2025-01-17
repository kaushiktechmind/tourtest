"use client";

import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { StarIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { SearchIcon } from "@/public/data/icons";

interface Review {
  ratings: number;
  id: string | number;
  name: string;
  model_name: string;
  description: string;
  created_at: string;
}

interface SwitchStates {
  [key: string]: boolean;
}

const Page = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [switchStates, setSwitchStates] = useState<SwitchStates>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null); // For modal
  const itemsPerPage = 3; // Set number of items per page

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("https://yrpitsolutions.com/tourism_api/api/get_review", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
        setFilteredReviews(response.data);
        const initialSwitchStates: { [key: string]: boolean } = {};
        response.data.forEach((review: { id: string | number; status: string }) => {
          initialSwitchStates[review.id] = review.status === "active";
        });
        setSwitchStates(initialSwitchStates);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  const handleToggle = (id: string | number) => {
    const newStatus = !switchStates[id];

    setSwitchStates((prev) => ({
      ...prev,
      [id]: newStatus,
    }));

    const reviewToUpdate = reviews.find((review) => review.id === id);

    if (!reviewToUpdate) return;

    axios
      .put(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_review_by_id/${id}`,
        {
          ...reviewToUpdate,
          status: newStatus ? "1" : "0",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Review status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating review status:", error);
        setSwitchStates((prev) => ({
          ...prev,
          [id]: !newStatus,
        }));
      });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredReviews(
      reviews.filter(
        (review) =>
          review.name.toLowerCase().includes(query) ||
          review.description.toLowerCase().includes(query)
      )
    );
    setCurrentPage(1); // Reset to first page after search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDialog = (review: Review) => {
    setSelectedReview(review);
  };

  const handleCloseDialog = () => {
    setSelectedReview(null);
  };

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Reviews</h2>
      </div>
      <div className="bg-[var(--bg-1)] px-3 lg:px-6 relative before:bg-[var(--dark)] before:w-full before:h-[70px] before:absolute before:top-0 before:left-0">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 z-[1] relative">
          <div className="col-span-12 lg:col-span-12">
            <div className="p-3 sm:p-4 md:p-6 border xl:p-8 bg-white rounded-2xl mb-8">
              {/* Search bar */}
              <div className="flex flex-wrap gap-3 justify-between mb-7">
                <form className="flex flex-wrap items-center gap-3">
                  <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <SearchIcon />
                  </div>
                </form>
              </div>

              {/* Review list */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                      <th className="border p-2">Created At</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Ratings</th>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map((review) => (
                      <tr key={review.id}>
                        <td className="border p-2">{new Date(review.created_at).toLocaleDateString()}</td>
                        <td className="border p-2">{review.name}</td>
                        <td className="border p-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, index) => (
                              <StarIcon
                                key={index}
                                className={`w-5 h-5 ${index < review.ratings ? "text-[var(--tertiary)]" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border p-2">
                          <p>{`${review.description.slice(0, 50)}...`}</p>
                          <InformationCircleIcon
                            className="w-6 h-6 text-blue-500 cursor-pointer inline"
                            onClick={() => handleOpenDialog(review)}
                          />
                        </td>
                        <td className="border p-2">
                          {/* Custom Toggle Switch */}
                          <div
                            className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                              switchStates[review.id] ? "bg-green-500" : ""
                            }`}
                            onClick={() => handleToggle(review.id)}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                switchStates[review.id] ? "translate-x-5" : ""
                              }`}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                totalItems={filteredReviews.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80%]">
            <h3 className="text-xl font-bold mb-4">{selectedReview.name}</h3>
            <p className="text-gray-700">{selectedReview.description}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Page;
