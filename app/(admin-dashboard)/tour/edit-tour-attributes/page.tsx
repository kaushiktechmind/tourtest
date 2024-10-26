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
        <h2 className="h2 text-white">Edit Package Attributes</h2>
        <Link href="/tour/all-tour" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Packages
        </Link>
      </div>
      {/* statisticts */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
  <div className="col-span-12 flex justify-center">
    <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
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
                </span>
              </span>
              <input type="file" id="dropzone-file" className="hidden" />
            </label>
          </div>
        </div>
        <div className="mt-[20px] text-center">
          <Link href="#" className="btn-primary font-semibold">
            <span className="inline-block"> Update </span>
          </Link>
        </div>
      </form>
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
