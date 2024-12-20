"use client";
import { useEffect, useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

// Define an interface for the room object
interface Room {
  id: number;
  min_pax: string;
  max_pax: string;
  status: string;
}
interface Amenity {
  id: number;
  amenity_name: string; // Ensure this matches your API response
  amenity_logo: string; // Add this if the API returns a logo
}

interface CabFormData {
  cab_main_form_id: string;
  min_pax: string;
  max_pax: string;
  car_count: string;
  cargo_count: string;
  price: string;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId"); // Get FAQ ID from URL params

  const [rooms, setRooms] = useState<Room[]>([]);

  const [formData, setFormData] = useState<CabFormData>({
    cab_main_form_id: cabId ?? "",
    min_pax: "",
    max_pax: "",
    car_count: "",
    cargo_count: "",
    price: "",
  });


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/cabs/${cabId}/rooms`
        );
        if (!response.ok) {
          const errorMessage = await response.text(); // Retrieve the error message
          console.error("Error during image upload:", errorMessage);
          throw new Error(`Failed to add room: ${errorMessage}`);
        }
        const data = await response.json();
        setRooms(data.data); // Assuming the rooms array is in data.rooms
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (roomId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/cab_rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      alert(`Room Deleted Successfully`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }
  
    // Create FormData to send to the API
    const formDataToSend = new FormData();
    formDataToSend.append("cab_main_form_id", cabId);
    formDataToSend.append("min_pax", formData.min_pax);
    formDataToSend.append("max_pax", formData.max_pax);
    formDataToSend.append("car_count", formData.car_count);
    formDataToSend.append("cargo_count", formData.cargo_count);
    formDataToSend.append("price", formData.price);
  
    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/cab-sub-forms",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add room: ${errorMessage}`);
      }
  
      const data = await response.json();
      alert("Room added successfully");
      window.location.reload(); // Reload the page after successful submission
    } catch (error) {
      console.error("Error occurred during room addition:", error);
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
        <h2 className="h2 text-white">Manage Cab</h2>
        <Link
          href={`/cab/all-cab`}
          className="btn-primary"
        >
          <EyeIcon className="w-5 h-5" /> All Cabs
        </Link>
      </div>

      {/* Add Room Form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Rooms</h3>
          <form onSubmit={handleSubmit}>
            {/* <p className="mt-6 mb-4 text-xl font-medium">Cab ID :</p> */}
            <input
              type="hidden"
              name="cab_main_form_id"
              value={cabId ?? ""}
              readOnly
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"

            // assuming you have a setCabId function for updating cabId
            />

            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
             Min Pax
            </label>
            <input
              type="number"
              id="min_pax"
              name="min_pax"
              placeholder="Room Name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.min_pax}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Max Pax :</p>
            <input
              type="number"
              name="max_pax"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="3000"
              value={formData.max_pax}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">No of Cars:</p>
            <input
              type="number"
              name="car_count"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1000"
              value={formData.car_count}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">No of Cargo :</p>
            <input
              type="number"
              name="cargo_count"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1"
              value={formData.cargo_count}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
            <input
              type="number"
              name="price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="10"
              value={formData.price}
              onChange={handleInputChange}
            />


            <div className="mt-[20px]">
              <Link href="#" className="btn-primary font-semibold">
                <span className="inline-block" onClick={handleSubmit}>
                  {" "}
                  Add New{" "}
                </span>
              </Link>
            </div>
          </form>
        </div>

        {/* Rooms List */}
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                />
                <SearchIcon />
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Price</th>
                  <th className="py-3 lg:py-4 px-2">Status</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {(rooms ?? []).length > 0 ? (
                  rooms.map(({ id, min_pax, max_pax, status }) => (
                    <tr
                      key={id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                    >
                      <td className="py-3 lg:py-4 px-2">{min_pax}</td>
                      <td className="py-3 lg:py-4 px-2">{max_pax}</td>
                      <td className="py-3 lg:py-4 px-2">
                        {status === "1" ? "Active" : "Inactive"}
                      </td>
                      <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                        <Link
                          href={`/cab/edit-manage-room?cabId=${cabId}&roomId=${id}`}
                          className="text-primary"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-[var(--secondary-500)]"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-3">
                      No Cab Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* <Pagination /> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
