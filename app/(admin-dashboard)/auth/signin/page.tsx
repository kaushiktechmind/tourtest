"use client";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import loginImg from "@/public/img/admin-signin.png";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // State to show success popup

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
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
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
