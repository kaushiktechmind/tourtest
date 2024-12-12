"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, CloudArrowUpIcon, EyeIcon } from "@heroicons/react/24/outline";
import Accordion from "@/components/Accordion";
import QuillEditor from "@/components/QuillEditor";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";

interface FAQ {
  id: number; // Change to the actual type based on your API response
  package_faq_title: string;
  package_faq_description: string; // Assuming the correct spelling is 'package_faq_description'
}

interface Amenity {
  id: number;
  amenity_name: string; // Ensure this matches your API response
  amenity_logo: string; // Add this if the API returns a logo
}


const Page = () => {
  const [itineraries, setItineraries] = useState([
    { image: "", title: "", description: "", content: "" }
  ]);
  const [description, setDescription] = useState<string>("");
  const [formData, setFormData] = useState({
    package_title: "",
    package_content: "",
    tour_price: "",
    sale_price: "",
    youtube_video_link: "",
    duration: "",
    tour_min_people: "",
    tour_max_people: "",
    pickup_point: "",
    person_type_description3: "",
    person_type_price3: "",
    person_max3: "",
    person_min3: "",
    person_type_name3: "",
    itinerary: "",
    banner_image: "",
    location_name: "",
  });
  const [locations, setLocations] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [inclusions, setInclusions] = useState<{ id: number; include_title: string }[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<{ id: number; include_title: string }[]>([]);
  const [exclusions, setExclusions] = useState<{ id: number; exclude_title: string }[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<{ id: number; include_title: string }[]>([]);
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]); // Changed type to Policy[]

  useEffect(() => {
    // Fetch inclusions from the API
    const fetchInclusions = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_package_include");
        const data = await response.json();
        setInclusions(data);
      } catch (error) {
        console.error("Failed to fetch inclusions:", error);
      }
    };

    fetchInclusions();
  }, []);

  useEffect(() => {

    const fetchExclusions = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_package_exclude");
        const data = await response.json();
        setExclusions(data); // Assuming API response is an array
      } catch (error) {
        console.error("Failed to fetch exclusions:", error);
      }
    };

    fetchExclusions();
  }, []);


  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_package_faq"
        );
        const data: FAQ[] = await response.json();
        setFAQs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_location");
        if (response.ok) {
          const data = await response.json();
          setLocations(data); // Assuming the response contains a `locations` array
        } else {
          console.error("Failed to fetch locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleCheckboxChange = (label: string) => {
    setSelectedAmenities((prevSelected) => {
      if (prevSelected.includes(label)) {
        return prevSelected.filter((item) => item !== label); // Unselect
      } else {
        return [...prevSelected, label]; // Select
      }
    });
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_amenities"
        );
        const jsonResponse = await response.json();

        console.log(jsonResponse); // Log the response data
        if (jsonResponse.data) {
          setAmenities(jsonResponse.data); // Assuming jsonResponse.data is an array of amenities
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, []);
  const handleAddInclusion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const inclusion = inclusions.find((inc) => inc.include_title === selectedTitle);

    if (inclusion && !selectedInclusions.some((inc) => inc.id === inclusion.id)) {
      setSelectedInclusions((prev) => [...prev, inclusion]);
    }

    // Reset the dropdown to the placeholder value
    e.target.value = "";
  };

  const handleEditInclusion = (index: number, value: string) => {
    setSelectedInclusions((prev) =>
      prev.map((inc, i) => (i === index ? { ...inc, include_title: value } : inc))
    );
  };
 

  const handleAddExclusion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const exclusion = exclusions.find((inc) => inc.exclude_title === selectedTitle);

    if (exclusion && !selectedExclusions.some((inc) => inc.id === exclusion.id)) {
      setSelectedExclusions((prev) => [...prev, exclusion]);
    }

    // Reset the dropdown to the placeholder value
    e.target.value = "";
  };

  const handleEditExclusion = (index: number, value: string) => {
    setSelectedExclusions((prev) =>
      prev.map((inc, i) => (i === index ? { ...inc, exclude_title: value } : inc))
    );
  };




  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }


    // // Append selected FAQs
    // selectedFAQs.forEach((faq, index) => {
    //   formData.append(`package_faq_title${index + 1}`, faq.package_faq_title);
    //   formData.append(`package_faq_description${index + 1}`, faq.package_faq_description);
    // });

    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          package_content: description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Package saved successfully!");
        console.log(data);
      } else {
        alert("Failed to save package.");
      }
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newItineraries = [...itineraries];
    newItineraries[index][field] = value;
    setItineraries(newItineraries);
  };

  // Add new itinerary box
  const addNewItinerary = () => {
    if (itineraries.length < 5) {
      setItineraries([
        ...itineraries,
        { image: "", title: "", description: "", content: "" }
      ]);
    }
  };

  // Delete itinerary box
  const deleteItinerary = (index: number) => {
    if (itineraries.length > 1) {
      const newItineraries = itineraries.filter((_, i) => i !== index);
      setItineraries(newItineraries);
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Add New Package</h2>
        <Link href="/package/all-package" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Packages
        </Link>
      </div>
      {/* statisticts */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                <h3 className="h3">Package Content </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <div className="border-t pt-4">
                <p className="mt-6 mb-4 text-xl font-medium">Location:</p>
                <select
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select a location
                  </option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.location_name}>
                      {location.location_name}
                    </option>
                  ))}
                </select>



                <p className="mt-6 mb-4 text-xl font-medium">Package Name:</p>
                <input
                  type="text"
                  name="package_title"
                  value={formData.package_title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-base"
                  placeholder="Name of Package"
                />

                <p className="mt-6 mb-4 text-xl font-medium">Description :<span className="astrick">*</span></p>
                <QuillEditor onChange={setDescription} value={description} />


                <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
                <input
                  type="number"
                  name="tour_price"
                  value={formData.tour_price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-base"
                  placeholder="10,000"
                />

                <p className="mt-6 mb-4 text-xl font-medium">Sale Price:</p>
                <input
                  type="number"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-base"
                  placeholder="9,000"
                />


              </div>
            </div>
          </Accordion>
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}>
                <h3 className="h3">Package Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">Max People :</p>
              <input
                type="number"
                name="tour_max_people"
                value={formData.tour_max_people}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Min People :</p>
              <input
                type="number"
                name="tour_min_people"
                value={formData.tour_min_people}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Duration</p>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Pickup Point :</p>
              <input
                type="text"
                name="pickup_point"
                value={formData.pickup_point}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />


            </div>
          </Accordion>

          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}>
                <h3 className="h3">Price Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border border-gray-200 px-4 py-2">Person Type</th>
                    <th className="border border-gray-200 px-4 py-2">Min</th>
                    <th className="border border-gray-200 px-4 py-2">Max</th>
                    <th className="border border-gray-200 px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "Adult", min: "1", max: "4", price: "1000" },
                    { type: "Child", min: "0", max: "2", price: "300" },
                    { type: "Infant", min: "0", max: "1", price: "200" },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="text"
                          name={`personType_${index}`}
                          value={row.type}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                        <p className="text-xs text-gray-500">{row.age}</p>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`min_${index}`}
                          value={row.min}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`max_${index}`}
                          value={row.max}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`price_${index}`}
                          value={row.price}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
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
                    </span>
                    <input type="file" id="dropzone-file" className="hidden" />
                  </label>
                </div>
                <p className="mt-6 mb-4 text-xl font-medium">Video Link :</p>
                <input
                  type="text"
                  name="youtube_video_link"
                  value={formData.youtube_video_link}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholder="0"
                />




              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border mt-6">
            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                    } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
                >
                  <h3 className="h3">Inclusion</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                <select
                  name="include_title"
                  onChange={handleAddInclusion}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select an Inclusion
                  </option>
                  {inclusions.map((inclusion) => (
                    <option key={inclusion.id} value={inclusion.include_title}>
                      {inclusion.include_title}
                    </option>
                  ))}
                </select>

                {/* Render selected inclusions */}
                <div className="mt-4 space-y-4">
                  {selectedInclusions.map((inclusion, index) => (
                    <input
                      key={index}
                      type="text"
                      value={inclusion.include_title}
                      onChange={(e) => handleEditInclusion(index, e.target.value)}
                      className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                    />
                  ))}
                </div>
              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border mt-6">
            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                    } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
                >
                  <h3 className="h3">Exclusion</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                <select
                  name="exclude_title"
                  onChange={handleAddExclusion}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select an Exclusion
                  </option>
                  {exclusions.map((exclusion) => (
                    <option key={exclusion.id} value={exclusion.exclude_title}>
                      {exclusion.exclude_title}
                    </option>
                  ))}
                </select>

                <div className="mt-4 space-y-4">
                  {selectedExclusions.map((exclusion, index) => (
                    <input
                      key={index}
                      type="text"
                      value={exclusion.exclude_title}
                      onChange={(e) => handleEditExclusion(index, e.target.value)}
                      className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                    />
                  ))}
                </div>
              </div>
            </Accordion>
          </div>


          <div className="rounded-2xl bg-white border mt-6 ">

            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                    } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
                >
                  <h3 className="h3">Hotel FAQ</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                {faqs.length > 0 ? (
                  <div className="mb-4">
                    <label
                      htmlFor="faqDropdown"
                      className="text-lg font-bold mb-2 block"
                    >
                      Select a FAQ
                    </label>
                    <select
                      id="faqDropdown"
                      className="w-full border p-2 rounded-md"
                      onChange={(e) => {
                        const selectedFAQ = faqs.find(
                          (faq) => faq.id === parseInt(e.target.value)
                        );
                        if (
                          selectedFAQ &&
                          !selectedFAQs.some((f) => f.id === selectedFAQ.id)
                        ) {
                          setSelectedFAQs((prev) => [...prev, selectedFAQ]);
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select a FAQ...
                      </option>
                      {faqs.map((faq) => (
                        <option key={faq.id} value={faq.id}>
                          {faq.package_faq_title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p>No FAQs available</p>
                )}

                {/* Render input fields for each selected FAQ */}
                {selectedFAQs.map((faq) => (
                  <div key={faq.id} className="mb-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.package_faq_title}
                        readOnly
                      />
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.package_faq_description}
                        onChange={(e) => {
                          const updatedFAQs = selectedFAQs.map((f) =>
                            f.id === faq.id
                              ? { ...f, package_faq_description: e.target.value }
                              : f
                          );
                          setSelectedFAQs(updatedFAQs);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>


          <div className="rounded-2xl bg-white border mt-6 ">

            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                    } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
                >
                  <h3 className="h3">Attributes</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="p-6">
                <p className="text-xl font-medium">Features:</p>
                {amenities.length === 0 ? (
                  <p>No amenities available</p>
                ) : (
                  <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                    {amenities.map((item) => (
                      <li key={item.id} className="py-2 flex items-center">
                        <CheckboxCustom
                          label={item.amenity_name}
                          onChange={() => handleCheckboxChange(item)}
                          checked={selectedAmenities.some(
                            (amenity) => amenity.id === item.id
                          )}
                        />

                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Accordion>
          </div>
        </div>
      </section>

      <div className="rounded-2xl bg-white border m-6 p-6">
        <Accordion
          buttonContent={(open) => (
            <div
              className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
              <h3 className="h3">Itinerary</h3>
              <ChevronDownIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
              />
            </div>
          )}
          initialOpen={true}>
          <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
            {itineraries.map((itinerary, index) => (
              <div key={index} className="mb-6 p-4 border rounded-md">
                <div className="flex flex-wrap gap-4 items-start">
                  <div className="w-full md:w-1/5 flex flex-col">
                    <div>
                      <label className="block text-sm font-medium mb-2">Day</label>
                      <input
                        type="text"
                        value={`Day ${index + 1}`}
                        readOnly
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base bg-gray-100"
                        placeholder="Day 1"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <textarea
                      value={itinerary.content}
                      onChange={(e) => handleInputChange(index, "content", e.target.value)}
                      className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      placeholder="Title"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed">
                      <span className="flex flex-col items-center justify-center py-12">
                        <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                      </span>
                      <input type="file" id="dropzone-file" className="hidden" />
                    </label>
                  </div>
                  {itineraries.length > 1 && (
                    <div className="w-full md:w-1/6 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => deleteItinerary(index)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="w-full flex flex-col">
                    <div className="mt-4">
                      <p className="mb-4 text-xl font-medium">Description :</p>
                      <QuillEditor onChange={setDescription} value={description} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewItinerary}
              className="text-blue-500"
              disabled={itineraries.length >= 5}
            >
              Add New
            </button>
          </div>

        </Accordion>
      </div>
      <button onClick={handleSubmit} className="btn-primary font-semibold m-6">
            Save & Preview
          </button>

      <Footer />
    </div>
  );
};

export default Page;
