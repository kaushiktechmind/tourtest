"use client";
import { Tab } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}


const page = () => {

  const travelData = JSON.parse(localStorage.getItem("travelData") || "{}");

  const adults = travelData.adults || 0;
  const infants = travelData.infants || 0;



  const [nationalities, setNationalities] = useState(
    Array.from({ length: adults + infants }).fill("Indian")
  );

  const handleNationalityChange = (index, nationality) => {
    const updatedNationalities = [...nationalities];
    updatedNationalities[index] = nationality;
    setNationalities(updatedNationalities);
  };



  return (
    <div className="bg-[var(--bg-2)] py-[30px] lg:py-[60px] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 xl:col-span-8">
            <div className="section-space--sm">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <h2 className="mb-0 h2 flex items-center flex-wrap gap-4 text-[var(--neutral-700)]">
                      <span> Add Traveller(s) Details </span>
                    </h2>
                  </div>

                  {Array.from({ length: adults }).map((_, index) => (
                    <div className="flight-card bg-white border-dashed rounded-2xl mt-6" key={`adult-${index}`}>
                      <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                        <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                          <div className="flex w-full flex-col gap-6 text-center md:text-start">
                            <p className="mb-0 font-medium">Adult {index + 1}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Title Dropdown */}
                              <select className="border border-neutral-300 rounded-lg p-2 w-32 focus:outline-none">
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Master">Master</option>
                              </select>

                              {/* Full Name Field */}
                              <input
                                type="text"
                                placeholder="Full Name"
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                              />

                              {/* Age Field */}
                              <input
                                type="number"
                                placeholder="Age"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                              />

                              {/* Sex Field */}
                              <input
                                type="text"
                                placeholder="Sex"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                              />

                              {/* Country Dropdown */}
                              <select
                                value={nationalities[index]}
                                onChange={(e) => handleNationalityChange(index, e.target.value)}
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                              >
                                <option value="Indian">Indian</option>
                                <option value="Foreigner">Foreigner</option>
                              </select>
                            </div>

                            {/* Additional Fields for Foreigner */}
                            {nationalities[index] === "Foreigner" && (
                              <div className="flex flex-wrap items-center gap-4 mt-4">
                                <input
                                  type="text"
                                  placeholder="Country"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Passport Number"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                                <input
                                  type="date"
                                  placeholder="Passport Expiry Date"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* // Handling infants (similar to adults) */}
                  {Array.from({ length: infants }).map((_, index) => (
                    <div className="flight-card bg-white border-dashed rounded-2xl mt-6" key={`infant-${index}`}>
                      <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                        <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                          <div className="flex w-full flex-col gap-6 text-center md:text-start">
                            <p className="mb-0 font-medium">Infant {index + 1}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Title Dropdown */}
                              <select className="border border-neutral-300 rounded-lg p-2 w-32 focus:outline-none">
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Master">Master</option>
                              </select>

                              {/* Full Name Field */}
                              <input
                                type="text"
                                placeholder="Full Name"
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                              />

                              {/* Age Field */}
                              <input
                                type="number"
                                placeholder="Age"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                              />

                              {/* Sex Field */}
                              <input
                                type="text"
                                placeholder="Sex"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                              />

                              {/* Country Dropdown */}
                              <select
                                value={nationalities[index]}
                                onChange={(e) => handleNationalityChange(index, e.target.value)}
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                              >
                                <option value="Indian">Indian</option>
                                <option value="Foreigner">Foreigner</option>
                              </select>
                            </div>

                            {/* Additional Fields for Foreigner */}
                            {nationalities[index] === "Foreigner" && (
                              <div className="flex flex-wrap items-center gap-4 mt-4">
                                <input
                                  type="text"
                                  placeholder="Country"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Passport Number"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                                <input
                                  type="date"
                                  placeholder="Passport Expiry Date"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <h2 className="mb-0 h2 flex items-center flex-wrap gap-4 text-[var(--neutral-700)]">
                      <span> Add Contact Details </span>
                    </h2>
                  </div>
                  <div className="flight-card bg-white border-dashed rounded-2xl">
                    <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Email Address"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="Primary Mobile"
                          placeholder="Phone Number"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />

                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="tel"
                          placeholder="Alternative Number"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Number of Passenger"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Schedule ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="tel"
                          placeholder="Travel Date"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Class ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Fare"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="tel"
                          placeholder="TC Check"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Return Schedule Id"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Return Travel Date"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="tel"
                          placeholder="Return Class ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Return Fare"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        />

                      </div>
                      <textarea
                        placeholder="Remark"
                        className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                      />
                    </div>
                  </div>
                </div>



                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-2)] rounded-2xl border border-neutral-40 mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">
                    {" "}
                    Cancellation Charges:{" "}
                  </h4>
                  <div className="hr-dashed my-5"></div>
                  <h6 className="mb-4"> Passengers traveling </h6>
                  <ul className="list-disc pl-4 gap-3 mb-8">
                    <li>
                      Cancellation 48 hours or more before ferry departure: Rs 250 per ticket.
                    </li>
                    <li>
                      Cancellation between 24 and 48 hours before departure: 50% of the ticket price.
                    </li>
                    <li>
                      Cancellation within 24 hours of departure: 100% of the ticket price.
                    </li>
                  </ul>
                  <h6 className="mb-4"> Guidelines </h6>
                  <ul className="pl-4 list-disc gap-3 mb-8">
                    <li>
                      Bring all necessary documentation, including your passport
                      or ID card, visa (if required)
                    </li>
                    <li>
                      Check the baggage allowance for your flight and pack
                      accordingly.
                    </li>
                    <li>
                      Check in online or at the airport, following the
                      airline&apos;s guidelines for check-in times
                    </li>
                    <li>
                      Go through security screening and follow the guidelines
                      for liquids, gels, in your carry-on luggage.
                    </li>
                    <li>
                      Board your flight when your boarding group is called,
                      following the instructions of the airline staff.
                    </li>
                    <li>
                      During the flight, follow the instructions of the flight
                      crew and stay in your seat with your seat belt fastened
                      when the seat belt sign is on.
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="link flex items-center gap-2 text-primary">
                    <span className="font-semibold inline-block">
                      Read More
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
               
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-2)] rounded-2xl border border-neutral-40 mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">
                    {" "}
                    Traveler Details{" "}
                  </h4>
                  <div className="hr-dashed my-5"></div>
                  <form action="#" className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        First Name
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Enter First Name"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Last Name
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Enter Last Name"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Email
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="email"
                        placeholder="Enter Email"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Phone
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Enter Phone"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Date Of Birth
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="date"
                        placeholder="Select date of birth"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Nationality
                      </label>
                      <div className="property-search__select property-search__col rounded-full flex items-center gap-2 px-6 flex-grow bg-white">
                        <select
                          className="w-full bg-transparent px-5 py-3 focus:outline-none"
                          aria-label="Default select example">
                          <option>Location</option>
                          <option value="1">New York</option>
                          <option value="2">Chicago</option>
                          <option value="3">Atlanta</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Passport Number
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Passport Number"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Issuing Country
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Country Name"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block font-medium text-[var(--neutral-700)] text-lg mb-3">
                        Passport Expiry
                      </label>
                      <input
                        className="w-full focus:outline-none text-base py-3 px-5 rounded-full"
                        type="text"
                        placeholder="Passport Date"
                      />
                    </div>
                    <div className="col-span-12">
                      <Link
                        href="#"
                        className="link flex items-center gap-2 text-primary">
                        <span className="font-semibold inline-block">
                          Add New Adult
                        </span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href="#"
                    className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-1">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="inline-block font-semibold">
                      Previous Flight
                    </span>
                  </Link>
                  <ul className="flex flex-wrap gap-3 justify-center order-3 flex-grow md:order-2">
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-linkedin-in"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-dribbble"></i>
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-2">
                    <span className="inline-block font-semibold">
                      Next Flight
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
              <div className="flex items-center justify-between gap-4 mb-10">
                <h5 className="mb-0 h2 flex items-center flex-wrap gap-4">
                  <h5> Your Selections </h5>
                </h5>
              </div>
              <div className="flight-card bg-white border-dashed rounded-2xl">
                <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                  <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                    <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                      <div className="grid place-content-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto ms-md-0">
                        <Image
                          width={52}
                          height={27}
                          src="/img/brand-11.png"
                          alt="image"
                          className=" object-fit-contain"
                        />
                      </div>
                      <p className="mb-0 font-medium">Makruzz</p>
                    </div>
                    <div className="flex md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow w-full md:w-auto">
                      <span className="block text-primary">From</span>
                      <h6 className="mb-0  font-semibold">
                        12:10 am
                      </h6>
                      <span className="block text-[var(--neutral-700)]">
                        New York
                      </span>
                    </div>
                    <div className="flex w-full md:w-auto justify-center flex-col gap-2 text-center flex-grow">
                      <div className="grid place-content-center w-12 h-12 shadow-lg rounded-full mx-auto">
                        <div className="grid place-content-center w-10 h-10 bg-[var(--primary-light)] text-primary rounded-full">
                          <i className="las la-plane-departure text-2xl"></i>
                        </div>
                      </div>
                      <span className="block clr-neutral-500">
                        02h 15 min
                      </span>
                    </div>
                    <div className="flex w-full md:w-auto md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow">
                      <span className="block text-primary">To</span>
                      <h6 className="mb-0  font-semibold">
                        07:20 am
                      </h6>
                      <span className="block text-[var(--neutral-700)]">
                        London
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center text-center gap-3 rounded-xl bg-[#F7F7FE] p-3">
                    <p className="mb-0">
                      Date :
                      <span className="text-amber-700"> 2025-12-04</span>
                    </p>
                    <p className="mb-0">
                      Travel Class :
                      <span className="text-primary"> Delux</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-0 mb-6 relative">
              <div className="bg-white rounded-2xl py-8 px-6">
               
                <Tab.Group>
                  <Tab.List className="flex gap-3 about-tab mb-7">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "focus:outline-none",
                          selected ? "text-primary font-medium" : ""
                        )
                      }>
                      Pricing Details
                    </Tab>{" "}
                    <span>|</span>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "focus:outline-none",
                          selected ? "text-primary font-medium" : ""
                        )
                      }>
                      Enquiry Form
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="tab-content mb-8">
                    <Tab.Panel>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> Base Price </p>
                        <p className="mb-0 font-medium"> $360 </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> State Tax </p>
                        <p className="mb-0 font-medium"> $70 </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> Night Charge </p>
                        <p className="mb-0 font-medium"> $170 </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="mb-0 clr-neutral-500">
                          {" "}
                          Convenience Fee{" "}
                        </p>
                        <p className="mb-0 font-medium"> $15 </p>
                      </div>
                      <div className="hr-dashed my-4"></div>
                      <div className="flex items-center justify-between mb-10">
                        <p className="mb-0 clr-neutral-500"> Total </p>
                        <p className="mb-0 font-medium"> $1025 </p>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> Base Price </p>
                        <p className="mb-0 font-medium"> $570 </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> State Tax </p>
                        <p className="mb-0 font-medium"> $90 </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500"> Night Charge </p>
                        <p className="mb-0 font-medium"> $2300 </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="mb-0 clr-neutral-500">
                          {" "}
                          Convenience Fee{" "}
                        </p>
                        <p className="mb-0 font-medium"> $24 </p>
                      </div>
                      <div className="hr-dashed my-4"></div>
                      <div className="flex items-center justify-between mb-10">
                        <p className="mb-0 clr-neutral-500"> Total </p>
                        <p className="mb-0 font-medium"> $1025 </p>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
                <Link
                  href="#"
                  className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6">
                  <span className="inline-block"> Proceed Booking </span>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
