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


interface Location {
  id: number;
  location_name: string;
}

interface Amenity {
  id: number;
  package_attribute_name: string; // Ensure this matches your API response
  package_attribute_logo: string; // Add this if the API returns a logo
}

interface Itinerary {
  day: string;
  title: string;
  description: string;
  itinerary_images: File[]; // Store the images in this array
}


const EditPackage = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    { day: "", title: "", description: "", itinerary_images: [] }
  ]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

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
    location_name: "",
    itinerary_images: [],
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bannerImages, setBannerImages] = useState<(File | string)[]>([]);

  const [policies, setPolicies] = useState<Policy[]>([]); // State for FAQs
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);


  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]);
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
        console.log("Inclusions fetched:", data); // Debug: Log the inclusions data
        if (Array.isArray(data)) {
          setInclusions(data); // Ensure the data is an array and set it to state
        } else {
          console.error("Invalid data format for inclusions:", data);
        }
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


  const handleRemoveInclusion = (index: number) => {
    const updatedInclusions = selectedInclusions.filter((_, i) => i !== index);
    setSelectedInclusions(updatedInclusions);
  };


  const handleRemoveExclusion = (index: number) => {
    const updatedExclusions = selectedExclusions.filter((_, i) => i !== index);
    setSelectedExclusions(updatedExclusions);
  };




  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_package_by_id/${packageId}`);
        const data = await response.json();

        setBannerImages(data.banner_image || []);

        if (data.package_faqs) {
          const parsedFAQs = JSON.parse(data.package_faqs).map((faq: { id: any; question: any; answer: any; }, index: number) => ({
            id: faq.id || Date.now() + index, // Ensure a unique ID
            package_faq_title: faq.question,
            package_faq_description: faq.answer,
          }));
          setSelectedFAQs(parsedFAQs);
        }


        // Prefill Policies
        const policyData = [];
        for (let i = 1; i <= 10; i++) {
          if (data[`package_policy_title${i}`] && data[`package_policy_description${i}`]) {
            policyData.push({
              id: i,
              package_policy_title: data[`package_policy_title${i}`],
              package_policy_description: data[`package_policy_description${i}`]
            });
          }
        }
        setSelectedPolicies(policyData);

        const parsedItineraries = JSON.parse(data.itinerary);
        setItineraries(
          parsedItineraries.map((item: any) => ({
            day: item.day,
            title: item.title,
            description: item.description,
            image: item.image
          }))
        );

        if (data.package_content) {
          setDescription(data.package_content); // Set the description from the API
        }

        if (data.amenities) {
          const parsedAmenities = JSON.parse(data.amenities); // Parse the JSON string into an array
          setSelectedAmenities(parsedAmenities); // Prefill selected amenities
        }

        // Handling inclusions
        if (data.package_includes) {
          const packageIncludes = JSON.parse(data.package_includes);
          console.log("Parsed package_includes:", packageIncludes);

          const preFilledInclusions = inclusions.filter((inc) =>
            packageIncludes.includes(inc.include_title)
          );
          console.log("Pre-filled inclusions:", preFilledInclusions);

          setSelectedInclusions(preFilledInclusions);
        }

        // Handling exclusions
        if (data.package_excludes) {
          const packageExcludes = JSON.parse(data.package_excludes);
          console.log("Parsed package_excludes:", packageExcludes);

          // Pre-fill exclusions based on the fetched package data
          const preFilledExclusions = exclusions.filter((ex) =>
            packageExcludes.includes(ex.exclude_title)
          );
          console.log("Pre-filled exclusions:", preFilledExclusions);

          setSelectedExclusions(preFilledExclusions);
        }

        // Prefill formData with the API response
        setFormData((prevState) => ({
          ...prevState,
          package_title: data.package_title || "",
          package_content: data.package_content || "",
          tour_price: data.tour_price || "",
          sale_price: data.sale_price || "",
          duration: data.duration || "",
          tour_min_people: data.tour_min_people || "",
          tour_max_people: data.tour_max_people || "",
          pickup_point: data.pickup_point || "",
          location_name: data.location_name || "",

          person_type_name1:  "Adult",
          person_type_description1: data.person_type_description1 || "",
          person_min1: data.person_min1 || "",
          person_max1: data.person_max1 || "",
          person_type_price1: data.person_type_price1 || "",

          person_type_name2: "Child",
          person_type_description2: data.person_type_description2 || "",
          person_min2: data.person_min2 || "",
          person_max2: data.person_max2 || "",
          person_type_price2: data.person_type_price2 || "",

          person_type_name3: "Child",
          person_type_description3: data.person_type_description3 || "",
          person_min3: data.person_min3 || "",
          person_max3: data.person_max3 || "",
          person_type_price3: data.person_type_price3 || "",

          person_type_name4: "Child",
          person_type_description4: data.person_type_description4 || "",
          person_min4: data.person_min4 || "",
          person_max4: data.person_max4 || "",
          person_type_price4: data.person_type_price4 || "",

          person_type_name5: "Infant",
          person_type_description5: data.person_type_description5 || "",
          person_min5: data.person_min5 || "",
          person_max5: data.person_max5 || "",
          person_type_price5: data.person_type_price5 || "",

          person_type_name6: "Infant",
          person_type_description6: data.person_type_description6 || "",
          person_min6: data.person_min6 || "",
          person_max6: data.person_max6 || "",
          person_type_price6: data.person_type_price6 || "",

          // Add other fields as necessary
        }));
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    fetchPackageData();
  }, [packageId, inclusions, exclusions]);


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

      formDataToSend.append("package_includes", JSON.stringify(selectedInclusions.map((inc) => inc.include_title)));
      formDataToSend.append("package_excludes", JSON.stringify(selectedExclusions.map((exc) => exc.exclude_title)));
      formDataToSend.append("amenities", JSON.stringify(selectedAmenities));

      formDataToSend.append("_method", "PUT");

      const faqsData = selectedFAQs.map((faq) => ({
        question: faq.package_faq_title,
        answer: faq.package_faq_description,
      }));
      formDataToSend.append("package_faqs", JSON.stringify(faqsData));


      selectedPolicies.forEach((policy, index) => {
        formDataToSend.append(`package_policy_title${index + 1}`, policy.package_policy_title);
        formDataToSend.append(`package_policy_description${index + 1}`, policy.package_policy_description);
      });


      // If new files are selected, add them; otherwise, send an empty array
      if (bannerImages.length > 0 && bannerImages[0] instanceof File) {
        bannerImages.forEach((file) => {
          formDataToSend.append("banner_image[]", file);
        });
      } else {
        formDataToSend.append("banner_image[]", ""); // Clear existing images if no new ones are provided
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
      const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_package_by_id/${packageId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' should not be set manually when using FormData
        },
        body: formDataToSend, // Send the FormData object
      });

      if (response.ok) {
        const data = await response.json();
        alert("Package Updated successfully!");
        // router.push("/package/all-package");
        console.log(data);
      } else {
        alert("Failed to Update package.");
      }
    } catch (error) {
      console.error("Error Update package:", error);
    }
  };




  const handleInputChange = (index: number, field: keyof Itinerary, value: string) => {
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
                    <th className="border border-gray-200 px-4 py-2">Description</th>
                    <th className="border border-gray-200 px-4 py-2">Min</th>
                    <th className="border border-gray-200 px-4 py-2">Max</th>
                    <th className="border border-gray-200 px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, index) => {
                    const personIndex = index + 1;
                    return (
                      <tr key={index}>
                        <td className="border border-gray-200 px-4 py-2">
                          <input
                            type="text"
                            name={`person_type_name${personIndex}`}
                            value={formData[`person_type_name${personIndex}` as keyof typeof formData] || ""}
                            onChange={handleChange}
                            className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <input
                            type="text"
                            name={`person_type_description${personIndex}`}
                            value={formData[`person_type_description${personIndex}`  as keyof typeof formData] || ""}
                            onChange={handleChange}
                            className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <input
                            type="number"
                            name={`person_min${personIndex}`}
                            value={formData[`person_min${personIndex}`  as keyof typeof formData] || ""}
                            onChange={handleChange}
                            className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <input
                            type="number"
                            name={`person_max${personIndex}`}
                            value={formData[`person_max${personIndex}`  as keyof typeof formData] || ""}
                            onChange={handleChange}
                            className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <input
                            type="number"
                            name={`person_type_price${personIndex}`}
                            value={formData[`person_type_price${personIndex}`  as keyof typeof formData] || ""}
                            onChange={handleChange}
                            className="w-full border py-1 px-2 rounded-md text-sm focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
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
                        <span className="h3 clr-neutral-500 text-center mt-4 mb-3">Drag & Drop</span>
                        <span className="block text-center mb-6 clr-neutral-500">OR</span>
                        <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                          Select Files
                        </span>
                        <span className="h5 clr-neutral-500 text-center mt-4 mb-3">Select Minimum 6 Files</span>
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

                  <div>
                    {bannerImages.length > 0 &&
                      (bannerImages[0] instanceof File ? (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold">Selected Images</h3>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {bannerImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image as File)}
                                  alt={`Selected Image ${index + 1}`}
                                  className="w-[150px] h-[150px] object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold">Existing Banner Images</h3>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {bannerImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image as string}
                                  alt={`Banner Image ${index + 1}`}
                                  className="w-[150px] h-[150px] object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
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
                  {inclusions
                    .filter(
                      (inclusion) =>
                        !selectedInclusions.some(
                          (selected) => selected.include_title === inclusion.include_title
                        )
                    )
                    .map((inclusion) => (
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
                  {exclusions
                    .filter(
                      (exclusion) =>
                        !selectedExclusions.some(
                          (selected) => selected.exclude_title === exclusion.exclude_title
                        )
                    )
                    .map((exclusion) => (
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
                {policies.length > 0 ? (
                  <div className="mb-4">
                    <label htmlFor="policyDropdown" className="text-lg font-bold mb-2 block">
                      Select a Policy
                    </label>
                    <select
                      id="policyDropdown"
                      className="w-full border p-2 rounded-md"
                      value="" // Ensures the default state
                      onChange={(e) => {
                        const selectedPolicy = policies.find(
                          (policy) => policy.id === parseInt(e.target.value)
                        );
                        if (
                          selectedPolicy &&
                          !selectedPolicies.some(
                            (policy) =>
                              policy.id === selectedPolicy.id ||
                              policy.package_policy_title === selectedPolicy.package_policy_title
                          )
                        ) {
                          setSelectedPolicies((prev) => [...prev, selectedPolicy]);
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select a Policy...
                      </option>
                      {policies
                        .filter(
                          (policy) =>
                            !selectedPolicies.some(
                              (p) =>
                                p.id === policy.id || p.package_policy_title === policy.package_policy_title
                            )
                        )
                        .map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.package_policy_title}
                          </option>
                        ))}
                    </select>

                  </div>
                ) : (
                  <p>No Policies available</p>
                )}

                {/* Render prefilled input fields for each selected policy */}
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
                          p.id === policy.id ? { ...p, package_policy_description: e.target.value } : p
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
                          !selectedFAQs.some(
                            (f) =>
                              f.id === selectedFAQ.id ||
                              f.package_faq_title === selectedFAQ.package_faq_title
                          )
                        ) {
                          setSelectedFAQs((prev) => [...prev, selectedFAQ]);
                        }

                        // Reset the dropdown selection
                        e.target.value = "";
                      }}
                    >
                      <option value="" disabled selected>
                        Select a FAQ...
                      </option>
                      {faqs
                        .filter(
                          (faq) =>
                            !selectedFAQs.some(
                              (f) => f.id === faq.id || f.package_faq_title === faq.package_faq_title
                            )
                        )
                        .map((faq) => (
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
                      {/* Add the trash icon */}
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
                <p className="text-xl font-medium">Features:</p>
                {amenities.length === 0 ? (
                  <p>No amenities available</p>
                ) : (
                  <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
                    {amenities.map((item) => (
                      <li key={item.id} className="py-2 flex items-center">
                        <CheckboxCustom
                          label={item.package_attribute_name}
                          onChange={() => handleCheckboxChange(item.package_attribute_name)} // Handle checkbox change
                          checked={selectedAmenities.includes(item.package_attribute_name)} // Prefill based on selectedAmenities
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
        Update Package
      </button>

      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditPackage />
  </Suspense>
);

export default Page;  