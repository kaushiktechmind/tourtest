"use client";
import Image from "next/image";
import Link from "next/link";
import LoginImg from "@/public/img/admin-signin.png";
import { useEffect, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const SignupPage = () => {
  // State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [id, setId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/img/user-1.jpg"); // Default photo
  
  

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedPhoto = localStorage.getItem("profile_photo");

    if (storedId) {
      setId(storedId);
    }
    if (storedName) {
      setFullName(storedName);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
  }, []);

  // Function to close the popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const payload = {
      name: fullName,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      // You can include other fields as needed
    };
  
    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/admin_update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Add your Bearer token if needed
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful update
        setIsPopupVisible(true); // Show success popup
        // Optionally update local storage with new data
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("mobile_number", data.user.mobile_number);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("profile_photo", data.user.profile_photo);
      } else {
        // Handle errors
        setErrorMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to update user information.");
    }
  };
  
  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-1)] signup-section">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 lg:gap-8 mx-3 mt-[20px]">
          <div className="col-span-2 lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4 h3"> Admin Profile </h3>
                <p className="mb-10">Update Your Details</p>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
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
                  <div className="col-span-12">
                    <label htmlFor="mobile-number" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Enter Your Mobile Number
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Mobile Number"
                      id="mobile-number"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="email" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Enter Your Email ID
                    </label>
                    <input
                      type="email"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="password" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Enter Your Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="confirm-password" className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Confirm Your Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Confirm Your Password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="icon" className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                      Upload Icon :
                    </label>
                    <div className="pt-6">
                      <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed">
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
                            // onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <p className="mb-0">
                      Do you have an account?
                      <Link href="sign-in" className="link font-semibold text-primary">
                        Signin
                      </Link>
                    </p>
                  </div>
                  <div className="col-span-12">
                    <button
                      type="submit"
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:bg-primary-400 font-semibold"
                    >
                      <span className="inline-block"> Update Profile </span>
                    </button>
                  </div>
                </div>
                {/* Error Message Display */}
                {errorMessage && (
                  <div className="mt-4 text-red-600">{errorMessage}</div>
                )}
              </form>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 flex justify-center items-center">
            <Image src={LoginImg} alt="login image" className="mx-auto max-w-[450px]" />
          </div>
        </div>
      </div>
      {/* Success Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Profile Updated Successfully!</h2>
            <button onClick={closePopup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
