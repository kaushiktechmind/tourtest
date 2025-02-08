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
  cab_faq_title: string;
  cab_faq_description: string; // Assuming the correct spelling is 'cab_faq_description'
}

interface CabPolicy {
  id: number;
  cab_policy_title: string;
  cab_policy_description: string;
}




interface Amenity {
  id: number;
  cab_attribute_name: string; // Ensure this matches your API response
  cab_attribute_logo: string; // Add this if the API returns a logo
}
interface Location {
  id: number;
  location_name: string;
}


interface PickupPoint {
  id: string | number;  // Adjust type as needed
  cab_pickup_point_name: string;
}

interface DropPoint {
  id: string | number;  // Adjust type as needed
  cab_drop_point_name: string;
}



const EditCab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId");

  const [description, setDescription] = useState<string>("");
  const [formData, setFormData] = useState({
    cab_name: "",
    description: "",
    price: "",
    sale_price: "",
    status: "1",
    duration: "",
    min_passenger: "",
    max_passenger: "",
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
    banner_image_multiple: "",
    location_name: "",
    cab_pickup_point_name: "",
    cab_drop_point_name: ""
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [pickup, setPickup] = useState<PickupPoint[]>([]);
  const [droppoint, setDroppoint] = useState<DropPoint[]>([]);


  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bannerImages, setBannerImages] = useState<File[]>([]);

  const [cabPolicies, setCabPolicies] = useState<CabPolicy[]>([])
  const [selectedCabPolicies, setSelectedCabPolicies] = useState<CabPolicy[]>([]);

  const [faqs, setFAQs] = useState<FAQ[]>([]); // State for FAQs
  const [selectedFAQs, setSelectedFAQs] = useState<FAQ[]>([]); // Changed type to Policy[]
  const [inclusions, setInclusions] = useState<{ id: number; cab_inclusion_title: string }[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<{ id: number; cab_inclusion_title: string }[]>([]);
  const [exclusions, setExclusions] = useState<{ id: number; cab_exclusion_title: string }[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<{ id: number; cab_exclusion_title: string }[]>([]);


  useEffect(() => {
    // Fetch inclusions from the API
    const fetchInclusions = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_cab_inclusion");
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
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_cab_exclusion");
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
          "https://yrpitsolutions.com/tourism_api/api/admin/get_cab_faq"
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
    const fetchCabPolicies = async () => {
      try {
        const response = await fetch('https://yrpitsolutions.com/tourism_api/api/get_all_cab_policy');
        if (response.ok) {
          const data = await response.json();
          setCabPolicies(data); // Adjust this if the response structure is different
        } else {
          console.error('Failed to fetch cab policies');
        }
      } catch (error) {
        console.error('Error fetching cab policies:', error);
      }
    };

    fetchCabPolicies();
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


    useEffect(() => {
      const fetchPickup = async () => {
        try {
          const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_cab_pickup_point_name");
          if (response.ok) {
            const data = await response.json();
            setPickup(data); // Assuming the response contains a `locations` array
          } else {
            console.error("Failed to fetch locations");
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };
  
      fetchPickup();
    }, []);
  
  
  
    useEffect(() => {
      const fetchDroppoint = async () => {
        try {
          const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_cab_drop_point_name");
          if (response.ok) {
            const data = await response.json();
            setDroppoint(data); // Assuming the response contains a `locations` array
          } else {
            console.error("Failed to fetch locations");
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };
  
      fetchDroppoint();
    }, []);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBannerImages(Array.from(e.target.files)); // Store multiple files
    }
  };




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          "https://yrpitsolutions.com/tourism_api/api/admin/get_cab_attribute"
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
    const inclusion = inclusions.find((inc) => inc.cab_inclusion_title === selectedTitle);

    if (inclusion && !selectedInclusions.some((inc) => inc.id === inclusion.id)) {
      setSelectedInclusions((prev) => [...prev, inclusion]);
    }

    // Reset the dropdown to the placeholder value
    e.target.value = "";
  };

  const handleEditInclusion = (index: number, value: string) => {
    setSelectedInclusions((prev) =>
      prev.map((inc, i) => (i === index ? { ...inc, cab_inclusion_title: value } : inc))
    );
  };


  const handleAddExclusion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const exclusion = exclusions.find((inc) => inc.cab_exclusion_title === selectedTitle);

    if (exclusion && !selectedExclusions.some((inc) => inc.id === exclusion.id)) {
      setSelectedExclusions((prev) => [...prev, exclusion]);
    }

    // Reset the dropdown to the placeholder value
    e.target.value = "";
  };

  const handleEditExclusion = (index: number, value: string) => {
    setSelectedExclusions((prev) =>
      prev.map((inc, i) => (i === index ? { ...inc, cab_exclusion_title: value } : inc))
    );
  };






  useEffect(() => {
    const fetchCabData = async () => {
      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/cab-main-forms/${cabId}`);
        const data = await response.json();


        // Extract attribute names dynamically
        const attributes = Object.keys(data)
          .filter((key) => key.startsWith("attribute_name") && data[key]) // Filter non-null attribute names
          .map((key) => data[key]); // Get attribute values


        // Prefill selected amenities with valid attributes
        setSelectedAmenities(attributes);

        // setBannerImages(data.banner_image || []);
        setBannerImages(data.banner_image_multiple || []);


        if (data.faqs && data.faqs.length > 0) {
          // Parse the first element of the array (which is a stringified JSON)
          const parsedFAQs = JSON.parse(data.faqs[0]).map((faq: any, index: number) => ({
            id: faq.id || index,
            cab_faq_title: faq.question,
            cab_faq_description: faq.answer,
          }));
          setSelectedFAQs(parsedFAQs);  // Update state with parsed FAQs
        } else {
          console.log("No FAQs found in the data");
        }


        if (data.description) {
          setDescription(data.description); // Set the description from the API
        }


        const prefilledInclusions = data.inclusion.map((title: string, index: number) => ({
          id: index + 1,
          cab_inclusion_title: title,
        }));
        setSelectedInclusions(prefilledInclusions);

        const prefilledExclusions = data.exclusion.map((title: string, index: number) => ({
          id: index + 1,
          cab_exclusion_title: title,
        }));
        setSelectedExclusions(prefilledExclusions);

        if (data.policies && typeof data.policies === 'string') {
          const parsedPolicies = JSON.parse(data.policies).map((policy: any, index: number) => ({
            id: index + 1,
            cab_policy_title: policy.policy_title,
            cab_policy_description: policy.policy_description,
          }));
          setSelectedCabPolicies(parsedPolicies);
        }


        // Prefill formData with the API response
        setFormData((prevState) => ({
          ...prevState,
          cab_name: data.cab_name || "",
          description: data.description || "",
          price: data.price || "",
          sale_price: data.sale_price || "",
          duration: data.duration || "",
          min_passenger: data.min_passenger,
          max_passenger: data.max_passenger || "",
          location_name: data.location || "",
          cab_pickup_point_name: data.pickup_point || "",
          cab_drop_point_name: data.drop_point || "",


          // Add other fields as necessary
        }));
      } catch (error) {
        console.error("Error fetching cab data:", error);
      }
    };


    fetchCabData();
  }, [cabId, inclusions, exclusions]);  // Add inclusions and exclusions as dependencies

  // console.log("aaaaaaaaaaaaaaa", formData.min_passenger)



  const handleDeleteFAQ = (id: number) => {
    setSelectedFAQs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleDeletePolicy = (policyId: number) => {
    setSelectedCabPolicies((prevPolicies) =>
      prevPolicies.filter((policy) => policy.id !== policyId)
    );
  };


  const handleRemoveInclusion = (index: number) => {
    setSelectedInclusions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleRemoveExclusion = (index: number) => {
    setSelectedExclusions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };





  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    try {

      const formDataToSend = new FormData();

      const plainDescription = description.replace(/<[^>]*>/g, ""); // This removes HTML tags
      // Manually append each field from formData and plainDescription
      formDataToSend.append("cab_name", formData.cab_name);
      formDataToSend.append("description", plainDescription);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("sale_price", formData.sale_price);
      formDataToSend.append("min_passenger", formData.min_passenger);
      formDataToSend.append("max_passenger", formData.max_passenger);

      formDataToSend.append("location", formData.location_name);
      formDataToSend.append("pickup_point", formData.cab_pickup_point_name);
      formDataToSend.append("drop_point", formData.cab_drop_point_name);
      formDataToSend.append("_method", "PUT");


      // Append each inclusion separately
      selectedInclusions.forEach((inc) => {
        formDataToSend.append("inclusion[]", inc.cab_inclusion_title);
      });

      // Append each exclusion separately
      selectedExclusions.forEach((inc) => {
        formDataToSend.append("exclusion[]", inc.cab_exclusion_title);
      });




      // Add selected amenities as dynamic fields
      selectedAmenities.forEach((amenityName, index) => {
        const attributeNumber = index + 1; // Starts from 1
        const amenity = amenities.find((a) => a.cab_attribute_name === amenityName);

        if (amenity) {
          const attributeNameKey = `attribute_name${attributeNumber}`;
          const attributeLogoKey = `attribute_logo${attributeNumber}`;

          formDataToSend.append(attributeNameKey, amenity.cab_attribute_name);
          formDataToSend.append(attributeLogoKey, amenity.cab_attribute_logo);
        }
      });

      // Debug: Log all FormData entries
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }



      // const firstSelectedAmenity = selectedAmenities[0]; // Assuming the first selected amenity
      // if (firstSelectedAmenity) {
      //   // Append the name of the first selected attribute
      //   formDataToSend.append('attribute_name1', firstSelectedAmenity);

      //   // Find the corresponding logo for the selected amenity
      //   const selectedAmenity = amenities.find(
      //     (item) => item.cab_attribute_name === firstSelectedAmenity
      //   );

      //   // If we found the selected amenity, append its logo as well
      //   if (selectedAmenity) {
      //     formDataToSend.append('attribute_logo1', selectedAmenity.cab_attribute_logo);
      //   }
      // }

      // selectedAmenities.forEach((label, index) => {
      //   if (index < 15) { // Limit to 15 items
      //     const selectedAmenity = amenities.find(
      //       (item) => item.cab_attribute_name === label
      //     );

      //     if (selectedAmenity) {
      //       formDataToSend.append(`attribute_name${index + 1}`, selectedAmenity.cab_attribute_name);
      //       formDataToSend.append(`attribute_logo${index + 1}`, selectedAmenity.cab_attribute_logo);
      //     }
      //   }
      // });

      // // formDataToSend.append("amenities", JSON.stringify(selectedAmenities));


      selectedCabPolicies.forEach((policy, index) => {
        formDataToSend.append(`policies[${index}][policy_title]`, policy.cab_policy_title);
        formDataToSend.append(`policies[${index}][policy_description]`, policy.cab_policy_description);
      });


      const faqsData = selectedFAQs.map((faq) => ({
        question: faq.cab_faq_title,
        answer: faq.cab_faq_description,
      }));

      const faqs = JSON.stringify(faqsData);
      // console.log("zzzzzzzzzzzzzzzzzzz", faqs);

      formDataToSend.append("faqs[]", faqs);

      // Conditionally append banner images only if images are selected
      if (Array.isArray(bannerImages) && bannerImages.length > 0) {
        bannerImages.forEach((file) => {
          formDataToSend.append("banner_image_multiple[]", file);
        });
      }



      // Send the request with FormData
      const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/cab-main-forms/${cabId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' should not be set manually when using FormData
        },
        body: formDataToSend, // Send the FormData object
      });

      if (response.ok) {
        const data = await response.json();
        alert("Cab saved successfully!");
        // router.push("/cab/all-cab");
      } else {
        alert("Failed to save cab.");
      }
    } catch (error) {
      console.error("Error saving cab:", error);
    }
  };


  return (

    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Cab</h2>
        <Link href={`/cab/manage-cab?cabId=${cabId}`} className="btn-primary">
          <EyeIcon className="w-5 h-5" /> Manage Cabs
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
                <h3 className="h3">Cab Content </h3>
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



                <p className="mt-6 mb-4 text-xl font-medium">Cab Name:</p>
                <input
                  type="text"
                  name="cab_name"
                  value={formData.cab_name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-base"
                  placeholder="Name of Cab"
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
                <h3 className="h3">Cab Details </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            )}
            initialOpen={true}>
            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
              <p className="mb-4 text-xl font-medium">Min Passenger :</p>
              <input
                type="number"
                name="min_passenger"
                value={formData.min_passenger}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />

              <p className="mt-6 mb-4 text-xl font-medium">Max Passenger :</p>
              <input
                type="number"
                name="max_passenger"
                value={formData.max_passenger}
                onChange={handleChange}
                className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                placeholder="0"
              />



            </div>
          </Accordion>





          <div className="rounded-2xl bg-white border mt-6">
            <Accordion
              buttonContent={(open) => (
                <div className={`${open ? "rounded-t-2xl" : "rounded-2xl"} flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                  <h3 className="h3">Policies</h3>
                  <ChevronDownIcon className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`} />
                </div>
              )}
              initialOpen={true}
            >
              <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                {cabPolicies.length > 0 ? (
                  <div className="mb-4">
                    <label htmlFor="cabPolicyDropdown" className="text-lg font-bold mb-2 block">
                      Select a Cab Policy
                    </label>
                    <select
                      id="cabPolicyDropdown"
                      className="w-full border p-2 rounded-md"
                      value=""
                      onChange={(e) => {
                        const selectedPolicy = cabPolicies.find(
                          (policy) => policy.id === parseInt(e.target.value)
                        );
                        if (
                          selectedPolicy &&
                          !selectedCabPolicies.some(
                            (policy) =>
                              policy.id === selectedPolicy.id ||
                              policy.cab_policy_title === selectedPolicy.cab_policy_title
                          )
                        ) {
                          setSelectedCabPolicies((prev) => [...prev, selectedPolicy]);
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select a Cab Policy...
                      </option>
                      {cabPolicies
                        .filter(
                          (policy) =>
                            !selectedCabPolicies.some(
                              (p) =>
                                p.id === policy.id || p.cab_policy_title === policy.cab_policy_title
                            )
                        )
                        .map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.cab_policy_title}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <p>No Cab Policies available</p>
                )}

                {/* Render input fields for each selected Cab Policy */}
                {selectedCabPolicies.map((policy) => (
                  <div key={policy.id} className="mb-4 flex items-center gap-4">
                    <div className="flex gap-4 w-full">
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={policy.cab_policy_title}
                        readOnly
                      />
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={policy.cab_policy_description}
                        onChange={(e) => {
                          const updatedPolicies = selectedCabPolicies.map((p) =>
                            p.id === policy.id ? { ...p, cab_policy_description: e.target.value } : p
                          );
                          setSelectedCabPolicies(updatedPolicies);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
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
                        if (
                          selectedFAQ &&
                          !selectedFAQs.some(
                            (f) => f.id === selectedFAQ.id || f.cab_faq_title === selectedFAQ.cab_faq_title
                          )
                        ) {
                          setSelectedFAQs((prev) => [...prev, selectedFAQ]);
                        }
                        // Reset the dropdown to the placeholder
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
                              (f) => f.id === faq.id || f.cab_faq_title === faq.cab_faq_title
                            )
                        )
                        .map((faq) => (
                          <option key={faq.id} value={faq.id}>
                            {faq.cab_faq_title}
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
                    <div className="flex gap-4 w-full">
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.cab_faq_title}
                        readOnly
                      />
                      <input
                        type="text"
                        className="w-1/2 border p-2 rounded-md"
                        value={faq.cab_faq_description}
                        onChange={(e) => {
                          const updatedFAQs = selectedFAQs.map((f) =>
                            f.id === faq.id
                              ? { ...f, cab_faq_description: e.target.value }
                              : f
                          );
                          setSelectedFAQs(updatedFAQs);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>

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
                        <span className="h5 clr-neutral-500 text-center mt-4 mb-3">Select Minimum 3 Files</span>
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
                                  src={image as unknown as string}
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

          
          <div className="col-span-12 lg:col-span-6 mt-6">
                      <Accordion
                        buttonContent={(open) => (
                          <div
                            className={`${open ? "rounded-t-2xl" : "rounded-2xl"
                              } flex justify-between items-center p-4 md:p-6 lg:p-8 duration-500 bg-white`}>
                            <h3 className="h3">Stations </h3>
                            <ChevronDownIcon
                              className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""
                                }`}
                            />
                          </div>
                        )}
                        initialOpen={true}>
                        <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 bg-white rounded-b-2xl">
                          <div className="border-t pt-4">
                            <p className="mt-6 mb-4 text-xl font-medium">Pickup Point   :</p>
                            <select
                              name="cab_pickup_point_name"
                              value={formData.cab_pickup_point_name}
                              onChange={handleChange}
                              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                            >
                              <option value="" disabled>
                                Select a Pickup Point
                              </option>
                              {pickup.map((pickuppoint) => (
                                <option key={pickuppoint.id} value={pickuppoint.cab_pickup_point_name}>
                                  {pickuppoint.cab_pickup_point_name}
                                </option>
                              ))}
                            </select>
          
          
          
                            <p className="mt-6 mb-4 text-xl font-medium">Drop Point :</p>
                            <select
                              name="cab_drop_point_name"
                              value={formData.cab_drop_point_name}
                              onChange={handleChange}
                              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                            >
                              <option value="" disabled>
                                Select a Drop Point
                              </option>
                              {droppoint.map((drop) => (
                                <option key={drop.id} value={drop.cab_drop_point_name}>
                                  {drop.cab_drop_point_name}
                                </option>
                              ))}
                            </select>
          
          
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
                  name="cab_inclusion_title"
                  onChange={handleAddInclusion}
                  value=""  // Ensure no default selection
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select an Inclusion
                  </option>
                  {inclusions
                    .filter(
                      (inclusion) =>
                        !selectedInclusions.some(
                          (selected) =>
                            selected.id === inclusion.id ||
                            selected.cab_inclusion_title === inclusion.cab_inclusion_title
                        )
                    )
                    .map((inclusion) => (
                      <option key={inclusion.id} value={inclusion.cab_inclusion_title}>
                        {inclusion.cab_inclusion_title}
                      </option>
                    ))}
                </select>


                {/* Render selected inclusions */}
                <div className="mt-4 space-y-4">
                  {selectedInclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={inclusion.cab_inclusion_title}
                        onChange={(e) => handleEditInclusion(index, e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      />
                      <button
                        onClick={() => handleRemoveInclusion(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove Inclusion"
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
                  name="cab_exclusion_title"
                  onChange={handleAddExclusion}
                  value=""  // Prevent default selection
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                >
                  <option value="" disabled>
                    Select an Exclusion
                  </option>
                  {exclusions
                    .filter(
                      (exclusion) =>
                        !selectedExclusions.some(
                          (selected) =>
                            selected.id === exclusion.id ||
                            selected.cab_exclusion_title === exclusion.cab_exclusion_title
                        )
                    )
                    .map((exclusion) => (
                      <option key={exclusion.id} value={exclusion.cab_exclusion_title}>
                        {exclusion.cab_exclusion_title}
                      </option>
                    ))}
                </select>


                {/* Render selected exclusions with trash icon */}
                <div className="mt-4 space-y-4">
                  {selectedExclusions.map((exclusion, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={exclusion.cab_exclusion_title}
                        onChange={(e) => handleEditExclusion(index, e.target.value)}
                        className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                      />
                      <button
                        onClick={() => handleRemoveExclusion(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove Exclusion"
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
                {amenities.length === 0 ? (
                  <p>No amenities available</p>
                ) : (
                  <ul className="space-y-2">
                    {amenities.map((item) => (
                      <li key={item.id} className="flex items-center space-x-2">
                        <CheckboxCustom
                          label={item.cab_attribute_name}
                          onChange={() => handleCheckboxChange(item.cab_attribute_name)}
                          checked={selectedAmenities.includes(item.cab_attribute_name)}
                        />
                        <span className="text-lg">{item.cab_attribute_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </Accordion>
          </div>
          <button onClick={handleSubmit} className="btn-primary font-semibold m-6">
            Save & Preview
          </button>
        </div>

      </section>



      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditCab />
  </Suspense>
);

export default Page;  