"use client";
import {
  CloudArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

const EditHotelAttribute = () => {
  const [promotionData, setPromotionaData] = useState({
    id: "",
    url: "",
    photo: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconImage, setIconImage] = useState<string>("");
  const router = useRouter();

  // Fetch the promotion data by ID
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/get_promotion_by_id/1`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data) {
          setPromotionaData({
            id: data.id || "",
            url: data.url || "",
            photo: data.photo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching promotion data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPromotionaData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIconFile(e.target.files[0]);
      const image = URL.createObjectURL(e.target.files[0]);
      setIconImage(image);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promotionData.url.trim()) {
      alert("Promotion URL is required.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const form = new FormData();
    form.append("url", promotionData.url);

    // Send existing promotion logo if no new file is uploaded
    if (iconFile) {
      form.append("photo", iconFile);
    } else {
      form.append("photo", promotionData.photo);
    }

    form.append("_method", "PUT");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_promotion_by_id/1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        alert(
          "Error updating promotion: " + (errorResponse.message || "Unknown error")
        );
        return;
      }

      const result = await response.json();
      alert("Promotion updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Promotion</h2>
      </div>

      {/* Edit form */}
      <section className="grid z-[1] grid-cols-1 lg:grid-cols-2 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative pb-10 xxl:pb-0 after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1]">
        {/* First Card */}
        <div className="col-span-1 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Edit Promotion</h3>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="url"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              URL:
            </label>
            <input
              type="text"
              id="url"
              value={promotionData.url}
              onChange={handleInputChange}
              placeholder="URL Name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border-primary outline-1"
              required
            />
            {promotionData.photo && (
              <div className="mt-4">
                <Image
                  width={22}
                  height={22}
                  src={iconFile ? iconImage : promotionData.photo}
                  alt="Promotional Logo"
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
            <label
              htmlFor="icon"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Upload Image:
            </label>
            <div className="pt-6">
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
                </span>
                <input
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="mt-[20px] text-center">
              <button type="submit" className="btn-primary font-semibold">
                <span className="inline-block">Update</span>
              </button>
            </div>
          </form>
        </div>

        {/* Second Card */}
        <div className="col-span-1 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">ID</th>
                  <th className="py-3 lg:py-4 px-2">promotion URL</th>
                  <th className="py-3 lg:py-4 px-2">Icon</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed">
                  <td className="py-3 lg:py-4 px-2">{promotionData.id || "1"}</td>
                  <td className="py-3 lg:py-4 px-2">{promotionData.url || ""}</td>
                  <td className="py-3 lg:py-4 px-2">
                    <Image
                      src={promotionData.photo || "/path-to-static-logo1.jpg"}
                      alt="Free Wi-Fi"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </td>
                  <td className="py-3 lg:py-4 px-2 flex items-center space-x-2">
                    <Link href={`/hotel/edit-hotel-attributes?promotionId=1`}>
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
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
    <EditHotelAttribute />
  </Suspense>
);

export default Page;
