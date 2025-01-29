"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import CardPagination from "@/components/CardPagination";
import HotelListingList from "@/components/HotelListingList";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import HotelListingCard from "@/components/HotelListingCard";

const HotelListingGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = "Hotel";
  const loc = localStorage.getItem("storedLocation");


  const [noOfRooms, setNoOfRooms] = useState<number | null>(null);
  const [startdate, setStartdate] = useState<string | null>(null);
  const [enddate, setEnddate] = useState<string | null>(null);

  useEffect(() => {
    // Only run on the client-side
    setNoOfRooms(Number(localStorage.getItem('noOfRooms')));
    setStartdate(localStorage.getItem('startDate'));
    setEnddate(localStorage.getItem('endDate'));
  }, []);



  // alert(noOfRooms)



  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page


  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data from the type API
      const response = await axios.get(
        `https://yrpitsolutions.com/tourism_api/api/hotels/filter_by_type/${type}`
      );

      let normalizedData = [];

      if (Array.isArray(response.data.data)) {
        // Normalize the response data
        normalizedData = response.data.data.map((hotel: any) => ({
          id: hotel.id,
          hotel_id: hotel.id,
          hotel_name: hotel.hotel_name,
          location_name: hotel.location_name,
          ratings: hotel.ratings || "",
          banner_images: hotel.banner_images || "",
          starting_price: hotel.starting_price || "",
          highest_price: hotel.highest_price || "",
          // Add amenities and other fields as required
          amenity_name1: hotel.amenity_name1 || {},
          amenity_logo1: hotel.amenity_logo1 || {},
          amenity_name2: hotel.amenity_name2 || {},
          amenity_logo2: hotel.amenity_logo2 || {},
          amenity_name3: hotel.amenity_name3 || {},
          amenity_logo3: hotel.amenity_logo3 || {},
          amenity_name4: hotel.amenity_name4 || {},
          amenity_logo4: hotel.amenity_logo4 || {},
          amenity_name5: hotel.amenity_name5 || {},
          amenity_logo5: hotel.amenity_logo5 || {},
          amenity_name6: hotel.amenity_name6 || {},
          amenity_logo6: hotel.amenity_logo6 || {},
          amenity_name7: hotel.amenity_name7 || {},
          amenity_logo7: hotel.amenity_logo7 || {},
          amenity_name8: hotel.amenity_name8 || {},
          amenity_logo8: hotel.amenity_logo8 || {},
          amenity_name9: hotel.amenity_name9 || {},
          amenity_logo9: hotel.amenity_logo9 || {},
          amenity_name10: hotel.amenity_name10 || {},
          amenity_logo10: hotel.amenity_logo10 || {},
          amenity_name11: hotel.amenity_name11 || {},
          amenity_logo11: hotel.amenity_logo11 || {},
          amenity_name12: hotel.amenity_name12 || {},
          amenity_logo12: hotel.amenity_logo12 || {},
          amenity_name13: hotel.amenity_name13 || {},
          amenity_logo13: hotel.amenity_logo13 || {},
          amenity_name14: hotel.amenity_name14 || {},
          amenity_logo14: hotel.amenity_logo14 || {},
          amenity_name15: hotel.amenity_name15 || {},
          amenity_logo15: hotel.amenity_logo15 || {}


        }));

        // Filter hotels by location if `loc` is set
        if (loc && loc.trim() !== "") {
          normalizedData = normalizedData.filter(
            (hotel: { location_name: string; }) => hotel.location_name === loc
          );
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
  }, [type, loc]);

  

 

  // Fetch hotels when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);

  // Calculate the paginated hotels
  const paginatedHotels = hotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total number of pages
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const noOfHotels = Number(localStorage.getItem("noOfHotels"));
  // let noOfCurHotels;

  // if (noOfHotels >= itemsPerPage) {
  //   noOfCurHotels = itemsPerPage;
  // }
  // else
  //   noOfCurHotels = noOfHotels;
  // localStorage.setItem("noOfCurHotels", String(noOfCurHotels));


  return (
    <>
        {loading ? (
          <div>Loading...</div>
        ) : hotels.length > 0 ? (
          // Deduplicate hotels before pagination
          [...new Map(hotels.map((item) => [item.hotel_id, item])).values()]
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((uniqueItem) => (
              <HotelListingCard
                key={uniqueItem.hotel_id}
                item={uniqueItem}
                noOfRooms={Number(noOfRooms)}
                loc={loc || ""}
                type={type || ""}
                startdate={startdate || ""}
                enddate={enddate || ""} adults={0} numChildren={0} infants={0} />
            ))
        ) : (
          <div className="col-span-12">No hotels available.</div>
        )}

        {/* Pass pagination props */}
        <CardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </>
  );
};



const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HotelListingGrid />
  </Suspense>
);

export default Page;  