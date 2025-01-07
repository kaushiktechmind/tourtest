"use client";
import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import CheckboxCustom from "@/components/Checkbox";
import Accordion from "@/components/Accordion";

// Define an interface for the room object
interface Room {
  id: number;
  room_name: string;
  room_price: string;
  status: string;
}
interface Amenity {
  id: number;
  amenity_name: string; // Ensure this matches your API response
  amenity_logo: string; // Add this if the API returns a logo
}

interface HotelFormData {
  hotel_id: string;
  room_name: string;
  room_price: string;
  extra_bed_price: string;
  child_price: string;
  no_of_beds: string;
  room_size: string;
  max_adults: string;
  max_childs: string;
  max_infants: string;
  amenities: number[]; // Change from [] to number[]
  status: string;
  agent_price: string;
  featured_images: File[];
  [key: string]: string | File[] | number[]; // Ensure this covers amenities
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
//   alert(roomId)

  const [rooms, setRooms] = useState<Room[]>([]);

  const [formData, setFormData] = useState<HotelFormData>({
    hotel_id: hotelId ?? "",
    room_name: "",
    room_price: "",
    extra_bed_price: "",
    child_price: "",
    no_of_beds: "",
    room_size: "",
    max_adults: "",
    max_childs: "",
    max_infants: "",
    amenities: [],
    status: "",
    agent_price: "1000",
    featured_images: [],
  });
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  
  const handleCheckboxChange = (amenityId: number) => {
    setSelectedAmenities((prevSelected) => {
      if (prevSelected.includes(amenityId)) {
        return prevSelected.filter((item) => item !== amenityId);
      } else {
        return [...prevSelected, amenityId];
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


  useEffect(() => {
    if (roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${roomId}`
          );
          const jsonResponse = await response.json();
  
          if (jsonResponse.room) { // Directly access `room` instead of `data.room`
            const roomData = jsonResponse.room;
            console.log("Room Data:", roomData);
  
            // Map amenity IDs
            const roomAmenityIds = roomData.amenities.map((amenity: { id: number }) => amenity.id);
  
            // Set form data with fetched room data
            setFormData((prevData) => ({
              ...prevData,
              room_name: roomData.room_name,
              room_price: roomData.room_price,
              extra_bed_price: roomData.extra_bed_price,
              child_price: roomData.child_price,
              no_of_beds: roomData.no_of_beds,
              room_size: roomData.room_size,
              max_adults: roomData.max_adults,
              max_childs: roomData.max_childs,
              max_infants: roomData.max_infants,
              amenities: roomAmenityIds, // Store only IDs in form data
              status: "1",
            }));
  
            // Set selected amenities
            setSelectedAmenities(roomAmenityIds);
          }
        } catch (error) {
          console.error("Error fetching room data:", error);
        }
      };
  
      fetchRoomData();
    }
  }, [roomId]);
  

  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prevData) => ({
        ...prevData,
        featured_images: files,
      }));
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      amenities: selectedAmenities,
    }));
  }, [selectedAmenities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const agentPrice = 1000;

  
    const token = localStorage.getItem("access_token");
    const formDataToSend = new FormData();
    formDataToSend.append("status", "1");
    formDataToSend.append("agent_price", agentPrice.toString()); 

  
    // Append form fields to FormData
    for (const key in formData) {
      if (key === "featured_images") {
        formData.featured_images.forEach((file) => {
          formDataToSend.append("featured_images[]", file);
        });
      } else if (key === "amenities") {
        // Append all selected amenity IDs as an array
        selectedAmenities.forEach((amenityId) => {
          formDataToSend.append("amenities[]", amenityId.toString()); // Use the array format "amenities[]"
        });
      } else {
        formDataToSend.append(
          key,
          formData[key as keyof HotelFormData] as string
        );
      }
    }
  
    // Add _method field to simulate PUT method in a POST request
    formDataToSend.append("_method", "PUT");
  
    try {
      // Assuming `roomId` is available for updating
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${roomId}`,
        {
          method: "POST",  // Keep POST method
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update room: ${errorMessage}`);
      }
  
      const data = await response.json();
      alert("Room updated successfully");
      router.push(`/hotel/manage-room?hotelId=${hotelId}`);
    } catch (error) {
      console.error("Error occurred during room update:", error);
    }
  };
  
  <div className="mt-[20px]">
    <button
      type="submit"
      onClick={handleSubmit}
      className="btn-primary font-semibold"
    >
      Add New
    </button>
  </div>;

  return (
    <div className="bg-[var(--bg-2)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Room</h2>
        <Link
          href={`/hotel/room-availability?hotelId=${hotelId}`}
          className="btn-primary"
        >
          <EyeIcon className="w-5 h-5" /> Room Availability
        </Link>
      </div>

      {/* Add Room Form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          {/* <h3 className="border-b h3 pb-6">Add Rooms</h3> */}
          <form onSubmit={handleSubmit}>
            <p className="mt-6 mb-4 text-xl font-medium">Hotel ID :</p>
            <input
              type="hidden"
              name="hotel_id"
              value={hotelId ?? ""}
              readOnly
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"

              // assuming you have a setHotelId function for updating hotelId
            />

            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Name:
            </label>
            <input
              type="text"
              id="room_name"
              name="room_name"
              placeholder="Room Name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.room_name}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Room Price :</p>
            <input
              type="text"
              name="room_price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="3000"
              value={formData.room_price}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Extra Bed Price :</p>
            <input
              type="text"
              name="extra_bed_price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1000"
              value={formData.extra_bed_price}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Child Price :</p>
            <input
              type="text"
              name="child_price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1"
              value={formData.child_price}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">No of Beds :</p>
            <input
              type="text"
              name="no_of_beds"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="10"
              value={formData.no_of_beds}
              onChange={handleInputChange}
            />

            <label
              htmlFor="icon-upload"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Upload Images:
            </label>
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
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <p className="mt-6 mb-4 text-xl font-medium">Room Size :</p>
            <input
              type="text"
              name="room_size"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="200 sq ft"
              value={formData.room_size}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Max Adult :</p>
            <input
              type="text"
              name="max_adults"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="2"
              value={formData.max_adults}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Max Childs :</p>
            <input
              type="text"
              name="max_childs"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="2"
              value={formData.max_childs}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Max Infants :</p>
            <input
              type="text"
              name="max_infants"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="2"
              value={formData.max_infants}
              onChange={handleInputChange}
            />
            <div className="rounded-2xl bg-white border p-4 md:p-6 lg:p-8 mt-4 lg:mt-6">
              <Accordion
                buttonContent={(open) => (
                  <div className="rounded-2xl flex justify-between">
                    <h3 className="h3">Attributes</h3>
                    <ChevronDownIcon
                      className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                        open ? "rotate-180" : ""
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
                    <ul className="columns-1 sm:columns-2 md:columns-3 lg:columns-2">
                      {amenities.map((item) => (
                        <li key={item.id} className="py-2">
                          <CheckboxCustom
                            label={item.amenity_name}
                            onChange={() => handleCheckboxChange(item.id)}  // Pass amenity id here
                            checked={selectedAmenities.includes(item.id)}  // Check if amenity id is selected
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Accordion>
            </div>

            <div className="mt-[20px]">
              <Link href="#" className="btn-primary font-semibold">
                <span className="inline-block" onClick={handleSubmit}>
                  {" "}
                  Update{" "}
                </span>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
