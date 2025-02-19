"use client";
import {
  CloudArrowUpIcon,
  InformationCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const AttributeForm = () => {
  const [amenityData, setAmenityData] = useState({
    activity_attribute_name: "",
    activity_attribute_logo: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconImage, setIconImage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const attributeId = searchParams.get("attributeId");

  // Fetch the amenity data by ID
  useEffect(() => {
    if (attributeId) {
      const fetchData = async () => {
        const token = localStorage.getItem("access_token");

        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/get_attribute_activity_by_id/${attributeId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data && data.data) {
            setAmenityData({
              activity_attribute_name: data.data.activity_attribute_name || "",
              activity_attribute_logo: data.data.activity_attribute_logo || "",
            });
          }
        } catch (error) {
          console.error("Error fetching amenity data:", error);
        }
      };
      fetchData();
    }
  }, [attributeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`Input changed: ${id} = ${value}`);
    setAmenityData((prev) => ({ ...prev, [id]: value }));
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

    if (!amenityData.activity_attribute_name.trim()) {
      alert("Amenity name is required.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const form = new FormData();
    form.append("activity_attribute_name", amenityData.activity_attribute_name);

    // Send existing amenity logo if no new file is uploaded
    if (iconFile) {
      form.append("activity_attribute_logo", iconFile);
    } else {
      // If no new logo is uploaded, send the existing activity_attribute_logo URL
      form.append("activity_attribute_logo", amenityData.activity_attribute_logo);
    }

    form.append("_method", "PUT");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_activity_attribute_by_id/${attributeId}`,
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
        console.error("Response error:", errorResponse);
        alert(
          "Error updating amenity: " + (errorResponse.message || "Unknown error")
        );
        return;
      }

      const result = await response.json();
      alert("Amenity updated successfully!");
      router.push("/activity/activity-attributes");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };




  return (
    
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit activity Attributes</h2>
        <Link href="/activity/activity-attribute" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Attributes
        </Link>
      </div>

      {/* Edit form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
      <div className="col-span-12 flex justify-center">
          <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Attributes</h3>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="activity_attribute_name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
              >
                Name :
              </label>
              <input
                type="text"
                id="activity_attribute_name"
                value={amenityData.activity_attribute_name}
                onChange={handleInputChange}
                placeholder="Attribute name"
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border-primary outline-1"
                required
              />

              {/* Show the current logo if available */}
              {amenityData.activity_attribute_logo && (
                <div className="mt-4">
                  <Image
                    width={22}
                    height={22}
                    src={iconFile ? iconImage : amenityData.activity_attribute_logo}
                    alt="Current Amenity Logo"
                    className="h-20 w-20 object-contain"
                  />
                </div>
              )}

              <label
                htmlFor="icon"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
              >
                Upload Icon :
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
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-[20px] text-center">
                <button type="submit" className="btn-primary font-semibold">
                  <span className="inline-block"> Update </span>
                </button>
              </div>
            </form>
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
    <AttributeForm />
  </Suspense>
);

export default Page;
