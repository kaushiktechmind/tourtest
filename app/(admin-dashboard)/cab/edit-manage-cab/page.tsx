"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useRouter, useSearchParams } from "next/navigation";

// Define an interface for the form data
interface CabFormData {
  cab_main_form_id: string;
  min_pax: string;
  max_pax: string;
  car_count: string;
  cargo_count: string;
  price: string;
  cab_name: string;
  ar_count: string;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId");
  const cabSubId = searchParams.get("cabSubId");

  const [formData, setFormData] = useState<CabFormData>({
    cab_main_form_id: cabId ?? "",
    min_pax: "",
    max_pax: "",
    car_count: "",
    cargo_count: "",
    price: "",
    cab_name: "",
    ar_count: "",
  });

  // Fetch data for pre-filling the form
  useEffect(() => {
    const fetchCabSubFormData = async () => {
      if (!cabSubId) return;

      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/cab-sub-forms/${cabSubId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch cab data: ${response.statusText}`);
        }

        const data = await response.json();

        // Update formData with fetched data
        setFormData({
          cab_main_form_id: data.cab_main_form_id ?? cabId ?? "",
          min_pax: data.min_pax ?? "",
          max_pax: data.max_pax ?? "",
          car_count: data.car_count ?? "",
          cargo_count: data.cargo_count ?? "",
          price: data.price ?? "",
          cab_name: data.cab_name ?? "",
          ar_count: data.ar_count ?? "",
        });
      } catch (error) {
        console.error("Error fetching cab data:", error);
      }
    };

    fetchCabSubFormData();
  }, [cabSubId, cabId]);

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

    const formDataToSend = new FormData();
    formDataToSend.append("cab_main_form_id", cabId ?? "");
    formDataToSend.append("min_pax", formData.min_pax);
    formDataToSend.append("max_pax", formData.max_pax);
    formDataToSend.append("car_count", formData.car_count);
    formDataToSend.append("cargo_count", formData.cargo_count);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("_method", "PUT");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/cab-sub-forms/${cabSubId}`,
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
        throw new Error(`Failed to update cab data: ${errorMessage}`);
      }

      alert("Cab data updated successfully");
      router.push(`/cab/manage-cab?cabId=${cabId}`); 
    } catch (error) {
      console.error("Error occurred during cab data update:", error);
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Manage Cab</h2>
        <Link href={`/cab/all-cab`} className="btn-primary">
          All Cabs
        </Link>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Cab Details</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="cab_main_form_id"
              value={formData.cab_main_form_id}
              readOnly
            />

            <label htmlFor="min_pax" className="py-4 inline-block text-base">
              Min Pax
            </label>
            <input
              type="number"
              id="min_pax"
              name="min_pax"
              placeholder="2"
              className="w-full border py-3 px-3 lg:px-6 rounded-md"
              value={formData.min_pax}
              onChange={handleInputChange}
            />

            <label htmlFor="max_pax" className="py-4 inline-block text-base">
              Max Pax
            </label>
            <input
              type="number"
              name="max_pax"
              placeholder="6"
              className="w-full border py-3 px-3 lg:px-6 rounded-md"
              value={formData.max_pax}
              onChange={handleInputChange}
            />

            <label htmlFor="car_count" className="py-4 inline-block text-base">
              No of Cars
            </label>
            <input
              type="number"
              name="car_count"
              placeholder="10"
              className="w-full border py-3 px-3 lg:px-6 rounded-md"
              value={formData.car_count}
              onChange={handleInputChange}
            />

            <label htmlFor="cargo_count" className="py-4 inline-block text-base">
              No of Cargo
            </label>
            <input
              type="number"
              name="cargo_count"
              placeholder="5"
              className="w-full border py-3 px-3 lg:px-6 rounded-md"
              value={formData.cargo_count}
              onChange={handleInputChange}
            />

            <label htmlFor="price" className="py-4 inline-block text-base">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="1000"
              className="w-full border py-3 px-3 lg:px-6 rounded-md"
              value={formData.price}
              onChange={handleInputChange}
            />

            <div className="mt-[20px]">
              <button type="submit" className="btn-primary font-semibold">
                Update Cab
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
