"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useRouter, useSearchParams } from "next/navigation";
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
}

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const couponId = searchParams.get("couponId");

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
        if (couponId) {
            fetchCouponData();
        }
    }, [couponId]);

    const fetchCouponData = async () => {
        try {
            const response = await fetch(
                `https://yrpitsolutions.com/tourism_api/api/get_coupon_by_id/${couponId}`,
                {
                    method: "GET",
                }
            );
    
            if (!response.ok) {
                throw new Error("Failed to fetch coupon data");
            }
    
            const data: Coupon = await response.json();
    
            // Prefill form fields with fetched data
            setFormData({
                coupon_name: data.coupon_name,
                coupon_code: data.coupon_code,
                type: data.type,
                discount_price: data.discount_price,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status,
            });
        } catch (error) {
            console.error("Error fetching coupon data:", error);
            alert("Failed to load coupon details.");
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
        e.preventDefault(); // Prevent form submission default behavior

        const token = localStorage.getItem("access_token");
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value as string);
        });

        formDataToSend.append("_method", "PUT");

        try {
            const response = await fetch(
                `https://yrpitsolutions.com/tourism_api/api/admin/update_coupon_by_id/${couponId}`,
                {
                    method: "POST", // Keep POST method
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDataToSend,
                }
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update coupon: ${errorMessage}`);
            }

            const data = await response.json();
            alert("Coupon updated successfully");
            router.push("/coupon/add-coupon"); // Redirect after successful update
        } catch (error) {
            console.error("Error occurred during coupon update:", error);
            alert("Error updating coupon: " + error.message);
        }
    };

    return (
        <div className="bg-[var(--bg-2)]">
            <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
                <h2 className="h2 text-white">Edit Coupon</h2>
            </div>

            <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
                <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
                    <h3 className="border-b h3 pb-6">Edit Coupon Details</h3>
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
                                    selected={
                                        formData.start_date
                                            ? new Date(formData.start_date)
                                            : null
                                    }
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
                                    selected={
                                        formData.end_date
                                            ? new Date(formData.end_date)
                                            : null
                                    }
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

                        <div className="mt-[20px]">
                            <button
                                type="submit"
                                className="btn-primary font-semibold"
                            >
                                Update Coupon
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
