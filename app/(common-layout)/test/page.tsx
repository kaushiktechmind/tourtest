"use client";
import axios from 'axios';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const data = {
          date: "20-11-2022",
          from: "Port Blair",
          to: "Swaraj Dweep",
          userName: "mangroves",
          token: "U2FsdGVkX18+ji7DedFzFnkTxo/aFlcWsvmp03XU5bgJ5XE9r1/DCIKHCabpP24hxlAB0F2kFnOYvu9FZaJiNA=="
        };

        const response = await axios.post(
          'http://api.dev.gonautika.com:8012/getTripData',
          JSON.stringify(data), // Use JSON.stringify to send the data as a string
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTripData();
  }, []);

};

export default Page;
