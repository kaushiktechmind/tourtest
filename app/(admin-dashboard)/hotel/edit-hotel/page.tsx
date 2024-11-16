"use client";
import {
  ChevronDownIcon,
  CloudArrowUpIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import dynamic from "next/dynamic";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CustomRangeSlider from "@/components/RangeSlider";
import Accordion from "@/components/Accordion";
import SelectUI from "@/components/SelectUI";
import CheckboxCustom from "@/components/Checkbox";
import QuillEditor from "../../../../components/QuillEditor";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
interface Amenity {
  id: number;
  amenity_name: string; // Ensure this matches your API response
  amenity_logo: string; // Add this if the API returns a logo
}

interface Policy {
  id: number; // Use number if your API returns numeric IDs
  policy_title: string;
  policy_decription: string; // Corrected spelling from 'policy_decription' to 'policy_decription'
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
  video_link: string;
  full_address: string;
  i_frame_link: string;
}

const Page = () => {
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
    // description: "",
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
    video_link: "",
    full_address: "",
    i_frame_link: "",
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

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]); // Changed type to Policy[]

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]); // Changed type to Policy[]
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  const [educationFields, setEducationFields] = useState<Field[]>([
    { name: "", content: "", distance: "" },
  ]);
  const [healthFields, setHealthFields] = useState<Field[]>([
    { name: "", content: "", distance: "" },
  ]);
  const [transportationFields, setTransportationFields] = useState<Field[]>([
    { name: "", content: "", distance: "" },
  ]);

  // Handler to add new input row (max 5)
  const handleAddRow = (
    fields: Field[],
    setFields: React.Dispatch<React.SetStateAction<Field[]>>
  ) => {
    if (fields.length < 5) {
      setFields([...fields, { name: "", content: "", distance: "" }]);
    }
  };

  // Handler to update input fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fields: Field[],
    setFields: React.Dispatch<React.SetStateAction<Field[]>>
  ) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setFields(updatedFields);
  };
  const formatDataForApi = () => {
    const formattedData: any = {};

    educationFields.forEach((field, index) => {
      formattedData[`education_name${index + 1}`] = field.name;
      formattedData[`education_content${index + 1}`] = field.content;
      formattedData[`education_distance${index + 1}`] = field.distance;
    });

    healthFields.forEach((field, index) => {
      formattedData[`health_name${index + 1}`] = field.name;
      formattedData[`health_content${index + 1}`] = field.content;
      formattedData[`health_distance${index + 1}`] = field.distance;
    });

    transportationFields.forEach((field, index) => {
      formattedData[`transport_name${index + 1}`] = field.name;
      formattedData[`transport_content${index + 1}`] = field.content;
      formattedData[`transport_distance${index + 1}`] = field.distance;
    });

    return formattedData;
  };

  // Render input rows
  const renderInputRows = (fields, setFields) => {
    return fields.map((field, index) => (
      <div key={index} className="flex gap-4 mb-4">
        <input
          type="text"
          className="w-1/3 border p-2 rounded-md"
          value={field.name}
          placeholder="Name"
          onChange={(e) => {
            const updatedFields = [...fields];
            updatedFields[index].name = e.target.value;
            setFields(updatedFields);
          }}
        />
        <input
          type="text"
          className="w-1/3 border p-2 rounded-md"
          value={field.content}
          placeholder="Content"
          onChange={(e) => {
            const updatedFields = [...fields];
            updatedFields[index].content = e.target.value;
            setFields(updatedFields);
          }}
        />
        <input
          type="text"
          className="w-1/3 border p-2 rounded-md"
          value={field.distance}
          placeholder="Distance"
          onChange={(e) => {
            const updatedFields = [...fields];
            updatedFields[index].distance = e.target.value;
            setFields(updatedFields);
          }}
        />
      </div>
    ));
  };
  

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
        console.log("yeahhhhhhhhh", hotelData.data.description);
        setDescription(hotelData.data.description);
        const amenitiesArray = [];
        for (let i = 1; i <= 30; i++) {  // Assuming there are up to 7 amenities
          const amenityName = hotelData.data[`amenity_name${i}`];
          const amenityLogo = hotelData.data[`amenity_logo${i}`];

          if (amenityName) {
            amenitiesArray.push({
              amenity_name: amenityName,
              amenity_logo: amenityLogo,
            });
          }
        }
        console.log("Transformed Amenities:", amenitiesArray);

        const faqsArray = [];
        for (let i = 1; i <= 30; i++) {
          const faqTitle = hotelData.data[`faq_title${i}`];
          const faqDescription = hotelData.data[`faq_description${i}`];
          if (faqTitle) {
            faqsArray.push({
              id: i, // Use the index as an id if there's no unique id
              faq_title: faqTitle,
              faq_description: faqDescription || "",
            });
          }
        }
        setSelectedFAQs(faqsArray);

        const policyArray = [];
        for (let i = 1; i <= 30; i++) {
          const policyTitle = hotelData.data[`policy_title${i}`];
          const policyDescription = hotelData.data[`policy_description${i}`];
  
          if (policyTitle) {
            policyArray.push({
              id: i, // Using index as id for unique key
              policy_title: policyTitle,
              policy_description: policyDescription || "", // Maintain exact field name
            });
          }
        }
        setSelectedPolicies(policyArray);

        const educationFieldsArray = [];
        for (let i = 1; i <= 5; i++) {
          const educationName = hotelData.data[`education_name${i}`];
          const educationContent = hotelData.data[`education_content${i}`];
          const educationDistance = hotelData.data[`education_distance${i}`];
  
          if (educationName) {
            educationFieldsArray.push({
              name: educationName,
              content: educationContent || "",
              distance: educationDistance || "",
            });
          }
        }

        
        const healthFieldsArray = [];
        for (let i = 1; i <= 5; i++) {
          const healthName = hotelData.data[`health_name${i}`];
          const healthContent = hotelData.data[`health_content${i}`];
          const healthDistance = hotelData.data[`health_distance${i}`];
  
          if (healthName) {
            healthFieldsArray.push({
              name: healthName,
              content: healthContent || "",
              distance: healthDistance || "",
            });
          }
        }

        const transportFieldsArray = [];
        for (let i = 1; i <= 5; i++) {
          const transportName = hotelData.data[`transport_name${i}`];
          const transportContent = hotelData.data[`transport_content${i}`];
          const transportDistance = hotelData.data[`transport_distance${i}`];
  
          if (transportName) {
            transportFieldsArray.push({
              name: transportName,
              content: transportContent || "",
              distance: transportDistance || "",
            });
          }
        }


        
  
        // Set the prefilled education fields
        setEducationFields(educationFieldsArray);
        setHealthFields(healthFieldsArray);
        setTransportationFields(transportFieldsArray);

        // Prefill the form fields
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
          video_link: hotelData.data.video_link,
          full_address: hotelData.data.full_address,
          i_frame_link: hotelData.data.i_frame_link,
        });
        setSelectedAmenities(amenitiesArray.map(item => item.amenity_name));
        // Store image URLs for rendering
        setBannerImageUrls(hotelData.data.banner_images); // Storing URLs for display
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [hotelId]); // Run this effect when hotelId changes











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

    // Append selected amenities
    selectedAmenities.forEach((amenity, index) => {
      formDataToSend.append(`amenity_name${index + 1}`, amenity);
    });

    // Append Education Fields
    educationFields.forEach((field, index) => {
      formDataToSend.append(`education_name${index + 1}`, field.name);
      formDataToSend.append(`education_content${index + 1}`, field.content);
      formDataToSend.append(`education_distance${index + 1}`, field.distance);
    });

    // Append Health Fields
    healthFields.forEach((field, index) => {
      formDataToSend.append(`health_name${index + 1}`, field.name);
      formDataToSend.append(`health_content${index + 1}`, field.content);
      formDataToSend.append(`health_distance${index + 1}`, field.distance);
    });

    // Append Transportation Fields
    transportationFields.forEach((field, index) => {
      formDataToSend.append(`transport_name${index + 1}`, field.name);
      formDataToSend.append(`transport_content${index + 1}`, field.content);
      formDataToSend.append(`transport_distance${index + 1}`, field.distance);
    });

    // Append selected policies
    selectedPolicies.forEach((policy, index) => {
      formDataToSend.append(`policy_title${index + 1}`, policy.policy_title);
      formDataToSend.append(`policy_decription${index + 1}`, policy.policy_decription);
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
      console.log("API Response:", response.data);
      alert("Hotel Details Updated");
      router.push("/hotel/all-hotels"); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
        console.error("Axios error response:", error.response);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
      } else {
        console.error("Unexpected error", error);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Get the FileList object
    if (files) {
      const fileArray = Array.from(files); // Convert to array
      setFormData((prevData) => ({
        ...prevData,
        banner_images: fileArray, // Update state with the file array
      }));
    }
  };

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
      <form
        onSubmit={handleSubmit}
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
                <p className="mt-6 mb-4 text-xl font-medium">Property ID :</p>
                <input
                  type="text"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholder="Enter ID"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Type:</p>
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

                <p className="mt-6 mb-4 text-xl font-medium">Name:</p>
                <input
                  type="text"
                  id="hotel_name"
                  name="hotel_name"
                  value={formData.hotel_name}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
                <input
                  type="text"
                  id="starting_price"
                  name="starting_price"
                  value={formData.starting_price}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Name of Hotel"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Sale Price:</p>
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

                <p className="mt-6 mb-4 text-xl font-medium">People</p>
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
                    {/* <SelectUI
                      options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}
                    /> */}
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
                    {/* <SelectUI
                      options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}

                    /> */}
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
                    {/* <SelectUI
                      options={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }, { name: "7" }, { name: "8" }, { name: "9" }]}

                    /> */}
                  </div>
                </div>

                <p className="mt-6 mb-4 text-xl font-medium">Description :</p>
                <QuillEditor onChange={setDescription} value={description} />
                <p className="mt-3 mb-4 text-xl font-medium">Hotel Rating :</p>
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

                {/* <SelectUI
                  options={[
                    { name: "1" },
                    { name: "2" },
                    { name: "3" },
                    { name: "4" },
                    { name: "5" },
                  ]}
                /> */}
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
              <p className="mb-4 text-xl font-medium">Bedrooms:</p>
              <input
                type="text"
                id="no_of_bedrooms"
                name="no_of_bedrooms"
                value={formData.no_of_bedrooms}
                onChange={handleChange}
                className="w-full border p-2 focus:outline-none rounded-md text-base"
                placeholder="5"
              />
              {/* <SelectUI
                options={[{ name: "1" }, { name: "2" }, { name: "3" }]}
              // onSelect={(option) => setSelectedBedroom(option.name)} // Set selected bedroom count
              /> */}
              <p className="mt-6 mb-4 text-xl font-medium">Bathrooms :</p>
              <input
                type="text"
                id="no_of_bathrooms"
                name="no_of_bathrooms"
                value={formData.no_of_bathrooms}
                onChange={handleChange}
                className="w-full border p-2 focus:outline-none rounded-md text-base"
                placeholder="10"
              />
              {/* <SelectUI
                options={[{ name: "1" }, { name: "2" }, { name: "3" }]}
              /> */}

              <p className="mt-6 mb-4 text-xl font-medium">Room Size :</p>
              <input
                type="text"
                name="room_size"
                id="room_size"
                value={formData.room_size}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="06"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Number of Beds :</p>
              <input
                type="text"
                name="no_of_beds"
                id="no_of_beds"
                value={formData.no_of_beds}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="06"
              />
              <p className="mt-6 mb-4 text-xl font-medium">Parking :</p>
              <input
                type="text"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="3"
              />
            </div>
          </Accordion>

          <Accordion 
  buttonContent={(open) => (
    <div
      className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between mt-[30px] items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
    >
      <h3 className="h3">Hotel Policy</h3>
      <ChevronDownIcon className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`} />
    </div>
  )}
  initialOpen={true}
>
  <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
    {policies.length > 0 ? (
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
            if (
              selectedPolicy &&
              !selectedPolicies.some((p) => p.id === selectedPolicy.id)
            ) {
              setSelectedPolicies((prev) => [...prev, selectedPolicy]);
            }
          }}
        >
          <option value="" disabled selected>
            Select a policy...
          </option>
          {policies.map((policy) => (
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
            value={policy.policy_description} // Use 'policy_description' directly
            onChange={(e) => {
              const updatedPolicies = selectedPolicies.map((p) =>
                p.id === policy.id
                  ? { ...p, policy_description: e.target.value }
                  : p
              );
              setSelectedPolicies(updatedPolicies);
            }}
          />
        </div>
      </div>
    ))}
  </div>
</Accordion>


          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between mt-[30px] items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
              >
                <h3 className="h3">Hotel FAQ</h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                />
              </div>
            )}
            initialOpen={true}
          >
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              {selectedFAQs.map((faq) => (
                <div key={faq.id} className="mb-4">
                  <div className="flex gap-4">
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
                  </div>
                </div>
              ))}
            </div>
          </Accordion>


          <Accordion
            buttonContent={(open) => (
              <div
                className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                  } flex justify-between items-center p-4 md:p-6 lg:p-8 mt-6 duration-500 bg-white`}
              >
                <h3 className="h3">Sorroundings</h3>
              </div>
            )}
            initialOpen={true}
          >
           <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
  {/* Education Section */}
  <p className="mt-6 mb-4 text-xl font-medium">Education:</p>
  {renderInputRows(educationFields, setEducationFields)}
  {educationFields.length < 5 && (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleAddRow(educationFields, setEducationFields);
      }}
      className="text-blue-500 hover:underline"
    >
      + Add Item
    </button>
  )}

  {/* Health Section */}
  <p className="mt-6 mb-4 text-xl font-medium">Health:</p>
  {renderInputRows(healthFields, setHealthFields)}
  {healthFields.length < 5 && (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleAddRow(healthFields, setHealthFields);
      }}
      className="text-blue-500 hover:underline"
    >
      + Add Item
    </button>
  )}

  {/* Transportation Section */}
  <p className="mt-6 mb-4 text-xl font-medium">Transportation:</p>
  {renderInputRows(transportationFields, setTransportationFields)}
  {transportationFields.length < 5 && (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleAddRow(transportationFields, setTransportationFields);
      }}
      className="text-blue-500 hover:underline"
    >
      + Add Item
    </button>
  )}
