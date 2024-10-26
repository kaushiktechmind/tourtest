"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import { adminRecentListings } from "@/public/data/adminrecentlisting";
import Pagination from "@/components/vendor-dashboard/Pagination";
import Image from "next/image";
const Page = () => {
  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Hotel Attributes</h2>
        <Link href="/add-property" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Hotel
        </Link>
      </div>
      {/* statisticts */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Attributes</h3>
          <form>
            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
              Name :
            </label>
            <input
              type="text"
              id="name"
              placeholder="Attribute name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
            />
            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
              Upload Icon :
            </label>
            <div className="pt-6">
                <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed">
                    <span className="flex flex-col items-center justify-center py-12">
                      <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                      <span className="h3 clr-neutral-500 text-center mt-4 mb-3">
                        Drag & Drop
                      </span>
                      <span className="block text-center mb-6 clr-neutral-500">
                        OR
                      </span>
                      <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                        Select Files
                      </span>
                      <span className="flex items-center justify-center flex-wrap gap-5">
                        <span className="flex items-center gap-2">
                          <InformationCircleIcon className="w-5 h-5" />
                          <span className="block mb-0 clr-neutral-500">
                            Maximum allowed file size is 9.00 MB
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <InformationCircleIcon className="w-5 h-5" />
                          <span className="block mb-0 clr-neutral-500">
                            Maximum 10 files are allowed
                          </span>
                        </span>
                      </span>
                    </span>
                    <input type="file" id="dropzone-file" className="hidden" />
                  </label>
                </div>
          
              </div>
              <div className="mt-[20px]">
          <Link href="#" className="btn-primary font-semibold">
            <span className="inline-block"> Add New </span>
          </Link>
          </div>
              {/* <button className="btn-primary">Apply</button> */}
           
            {/* <h5 className="text-base sm:text-lg md:text-xl font-medium pb-4">
              Tagline:
            </h5>
            <CheckboxCustom label="I agree to the privacy policy" />
            <h5 className="text-base xm:text-lg md:text-xl font-medium py-4">
              Tag
            </h5> */}
            {/* <CheckboxCustom label="I agree to the Terms & Conditions" /> */}
          
          </form>
        </div>
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <div className="flex items-center gap-3">
              <form className="border rounded-full pr-3 xl:pr-4 bg-[var(--bg-1)]">
                <select className="p-3 bg-transparent xl:pl-4 min-w-[160px] rounded-full focus:outline-none">
                  <option value="1">Bulk Actions</option>
                  <option value="2">Delete</option>
                  <option value="3">Publish</option>
                </select>
              </form>
              <button className="btn-primary">Apply</button>
            </div>
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
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
                  <th className="py-3 lg:py-4 px-2">Icon</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                  
                </tr>
              </thead>
              <tbody>
                {adminRecentListings.slice(0, 6).map(({ id, agent, date }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                    <td className="py-3 lg:py-4 px-2">{date}</td>
                    <td className="py-3 lg:py-4 px-2">{agent}</td>
                    <td className="py-3 lg:py-4 px-2"><Image
                        width={40}
                        height={50}
                        className="rounded-full"
                        src={"https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                        alt="user"
                      /></td>
                    <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                      <Link href="/hotel/edit-hotel-attributes" className="text-primary">
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button className="text-[var(--secondary-500)]">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                     
                    </td>
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
