"use client";
import Image from "next/image";
import Link from "next/link";
import LoginImg from "@/public/img/admin-signin.png";
import { useState } from "react";

const SignupPage = () => {
  // State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Trim whitespace from password fields
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Check if passwords match
    if (trimmedPassword !== trimmedConfirmPassword) {
      console.error("Passwords do not match.");
      setErrorMessage("Passwords do not match."); // Set error message
      return; // Exit the function if passwords don't match
    }

    // Create an object to hold the form data
    const formData = {
      name: fullName,
      phone_number: phoneNumber,
      email: email,
      password: trimmedPassword, // Main password field
      password_confirmation: trimmedConfirmPassword, // Confirmation field
    };

    // Log form data for debugging
    console.log("Form Data:", JSON.stringify(formData));

    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful registration (e.g., show success popup)
        console.log("Registration successful:", data);
        setIsPopupVisible(true); // Show success popup
        setErrorMessage(""); // Clear any previous error messages
      } else {
        // Handle errors (e.g., display error messages)
        console.error("Registration error:", data);
        setErrorMessage(data.message || "Registration failed. Please try again."); // Set error message
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again."); // Set error message
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-1)] signup-section">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 lg:gap-8 mx-3 mt-[20px]">
          <div className="col-span-2 lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4 h3"> Let’s Get Started! </h3>
                <p className="mb-10">
                  Please enter your email address to join us
                </p>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <label
                      htmlFor="full-name"
                      className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
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
                    <label
                      htmlFor="phone-number"
                      className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Enter Your Phone Number
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Mobile Number"
                      id="phone-number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label
                      htmlFor="email"
                      className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
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
                    <label
                      htmlFor="password"
                      className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Enter Your Password
                    </label>
                    <input
                      type="password" // Change to password type
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <label
                      htmlFor="confirm-password"
                      className="text-base sm:text-lg md:text-xl font-normal sm:font-medium block mb-3">
                      Confirm Your Password
                    </label>
                    <input
                      type="password" // Change to password type
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Confirm Your Password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-span-12">
                    <p className="mb-0">
                      Do you have an account?
                      <Link
                        href="sign-in"
                        className="link font-semibold text-primary">
                        Signin
                      </Link>
                    </p>
                  </div>
                  <div className="col-span-12">
                    <button
                      type="submit"
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:bg-primary-400 font-semibold">
                      <span className="inline-block"> Signup </span>
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
          <div className="col-span-2 lg:col-span-1">
            <Image
              src={LoginImg}
              className="w-full 3xl:translate-x-20"
              alt="Sign Up Image"
            />
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h4 className="mb-4 text-lg font-semibold">Registration Successful</h4>
            <p>You have registered successfully!</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
              onClick={closePopup}
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
