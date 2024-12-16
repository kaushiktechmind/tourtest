"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardPagination from "@/components/CardPagination";

interface PaymentData {
  id: number;
  invoice_id: string;
  order_id: string;
  service_type: string;
  customer_name: string;
  payment_method: string;
  amount: string;
  invoice_pdf: string | null;
  created_at: string;
}

const Page = () => {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [tourName, setTourName] = useState<string | null>(null); 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<PaymentData[]>([]);

  // Paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = paymentData.filter((payment) =>
      Object.values(payment).some((value) =>
        value?.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      const customerId = localStorage.getItem("id");
      if (!customerId) {
        console.error("Customer ID not found in local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.data) {
          setPaymentData(data.data);
          setFilteredData(data.data); // Initialize filtered data
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  useEffect(() => {
    if (paymentData.length > 0) {
      // Find the first non-null value among the fields
      const tourName = 
        paymentData[0]?.hotel_name || 
        paymentData[0]?.package_name || 
        paymentData[0]?.activity_name || 
        paymentData[0]?.cab_name;
  
        if (tourName) {
          setTourName(tourName); // Set the value in state
        } else {
          setTourName(null); // Or handle if none found
        }
    }
  }, [paymentData]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6  mt-[40px]">
        {/* <h1 className="text-2xl font-bold mb-6">Payment History</h1> */}

        {/* Search Field UI */}
        <div className="flex flex-wrap gap-3 justify-between mb-7">
          <form className="flex flex-wrap items-center gap-3">
            <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
              />
            </div>
          </form>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Booking ID</th>
                  <th className="border p-2">Customer Name</th>
                  <th className="border p-2">Tour Name</th>
                  <th className="border p-2">Transaction ID</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {new Date(payment.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="border p-2">{payment.booking_id}</td>  
                    <td className="border p-2">{payment.customer_name}</td>
                    <td className="border p-2">{tourName}</td>
                    <td className="border p-2">{payment.invoice_id}</td>
                    <td className="border p-2">₹{payment.amount}/-</td>
                    <td className="border p-2">
                      <a
                        href={payment.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-black-500"
                        >
                          <path d="M19 2H8a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V6l-5-4zM13 9h-2v6h2v-2h2v-2h-2V9zm-7 8H5v-2h1v2zm0-4H5v-2h1v2zm0-4H5V7h1v2zm12 9H8V4h5v5h5v10z" />
                        </svg>
                        <span className="sr-only">View Invoice</span> {/* For accessibility */}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payment data available.</p>
        )}
        <div className="mt-6">
          <CardPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
