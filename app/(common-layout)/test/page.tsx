"use client";
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const data = JSON.stringify({
          date: "2-9-2025",
          from: "Port Blair",
          to: "Swaraj Dweep",
          userName: "mangroves",
          token: "U2FsdGVkX1/Vt650aC9j+62YZmC0qZKnmhTtskLKQt4mDfWIJndWKxS+CqFZS46hGlCIMMGrKW62H5It7eumzw=="
        });

        const response = await fetch('http://api.dev.gonautika.com:8012/getTripData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: data
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Trip data response:', result);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTripData();
  }, []);

  return <div>Fetching trip data...</div>;
};

export default Page;
