"use client";
import {
  ChevronDownIcon,
  CloudArrowUpIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import dynamic from 'next/dynamic';
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CustomRangeSlider from "@/components/RangeSlider";
import Accordion from "@/components/Accordion";
import SelectUI from "@/components/SelectUI";
import { propertyAmenities } from "@/public/data/addpropertyAmenities";
import CheckboxCustom from "@/components/Checkbox";
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import React, { useState } from "react";


const Page = () => {
  const [description, setDescription] = useState("");

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Hotel</h2>
        <div className="flex space-x-2"> {/* Use flex and space-x-2 for horizontal spacing */}
          <Link href="/hotel/manage-room" className="btn-primary">
            <EyeIcon className="w-5 h-5" /> Manage Room
          </Link>
          <Link href="/hotel/all-hotels" className="btn-primary">
            <EyeIcon className="w-5 h-5" /> View All Hotel
          </Link>
        </div>

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
                <h3 className="h3">Hotel Content</h3>
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
              <p className="mt-6 mb-4 text-xl font-medium">Property ID :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Enter ID"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Type:</p>
<div className="flex space-x-4">
  <div className="flex items-center">
    <input
      type="radio"
      id="hotel"
      name="accommodation"
      value="hotel"
      className="mr-2"
    />
    <label htmlFor="hotel" className="text-base">Hotel</label>
  </div>
  <div className="flex items-center">
    <input
      type="radio"
      id="homestay"
      name="accommodation"
      value="homestay"
      className="mr-2"
    />
    <label htmlFor="homestay" className="text-base">Homestay</label>
  </div>
</div>

                
                <p className="mt-6 mb-4 text-xl font-medium">Name:</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Starting Price:</p>
                <CustomRangeSlider />
               

<p className="mt-6 mb-4 text-xl font-medium">People</p>
<div className="flex space-x-4">
  <div className="w-full flex flex-col">
    <label htmlFor="adults" className="text-base">Max Adults:</label>
    <SelectUI
      options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}
    />
  </div>
  <div className="w-full flex flex-col">
    <label htmlFor="children" className="text-base">Max Children:</label>
    <SelectUI 
            options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}

    />
  </div>
  <div className="w-full flex flex-col">
    <label htmlFor="infants" className="text-base">Max Infants:</label>
    <SelectUI
           options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}

    />
  </div>
</div>

                
                <p className="mt-6 mb-4 text-xl font-medium">Description :</p>
                <QuillEditor onChange={setDescription} value={description} />
                  <p className="mt-3 mb-4 text-xl font-medium">
                  Hotel Rating :
                </p>
                <SelectUI
                  options={[
                    { name: "1" },
                    { name: "2" },
                    { name: "3" },
                    { name: "4" },
                    { name: "5" },
                  ]}
                />
                  
                {/* <p className="mt-6 mb-4 text-xl font-medium">Tagline :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md  text-base"
                  placeholder="Your tag line"
                /> */}
                {/* <p className="mt-6 mb-4 text-xl font-medium"> Tag </p>
                <SelectUI
                  options={[
                    { name: "One" },
                    { name: "Two" },
                    { name: "Three" },
                  ]}
                /> */}
              </div>
            </div>
          </Accordion>
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${
                  open ? "rounded-t-2xl" : "rounded-2xl"
                } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}>
                <h3 className="h3">Hotel  Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium"> Bedrooms : </p>
              <SelectUI
                options={[{ name: "1" }, { name: "2" }, { name: "3" }]}
              />
              <p className="mt-6 mb-4 text-xl font-medium">Bathrooms :</p>
              <SelectUI
                options={[{ name: "1" }, { name: "2" }, { name: "3" }]}
              />
              {/* <p className="mt-6 mb-4 text-xl font-medium">Garages :</p>
              <SelectUI
                options={[{ name: "1" }, { name: "2" }, { name: "3" }]}
              /> */}
              <p className="mt-6 mb-4 text-xl font-medium">Person :</p>
              <SelectUI
                options={[
                  { name: "1" },
                  { name: "2" },
                  { name: "3" },
                  { name: "4" },
                  { name: "5" },
                  { name: "6" },
                  { name: "7" },
                  { name: "8" },
                ]}
              />
              <p className="mt-6 mb-4 text-xl font-medium">Room Size (sq ft) :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />
            
              {/* <p className="mt-6 mb-4 text-xl font-medium">Type :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Enter type"
              /> */}
              {/* <p className="mt-6 mb-4 text-xl font-medium">Area :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="Enter area"
              /> */}
              <p className="mt-6 mb-4 text-xl font-medium">Number of Beds :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="06"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Parking :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="3"
              />
              {/* <p className="mt-6 mb-4 text-xl font-medium">Dimensions :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              /> */}
              {/* <p className="mt-6 mb-4 text-xl font-medium">Year Build :</p>
              <input
                type="text"
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="2023"
              /> */}


<div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
                <div className="">
                  <p className=" mb-3 text-xl font-medium">Status:</p>
                  <div className="flex flex-col gap-2"> {/* Change to flex-col for vertical stacking */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="hotel"
                        name="accommodation"
                        value="hotel"
                        className="mr-2"
                      />
                      <label htmlFor="hotel" className="text-base">Publish</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="homestay"
                        name="accommodation"
                        value="homestay"
                        className="mr-2"
                      />
                      <label htmlFor="homestay" className="text-base">Draft</label>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="#" className="btn-primary font-semibold mt-6">
                <span className="inline-block"> Save & Preview </span>
              </Link>
            </div>
          </Accordion>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex items-center justify-between">
                  <h3 className="h3">Banner Images and Videos </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}
              initialOpen={true}>
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
                <p className="mt-6 mb-4 text-xl font-medium">Video Link :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Any type video link"
                />
                <div className="mt-6">
                  <div className="h-[400px]">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2233.5934788396344!2d89.78232001463437!3d23.836268639364576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1688381345276!5m2!1sen!2sbd"></iframe>
                  </div>
                </div>
                <p className="mt-6 mb-4 text-xl font-medium">Address :</p>
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
                <p className="text-xl font-medium"> Features : </p>
                <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                  {propertyAmenities.map((item) => (
                    <li key={item} className="py-2">
                      <CheckboxCustom label={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex justify-between">
                  <h3 className="h3">Contact Information </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}
              initialOpen={true}>
              <div className="pt-6">
                <p className="mb-4 text-xl font-medium">Zip/Post Code :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="4"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Phone :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Number"
                />
                <p className="mt-6 mb-4 text-xl font-medium"> Fax : </p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Fax number"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Email :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Email"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Website :</p>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter website"
                />
                <Link
                  href="#"
                  className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-semibold mt-6">
                  <span className="inline-block"> Add New </span>
                </Link>
              </div>
            </Accordion>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;