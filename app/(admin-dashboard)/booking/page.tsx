"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun, faCalendarDays, faHotel, faCar, faShip } from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  HomeIcon,
  CubeIcon,
  ClipboardIcon,
  TruckIcon 
  // CarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { SearchIcon } from "@/public/data/icons";
import { FaHotel, FaHome, FaCar, FaSuitcase, FaMountain } from "react-icons/fa";

interface Payment {
  id: number;
  invoice_id: string;
  service_type: string;
  adults: string;
  childs: string;
  infants: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  amount: string;
  payment_method: string;
  invoice_pdf: string;
  created_at: string;
  updated_at: string;
}

interface Payment {
  booking_id: string;
  hotel_name?: string;
  package_name?: string;
  activity_name?: string;
  cab_name?: string;
  ferry_name?: string;
}

const Page = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define items per page

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/get_all_payments"
      );
      const data = await response.json();
      if (data.message) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getDetailsAndIcon = (payment: Payment) => {
    const details = payment.hotel_name || payment.package_name || payment.activity_name || payment.cab_name || payment.ferry_name || "N/A";

    let icon = null;
    let text = "";

    if (payment.hotel_name) {
      icon = <FaHotel className="text-[#243757] text-2xl mx-auto" />;
      text = "Hotel"; // Add related text for hotel
    } else if (payment.package_name) {
      icon = <FaMountain className="text-[#243757] text-2xl mx-auto" />;
      text = "Package"; // Add related text for package
    } else if (payment.activity_name) {
      icon = <FaSuitcase className="text-[#243757] text-2xl mx-auto" />;
      text = "Activity"; // Add related text for activity
    } else if (payment.cab_name) {
      icon = <FaCar className="text-[#243757] text-2xl mx-auto" />;
      text = "Cab"; // Add related text for cab
    } else if (payment.ferry_name) {
      icon = <FaHome className="text-[#243757] text-2xl mx-auto" />;
      text = "Ferry"; // Add related text for ferry
    }

    return { icon, details, text }; // Return icon, details, and text
  };

  const filteredPayments = payments.filter((payment) =>
    searchTerm
      .toLowerCase()
      .split(' ')
      .some((term) =>
        [
          payment.customer_name,
          payment.booking_id,
          payment.hotel_name,
          payment.package_name,
          payment.activity_name,
          payment.cab_name,
          payment.ferry_name,
          payment.customer_mobile_number,
        ]
          .filter(Boolean)
          .some((field) => field && field.toLowerCase().includes(term))
      )
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Booking</h2>
      </div>

      {/* Recent bookings */}
      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 ">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Service Type</th>
                  <th className="py-3 lg:py-4 px-2">Booking ID</th>
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Mobile</th>
                  <th className="py-3 lg:py-4 px-2">Details</th>
                  <th className="py-3 lg:py-4 px-2">Total Price</th>
                  <th className="py-3 lg:py-4 px-2">Transaction ID</th>
                  <th className="py-3 lg:py-4 px-2">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2 flex items-center gap-2 relative group">
                      {(() => {
                        const { icon, text } = getDetailsAndIcon(payment); // Destructure the returned object
                        return (
                          <>
                            {icon}
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-1 rounded-md mt-2">
                              {text}
                            </span>
                          </>
                        );
                      })()}
                    </td>
                    <td className="py-3 lg:py-4 px-2">{payment.booking_id}</td>
                    <td className="py-3 lg:py-4 px-2">{payment.customer_name}</td>
                    <td className="py-3 lg:py-4 px-2">{payment.customer_mobile_number}</td>
                    <td className="py-3 lg:py-4 px-2 flex items-center gap-2">
                      {(() => {
                        const { icon, details } = getDetailsAndIcon(payment); // Destructure the returned object
                        return (
                          <>
                            {details}
                          </>
                        );
                      })()}
                    </td>

                    <td className="py-3 lg:py-4 px-2">₹{payment.amount}/-</td>
                    <td className="py-3 lg:py-4 px-2">{payment.invoice_id}</td>
                    <td className="py-3 lg:py-4 px-2">
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
            <Pagination
              totalItems={filteredPayments.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
