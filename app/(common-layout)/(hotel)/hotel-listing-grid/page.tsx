"use client";
import CardPagination from "@/components/CardPagination";
import HotelListingCard from "@/components/HotelListingCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   // Function to fetch data from API
   const fetchHotels = async () => {
    try {
      const response = await axios.get(`https://yrpitsolutions.com/tourism_api/api/admin/hotels/${type}`);

      console.log("API Response:", response.data); // Log the response to check the structure

      // Set hotels based on the new structure
      if (Array.isArray(response.data.data)) {
        setHotels(response.data.data); // Use the 'data' array
      } else {
        console.warn("No hotels found in response.");
        setHotels([]); // Set to empty array if no hotels found
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
     {Array.isArray(hotels) && hotels.length > 0 ? (
        hotels.map((item) => (
          <HotelListingCard key={item.id} item={item} />
        ))
      ) : (
        <div>No hotels available.</div>
      )}

      <CardPagination />
    </>
  );
};

export default Page;
