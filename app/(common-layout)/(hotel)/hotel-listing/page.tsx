"use client";
import React, { useEffect, useState } from "react";
import CardPagination from "@/components/CardPagination";
import HotelListingList from "@/components/HotelListingList";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const loc = searchParams.get("loc");
 
  const noOfRooms = Number(localStorage.getItem('noOfRooms'));
  const startdate = localStorage.getItem('startDate');
  const enddate = localStorage.getItem('endDate');
 

  // alert(noOfRooms)



  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    setLoading(true); 
    setError(null);

    try {
        let response;

        if (type) {
          console.log("give data based on Type");
            // Fetch data based on "type"
            response = await axios.get(
                `https://yrpitsolutions.com/tourism_api/api/hotels/filter_by_type/${type}`
            );
        } else if (loc) {
          console.log("give data based on location");
            // Fetch data based on "location" and dates
            response = await axios.get(
                `https://yrpitsolutions.com/tourism_api/api/room-management/filter/${loc}/${startdate}/${enddate}`
            );
        } else {
            setError("Please provide valid search parameters.");
            return;
        }

        console.log("API Response:", response.data);

        // Normalize data structure to only include the necessary fields
        let normalizedData = [];

        if (Array.isArray(response.data.data)) {
            if (type) {
                // Normalization for 'filter_by_type' API response
                normalizedData = response.data.data.map((hotel) => ({
                    id: hotel.id,
                    hotel_id: hotel.id, // Use id as hotel_id if not explicitly provided
                    hotel_name: hotel.hotel_name,
                    location_name: hotel.location_name,
                    ratings: hotel.ratings || "",
                    banner_images: hotel.banner_images || "", // Adjust field if present in actual data
                    starting_price: hotel.starting_price || "",
                    highest_price: hotel.highest_price || "",
                    amenity_name1: hotel.amenity_name1 || {},
                    amenity_name1: hotel.amenity_name1 || {},
                    amenity_name2: hotel.amenity_name2 || {},
                    amenity_name3: hotel.amenity_name3 || {},
                    amenity_name4: hotel.amenity_name4 || {},
                    amenity_name5: hotel.amenity_name5 || {},
                    amenity_name6: hotel.amenity_name6 || {},
                    amenity_name7: hotel.amenity_name7 || {},
                    amenity_name8: hotel.amenity_name8 || {},
                    amenity_name9: hotel.amenity_name9 || {},
                    amenity_name10: hotel.amenity_name10 || {},
                    amenity_name11: hotel.amenity_name11 || {},
                    amenity_name12: hotel.amenity_name12 || {},
                    amenity_name13: hotel.amenity_name13 || {},
                    amenity_name14: hotel.amenity_name14 || {},
                    amenity_name15: hotel.amenity_name15 || {},
                    amenity_logo1: hotel.amenity_logo1 || {},
                    amenity_logo2: hotel.amenity_logo2 || {},
                    amenity_logo3: hotel.amenity_logo3 || {},
                    amenity_logo4: hotel.amenity_logo4 || {},
                    amenity_logo5: hotel.amenity_logo5 || {},
                    amenity_logo6: hotel.amenity_logo6 || {},
                    amenity_logo7: hotel.amenity_logo7 || {},
                    amenity_logo8: hotel.amenity_logo8 || {},
                    amenity_logo9: hotel.amenity_logo9 || {},
                    amenity_logo10: hotel.amenity_logo10 || {},
                    amenity_logo11: hotel.amenity_logo11 || {},
                    amenity_logo12: hotel.amenity_logo12 || {},
                    amenity_logo13: hotel.amenity_logo13 || {},
                    amenity_logo14: hotel.amenity_logo14 || {},
                    amenity_logo15: hotel.amenity_logo15 || {}
                }));
            } else if (loc) {
                // Normalization for 'filter' API response (location and date-based)
                normalizedData = response.data.data.map((item) => ({
                    id: item.hotel.hotel_id,
                    hotel_id: item.hotel.hotel_id,
                    hotel_name: item.hotel.hotel_name,
                    location_name: item.hotel.location_name,
                    ratings: item.hotel.ratings || "",
                    banner_images: item.hotel.banner_images || "",
                    starting_price: item.hotel.starting_price,
                    highest_price: item.hotel.highest_price,
                    amenity_name1: item.hotel.amenities.amenity_name1 || {},
                    amenity_name2: item.hotel.amenities.amenity_name2 || {},
                    amenity_name3: item.hotel.amenities.amenity_name3 || {},
                    amenity_name4: item.hotel.amenities.amenity_name4 || {},
                    amenity_name5: item.hotel.amenities.amenity_name5 || {},
                    amenity_name6: item.hotel.amenities.amenity_name6 || {},
                    amenity_name7: item.hotel.amenities.amenity_name7 || {},
                    amenity_name8: item.hotel.amenities.amenity_name8 || {},
                    amenity_name9: item.hotel.amenities.amenity_name9 || {},
                    amenity_name10: item.hotel.amenities.amenity_name10 || {},
                    amenity_name11: item.hotel.amenities.amenity_name11 || {},
                    amenity_name12: item.hotel.amenities.amenity_name12 || {},
                    amenity_name13: item.hotel.amenities.amenity_name13 || {},
                    amenity_name14: item.hotel.amenities.amenity_name14 || {},
                    amenity_name15: item.hotel.amenities.amenity_name15 || {},
                    amenity_logo1: item.hotel.amenities.amenity_logo1 || {},
                    amenity_logo2: item.hotel.amenities.amenity_logo2 || {},
                    amenity_logo3: item.hotel.amenities.amenity_logo3 || {},
                    amenity_logo4: item.hotel.amenities.amenity_logo4 || {},
                    amenity_logo5: item.hotel.amenities.amenity_logo5 || {},
                    amenity_logo6: item.hotel.amenities.amenity_logo6 || {},
                    amenity_logo7: item.hotel.amenities.amenity_logo7 || {},
                    amenity_logo8: item.hotel.amenities.amenity_logo8 || {},
                    amenity_logo9: item.hotel.amenities.amenity_logo9 || {},
                    amenity_logo10: item.hotel.amenities.amenity_logo10 || {},
                    amenity_logo11: item.hotel.amenities.amenity_logo11 || {},
                    amenity_logo12: item.hotel.amenities.amenity_logo12 || {},
                    amenity_logo13: item.hotel.amenities.amenity_logo13 || {},
                    amenity_logo14: item.hotel.amenities.amenity_logo14 || {},
                    amenity_logo15: item.hotel.amenities.amenity_logo15 || {}

                }));
            }

            setHotels(normalizedData);
        } else {
            console.warn("No hotels found in response.");
            setHotels([]);
        }
    } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Failed to fetch hotels. Please try again later.");
    } finally {
        setLoading(false);
    }
};


  // Fetch hotels when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);



  return (
    <>
    {hotels.length > 0 ? (
      [...new Map(hotels.map((item) => [item.hotel_id, item])).values()].map(
        (uniqueItem) => (
          <HotelListingList
            key={uniqueItem.hotel_id}
            item={uniqueItem}
            noOfRooms={noOfRooms}
            loc={loc}
            type={type}
            startdate={startdate}
            enddate={enddate}
          />
        )
      )
    ) : (
      <div>No hotels available.</div>
    )}
  </>
  );
};

export default Page;
