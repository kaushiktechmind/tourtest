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
  package_faq_title: string;
  package_faq_description: string; // Assuming the correct spelling is 'package_faq_description'
}

interface Policy {
  id: number; // Change to the actual type based on your API response
  package_policy_title: string;
  package_policy_description: string; // Assuming the correct spelling is 'package_faq_description'
}

interface Amenity {
  id: number;
  package_attribute_name: string; // Ensure this matches your API response
  package_attribute_logo: string; // Add this if the API returns a logo
}

interface Location {
  id: number;
  location_name: string;
}


interface Itinerary {
  day: string;
  title: string;
  description: string;
  itinerary_images: File[]; // Assuming you want to store the files in this property
}


const AddNewPackage = () => {
  const router = useRouter();
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    {
      day: "",
      title: "",
      description: "",
      itinerary_images: []
    }
  ]);

  const [description, setDescription] = useState<string>("");
  const [formData, setFormData] = useState({
    package_title: "",
    package_content: "",
    tour_price: "",
    sale_price: "",
    status: "1",
    duration: "",
    tour_min_people: "",
    tour_max_people: "",
    pickup_point: "",
    person_type_description1: "",
    person_type_price1: "",
    person_min1: "",
    person_max1: "",
    person_type_name1: "",
    person_type_description2: "",
    person_type_price2: "",
    person_min2: "",
    person_max2: "",
    person_type_name2: "",
    person_type_description3: "",
    person_type_price3: "",
    person_min3: "",
    person_max3: "",
    person_type_name3: "",
    person_type_description4: "",
    person_type_price4: "",
    person_min4: "",
    person_max4: "",
    person_type_name4: "",
    person_type_description5: "",
    person_type_price5: "",
    person_min5: "",
    person_max5: "",
    person_type_name5: "",
    person_type_description6: "",
    person_type_price6: "",
    person_min6: "",
    person_max6: "",
    person_type_name6: "",
    itinerary: "",
    banner_image: "",
    seo_title: "",
    seo_description: "",
    meta_title: "",
    location_name: "",
    itinerary_images: [],
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bannerImages, setBannerImages] = useState<File[]>([]);

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]); // Changed type to Policy[]


  const [policies, setPolicies] = useState<Policy[]>([]); // State for FAQs
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]); // Changed type to Policy[]


  const [inclusions, setInclusions] = useState<{ id: number; include_title: string }[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<{ id: number; include_title: string }[]>([]);
  const [exclusions, setExclusions] = useState<{ id: number; exclude_title: string }[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<{ id: number; exclude_title: string }[]>([]);


  const personTypes = [
    "Adult",
    "Child",
    "Child",
    "Child",
    "Infant",
    "Infant",
  ];


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
    const fetchPolicies = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_package_policy"
        );
        const data: Policy[] = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Error fetching Policies:", error);
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


  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const updatedItineraries = [...itineraries];
      updatedItineraries[index].itinerary_images = Array.from(files); // Store the files in itinerary_images
      setItineraries(updatedItineraries);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };






  const handleRemoveInclusion = (index: number) => {
    const updatedInclusions = selectedInclusions.filter((_, i) => i !== index);
    setSelectedInclusions(updatedInclusions);
  };

  const handleRemoveExclusion = (index: number) => {
    const updatedExclusions = selectedExclusions.filter((_, i) => i !== index);
    setSelectedExclusions(updatedExclusions);
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
          "https://yrpitsolutions.com/tourism_api/api/admin/get_package_attribute"
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

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      const plainDescription = description.replace(/<[^>]*>/g, ""); // This removes HTML tags



      // Manually append each field from formData and plainDescription
      formDataToSend.append("package_title", formData.package_title);
      formDataToSend.append("package_content", plainDescription); // Save as plain text
      formDataToSend.append("tour_price", formData.tour_price);
      formDataToSend.append("sale_price", formData.sale_price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("tour_min_people", formData.tour_min_people);
      formDataToSend.append("tour_max_people", formData.tour_max_people);
      formDataToSend.append("pickup_point", formData.pickup_point);

      formDataToSend.append("person_type_description1", formData.person_type_description1);
      formDataToSend.append("person_type_price1", formData.person_type_price1);
      formDataToSend.append("person_max1", formData.person_max1);
      formDataToSend.append("person_min1", formData.person_min1);
      formDataToSend.append("person_type_name1", "Adult");

      formDataToSend.append("person_type_description2", formData.person_type_description2);
      formDataToSend.append("person_type_price2", formData.person_type_price2);
      formDataToSend.append("person_max2", formData.person_max2);
      formDataToSend.append("person_min2", formData.person_min2);
      formDataToSend.append("person_type_name2", "Child");

      formDataToSend.append("person_type_description3", formData.person_type_description3);
      formDataToSend.append("person_type_price3", formData.person_type_price3);
      formDataToSend.append("person_max3", formData.person_max3);
      formDataToSend.append("person_min3", formData.person_min3);
      formDataToSend.append("person_type_name3", "Child");

      formDataToSend.append("person_type_description4", formData.person_type_description4);
      formDataToSend.append("person_type_price4", formData.person_type_price4);
      formDataToSend.append("person_max4", formData.person_max4);
      formDataToSend.append("person_min4", formData.person_min4);
      formDataToSend.append("person_type_name4", "Child");

      formDataToSend.append("person_type_description5", formData.person_type_description5);
      formDataToSend.append("person_type_price5", formData.person_type_price5);
      formDataToSend.append("person_max5", formData.person_max5);
      formDataToSend.append("person_min5", formData.person_min5);
      formDataToSend.append("person_type_name5", "Infant");

      formDataToSend.append("person_type_description6", formData.person_type_description6);
      formDataToSend.append("person_type_price6", formData.person_type_price6);
      formDataToSend.append("person_max6", formData.person_max6);
      formDataToSend.append("person_min6", formData.person_min6);
      formDataToSend.append("person_type_name6", "Infant");

      formDataToSend.append("location_name", formData.location_name);
      formDataToSend.append("status", formData.status);

      formDataToSend.append("seo_title", formData.seo_title);
      formDataToSend.append("seo_description", formData.seo_description);
      formDataToSend.append("meta_title", formData.meta_title);

      formDataToSend.append("package_includes", JSON.stringify(selectedInclusions.map((inc) => inc.include_title)));
      formDataToSend.append("package_excludes", JSON.stringify(selectedExclusions.map((exc) => exc.exclude_title)));
      formDataToSend.append("amenities", JSON.stringify(selectedAmenities));

      const faqsData = selectedFAQs.map((faq) => ({
        question: faq.package_faq_title,
        answer: faq.package_faq_description,
      }));
      formDataToSend.append("package_faqs", JSON.stringify(faqsData));


      selectedPolicies.forEach((policy, index) => {
        formDataToSend.append(`package_policy_title${index + 1}`, policy.package_policy_title);
        formDataToSend.append(`package_policy_description${index + 1}`, policy.package_policy_description);
      });


      // Check if bannerImages is defined and is an array before using forEach
      if (Array.isArray(bannerImages)) {
        bannerImages.forEach((file) => {
          formDataToSend.append("banner_image[]", file);
        });
      } else {
        console.error('bannerImages is not defined or not an array');
      }

      // Check if itineraries is defined and is an array before using forEach
      if (Array.isArray(itineraries)) {
        itineraries.forEach((itinerary, index) => {
          if (Array.isArray(itinerary.itinerary_images)) {
            itinerary.itinerary_images.forEach((file) => {
              formDataToSend.append(`itinerary_images[${index}]`, file);
            });
          } else {
            console.error(`itinerary_images for itinerary ${index} is not defined or not an array`);
          }
        });
      } else {
        console.error('itineraries is not defined or not an array');
      }



      const formattedItineraries = itineraries.map((itinerary, index) => ({
        day: index + 1,
        title: itinerary.title,
        description: itinerary.description.replace(/<[^>]*>/g, "").trim(),

      }));

      // Append itinerary data as a JSON string
      formDataToSend.append("itinerary", JSON.stringify(formattedItineraries));

      // Send the request with FormData
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_package", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' should not be set manually when using FormData
        },
        body: formDataToSend, // Send the FormData object
      });

      if (response.ok) {
        const data = await response.json();
        alert("Package saved successfully!");
        router.push("/package/all-package");
      } else {
        alert("Failed to save package.");
      }
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };




  const handleInputChange = (index: number, field: string, value: string) => {
    const newItineraries = [...itineraries];
    (newItineraries[index] as any)[field] = value;
    setItineraries(newItineraries);
  };

  const addNewItinerary = () => {
    if (itineraries.length < 5) {
      setItineraries([
        ...itineraries,
        { day: "", title: "", description: "", itinerary_images: [] }
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
                placeholder=""
              />

              <p className="mt-6 mb-4 text-xl font-medium">Min People :</p>
              <input
                type="number"
                name="tour_min_people"
                value={formData.tour_min_people}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />
              <p className="mt-6 mb-4 text-xl font-medium">Duration</p>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder=""
              />
              <p className="mt-6 mb-4 text-xl font-medium">Pickup Point :</p>
              <input
                type="text"
                name="pickup_point"
                value={formData.pickup_point}
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
                    <th className="border border-gray-200 px-4 py-2">Description</th>
                    <th className="border border-gray-200 px-4 py-2">Min</th>
                    <th className="border border-gray-200 px-4 py-2">Max</th>
                    <th className="border border-gray-200 px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {personTypes.map((type, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="text"
                          name={`person_type_name${index + 1}`}
                          value={type} // Prefilled with static value
                          readOnly // Prevents editing
                          className="w-full border py-1 px-2 rounded-md text-sm bg-gray-100 focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="text"
                          name={`person_type_description${index + 1}`}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`person_min${index + 1}`}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`person_max${index + 1}`}
                          onChange={handleChange}
                          className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="number"
                          name={`person_type_price${index + 1}`}
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
          <div className="rounded-2xl bg-white border mt-6">
            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
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
                  value=""
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
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={inclusion.include_title}
                        onChange={(e) => handleEditInclusion(index, e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion>

          </div>
          <div className="rounded-2xl bg-white border mt-6">
            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}
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
                  value=""
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

                {/* Render selected exclusions */}
                <div className="mt-4 space-y-4">
                  {selectedExclusions.map((exclusion, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={exclusion.exclude_title}
                        onChange={(e) => handleEditExclusion(index, e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
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
                          {policy.package_policy_title}
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
                      value={policy.package_policy_title}
                      readOnly
                    />
                    <input
                      type="text"
                      className="w-1/2 border p-2 rounded-md"
                      value={policy.package_policy_description}
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
                  <div key={faq.id} className="mb-4 flex items-center gap-4">
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
                    {/* Trash Icon for deleting FAQ */}
                    <button
                      onClick={() =>
                        setSelectedFAQs((prev) => prev.filter((f) => f.id !== faq.id))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-6 h-6" />
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
                          label={item.package_attribute_name}
                          onChange={() => handleCheckboxChange(item.package_attribute_name)} // Use the amenity name
                          checked={selectedAmenities.includes(item.package_attribute_name)} // Check if selected
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Accordion>
          </div>


          <div className="col-span-12 lg:col-span-6 mt-6">
            <Accordion
              buttonContent={(open) => (
                <div
                  className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                    } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                  <h3 className="h3">SEO </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                      }`}
                  />
                </div>
              )}
              initialOpen={true}>
              <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                <div className="border-t pt-4">
                  <p className="mt-6 mb-4 text-xl font-medium">URL Name   :</p>
                  <input
                    type="text"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md text-base"
                    placeholder="url name"
                  />
                  <p className="mt-6 mb-4 text-xl font-medium">SEO Description  :</p>
                  <input
                    type="text"
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md text-base"
                    placeholder="seo description"
                  />

                  <p className="mt-6 mb-4 text-xl font-medium">Meta Title :</p>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md text-base"
                    placeholder="meta title"
                  />
                </div>
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
          initialOpen={true}
        >
          <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
            {itineraries.map((itinerary, index) => (
              <div key={index} className="mb-6 p-4 border rounded-md">
                {/* Day Centered */}
                <div className="w-full text-center mb-4">
                  <input
                    type="text"
                    value={`Day ${index + 1}`}
                    readOnly
                    className="border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base bg-gray-100 text-center"
                  />
                </div>

                {/* Title & Image Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={itinerary.title}
                      onChange={(e) => handleInputChange(index, "title", e.target.value)}
                      className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium ">Image</label>
                    <label
                      htmlFor={`dropzone-file-${index}`}
                      className=""
                    >
                      <span className="flex flex-col items-center justify-center py-1">
                      </span>
                      <input
                        id={`dropzone-file-${index}`}
                        type="file"
                        onChange={(e) => handleImageChange(index, e)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      />
                    </label>
                  </div>
                </div>

                {/* Description Section */}
                <div className="w-full mt-6">
                  <p className="mb-4 text-xl font-medium">Itinerary Description :</p>
                  <QuillEditor
                    onChange={(value) => handleInputChange(index, "description", value)}
                    value={itinerary.description || ""}
                  />
                </div>

                {/* Delete Button */}
                {itineraries.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => deleteItinerary(index)}
                      className="text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Itinerary Button */}
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

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AddNewPackage />
  </Suspense>
);

export default Page;  