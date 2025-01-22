"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [id, setId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/img/user-1.jpg"); // Default photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const storedName = localStorage.getItem("name");
    const storedMobileNo = localStorage.getItem("mobile_number");
    const storedEmail = localStorage.getItem("email");
    const storedAddress = localStorage.getItem("address");
    const storedPhoto = localStorage.getItem("profile_photo");

    if (storedId) setId(storedId);
    if (storedName) setFullName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedAddress) setAddress(storedAddress);
    if (storedMobileNo) setMobileNo(storedMobileNo);
    if (storedPhoto) setProfilePhoto(storedPhoto);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file)); // Preview the image
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("mobile_number", mobileNo);

    if (photoFile) {
      formData.append("profile_photo", photoFile); // Append the new image file
    }
    formData.append('_method', 'PUT');
    
    try {
      const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/user/user_update/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData, // Send the form data including the image
      });

      const data = await response.json();

      if (response.ok) {
        // If the update was successful, use the new profile photo from the response
        setIsPopupVisible(true); // Show success popup
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("mobile_number", data.user.mobile_number);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("address", data.user.address);
        localStorage.setItem("profile_photo", data.user.profile_photo); // Update the new photo URL
        setProfilePhoto(data.user.profile_photo); // Update profile photo in frontend
      } else {
        setErrorMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to update user information.");
    }
  };

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-1)] signup-section">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 lg:gap-8 mx-3 mt-[20px]">
          <div className="col-span-6 lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4 h3"> User Profile </h3>
                <p className="mb-10">Update Your Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="full-name" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Full Name"
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="mobile-number" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Mobile Number"
                      id="mobile-number"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="email" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="address" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Address"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                 
                  <div className="col-span-2">
                    <label htmlFor="profile-photo" className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                      Upload Profile Photo:
                    </label>
                    <div className="pt-6">
                      <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed">
                          <span className="flex flex-col items-center justify-center py-12">
                            <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                            <span className="h3 clr-neutral-500 text-center mt-4 mb-3">Drag & Drop</span>
                            <span className="block text-center mb-6 clr-neutral-500">OR</span>
                            <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">Select Files</span>
                          </span>
                          <input
                            type="file"
                            id="dropzone-file"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                    {profilePhoto && (
                      <div className="mt-4">
                        <Image
                          src={profilePhoto}
                          alt="Profile Photo Preview"
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:bg-primary-400 font-semibold"
                    >
                      <span className="inline-block">Update Profile</span>
                    </button>
                  </div>
                </div>
                {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Profile Updated Successfully!</h2>
            <button
              onClick={closePopup}
              className="mt-4 py-2 px-4 bg-primary text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
