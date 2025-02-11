"use client";
import {
  ChevronDownIcon,
  CloudArrowUpIcon,
  EyeIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Accordion from "@/components/Accordion";
import CheckboxCustom from "@/components/Checkbox";
import Link from "next/link";

const QuillEditor = dynamic(() => import('../../../../components/QuillEditor'), { ssr: false });
import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import axios, { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
interface Amenity {
  id: number;
  amenity_name: string; // Ensure this matches your API response
  amenity_logo: string; // Add this if the API returns a logo
}

interface Policy {
  id: number;
  policy_title: string;
  policy_description: string;
}

interface FAQ {
  id: number; // Change to the actual type based on your API response
  faq_title: string;
  faq_description: string; // Assuming the correct spelling is 'faq_description'
}

interface Location {
  location_name: string;
}

interface Field {
  name: string;
  content: string;
  distance: string;
}

interface HotelFormData {
  property_id: string;
  hotel_or_home_stay: string;
  location_name: string;
  hotel_name: string;
  // description: string;
  starting_price: string;
  highest_price: string;
  ratings: string;
  max_adult: string;
  max_children: string;
  max_infant: string;
  no_of_bedrooms: string;
  no_of_bathrooms: string;
  no_of_beds: string;
  room_size: string;
  company_website: string;
  email: string;
  phone: string;
  zipcode: string;
  parking: string;
  [key: string]: any;
  banner_images: File[]; // Ensure this is defined as an array of File
  full_address: string;
  seo_title: string;
  seo_description: string,
  meta_title: string,
}

const EditHotel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const [description, setDescription] = useState<string>(""); // Type for description

  const [formData, setFormData] = useState<HotelFormData>({
    property_id: "",
    hotel_or_home_stay: "",
    status: "",
    location_name: "",
    hotel_name: "",
    starting_price: "",
    highest_price: "",
    ratings: "",
    max_adult: "",
    max_children: "",
    max_infant: "",
    no_of_bedrooms: "",
    no_of_bathrooms: "",
    no_of_beds: "",
    room_size: "",
    company_website: "",
    email: "",
    phone: "",
    zipcode: "",
    parking: "",
    banner_images: [],
    full_address: "",
    seo_title: "",
    seo_description: "",
    meta_title: "",
  });

  const [imageInput, setImageInput] = useState("");
  const [homeOrHomeStay, setHomeOrHomeStay] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [locations, setLocations] = useState<
    {
      location_name: any;
      name: string;
    }[]
  >([]);
  const [maxAdults, setMaxAdults] = useState("");
  const [maxChildren, setMaxChildren] = useState("");
  const [maxInfants, setMaxInfants] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedBedroom, setSelectedBedroom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);






  const handleCheckboxChange = (label: string) => {
    setSelectedAmenities((prevSelected) => {
      // Check if the label already exists in the array, then unselect or select
      if (prevSelected.includes(label)) {
        return prevSelected.filter((item) => item !== label); // Unselect
      } else {
        return [...prevSelected, label]; // Select
      }
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_location"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming the API returns an array of locations
        setLocations(data); // Adjust based on the actual structure of the API response
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_policy"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Policy[] = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };
    fetchPolicies();
  }, []);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_faq"
        );
        const data: FAQ[] = await response.json();
        setFAQs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setHomeOrHomeStay(e.target.value);
    setStatus(e.target.value);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([]);

  // Fetch hotel data using GET API
  useEffect(() => {
    const fetchHotelData = async () => {
      if (!hotelId) return; // Ensure hotelId is available
      try {
        const response = await axios.get(
          `https://yrpitsolutions.com/tourism_api/api/admin/hotels/${hotelId}`
        );
        const hotelData = response.data; // Assuming the data is in the 'data' field

        // Check if formData is already populated to prevent overwriting edited data
        if (!formData.property_id) {
          setDescription(hotelData.data.description);

          const amenitiesArray = [];
          for (let i = 1; i <= 30; i++) {
            const amenityName = hotelData.data[`amenity_name${i}`];
            const amenityLogo = hotelData.data[`amenity_logo${i}`];
            if (amenityName) {
              amenitiesArray.push({
                amenity_name: amenityName,
                amenity_logo: amenityLogo,
              });
            }
          }
          setAmenities(amenitiesArray); // Ensure amenities state is set
          setSelectedAmenities(amenitiesArray.map((item) => item.amenity_name));
          console.log("Transformed Amenities:", amenitiesArray);

          const faqsArray = [];
          for (let i = 1; i <= 30; i++) {
            const faqTitle = hotelData.data[`faq_title${i}`];
            const faqDescription = hotelData.data[`faq_description${i}`];
            if (faqTitle) {
              faqsArray.push({
                id: i,
                faq_title: faqTitle,
                faq_description: faqDescription || "",
              });
            }
          }
          setSelectedFAQs(faqsArray);

          const policyArray: Policy[] = [];
          for (let i = 1; i <= 30; i++) {
            const policyTitle = hotelData.data[`policy_title${i}`];
            const policyDescription = hotelData.data[`policy_description${i}`];
            if (policyTitle) {
              policyArray.push({
                id: i,
                policy_title: policyTitle,
                policy_description: policyDescription || "",
              });
            }
          }
          setSelectedPolicies(policyArray);


          // Prefill the form fields only if not already set
          setFormData({
            ...formData,
            property_id: hotelData.data.property_id,
            hotel_or_home_stay: hotelData.data.hotel_or_home_stay.toLowerCase(),
            location_name: hotelData.data.location_name,
            hotel_name: hotelData.data.hotel_name,
            description: hotelData.data.description,
            starting_price: hotelData.data.starting_price,
            highest_price: hotelData.data.highest_price,
            ratings: hotelData.data.ratings,
            max_adult: hotelData.data.max_adult,
            max_children: hotelData.data.max_children,
            max_infant: hotelData.data.max_infant,
            no_of_bedrooms: hotelData.data.no_of_bedrooms,
            no_of_bathrooms: hotelData.data.no_of_bathrooms,
            no_of_beds: hotelData.data.no_of_beds,
            room_size: hotelData.data.room_size,
            company_website: hotelData.data.company_website,
            email: hotelData.data.email,
            phone: hotelData.data.phone,
            zipcode: hotelData.data.zipcode,
            parking: hotelData.data.parking,
            banner_images: [], // Assuming the images come as an array
            full_address: hotelData.data.full_address,
            seo_title: hotelData.data.seo_title,
            seo_description: hotelData.data.seo_description,
            meta_title: hotelData.data.meta_title
          });

          // setSelectedAmenities(amenitiesArray.map((item) => item.amenity_name));
          setBannerImageUrls(hotelData.data.banner_images); // Storing URLs for display
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [hotelId]);



  const handleDeletePolicy = (policyId: number) => {
    // Remove the policy from the selectedPolicies state
    setSelectedPolicies((prev) =>
      prev.filter((policy) => policy.id !== policyId)
    );
  };

  const handleDeleteFAQ = (faqId: number) => {
    // Remove the policy from the selectedPolicies state
    setSelectedFAQs((prev) =>
      prev.filter((faq) => faq.id !== faqId)
    );
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    console.log("Form submitted");
    console.log("Token:", token);

    const formDataToSend = new FormData();

    // Append existing form data
    for (const key in formData) {
      if (key === "banner_images") {
        // Append each file individually
        formData.banner_images.forEach((file) => {
          formDataToSend.append("banner_images[]", file);
        });
      } else {
        formDataToSend.append(key, formData[key as keyof HotelFormData]); // Use type assertion
      }
    }

    // Append additional fields
    // formDataToSend.append("home_or_home_stay", homeOrHomeStay);
    formDataToSend.append("status", status);

    amenities
    .filter((amenity) => selectedAmenities.includes(amenity.amenity_name)) // Only selected amenities
    .forEach((amenity, index) => {
      formDataToSend.append(`amenity_name${index + 1}`, amenity.amenity_name);
      if (amenity.amenity_logo instanceof File) {
        formDataToSend.append(`amenity_logo${index + 1}`, amenity.amenity_logo);
      } else if (typeof amenity.amenity_logo === "string") {
        formDataToSend.append(`amenity_logo${index + 1}`, amenity.amenity_logo);
      }
    });

    // Append selected policies
    selectedPolicies.forEach((policy, index) => {
      formDataToSend.append(`policy_title${index + 1}`, policy.policy_title);
      formDataToSend.append(
        `policy_description${index + 1}`,
        policy.policy_description
      );
    });

    // Append selected FAQs
    selectedFAQs.forEach((faq, index) => {
      formDataToSend.append(`faq_title${index + 1}`, faq.faq_title);
      formDataToSend.append(`faq_description${index + 1}`, faq.faq_description);
    });

    // Append description in plain text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = description;
    const plainTextDescription = tempElement.textContent || tempElement.innerText || "";
    formDataToSend.append("description", plainTextDescription);

    // Add `_method` field to simulate PUT request via POST
    formDataToSend.append("_method", "PUT");

    setLoading(true);

    try {
      const response = await axios.post(
        `https://yrpitsolutions.com/tourism_api/api/admin/hotels/${hotelId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setTimeout(() => {
        alert("Hotel Details Updated!");
        router.push("/hotel/all-hotels");
      }, 100);


    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setTimeout(() => {
          alert(
            `Failed to add hotel: ${error.response?.data?.message || error.message}`
          );
        }, 100);

      }
    }

  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Get the FileList object
    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convert to array
      const fileUrls = fileArray.map((file) => URL.createObjectURL(file)); // Generate temporary URLs for preview

      // Update the state for form data and preview URLs
      setFormData((prevData) => ({
        ...prevData,
        banner_images: fileArray, // Update state with the file array
      }));

      setBannerImageUrls(fileUrls); // Update state for preview URLs
    }
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Hotel</h2>
        <div className="flex space-x-2">
          {" "}
          {/* Use flex and space-x-2 for horizontal spacing */}
          <Link
            href={`/hotel/manage-room?hotelId=${hotelId}`}
            className="btn-primary"
          >
            <EyeIcon className="w-5 h-5" /> Manage Room
          </Link>
          <Link href="/hotel/all-hotels" className="btn-primary">
            <EyeIcon className="w-5 h-5" /> View All Hotel
          </Link>
        </div>
      </div>
      {/* statisticts */}
      <div

        className=" grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0"
      >
        <div className="col-span-12 lg:col-span-6">
          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
              >
                <h3 className="h3">Hotel Content </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}
          >
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <div className="border-t pt-4">
                <p className="mt-6 mb-4 text-xl font-medium">Property ID : <span className="astrick">*</span></p>
                <input
                  type="text"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholder="Enter ID"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Type: <span className="astrick">*</span></p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hotel"
                      name="hotel_or_home_stay"
                      value="hotel" // Fixed value for the Hotel option
                      checked={formData.hotel_or_home_stay === "hotel"} // Check if this option is selected
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="hotel" className="text-base">
                      Hotel
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="homestay"
                      name="hotel_or_home_stay"
                      value="homestay" // Fixed value for the Homestay option
                      checked={formData.hotel_or_home_stay === "homestay"} // Check if this option is selected
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="homestay" className="text-base">
                      Homestay
                    </label>
                  </div>
                </div>

                <p className="mt-6 mb-4 text-xl font-medium">Name: <span className="astrick">*</span></p>
                <input
                  type="text"
                  id="hotel_name"
                  name="hotel_name"
                  value={formData.hotel_name}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Price:  <span className="astrick">*</span></p>
                <input
                  type="text"
                  id="starting_price"
                  name="starting_price"
                  value={formData.starting_price}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Sale Price: <span className="astrick">*</span></p>
                <input
                  type="text"
                  id="highest_price"
                  name="highest_price"
                  value={formData.highest_price}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                {/* <CustomRangeSlider /> */}

                <p className="mt-6 mb-4 text-xl font-medium">People <span className="astrick">*</span></p>
                <div className="flex space-x-4">
                  <div className="w-full flex flex-col">
                    <label htmlFor="adults" className="text-base">
                      Max Adults:
                    </label>
                    <input
                      type="text"
                      id="max_adult"
                      name="max_adult"
                      value={formData.max_adult}
                      onChange={handleChange}
                      className="w-full border p-2 focus:outline-none rounded-md text-base"
                      placeholder="Name of Hotel"
                    />

                  </div>
                  <div className="w-full flex flex-col">
                    <label htmlFor="children" className="text-base">
                      Max Children:
                    </label>
                    <input
                      type="text"
                      id="max_children"
                      name="max_children"
                      value={formData.max_children}
                      onChange={handleChange}
                      className="w-full border p-2 focus:outline-none rounded-md text-base"
                      placeholder="Name of Hotel"
                    />

                  </div>
                  <div className="w-full flex flex-col">
                    <label htmlFor="infants" className="text-base">
                      Max Infants:
                    </label>
                    <input
                      type="text"
                      id="max_infant"
                      name="max_infant"
                      value={formData.max_infant}
                      onChange={handleChange}
                      className="w-full border p-2 focus:outline-none rounded-md text-base"
                      placeholder="Name of Hotel"
                    />

                  </div>
                </div>

                <p className="mt-6 mb-4 text-xl font-medium">Description : <span className="astrick">*</span></p>
                <QuillEditor onChange={setDescription} value={description} />
                <p className="mt-3 mb-4 text-xl font-medium">Hotel Rating :<span className="astrick">*</span></p>
                <select
                  id="ratings"
                  name="ratings"
                  value={formData.ratings}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select Rating
                  </option>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>


              </div>
            </div>
          </Accordion>

          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}
              >
                <h3 className="h3">Hotel Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}
          >
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">Bedrooms: <span className="astrick">*</span></p>
              <input
                type="number"
                id="no_of_bedrooms"
                name="no_of_bedrooms"
                value={formData.no_of_bedrooms}
                onChange={handleChange}
                className="w-full border p-2 focus:outline-none rounded-md text-base"
                placeholder="5"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Bathrooms :<span className="astrick">*</span></p>
              <input
                type="number"
                id="no_of_bathrooms"
                name="no_of_bathrooms"
                value={formData.no_of_bathrooms}
                onChange={handleChange}
                className="w-full border p-2 focus:outline-none rounded-md text-base"
                placeholder="10"
              />


              <p className="mt-6 mb-4 text-xl font-medium">Room Size :<span className="astrick">*</span></p>
              <input
                type="text"
                name="room_size"
                id="room_size"
                value={formData.room_size}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="06"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Number of Beds :<span className="astrick">*</span></p>
              <input
                type="number"
                name="no_of_beds"
                id="no_of_beds"
                value={formData.no_of_beds}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="06"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Parking :<span className="astrick">*</span></p>
              <input
                type="text"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="yes/no"
              />
            </div>
          </Accordion>

          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between mt-[30px] items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
              >
                <h3 className="h3">Hotel Policy</h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}
          >
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              {policies.length > 0 ? (
                <div className="mb-4">
                  <label
                    htmlFor="policyDropdown"
                    className="text-lg font-bold mb-2 block"
                  >
                    Select a Policy
                  </label>
                  <select
                    id="policyDropdown"
                    className="w-full border p-2 rounded-md"
                    value=""  // Reset dropdown after selection
                    onChange={(e) => {
                      const selectedPolicy = policies.find(
                        (policy) => policy.id === parseInt(e.target.value)
                      );
                      if (
                        selectedPolicy &&
                        !selectedPolicies.some((p) => p.id === selectedPolicy.id)
                      ) {
                        setSelectedPolicies((prev) => [...prev, selectedPolicy]);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a policy...
                    </option>
                    {policies
                      .filter(
                        (policy) =>
                          !selectedPolicies.some(
                            (p) => p.id === policy.id || p.policy_title === policy.policy_title
                          )
                      )
                      .map((policy) => (
                        <option key={policy.id} value={policy.id}>
                          {policy.policy_title}
                        </option>
                      ))}
                  </select>


                </div>
              ) : (
                <p>No policies available</p>
              )}

              {/* Render input fields for each selected policy */}
              {selectedPolicies.map((policy) => (
                <div key={policy.id} className="mb-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="w-1/2 border p-2 rounded-md"
                      value={policy.policy_title}
                      readOnly
                    />
                    <input
                      type="text"
                      className="w-1/2 border p-2 rounded-md"
                      value={policy.policy_description}
                      onChange={(e) => {
                        const updatedPolicies = selectedPolicies.map((p) =>
                          p.id === policy.id
                            ? { ...p, policy_description: e.target.value }
                            : p
                        );
                        setSelectedPolicies(updatedPolicies);
                      }}
                    />
                    {/* Delete icon button */}
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between mt-[30px] items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
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
                    value=""  // Add this line to reset the dropdown after selection
                    onChange={(e) => {
                      const selectedFAQ = faqs.find(
                        (faq) => faq.id === parseInt(e.target.value)
                      );
                      if (
                        selectedFAQ &&
                        !selectedFAQs.some(
                          (f) => f.id === selectedFAQ.id || f.faq_title === selectedFAQ.faq_title
                        )
                      ) {
                        setSelectedFAQs((prev) => [...prev, selectedFAQ]);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a FAQ...
                    </option>
                    {faqs
                      .filter(
                        (faq) =>
                          !selectedFAQs.some(
                            (f) => f.id === faq.id || f.faq_title === faq.faq_title
                          )
                      )
                      .map((faq) => (
                        <option key={faq.id} value={faq.id}>
                          {faq.faq_title}
                        </option>
                      ))}
                  </select>


                </div>
              ) : (
                <p>No FAQs available</p>
              )}

              {/* Render input fields for each selected FAQ with delete icon */}
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
                          f.id === faq.id
                            ? { ...f, faq_description: e.target.value }
                            : f
                        );
                        setSelectedFAQs(updatedFAQs);
                      }}
                    />
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedFAQs((prev) =>
                          prev.filter((f) => f.id !== faq.id)
                        );
                      }}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
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
              initialOpen={true}
            >
              <div className="pt-6">
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
                      <span className="block text-center mb-6 clr-neutral-500">
                        OR
                      </span>
                      <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                        Select Files
                      </span>

                    </span>
                    <input
                      type="file"
                      id="dropzone-file"
                      className="hidden"
                      multiple // Allow multiple file selection
                      onChange={handleFileChange} // Handle file change
                    />

                  </label>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {bannerImageUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img src={url} alt={`Banner Image ${index + 1}`} className="object-cover w-full h-full rounded-md" />
                    </div>
                  ))}
                </div>

               
                <p className="mt-6 mb-4 text-xl font-medium">Full Address :<span className="astrick">*</span></p>
                <input
                  type="text"
                  id="full_address"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Address"
                />


                <p className="mt-6 mb-4 text-xl font-medium">Location :<span className="astrick">*</span></p>

                <select
                  id="location_name"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select a location
                  </option>
                  {locations.map((location, index) => (
                    <option key={index} value={location.location_name}>
                      {location.location_name} {/* Display the location_name */}
                    </option>
                  ))}
                </select>

              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
          <Accordion
  buttonContent={(open) => (
    <div className="rounded-2xl flex justify-between items-center">
      <h3 className="h3">Attributes</h3>
      <ChevronDownIcon
        className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
      />
    </div>
  )}
  initialOpen={true}
>
  <div className="pt-6">
    <p className="text-xl font-medium mb-4">Features:</p>
    {amenities.length === 0 ? (
      <p className="text-gray-500">No amenities available</p>
    ) : (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <li key={index} className="flex items-center">
            <CheckboxCustom
              label={amenity.amenity_name}
              onChange={() => handleCheckboxChange(amenity.amenity_name)}
              checked={selectedAmenities.includes(amenity.amenity_name)}
            />
          </li>
        ))}
      </ul>
    )}
  </div>
</Accordion>

          </div>

          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex justify-between">
                  <h3 className="h3">Contact Information </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="pt-6">
                <p className="mb-4 text-xl font-medium">Zip/Post Code :<span className="astrick">*</span></p>
                <input
                  type="number"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="123456"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Phone :<span className="astrick">*</span></p>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Number"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Email :<span className="astrick">*</span></p>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Email"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Website :<span className="astrick">*</span></p>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Website Name"
                />

              </div>
            </Accordion>
          </div>



          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex justify-between">
                  <h3 className="h3">SEO </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="pt-6">
                <p className="mt-6 mb-4 text-xl font-medium">URL Title :<span className="astrick">*</span></p>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="URL Title"
                />
                <p className="mt-6 mb-4 text-xl font-medium">SEO Description :</p>
                <input
                  type="text"
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="SEO Description"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Meta Title :</p>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Meta Title"
                />

              </div>
            </Accordion>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} className="btn-primary font-semibold ml-6 mb-6" disabled={loading}>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Updating...</span>
          </div>
        ) : (
          "Update Hotel"
        )}
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditHotel />
  </Suspense>
);

export default Page;
