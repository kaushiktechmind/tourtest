"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Define the type for attribute data
interface Attribute {
  id: number;
  activity_attribute_name: string;
  activity_attribute_logo: string;
}

const Page = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [preview, setPreview] = useState<string | null>(null);


  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // New states for the form
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]); // State for filtered attributes
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [attributeToDelete, setAttributeToDelete] = useState<number | null>(null);
  const openDialog = (id: number) => {
    setAttributeToDelete(id);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setAttributeToDelete(null);
  };


  // Fetch data from API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_attribute_activity"
        );
        const data = await response.json();
        setAttributes(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attributes:", error);
        alert("Failed to fetch attributes. Please try again later.");
      }
    };
    fetchAttributes();
  }, []);



  // Filter attributes based on the search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredAttributes(attributes);
    } else {
      const filtered = attributes.filter((attribute) =>
        attribute.activity_attribute_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAttributes(filtered);
    }
  }, [searchQuery, attributes]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttributes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };


  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generate preview URL
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("activity_attribute_name", name);
    if (file) {
      formData.append("activity_attribute_logo", file);
    } else {
      // Optionally handle the case where no file is selected
      console.warn("No file selected");
    }
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_activity_attribute",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.reload();
        // Safeguard: Ensure prev is an array
        setAttributes((prev) => [
          ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
          {
            id: result.data.id,
            activity_attribute_name: name,
            activity_attribute_logo: result.data.activity_attribute_logo,
          },
        ]);
        // Reset the form
        setName("");
        setFile(null);
      } else {
        console.error(result.message);
        alert("Failed to add attribute. Please try again.");
      }
    } catch (error) {
      console.error("Error saving attribute:", error);
      alert("An error occurred while saving the attribute.");
    }
  };

  const handleDelete = async () => {
    if (attributeToDelete === null) return;

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_activity_attribute_by_id/${attributeToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setAttributes((prev) =>
          Array.isArray(prev) ? prev.filter((attribute) => attribute.id !== attributeToDelete) : []
        );
        alert("Attribute deleted successfully.");
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete attribute.");
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
      alert("An error occurred while deleting the attribute.");
    } finally {
      closeDialog(); // Close the dialog after deletion
    }
  };


  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Activity Attributes</h2>
        <Link href="/activity/all-activity" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Activities
        </Link>
      </div>

      {/* Statistics */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Attributes</h3>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Name :
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Attribute name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
            />
            <label
              htmlFor="icon"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Upload Icon :
            </label>

            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Selected attribute icon"
                  width={100}
                  height={100}
                  className="rounded-md border"
                />
              </div>
            )}
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

            <div className="mt-[20px]">
              <button type="submit" className="btn-primary font-semibold">
                <span className="inline-block"> Add New </span>
              </button>
            </div>
          </form>
        </div>

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
                  <th className="py-3 lg:py-4 px-2">ID</th>
                  <th className="py-3 lg:py-4 px-2">Attribute Name</th>
                  <th className="py-3 lg:py-4 px-2">Icon</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  currentItems.map((attribute, index) => (
                    <tr key={attribute.id} className="border-b border-dashed">
                      <td className="py-3 lg:py-4 px-2">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 lg:py-4 px-2">{attribute.activity_attribute_name}</td>
                      <td className="py-3 lg:py-4 px-2">
                        <Image
                          src={attribute.activity_attribute_logo}
                          alt={attribute.activity_attribute_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </td>
                      <td className="py-3 lg:py-4 px-2 flex items-center space-x-2">
                        <Link href={`/activity/edit-activity-attribute?attributeId=${attribute.id}`}>
                          <PencilSquareIcon className="w-5 h-5 text-primary" />
                        </Link>
                        <button
                          className="text-[var(--secondary-500)]"
                          onClick={() => openDialog(attribute.id)} // Open dialog with attribute id
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={filteredAttributes.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeDialog}>
              <div className="min-h-screen px-4 text-center flex items-center justify-center">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                <span className="inline-block h-screen align-middle" aria-hidden="true">
                  &#8203;
                </span>
                <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-lg">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900 mb-4">
                    Are you sure to delete this attribute?
                  </Dialog.Title>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md text-lg font-medium hover:bg-gray-400 transition duration-300"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition>


        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
