"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ChevronDownIcon, CloudArrowUpIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import Accordion from "@/components/Accordion";
import Link from "next/link";
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { useSearchParams, useRouter } from "next/navigation";

interface FAQ {
  id: number; // Change to the actual type based on your API response
  faq_title: string;
  faq_description: string; // Assuming the correct spelling is 'faq_description'
}

interface Policy {
  id: number; // Change to the actual type based on your API response
  policy_title: string;
  policy_description: string; // Assuming the correct spelling is 'faq_description'
}


interface Amenity {
  id: number;
  activity_attribute_name: string; // Ensure this matches your API response
  activity_attribute_logo: string; // Add this if the API returns a logo
}

interface Field {
  name: string;
  content: string;
  distance: string;
}

type Ticket = {
  code: string;
  name: string;
  price: string;
  number: string;
};

interface Location {
  id: string | number; // or whatever type your `id` field is
  location_name: string;
}


const AddActivity = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([
    { code: "", name: "", price: "", number: "" }
  ]);

  const [description, setDescription] = useState<string>("");
  const [formData, setFormData] = useState({
    activity_title: "",
    activity_content: "",
    price: "",
    sale_price: "",
    activity_status: "1",
    duration: "",
    start_time: "",
    tour_max_people: "",
    full_address: "",
    seo_title: "",
    seo_description: "",
    meta_title: "",
    ticket: "",
    banner_image_multiple: "",
    location_name: "",
  });

  const [locations, setLocations] = useState<Location[]>([]);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activity_attribute, setAmenities] = useState<Amenity[]>([]);
  const [bannerImages, setBannerImages] = useState<File[]>([]);

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]); // Changed type to Policy[]

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);





  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_faq_activity"
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
    const fetchPolicies = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_activity_policy"
        );
        const data: Policy[] = await response.json();
        setPolicies(data); // Make sure you have a state called `policies`
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBannerImages(Array.from(e.target.files)); // Store multiple files
    }
  };




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
          "https://yrpitsolutions.com/tourism_api/api/admin/get_attribute_activity"
        );
        const jsonResponse = await response.json();

        console.log(jsonResponse); // Log the response data
        if (jsonResponse.data) {
          setAmenities(jsonResponse.data); // Assuming jsonResponse.data is an array of activity_attribute
        }
      } catch (error) {
        console.error("Error fetching activity_attribute:", error);
      }
    };

    fetchAmenities();
  }, []);







  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      const plainDescription = description.replace(/<[^>]*>/g, ""); // This removes HTML tags



      // Manually append each field from formData and plainDescription
      formDataToSend.append("activity_title", formData.activity_title);
      formDataToSend.append("activity_content", plainDescription); // Save as plain text
      formDataToSend.append("price", formData.price);
      formDataToSend.append("sale_price", formData.sale_price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("full_address", formData.full_address);
      formDataToSend.append("seo_title", formData.seo_title);
      formDataToSend.append("seo_description", formData.seo_description);
      formDataToSend.append("meta_title", formData.meta_title);




      formDataToSend.append("location_name", formData.location_name);
      formDataToSend.append("activity_status", formData.activity_status);

      // Append each selected amenity as a separate entry
      if (selectedAmenities.length > 0) {
        selectedAmenities.forEach((amenity) => {
          formDataToSend.append("activity_attribute[]", amenity);
        });
      }

      selectedFAQs.forEach((faq) => {
        formDataToSend.append("faqs[]", JSON.stringify({ title: faq.faq_title, description: faq.faq_description }));
      });


      selectedPolicies.forEach((policy, index) => {
        formDataToSend.append(`policy_title${index + 1}`, policy.activity_policy_title);
        formDataToSend.append(`policy_description${index + 1}`, policy.activity_policy_description);
      });



      // Check if bannerImages is defined and is an array before using forEach
      if (Array.isArray(bannerImages)) {
        bannerImages.forEach((file) => {
          formDataToSend.append("banner_image_multiple[]", file);
        });
      } else {
        console.error('bannerImages is not defined or not an array');
      }


      const formattedTickets = tickets.map((ticket, index) => ({
        [`ticket_code${index + 1}`]: ticket.code,
        [`ticket_name${index + 1}`]: ticket.name,
        [`ticket_price${index + 1}`]: ticket.price,
        [`no_of_available_tickets${index + 1}`]: ticket.number,
      }));

      // Create FormData to send the ticket data
      formattedTickets.forEach((ticket) => {
        Object.keys(ticket).forEach((key) => {
          formDataToSend.append(key, ticket[key]);
        });
      });

      // Send the request with FormData
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_activity", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' should not be set manually when using FormData
        },
        body: formDataToSend, // Send the FormData object
      });
      if (response.ok) {
        const data = await response.json();
        alert("Activity saved successfully!");
        // router.push("/activity/all-activity");
      } else {
        alert("Failed to save activity.");
      }
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };




  const handleInputChange = (index: number, field: keyof Ticket, value: string) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };
  // Add new ticket box
  const addNewTicket = () => {
    if (tickets.length < 5) {
      setTickets([
        ...tickets,
        { code: "", name: "", price: "", number: "" }
      ]);
    }
  };

  // Delete ticket box
  const deleteTicket = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
    }
  };

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
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                <h3 className="h3">Activity Content </h3>
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



                <p className="mt-6 mb-4 text-xl font-medium">Activity Name:</p>
                <input
                  type="text"
                  name="activity_title"
                  value={formData.activity_title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-base"
                  placeholder="Name of Activity"
                />

                <p className="mt-6 mb-4 text-xl font-medium">Description :<span className="astrick">*</span></p>
                <QuillEditor onChange={setDescription} value={description} />


                <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
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
                <h3 className="h3">Tickets Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">Start Time :</p>
              <input
                type="text"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="3:00 PM"
              />


              <p className="mt-6 mb-4 text-xl font-medium">Duration</p>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="2 Hour"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Full Address :</p>
              <input
                type="text"
                name="full_address"
                value={formData.full_address}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />

            </div>
          </Accordion>


          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white mt-6`}
              >
                <h3 className="h3">Tickets</h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}
          >
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              {tickets.map((ticket, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="flex flex-wrap gap-4 items-start">
                    <div className="w-full md:w-1/6 flex flex-col">
                      <label className="block text-sm font-medium mb-2">Code</label>
                      <input
                        value={ticket.code}
                        onChange={(e) => handleInputChange(index, "code", e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                        placeholder="Code"
                      />
                    </div>
                    <div className="w-full md:w-1/5">
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        value={ticket.name}
                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                        placeholder="Name"
                      />
                    </div>
                    <div className="w-full md:w-1/5">
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <input
                        value={ticket.price}
                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                        placeholder="Price"
                      />
                    </div>
                    <div className="w-full md:w-1/6">
                      <label className="block text-sm font-medium mb-2">Number</label>
                      <input
                        value={ticket.number}
                        onChange={(e) => handleInputChange(index, "number", e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                        placeholder="Number"
                      />
                    </div>
                    {tickets.length > 1 && (
                      <div className="w-auto flex items-center">
                        <button
                          type="button"
                          onClick={() => deleteTicket(index)}
                          className="text-red-500 p-2 hover:bg-gray-100 rounded-full"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addNewTicket}
                className="text-blue-500"
                disabled={tickets.length >= 5}
              >
                Add New
              </button>
            </div>
          </Accordion>


        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex items-center justify-between">
                  <h3 className="h3">Banner Images</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}>
              <div className="pt-6">
                <div>
                  <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed"
                    >
                      <span className="flex flex-col items-center justify-center py-12">
                        <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                        <span className="h3 clr-neutral-500 text-center mt-4 mb-3">
                          Drag & Drop
                        </span>
                        <span className="block text-center mb-6 clr-neutral-500">OR</span>
                        <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                          Select Files
                        </span>
                        <span className="h5 clr-neutral-500 text-center mt-4 mb-3">
                          Select Minimum 6 Files
                        </span>
                      </span>
                      <input
                        type="file"
                        id="dropzone-file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Display the selected images */}
                  {bannerImages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">Selected Images</h3>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {bannerImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)} // Display image from local file
                              alt={`Selected Image ${index + 1}`}
                              className="w-full h-[100px] object-cover rounded-lg" // Set same size for all images
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  <h3 className="h3">Policy</h3>
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
                    <label htmlFor="policyDropdown" className="text-lg font-bold mb-2 block">
                      Select a Policy
                    </label>
                    <select
                      id="policyDropdown"
                      className="w-full border p-2 rounded-md"
                      onChange={(e) => {
                        const selectedPolicy = policies.find(
                          (policy) => policy.id === parseInt(e.target.value)
                        );
                        if (selectedPolicy && !selectedPolicies.some((p) => p.id === selectedPolicy.id)) {
                          setSelectedPolicies((prev) => [...prev, selectedPolicy]);
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select a Policy...
                      </option>
                      {policies.map((policy) => (
                        <option key={policy.id} value={policy.id}>
                          {policy.activity_policy_title}
                        </option>
                      ))}
                    </select>
                  </div>

                ) : (
                  <p>No FAQs available</p>
                )}

                {/* Render input fields for each selected FAQ */}
                {selectedPolicies.map((policy) => (
                  <div key={policy.id} className="mb-4 flex gap-4 items-center">
                    <input
                      type="text"
                      className="w-1/2 border p-2 rounded-md"
                      value={policy.activity_policy_title}
                      readOnly
                    />
                    <input
                      type="text"
                      className="w-1/2 border p-2 rounded-md"
                      value={policy.activity_policy_description}
                      onChange={(e) => {
                        const updatedPolicies = selectedPolicies.map((p) =>
                          p.id === policy.id ? { ...p, activity_policy_description: e.target.value } : p
                        );
                        setSelectedPolicies(updatedPolicies);
                      }}
                    />
                    <button
                      onClick={() => {
                        const updatedPolicies = selectedPolicies.filter((p) => p.id !== policy.id);
                        setSelectedPolicies(updatedPolicies);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
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
                  <h3 className="h3">FAQ</h3>
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
                    <label htmlFor="faqDropdown" className="text-lg font-bold mb-2 block">
                      Select a FAQ
                    </label>
                    <select
                      id="faqDropdown"
                      className="w-full border p-2 rounded-md"
                      onChange={(e) => {
                        const selectedFAQ = faqs.find(
                          (faq) => faq.id === parseInt(e.target.value)
                        );
                        if (selectedFAQ && !selectedFAQs.some((f) => f.id === selectedFAQ.id)) {
                          setSelectedFAQs((prev) => [...prev, selectedFAQ]);
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select a FAQ...
                      </option>
                      {faqs.map((faq) => (
                        <option key={faq.id} value={faq.id}>
                          {faq.faq_title}
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
                    <div className="flex gap-4 items-center">
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.faq_title}
                        readOnly
                      />
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.faq_description}
                        onChange={(e) => {
                          const updatedFAQs = selectedFAQs.map((f) =>
                            f.id === faq.id ? { ...f, faq_description: e.target.value } : f
                          );
                          setSelectedFAQs(updatedFAQs);
                        }}
                      />
                      {/* Delete Icon */}
                      <button
                        onClick={() => {
                          const updatedFAQs = selectedFAQs.filter((f) => f.id !== faq.id);
                          setSelectedFAQs(updatedFAQs);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>

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
                <p className="text-xl font-medium mb-4">Features:</p>
                {activity_attribute.length === 0 ? (
                  <p className="text-gray-500">No activity attributes available</p>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {activity_attribute.map((item) => (
                      <li key={item.id} className="flex items-center">
                        <CheckboxCustom
                          label={item.activity_attribute_name}
                          onChange={() => handleCheckboxChange(item.activity_attribute_name)}
                          checked={selectedAmenities.includes(item.activity_attribute_name)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Accordion>

          </div>


          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}>
                <h3 className="h3">SEO </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">URL Name :</p>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />


              <p className="mt-6 mb-4 text-xl font-medium">SEO Description :</p>
              <input
                type="text"
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />

              <p className="mt-6 mb-4 text-xl font-medium">Meta Title :</p>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />



            </div>
          </Accordion>
        </div>
      </section>


      <button onClick={handleSubmit} className="btn-primary font-semibold m-6">
        Save Activity
      </button>

      <Footer />
    </div>

  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AddActivity />
  </Suspense>
);
export default Page;  