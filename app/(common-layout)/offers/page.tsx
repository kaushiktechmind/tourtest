"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardPagination from "@/components/CardPagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun, faCalendarDays, faHotel, faCar, faShip } from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons

interface PaymentData {
  booking_id: number;
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

interface Payment {
  hotel_name: any;
  package_name: any;
  activity_name: any;
  cab_name: any;
  ferry_name: any;
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

  const getDetailsAndIcon = (payment: PaymentData | Payment) => {
    const details =
      (payment as Payment).hotel_name ||
      (payment as Payment).package_name ||
      (payment as Payment).activity_name ||
      (payment as Payment).cab_name ||
      (payment as Payment).ferry_name ||
      "N/A";

    let icon = null;
    let label = "";

    if ((payment as Payment).hotel_name) {
      icon = <FontAwesomeIcon icon={faHotel} className="w-5 h-5" />;
      label = "Hotel";
    } else if ((payment as Payment).package_name) {
      icon = <FontAwesomeIcon icon={faMountainSun} className="w-5 h-5" />;
      label = "Package";
    } else if ((payment as Payment).activity_name) {
      icon = <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5" />;
      label = "Activity";
    } else if ((payment as Payment).cab_name) {
      icon = <FontAwesomeIcon icon={faCar} className="w-5 h-5" />;
      label = "Cab";
    } else if ((payment as Payment).ferry_name) {
      icon = <FontAwesomeIcon icon={faShip} className="w-5 h-5" />;
      label = "Ferry";
    }

    return { icon, details, label };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 mt-[70px]">
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
                  <th className="border p-2">Service Type</th>
                  <th className="border p-2">Booking ID</th>
                  <th className="border p-2">Customer Name</th>
                  <th className="border p-2">Booking Name</th>
                  <th className="border p-2">Transaction ID</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((payment) => {
                  const { icon, details, label } = getDetailsAndIcon(payment);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        {new Date(payment.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="border p-2 relative">
                        <div className="group flex items-center">
                          <div className="w-5 h-5 mr-2">{icon}</div>
                          <div className="hidden group-hover:block absolute left-10 top-0 bg-gray-700 text-white p-2 rounded-lg">
                            {label}
                          </div>
                        </div>
                      </td>
                      <td className="border p-2">{payment.booking_id}</td>
                      <td className="border p-2">{payment.customer_name}</td>
                      <td className="border p-2">{details}</td>
                      <td className="border p-2">{payment.invoice_id}</td>
                      <td className="border p-2">₹{payment.amount}/-</td>
                      <td className="border p-2">
                        <a
                          href={payment.invoice_pdf || undefined}
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
                          <span className="sr-only">View Invoice</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
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
