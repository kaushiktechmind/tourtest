"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import SelectUI from "@/components/SelectUI";
import { alltours } from "@/public/data/alltours";
import HeadlessList from "@/components/ListBox";

const Page = () => {
  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Package Categories</h2>
        <Link href="./all-tour" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Packages
        </Link>
      </div>
      {/* statisticts */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
  <div className="col-span-12 flex justify-center">
    <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
      <h3 className="border-b h3 pb-6">Add Category</h3>
      <form>
        <label
          htmlFor="name"
          className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
          Name :
        </label>
        <input
          type="text"
          id="name"
          placeholder="Category name"
          className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
        />

        <button type="submit" className="btn-primary mt-5 lg:mt-7">
          Update
        </button>
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
