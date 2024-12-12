"use client";
import {
  ChevronDownIcon,
  CloudArrowUpIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CustomRangeSlider from "@/components/RangeSlider";
import Accordion from "@/components/Accordion";
import SelectUI from "@/components/SelectUI";
import CheckboxCustom from "@/components/Checkbox";
import { touramenities } from "@/public/data/touramenities";
import { spaceTypes } from "@/public/data/spacetypes";

const Page = () => {
  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Add New Activity</h2>
        <Link href="/activity/all-activity" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Activities
        </Link>
      </div>
      {/* statisticts */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${
                  open ? "rounded-t-2xl" : "rounded-2xl"
                } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                <h3 className="h3">Activity Content </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <div className="border-t pt-4">
                <p className="mt-6 mb-4 text-xl font-medium">Title:</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Write Title"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
                <input
                  type="number"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="10000"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Sale Price:</p>
                <input
                  type="number"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="8000"
                />
                
                <p className="mt-6 mb-4 text-xl font-medium">Description :</p>
                <textarea
                  rows={5}
                  className="w-full border p-2 focus:outline-none rounded-md "
                  placeholder="Description.."></textarea>
              </div>
            </div>
          </Accordion>
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${
                  open ? "rounded-t-2xl" : "rounded-2xl"
                } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}>
                <h3 className="h3">Extra Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">
                Available Tickets 1 :
              </p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Ex:3"
              />
              <p className="mt-6 mb-4 text-xl font-medium">
                Available Tickets 2
              </p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Ex:2"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Duration :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="3"
              />
              
              
              <p className="mt-6 mb-4 text-xl font-medium">Start Time :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="12"
              />
              <p className="mt-6 mb-4 text-xl font-medium"> Status :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Ex: 100"
              />
            </div>
          </Accordion>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex items-center justify-between">
                  <h3 className="h3">Images & Video </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}
              initialOpen={true}>
              <div className="pt-6 border-t mt-6">
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
                    </span>
                    <input type="file" id="dropzone-file" className="hidden" />
                  </label>
                </div>
                <p className="mt-6 mb-4 text-xl font-medium">Video Link :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Any type video link"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Full Address :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Address"
                />
                 <p className="mt-6 mb-4 text-xl font-medium">Map Address Link</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Address"
                />
              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex items-center justify-between">
                  <h3 className="h3">Attributes</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}
              initialOpen={true}>
              <div className="pt-6">
                <p className="text-xl font-medium border-t pt-4">
                  {" "}
                  Features :{" "}
                </p>
                <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                  {touramenities.map((item) => (
                    <li key={item} className="py-2">
                      <CheckboxCustom label={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </Accordion>
          </div>

          <Link href="#" className="btn-primary font-semibold">
            <span className="inline-block"> Save & Preview </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
