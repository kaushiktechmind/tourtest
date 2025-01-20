"use client";
import { Suspense, useEffect, useState } from "react";
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

// Define an interface for the cab object
interface Cab {
  id: number;
  price: string;
  max_pax: string;
  status: string;
  cab_main_form: {
    cab_name: string; // Ensure cab_name is part of cab_main_form
  };
  car_count: string;
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
  cab_name: string;
}

const ManageCab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId"); // Get FAQ ID from URL params

  const [cabs, setCabs] = useState<Cab[]>([]);
  const [cabName, setCabName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCabs, setFilteredCabs] = useState<Cab[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page


  const [formData, setFormData] = useState<CabFormData>({
    cab_main_form_id: cabId ?? "",
    min_pax: "",
    max_pax: "",
    car_count: "",
    cargo_count: "",
    price: "",
    cab_name: "",
  });


  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/filter/cabsubforms/by-cab-main-form-id/${cabId}`
        );
        if (!response.ok) {
          const errorMessage = await response.text(); // Retrieve the error message
          console.error("Error during image upload:", errorMessage);
          throw new Error(`Failed to add cab: ${errorMessage}`);
        }
        const data = await response.json();
        console.log(data)
        if (data && data.length > 0) {
          const cabData = data[0]; // If there are multiple cabs, pick the first one
          setCabName(cabData.cab_main_form?.cab_name || 'Cab name not found'); // Extracting cab_name
        }
        setCabs(data); // Assuming the cabs array is in data.cabs
      } catch (error) {
        console.error(error);
      }
    };

    fetchCabs();
  }, []);





  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    // Filter cabs based on the search query
    const filtered = cabs.filter((cab) => {
      const query = searchQuery.toLowerCase();
      return (
        (cab.cab_main_form?.cab_name?.toLowerCase() || "").includes(query) ||
        (cab.price?.toLowerCase() || "").includes(query) ||
        (cab.car_count?.toLowerCase() || "").includes(query) ||
        (cab.max_pax?.toLowerCase() || "").includes(query) ||
        (cab.status?.toLowerCase() || "").includes(query)
      );
    });
    setFilteredCabs(filtered);
    setCurrentPage(1); // Reset to the first page when search changes
  }, [searchQuery, cabs]);
  
  // Paginate the filtered cabs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCabs.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (cabId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/cab-sub-forms/${cabId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cab");
      }

      setCabs((prevCabs) => prevCabs.filter((cab) => cab.id !== cabId));
      alert(`Cab Deleted Successfully`);
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
    if (cabId) {
      formDataToSend.append("cab_main_form_id", cabId);
    }
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
        throw new Error(`Failed to add cab: ${errorMessage}`);
      }

      const data = await response.json();
      alert("Cab added successfully");
      window.location.reload(); // Reload the page after successful submission
    } catch (error) {
      console.error("Error occurred during Cab addition:", error);
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

      {/* Add Cab Form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Cab Details</h3>
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
              placeholder="2"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.min_pax}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Max Pax :</p>
            <input
              type="number"
              name="max_pax"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="6"
              value={formData.max_pax}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">No of Cars:</p>
            <input
              type="number"
              name="car_count"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="10"
              value={formData.car_count}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">No of Cargo :</p>
            <input
              type="number"
              name="cargo_count"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="5"
              value={formData.cargo_count}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Price:</p>
            <input
              type="number"
              name="price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1000"
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

        {/* Cabs List */}
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
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
                  <th className="py-3 lg:py-4 px-2">Cars</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>

              <tbody>
              {currentItems.length > 0 ? (
                  currentItems.map((cab) => (
                    <tr
                      key={cab.id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                    >
                      {/* Displaying cab_name from cab_main_form */}
                      <td className="py-3 lg:py-4 px-2">{cab.cab_main_form?.cab_name}</td>

                      {/* Displaying price */}
                      <td className="py-3 lg:py-4 px-2">{cab.price}</td>

                      <td className="py-3 lg:py-4 px-2">{cab.car_count}</td>

                      {/* Action buttons */}
                      <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                        <Link
                          href={`/cab/edit-manage-cab?cabId=${cabId}&cabSubId=${cab.id}`}
                          className="text-primary"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cab.id)}
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
            <Pagination
               totalItems={filteredCabs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ManageCab />
  </Suspense>
);

export default Page;
