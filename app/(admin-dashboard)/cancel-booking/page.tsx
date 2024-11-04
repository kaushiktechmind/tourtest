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
import HeadlessList from "@/components/ListBox";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch payment data from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_all_payments");
        const data = await response.json();
        if (data.message === "Payment retrieved successfully.") {
          setPayments(data.data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

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
                  placeholder="Search"
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
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Order ID</th>
                  <th className="py-3 lg:py-4 px-2">Service Type</th>
                  <th className="py-3 lg:py-4 px-2">Payment Method</th>
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Invoice</th>
                  <th className="py-3 lg:py-4 px-2">Email</th>
                  <th className="py-3 lg:py-4 px-2">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {payments
                  .filter((payment) => payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                      <td className="py-3 lg:py-4 px-2">{payment.customer_name}</td>
                      <td className="py-3 lg:py-4 px-2">{payment.invoice_id}</td>
                      <td className="py-3 lg:py-4 px-2">{payment.service_type}</td>
                      <td className="py-3 lg:py-4 px-2">{payment.payment_method}</td>
                      <td className="py-3 lg:py-4 px-2">{new Date(payment.created_at).toLocaleDateString()}</td>
                      <td className="py-3 lg:py-4 px-2">
                        <a href={payment.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View Invoice
                        </a>
                      </td>
                      <td className="py-3 lg:py-4 px-2">{payment.customer_email}</td>
                      <td className="py-3 lg:py-4 px-2">{payment.customer_mobile_number}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
