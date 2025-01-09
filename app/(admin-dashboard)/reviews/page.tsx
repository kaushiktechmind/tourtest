"use client";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/20/solid";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useState, useEffect } from "react";
import axios from "axios";

interface Review {
  ratings: number;
  id: string | number;
  name: string,
  model_name: string,
  description: string;
  created_at: string; // Or Date if you prefer
  // Add other fields that are expected in the object
}

interface SwitchStates {
  [key: string]: boolean; // Define index signature for dynamic keys (id) with boolean values
}

const Page = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [switchStates, setSwitchStates] = useState<SwitchStates>({});


  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Retrieve Bearer token from localStorage
    // Fetch reviews on component mount
    axios
      .get("https://yrpitsolutions.com/tourism_api/api/get_review", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
        // Initialize switch states based on fetched review status
        const initialSwitchStates: { [key: string]: boolean } = {};
        response.data.forEach((review: { id: string | number; status: string; }) => {
          initialSwitchStates[review.id] = review.status === "active"; // Assuming 'active' means ON
        });
        setSwitchStates(initialSwitchStates);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  // Handle switch toggle and API call
  const handleToggle = (id: string | number) => {
    const token = localStorage.getItem("access_token"); // Retrieve Bearer token from localStorage
    const newStatus = !switchStates[id];
    setSwitchStates((prev: any) => ({
      ...prev,
      [id]: newStatus,
    }));

    // Find the review being toggled
    const reviewToUpdate = reviews.find((review) => review.id === id);

    // Send the entire review data with the updated status
    axios
      .put(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_review_by_id/${id}`,
        {
          ...reviewToUpdate, // Spread the existing review data
          status: newStatus ? "1" : "0", // Only change the status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Review status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating review status:", error);
        // Revert switch state on error
        setSwitchStates((prev: any) => ({
          ...prev,
          [id]: !newStatus,
        }));
      });
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Reviews</h2>
      </div>
      <div className="bg-[var(--bg-1)] px-3 lg:px-6 relative before:bg-[var(--dark)] before:w-full before:h-[70px] before:absolute before:top-0 before:left-0">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 z-[1] relative">
          <div className="col-span-12 lg:col-span-12">
            <div className="p-3 sm:p-4 md:p-6 border xl:p-8 bg-white rounded-2xl mb-8">
              <div className="bg-white rounded-2xl">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[var(--bg-1)] rounded-2xl p-3 sm:p-4 md:p-6 mb-8"
                  >
                    <div className="flex items-center flex-wrap justify-between gap-4">
                      <div className="flex gap-5 items-center">
                        <div className="flex-grow">
                          <h5 className="mb-1 font-semibold">{review.name}</h5>
                          <p className="mb-0 clr-neutral-500">{review.model_name}</p>
                        </div>
                      </div>
                      <div className="text-sm-end">
                        <p className="mb-1">
                          {new Date(review.created_at).toLocaleTimeString()}
                        </p>
                        <p className="mb-0">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.ratings
                              ? "text-[var(--tertiary)]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mb-0 clr-neutral-500">{review.description}</p>
                    <div className="border border-dashed my-6"></div>
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
                  </div>
                ))}

                <Link href="#" className="btn-primary">
                  See All Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
