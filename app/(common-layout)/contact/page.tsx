"use client";
import {
  EnvelopeOpenIcon,
  MapPinIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const serviceTypeMapping = {
  1: "Hotel",
  2: "Homestay",
  3: "Package",
  4: "Activity",
  5: "Cab",
  6: "Ferry",
};

const Page = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const serviceText = serviceTypeMapping[data.service as unknown as keyof typeof serviceTypeMapping];

      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/save_enquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            email: data.email,
            message: data.message,
            service_type: serviceText,  // Send the service name instead of number
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="py-[60px] lg:py-[120px] px-3 relative bg-white after:absolute after:bottom-0 after:right-0 after:w-full after:isolate after:h-[34%] after:bg-[var(--bg-2)]">
        <div className="text-center">
          <h2 className="h2 mt-4 mb-6"> Need Any Help? </h2>
          <p className="mb-0">
            Queries, complaints, and feedback. We will be happy to serve you
          </p>
        </div>

        <div className="container pt-[30px] lg:pt-[60px] relative z-[1]">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
                <div className="grid place-content-center w-16 h-16 rounded-full bg-primary text-white shrink-0">
                  <PhoneArrowUpRightIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <h4 className="mb-2 text-2xl font-semibold"> Free Call </h4>
                  <ul className="list">
                    <li>
                      <span className="clr-neutral-500"> (406) 555-0120 </span>
                    </li>
                    <li>
                      <span className="clr-neutral-500"> (671) 555-0110 </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
                <div className="grid place-content-center w-16 h-16 rounded-full bg-[#37D27A] text-[var(--neutral-700)] shrink-0">
                  <EnvelopeOpenIcon className="h-6 w-6" />
                </div>
                <div className="flex-grow">
                  <h4 className="mb-2 text-2xl font-semibold"> Online Support </h4>
                  <ul className="list">
                    <li>
                      <span className="clr-neutral-500">info@example.com</span>
                    </li>
                    <li>
                      <span className="clr-neutral-500">info@example.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
                <div className="grid place-content-center w-16 h-16 rounded-full bg-[var(--tertiary)] text-[var(--neutral-700)] shrink-0">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h4 className="mb-2 text-2xl font-semibold"> Our Location </h4>
                  <p className="mb-0">
                    3891 Ranchview Dr. Richardson, California 62639
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-[60px] lg:pb-[120px] pt-4 bg-[var(--bg-2)] px-3">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 justify-center justify-content-xl-between">
            <div className="col-span-12 lg:col-span-6">
              <div className="h-full">
                <iframe
                  className="h-full w-full"
                  src="https://maps.google.com/maps?q=california&t=&z=10&ie=UTF8&iwloc=&output=embed"></iframe>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h3 className="mb-0 h3"> Get a Quote </h3>
                  <div className="border border-dashed my-6"></div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <label
                        htmlFor="first-name"
                        className="text-xl font-medium block mb-3">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border rounded-full py-3 px-5"
                        placeholder="Enter Name"
                        id="first-name"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="col-span-12">
                      <label
                        htmlFor="enter-email"
                        className="text-xl font-medium block mb-3">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border rounded-full py-3 px-5"
                        placeholder="Enter Email"
                        id="enter-email"
                        {...register("email", { required: true })}
                      />
                    </div>
                    <div className="col-span-12">
                      <label
                        htmlFor="phone"
                        className="text-xl font-medium block mb-3">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border rounded-full py-3 px-5"
                        placeholder="Enter Phone Number"
                        id="phone"
                        {...register("phone", { required: true })}
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="text-xl font-medium block mb-3">
                        Select Service Type
                      </label>
                      <div className="border text-left bg-[var(--bg-1)] rounded-full px-4">
                        <select
                          className="w-full bg-transparent py-3 focus:outline-none"
                          aria-label="Default select example"
                          {...register("service", { required: true })}>
                          <option value="1">Hotel</option>
                          <option value="2">Homestay</option>
                          <option value="3">Package</option>
                          <option value="4">Activity</option>
                          <option value="5">Cab</option>
                          <option value="6">Ferry</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <label
                        htmlFor="message"
                        className="text-xl font-medium block mb-3">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        className="w-full bg-[var(--bg-1)] focus:outline-none border rounded-xl py-3 px-5"
                        placeholder="Enter Message"
                        id="message"
                        {...register("message", { required: true })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-block mt-5 text-center w-full py-4 bg-primary text-white rounded-full transition-all duration-300 transform hover:bg-primary/90 hover:scale-105">
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
