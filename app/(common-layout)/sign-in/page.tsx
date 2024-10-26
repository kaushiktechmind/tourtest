"use client"
import Image from "next/image";
import Link from "next/link";
import LoginImg from "@/public/img/admin-signin.png";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Clear any previous errors
    setError("");

    // API request to login
    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      
      // Save the token (You can also store admin info as needed)
      localStorage.setItem("access_token", data.access_token);
      
      // Show the popup after successful login
      setShowPopup(true);
      console.log("Login successful:", data.admin);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Set error message if err is an instance of Error
      } else {
        setError("An unknown error occurred."); // Fallback error message
      }
    }
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    // Optionally redirect to another page here
    // window.location.href = "/dashboard"; // Uncomment if you want to redirect
  };

  return (
    <div className="py-[30px] lg:py-[60px] signup-section">
      <div className="container bg-green">
        <div className="grid grid-cols-2 gap-6 md:gap-8 mx-3 mt-[100px]">
          <div className="col-span-2 lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
              <form onSubmit={handleLogin}>
                <h3 className="mb-4 h3"> Welcome </h3>
                <p className="mb-10"> Sign in to your account and join us </p>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <label
                      htmlFor="enter-email"
                      className="text-base sm:text-lg md:text-xl font-medium block mb-3">
                      Enter Your Email ID
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5"
                      placeholder="Enter Your Email"
                      id="enter-email"
                      required
                    />
                  </div>
                  <div className="col-span-12">
                    <label
                      htmlFor="enter-password"
                      className="text-base sm:text-lg md:text-xl font-medium block mb-3">
                      Enter Your Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[var(--bg-1)] border focus:outline-none rounded-full py-3 px-5 mb-3"
                      placeholder="Enter Your Password"
                      id="enter-password"
                      required
                    />
                    <Link
                      href="signup"
                      className="link block text-sm text-primary :clr-primary-400 text-end">
                      Forget password
                    </Link>
                  </div>
                  {error && <div className="text-red-500 mb-3">{error}</div>}
                  <div className="col-span-12">
                    <p className="mb-0">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="signup"
                        className="link font-semibold text-primary">
                        Signup
                      </Link>
                    </p>
                  </div>
                  <div className="col-span-12">
                    <button
                      type="submit"
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-semibold">
                      <span className="inline-block"> Signin </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Image
              src={LoginImg}
              className="w-full 3xl:translate-x-20"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* Popup for successful login */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg text-center">
            <h2 className="text-lg font-semibold">Login Successful!</h2>
            <p className="mt-2">Welcome back! You have logged in successfully.</p>
            <button
              onClick={handleClosePopup}
              className="mt-4 py-2 px-4 rounded bg-primary text-white hover:bg-primary-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
