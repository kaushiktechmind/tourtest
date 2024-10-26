import Pagination from "@/components/vendor-dashboard/Pagination";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import { recentBookings } from "@/public/data/recentbookings";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <section className="bg-[var(--bg-1)] px-3 lg:px-6 py-4 lg:py-6">
        <div className="bg-white p-3 sm:p-4  md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl">
          <div className="flex flex-wrap justify-between mb-7 gap-5">
            <h3 className="h3">Recent Bookings</h3>
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                />
                <SearchIcon />
              </div>
              <div className="flex items-center gap-1">
                <span>Sort By :</span>
                <div className="border rounded-full pr-3">
                  <select className="p-3 min-w-[100px] rounded-full focus:outline-none">
                    <option value="1">Hotel</option>
                    <option value="2">Tour</option>
                    <option value="3">Cab</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[#F5F5FE] border-b border-dashed">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">item</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Paid</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Time</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(
                  ({ id, amount, date, name, item, paid, status, time }) => (
                    <tr key={id} className="border-b border-dashed">
                      <td className="py-3 px-2">{id}</td>
                      <td className="py-3 px-2">{name}</td>
                      <td className="py-3 px-2 text-primary">{item}</td>
                      <td className="py-3 px-2">{amount}</td>
                      <td className="py-3 px-2">{paid}</td>
                      <td className="py-3 px-2">{date}</td>
                      <td className="py-3 px-2">{time}</td>
                      <td className={`py-3 px-2`}>
                        <span
                          className={`py-2 px-3 rounded-xl ${
                            status == "Draft" &&
                            "text-[var(--secondary-500)] bg-[#EBFBF2]"
                          } ${
                            status == "Successfull" &&
                            "text-primary bg-[#EBEBFD]"
                          } ${
                            status == "Draft" && "text-[#9C742B] bg-[#FFF9ED]"
                          }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default page;
