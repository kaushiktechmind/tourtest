"use client";
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
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
=======
import { useState } from "react";
import loginImg from "@/public/img/admin-signin.png";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // State to show success popup

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
<<<<<<< HEAD
          body: JSON.stringify({
            email,
            password,
          }),
=======
          body: JSON.stringify({ email, password }),
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
<<<<<<< HEAD

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
                      className="text-base sm:text-lg md:text-xl font-medium block mb-3"
                    >
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
                      className="text-base sm:text-lg md:text-xl font-medium block mb-3"
                    >
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
                      className="link block text-sm text-primary :clr-primary-400 text-end"
                    >
                      Forget password
                    </Link>
                  </div>
                  {error && <div className="text-red-500 mb-3">{error}</div>}
                  <div className="col-span-12">
                    <p className="mb-0">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="signup"
                        className="link font-semibold text-primary"
                      >
                        Signup
                      </Link>
                    </p>
                  </div>
                  <div className="col-span-12">
                    <button
                      type="submit"
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-semibold"
                    >
                      <span className="inline-block"> Signin </span>
                    </button>
                  </div>
                </div>
              </form>
=======
      console.log("Response Data:", data); // Log the response

      const token = data.access_token;
      console.log("Token:", token); // Log the token

      // Save token to localStorage
      localStorage.setItem("access_token", token);

      // Show success popup
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {}
  };

  return (
    <div className="bg-[var(--bg-2)]">
      {/* Success Popup */}
      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-5 shadow-lg text-center">
            <h3 className="text-green-600 text-2xl font-semibold mb-2">
              Login Successful!
            </h3>
            <p className="text-gray-700">You are now logged in.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Sign In </h2>
      </div>
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12">
          <div className="py-3 md:p-6 lg:p-10 rounded-2xl bg-white">
            <div className="flex flex-wrap items-center gap-6 xl:gap-8 mx-3">
              <div className="w-full md:w-7/12">
                <div className="bg-[var(--bg-1)] border rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
                  <form onSubmit={handleLogin}>
                    <h3 className="mb-4 h3"> Welcome Back! </h3>
                    <p className="mb-10">
                      {" "}
                      Sign in to your account and join us{" "}
                    </p>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <label
                          htmlFor="enter-email"
                          className="text-xl font-medium block mb-3"
                        >
                          Enter Your Email ID
                        </label>
                        <input
                          type="email"
                          className="w-full bg-white border focus:outline-none rounded-full py-3 px-5"
                          placeholder="Enter Your Email"
                          id="enter-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-12">
                        <label
                          htmlFor="enter-password"
                          className="text-xl font-medium block mb-3"
                        >
                          Enter Your Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-white border focus:outline-none rounded-full py-3 px-5 mb-3"
                          placeholder="Enter Your Password"
                          id="enter-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Link
                          href="signup"
                          className="link block text-sm text-primary :clr-primary-400 text-end"
                        >
                          Forget password
                        </Link>
                      </div>
                      <div className="col-span-12">
                        <p className="mb-0">
                          Don&apos;t have an account?{" "}
                          <Link
                            href="signup"
                            className="link font-semibold text-primary"
                          >
                            Signup
                          </Link>
                        </p>
                      </div>
                      <div className="col-span-12">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-semibold"
                        >
                          Signin
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="w-full md:w-4/12">
                <Image
                  src={loginImg}
                  className="w-full xxl:mr-[-200px]"
                  alt="Sign in illustration"
                />
              </div>
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
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
            <p className="mt-2">
              Welcome back! You have logged in successfully.
            </p>
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
