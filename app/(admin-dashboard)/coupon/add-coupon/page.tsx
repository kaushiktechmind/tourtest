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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface Coupon {
  id: number;
  coupon_name: string;
  coupon_code: string;
  type: string;
  discount_price: string;
  start_date: string;
  end_date: string;
  status: string;
}


interface HotelFormData {
  coupon_name: string;
  coupon_code: string;
  type: string;
  discount_price: string;
  start_date: string;
  end_date: string;
  status: string;
  // For multiple image uploads
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState("");


  const [formData, setFormData] = useState<HotelFormData>({
    coupon_name: "",
    coupon_code: "",
    type: "",
    discount_price: "",
    start_date: "",
    end_date: "",
    status: "1",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_coupon");
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_coupon_by_id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete coupon: ${errorMessage}`);
      }
  
      alert("Coupon deleted successfully");
      setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon.id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Error deleting coupon: " + error.message);
    }
  };
  
  const filteredCoupons = coupons.filter((coupon) => {
    const searchTerm = search.toLowerCase();
    return (
      coupon.coupon_name.toLowerCase().includes(searchTerm) ||
      coupon.coupon_code.toLowerCase().includes(searchTerm) ||
      coupon.discount_price.toString().toLowerCase().includes(searchTerm) ||
      coupon.start_date.toLowerCase().includes(searchTerm) ||
      coupon.end_date.toLowerCase().includes(searchTerm) || 
      coupon.status.toLowerCase().includes(searchTerm)
    );
  });
  
  

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
    e.preventDefault(); // Prevent form submission default behavior

    const token = localStorage.getItem("access_token");
    const formDataToSend = new FormData();

    // Append each key-value pair from formData to formDataToSend
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => formDataToSend.append(key, val)); // Handle array values like amenities
      } else if (value instanceof File) {
        formDataToSend.append(key, value); // Handle file uploads
      } else {
        formDataToSend.append(key, value); // Append other values
      }
    });

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_coupon",
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
        throw new Error(`Failed to add coupon: ${errorMessage}`);
      }

      const data = await response.json();
      alert("Coupon added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error occurred during coupon addition:", error);
      alert("Error adding coupon: " + error.message);
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
        <h2 className="h2 text-white">Add New Coupon</h2>
      </div>

      {/* Add Room Form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Coupon Details</h3>
          <form onSubmit={handleSubmit}>

            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Name:
            </label>
            <input
              type="text"
              id="coupon_name"
              name="coupon_name"
              placeholder="Coupon Name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              value={formData.coupon_name}
              onChange={handleInputChange}
            />

            <p className="mt-6 mb-4 text-xl font-medium">Coupon Code :</p>
            <input
              type="text"
              name="coupon_code"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={formData.coupon_code}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Type :</p>
            <input
              type="text"
              name="type"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={formData.type}
              onChange={handleInputChange}
            />
            <p className="mt-6 mb-4 text-xl font-medium">Discount Price :</p>
            <input
              type="number"
              name="discount_price"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder=""
              value={formData.discount_price}
              onChange={handleInputChange}
            />
            <div className="flex gap-6 mt-6 mb-4">
              <div className="flex-1">
                <p className="mb-2 text-xl font-medium">Start Date :</p>
                <DatePicker
                  selected={formData.start_date ? new Date(formData.start_date) : null}
                  onChange={(date: Date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      start_date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholderText="Select Start Date"
                />
              </div>

              <div className="flex-1">
                <p className="mb-2 text-xl font-medium">End Date :</p>
                <DatePicker
                  selected={formData.end_date ? new Date(formData.end_date) : null}
                  onChange={(date: Date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      end_date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
                  placeholderText="Select End Date"
                />
              </div>
            </div>

            {/* <p className="mt-6 mb-4 text-xl font-medium">Status :</p>
            <input
              type="text"
              name="status"
              className="w-full border py-2 px-3 lg:px-4 focus:outline-none rounded-md text-base"
              placeholder="1"
              value={formData.status}
              onChange={handleInputChange}
            /> */}

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <th className="py-3 lg:py-4 px-2">Coupon Code</th>
              <th className="py-3 lg:py-4 px-2">Coupon Name</th>
              <th className="py-3 lg:py-4 px-2">Discount Price</th>
              <th className="py-3 lg:py-4 px-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map(({ id, coupon_code, discount_price, coupon_name }) => (
                <tr
                  key={id}
                  className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                >
                  <td className="py-3 lg:py-4 px-2">{coupon_code}</td>
                  <td className="py-3 lg:py-4 px-2">
                    {coupon_name}
                  </td>
                  <td className="py-3 lg:py-4 px-2">{discount_price}</td>
                  
                  <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                    <Link
                      href={`/coupon/edit-coupon?couponId=${id}`}
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
                  No coupons available
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
