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

interface Enquiry {
  id: number;
  invoice_id: string;
  service_type: string;
  adults: string;
  childs: string;
  infants: string;
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  amount: string;
  enquiry_method: string;
  invoice_pdf: string;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define items per page

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/get_all_enquiry"
      );
      const data = await response.json();
      if (data) {
        setEnquiries(data);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) =>
    enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Enquiry</h2>
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
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Email</th>
                  <th className="py-3 lg:py-4 px-2">Mobile Number</th>
                  <th className="py-3 lg:py-4 px-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 lg:py-4 px-2">{enquiry.name}</td>
                    <td className="py-3 lg:py-4 px-2">{enquiry.email}</td>
                    <td className="py-3 lg:py-4 px-2">{enquiry.phone}</td>
                    <td className="py-3 lg:py-4 px-2">{enquiry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalItems={filteredEnquiries.length}
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
