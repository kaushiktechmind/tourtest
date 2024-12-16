"use client";
import { useEffect, useState } from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { SearchIcon } from "@/public/data/icons";

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

const Page = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tourName, setTourName] = useState<string | null>(null); 

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

  // Filtered and paginated payments
  const filteredPayments = payments.filter((payment) =>
    payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    if (payments.length > 0) {
      // Find the first non-null value among the fields
      const tourName = 
        payments[0]?.hotel_name || 
        payments[0]?.package_name || 
        payments[0]?.activity_name || 
        payments[0]?.cab_name;
  
        if (tourName) {
          setTourName(tourName); // Set the value in state
        } else {
          setTourName(null); // Or handle if none found
        }
    }
  }, [payments]);
  

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Booking</h2>
        <Link href="#" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> View all booking
        </Link>
      </div>

      {/* Recent bookings */}
      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 ">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search by customer name"
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
                    <td className="py-3 lg:py-4 px-2">{payment.booking_id}</td>
                    <td className="py-3 lg:py-4 px-2">{payment.customer_name}</td>
                    <td className="py-3 lg:py-4 px-2">{payment.customer_mobile_number}</td>
                    <td className="py-3 lg:py-4 px-2">{tourName}</td>
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