</div>

          </Accordion>

          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <div className="">
              <p className=" mb-3 text-xl font-medium">Status:</p>
              <div className="flex flex-col gap-2">
                {" "}
                {/* Change to flex-col for vertical stacking */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="publish"
                    name="status"
                    value="publish"
                    className="mr-2"
                  />
                  <label htmlFor="hotel" className="text-base">
                    Publish
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="draft"
                    name="status"
                    value="draft"
                    className="mr-2"
                  />
                  <label htmlFor="homestay" className="text-base">
                    Draft
                  </label>
                </div>
              </div>
            </div>
          </div>

          <Link href="#" className="btn-primary font-semibold mt-6">
            <span className="inline-block" onClick={handleSubmit}>
              {" "}
              Save & Preview{" "}
            </span>
          </Link>
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
                    <input
                      type="file"
                      id="dropzone-file"
                      className="hidden"
                      multiple // Allow multiple file selection
                      onChange={handleFileChange} // Handle file change
                    />
                    <div className="flex flex-wrap gap-4">
                      {bannerImageUrls.map((url, index) => (
                        <div key={index} className="w-32 h-32">
                          <img src={url} alt={`Banner Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </label>
                </div>
                <p className="mt-6 mb-4 text-xl font-medium">Video Link :</p>
                <input
                  type="text"
                  name="video_link"
                  value={formData.video_link}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholder="3"
                />
                {/* <div className="mt-6">
                  <div className="h-[400px]">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2233.5934788396344!2d89.78232001463437!3d23.836268639364576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1688381345276!5m2!1sen!2sbd"></iframe>
                  </div>
                </div> */}
                <p className="mt-6 mb-4 text-xl font-medium">
                  Map Address (Script) :
                </p>
                <input
                  type="text"
                  name="i_frame_link"
                  value={formData.i_frame_link}
                  onChange={handleChange}
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholder="3"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Full Address :</p>
                <input
                  type="text"
                  id="full_address"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Address"
                />

                <p className="mt-6 mb-4 text-xl font-medium">Location :</p>

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

                {/* <SelectUI
                  options={locations.map(location => ({ name: location.location_name }))} // Map the location data to the expected format
                /> */}
              </div>
            </Accordion>
          </div>
          <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className="rounded-2xl flex justify-between">
                  <h3 className="h3">Attributes</h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}
            >
              <div className="pt-6">
                <p className="text-xl font-medium">Features:</p>
                {amenities.length === 0 ? (
                  <p>No amenities available</p>
                ) : (
                  <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                    {amenities.map((item) => (
                      <li key={item.amenity_name} className="py-2">
                        <CheckboxCustom
                          label={item.amenity_name} // Use amenity_name for the checkbox label
                          // img={
                          //   item.amenity_logo ? (
                          //     <img
                          //       src={item.amenity_logo}
                          //       alt={item.amenity_name}
                          //       className="w-5 h-5"
                          //     />
                          //   ) : null
                          // }
                          onChange={() => handleCheckboxChange(item.amenity_name)} // Call the handler
                          checked={selectedAmenities.includes(item.amenity_name)} // Set checked state
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
                <p className="mb-4 text-xl font-medium">Zip/Post Code :</p>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="4"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Phone :</p>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Number"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Email :</p>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter Email"
                />
                <p className="mt-6 mb-4 text-xl font-medium">Website :</p>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  className="w-full border p-2 focus:outline-none rounded-md text-base"
                  placeholder="Enter website"
                />
                
              </div>
            </Accordion>
          </div>
        </div>
      </form>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
