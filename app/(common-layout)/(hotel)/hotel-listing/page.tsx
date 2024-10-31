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
  const startdate = searchParams.get("startdate");
  const enddate = searchParams.get("enddate");
  console.log(startdate, enddate, "----------------");

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    setLoading(true); // Set loading to true before starting fetch
    setError(null); // Reset error state

    try {
      let response;

      // Check if type is provided
      if (type) {
        response = await axios.get(
          `https://yrpitsolutions.com/tourism_api/api/hotels/filter_by_type/${type}`
        );
      } else if (loc) {
        // If no type, check if loc, startdate, and enddate are provided
        // alert("hello i am inside loc date filter");
        response = await axios.get(
          `https://yrpitsolutions.com/tourism_api/api/room-management/filter/${loc}/${startdate}/${enddate}`
        );
      } else {
        // If neither condition is satisfied, set error and return
        setError("Please provide valid search parameters.");
        return;
      }

      console.log("API Response:", response.data); // Log the response to check the structure

      // Set hotels based on the new structure
      if (Array.isArray(response.data.data)) {
        setHotels(response.data.data); // Use the 'data' array
      } else {
        console.warn("No hotels found in response.");
        setHotels([]); // Set to empty array if no hotels found
      }
    } catch (error: any) {
      console.error("Error fetching hotels:", error);
      setError("Failed to fetch hotels. Please try again later.");
    } finally {
      setLoading(false); // Always set loading to false at the end
    }
  };

  // Fetch hotels when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {Array.isArray(hotels) && hotels.length > 0 ? (
        hotels.map((item) => <HotelListingList key={item.id} item={item} />)
      ) : (
        <div>No hotels available.</div>
      )}

      <CardPagination />
    </>
  );
};

export default Page;
