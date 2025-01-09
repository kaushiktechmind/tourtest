"use client";
import { Tab } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
// import RazorpayFerryBtn from "@/components/RazorpayFerryBtn";
import RazorpayFerryBtn from "@/components/RazorpayFerryBtn";
import { useRouter, useSearchParams } from "next/navigation";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface Passenger {
  [key: string]: string | number;
  title: string;
  name: string;
  age: string;
  sex: string;
  nationality: string;
  fcountry: string;
  fpassport: string;
  fexpdate: string;
}



const FerryDetailsPage = () => {
  const router = useRouter();
  // Parse travelData from localStorage, default to an empty object if not available
  const travelData = JSON.parse(localStorage.getItem("travelData") || "{}");
  const [bookingID, setBookingID] = useState('');

  const adults = travelData.adults ?? 0; // Default to 0 if not available
  const infants = travelData.infants ?? 0; // Default to 0 if not available

  // Parse selected ferries from localStorage, default to null if not available
  const selectedFerry = JSON.parse(localStorage.getItem("selectedFerry") || "null");
  const selectedFerry2 = JSON.parse(localStorage.getItem("selectedFerry2") || "null");
  const selectedFerry3 = JSON.parse(localStorage.getItem("selectedFerry3") || "null");

  // Assign values only if the selected ferry objects exist
  const shipTitle1 = selectedFerry?.ship_title;
  const shipTitle2 = selectedFerry2?.ship_title;
  const shipTitle3 = selectedFerry3?.ship_title;

  const scheduleId1 = selectedFerry?.id;
  const scheduleId2 = selectedFerry2?.id;
  const scheduleId3 = selectedFerry3?.id;

  const shipClassTitle1 = selectedFerry?.ship_class_title;
  const shipClassTitle2 = selectedFerry2?.ship_class_title;
  const shipClassTitle3 = selectedFerry3?.ship_class_title;

  const shipClassId1 = selectedFerry?.ship_class_id;
  const shipClassId2 = selectedFerry2?.ship_class_id;
  const shipClassId3 = selectedFerry3?.ship_class_id;

  const departureTime1 = selectedFerry?.departure_time;
  const departureTime2 = selectedFerry2?.departure_time;
  const departureTime3 = selectedFerry3?.departure_time;

  const arrivalTime1 = selectedFerry?.arrival_time;
  const arrivalTime2 = selectedFerry2?.arrival_time;
  const arrivalTime3 = selectedFerry3?.arrival_time;

  const shipClassPrice1 = selectedFerry?.ship_class_price;
  const shipClassPrice2 = selectedFerry2?.ship_class_price || 0;
  const shipClassPrice3 = selectedFerry3?.ship_class_price || 0;
  const totalPrice = Number(shipClassPrice1) + Number(shipClassPrice2) + Number(shipClassPrice3);

  // Assign travel data properties, default to undefined if not available
  const travelDate1 = travelData.travel_date1;
  const travelDate2 = travelData.travel_date2;
  const travelDate3 = travelData.travel_date3;

  const from1 = travelData.from1;
  const from2 = travelData.from2;
  const from3 = travelData.from3;

  const to1 = travelData.to1;
  const to2 = travelData.to2;
  const to3 = travelData.to3;




  const calculateTimeDifference = (departureTime: string, arrivalTime: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds, 0);
      return date;
    };

    const departureDate = formatTime(departureTime);
    const arrivalDate = formatTime(arrivalTime);

    const timeDifference = arrivalDate.getTime() - departureDate.getTime();

    // Convert time difference from milliseconds to hours and minutes
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 or 12-hour to 12-hour clock
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };


  const [bookingId, setBookingId] = useState(null);





  const [nationalities, setNationalities] = useState(
    Array.from({ length: adults + infants }).fill("Indian")
  );

  const handleNationalityChange = (index: number, nationality: unknown) => {
    const updatedNationalities = [...nationalities];
    updatedNationalities[index] = nationality;
    setNationalities(updatedNationalities);
  };


  const [passengerData, setPassengerData] = useState<Passenger[]>([
    ...Array.from({ length: adults + infants }, () => ({
      title: "Mr",
      name: "",
      age: "",
      sex: "Male",
      nationality: "Indian",
      fcountry: "",
      fpassport: "",
      fexpdate: "",
    }))
  ]);
  

  const storedName = localStorage.getItem("name");
  const storedEmail = localStorage.getItem("email");
  const storedMobile = localStorage.getItem("mobile_number");


  const [contactDetails, setContactDetails] = useState({
    c_name: storedName,
    c_mobile: storedMobile,
    c_email: storedEmail,
    p_contact: "",
    c_remark: "",
    no_of_passenger: adults + infants,
    schedule_id: scheduleId1,
    travel_date: travelDate1,
    class_id: shipClassId1,
    fare: shipClassPrice1,
    tc_check: true,
    return_schedule_id: "",
    return_travel_date: "",
    return_class_id: "",
    return_fare: "",
  });




  useEffect(() => {
    // Fetch `selectedFerry2` and `selectedFerry3` from localStorage
    const selectedFerry3 = localStorage.getItem("selectedFerry3");
    const selectedFerry2 = localStorage.getItem("selectedFerry2");

    // Conditional logic to set `return_schedule_id` and related fields
    if (selectedFerry3) {
      setContactDetails((prev) => ({
        ...prev,
        return_schedule_id: scheduleId3,
        return_travel_date: travelDate3,
        return_class_id: shipClassId3,
        return_fare: shipClassPrice3,
      }));
    } else if (selectedFerry2) {
      setContactDetails((prev) => ({
        ...prev,
        return_schedule_id: scheduleId2,
        return_travel_date: travelDate2,
        return_class_id: shipClassId2,
        return_fare: shipClassPrice2,
      }));
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedData = [...passengerData];

    updatedData[index][field] = value;
    setPassengerData(updatedData);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactDetails({ ...contactDetails, [field]: value });
  };

  // const handleSubmit = async () => {
  //   const passenger = passengerData.reduce((acc, data, index) => {
  //     acc[index + 1] = data;
  //     return acc;
  //   }, {});

  //   const payload = {
  //     data: {
  //       passenger,
  //       ...contactDetails,
  //     },
  //   };

  //   try {
  //     const response = await fetch("https://staging.makruzz.com/booking_api/savePassengers", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Mak_Authorization: localStorage.getItem("Mak_Authorization"),
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("Successssssss:", result);
  //       alert("Success:");
  //     } else {
  //       console.error("Error:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Request failed:", error);
  //   }
  // };

  const generateBookingID = () => {
    // Generate a random number with a fixed length
    const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
    return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
  };

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);





  // const handleDownloadTicket = async (bookingId) => {
  //   try {
  //     const response = await fetch("https://staging.makruzz.com/booking_api/download_ticket_pdf", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Mak_Authorization: localStorage.getItem("Mak_Authorization"),
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           booking_id: bookingId,
  //         },
  //       }),
  //     });

  //     if (response.ok) {
  //       // The response is expected to be a base64-encoded string (not JSON)
  //       const result = await response.text(); // Get response as text, not JSON
  //       console.log("Response from download_ticket_pdf API:", result);

  //       // Decode the base64 string
  //       const base64String = result;

  //       if (base64String) {
  //         // Debugging step: Check the base64 string's contents
  //         console.log("Base64 string received:", base64String);

  //         try {
  //           // Decode the base64 string into a byte array
  //           const byteCharacters = atob(base64String);
  //           const byteArrays = [];

  //           // Convert the base64 string into an array of bytes
  //           for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
  //             const slice = byteCharacters.slice(offset, offset + 1024);
  //             const byteNumbers = new Array(slice.length);
  //             for (let i = 0; i < slice.length; i++) {
  //               byteNumbers[i] = slice.charCodeAt(i);
  //             }
  //             const byteArray = new Uint8Array(byteNumbers);
  //             byteArrays.push(byteArray);
  //           }

  //           // Combine all byte arrays into one Uint8Array
  //           const byteArray = new Uint8Array(byteArrays.reduce((acc, arr) => acc.concat(Array.from(arr)), []));

  //           // Create a Blob from the byte array (PDF format)
  //           const blob = new Blob([byteArray], { type: "application/pdf" });

  //           // Create an object URL for the Blob
  //           const link = document.createElement("a");
  //           link.href = URL.createObjectURL(blob);
  //           link.download = `ticket_${bookingId}.pdf`; // Customize the file name
  //           link.click(); // Trigger the download

  //           alert("Ticket PDF download...");
  //         } catch (error) {
  //           console.error("Error decoding base64 or downloading the file:", error);
  //           alert("Error decoding the ticket or downloading the file.");
  //         }
  //       } else {
  //         console.error("No PDF data received in the response.");
  //         alert("Error: No PDF data received.");
  //       }
  //     } else {
  //       console.error("Error downloading ticket:", response.statusText);
  //       alert("Error downloading ticket.");
  //     }
  //   } catch (error) {
  //     console.error("Request failed:", error);
  //     alert("An error occurred while processing your request.");
  //   }
  // };



  const handleDownloadTicket = async (bookingId: any) => {
    try {
      const downloadResponse = await fetch("https://staging.makruzz.com/booking_api/download_ticket_pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Mak_Authorization: localStorage.getItem("Mak_Authorization") ?? "",
        },
        body: JSON.stringify({
          data: {
            booking_id: bookingId,
          },
        }),
      });

      if (downloadResponse.ok) {
        const base64String = await downloadResponse.text();

        if (base64String) {
          console.log("Base64 string received:", base64String);

          // Prepare data to be sent to the store_payment API
          const paymentData = {
            invoice_pdf: base64String, // Save the PDF in the `invoice_pdf` key
            service_type: "Ferry",
            invoice_id: "XXXXX",
            booking_id: bookingID,
            customer_id: "7",
            customer_name: storedName, // Replace with your field and value
            customer_email: storedEmail, // Replace with your field and value
            ammount: totalPrice,
            starting_date: travelDate1,
            adults: adults,
          };

          const storeResponse = await fetch("https://yrpitsolutions.com/tourism_api/api/user/store_payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(paymentData),
          });

          if (storeResponse.ok) {
            const storeResult = await storeResponse.json();
            console.log("Data saved to store_payment API:", storeResult);
            alert("PDF and data saved successfully!");
          } else {
            console.error("Error saving data to store_payment:", storeResponse.statusText);
            alert("Error saving data.");
          }
        } else {
          console.error("No PDF data received in the response.");
          alert("Error: No PDF data received.");
        }
      } else {
        console.error("Error downloading ticket:", downloadResponse.statusText);
        alert("Error downloading ticket.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while processing your request.");
    }
  };





  const handleSubmit = async () => {
    const passenger = passengerData.reduce<{ [key: number]: typeof passengerData[0] }>((acc, data, index) => {
      acc[index + 1] = data;
      return acc;
    }, {});

    const payload = {
      data: {
        passenger,
        ...contactDetails,
      },
    };

    try {
      // First, save passengers' data
      const response = await fetch("https://staging.makruzz.com/booking_api/savePassengers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Mak_Authorization: localStorage.getItem("Mak_Authorization") ?? "",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Success!");

        // Extract the booking_id(s) from the result
        const { booking_id, return_booking_id } = result.data;

        let confirmResponse;
        if (return_booking_id) {
          // For multiple trips, both booking_id and return_booking_id are present
          confirmResponse = await fetch("https://staging.makruzz.com/booking_api/confirm_booking_v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Mak_Authorization: localStorage.getItem("Mak_Authorization")?? "",
            },
            body: JSON.stringify({
              data: {
                booking_id: [booking_id, return_booking_id],
              },
            }),
          });
        } else {
          // For a single trip, only booking_id is present
          confirmResponse = await fetch("https://staging.makruzz.com/booking_api/confirm_booking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Mak_Authorization: localStorage.getItem("Mak_Authorization")?? "",
            },
            body: JSON.stringify({
              data: {
                booking_id,
              },
            }),
          });
        }

        if (confirmResponse.ok) {
          const confirmResult = await confirmResponse.json();
          console.log("Booking confirmed:", confirmResult);
          alert("Booking confirmed!");

          // Trigger ticket download after booking confirmation
          // Pass the correct booking_id to the handleDownloadTicket function
          handleDownloadTicket(booking_id); // Call handleDownloadTicket with booking_id
          localStorage.removeItem("selectedFerry");
          localStorage.removeItem("selectedFerry2");
          localStorage.removeItem("selectedFerry3");
          localStorage.removeItem("travelData");
          router.push("/ferry-payment");
        } else {
          console.error("Error confirming booking:", confirmResponse.statusText);
        }
      } else {
        console.error("Error saving passengers:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };






  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment Success Data:', paymentData);
    handleSubmit();
  };





  return (
    <div className="bg-[var(--bg-2)] py-[30px] lg:py-[60px] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[40px]">
          <div className="col-span-12 xl:col-span-8">
            <div className="section-space--sm">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <h2 className="mb-0 h2 flex items-center flex-wrap gap-4 text-[var(--neutral-700)]">
                      <span> Add Traveller(s) Details </span>
                    </h2>
                  </div>

                  {/* <button onClick={() => handleDownloadTicket("5818")}>Download Ticket PDF</button> */}

                  {Array.from({ length: adults }).map((_, index) => (
                    <div className="flight-card bg-white border-dashed rounded-2xl mt-6" key={`adult-${index}`}>
                      <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                        <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                          <div className="flex w-full flex-col gap-6 text-center md:text-start">
                            <p className="mb-0 font-medium">Adult {index + 1}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Title Dropdown */}
                              <select onChange={(e) => handlePassengerChange(index, "title", e.target.value)}>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Master">Master</option>
                              </select>

                              {/* Full Name Field */}
                              <input
                                type="text"
                                placeholder="Full Name"
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                              />

                              {/* Age Field */}
                              <input
                                type="number"
                                placeholder="Age"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                                onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                              />

                              {/* Sex Field */}
                              {/* <input
                                type="text"
                                placeholder="Sex"
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                                onChange={(e) => handlePassengerChange(index, "sex", e.target.value)}
                              /> */}
                              <select
                                className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                                onChange={(e) => handlePassengerChange(index, "sex", e.target.value)} // Handle the change event
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>


                              <select
                                value={passengerData[index].nationality}
                                onChange={(e) => handlePassengerChange(index, "nationality", e.target.value)}
                                className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                              >
                                <option value="Indian">Indian</option>
                                <option value="Foreigner">Foreigner</option>
                              </select>
                            </div>

                            {passengerData[index].nationality === "Foreigner" && (
                              <div className="flex flex-wrap items-center gap-4 mt-4">
                                <input
                                  type="text"
                                  placeholder="Country"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "fcountry", e.target.value)}
                                />
                                <input
                                  type="text"
                                  placeholder="Passport Number"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "fpassport", e.target.value)}
                                />
                                <input
                                  type="date"
                                  placeholder="Passport Expiry Date"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "fexpdate", e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {Array.from({ length: infants }).map((_, infantIndex) => {
                    const index = adults + infantIndex; // Offset by the number of adults
                    return (
                      <div className="flight-card bg-white border-dashed rounded-2xl mt-6" key={`infant-${infantIndex}`}>
                        <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                          <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                            <div className="flex w-full flex-col gap-6 text-center md:text-start">
                              <p className="mb-0 font-medium">Infant {infantIndex + 1}</p>
                              <div className="flex flex-wrap items-center gap-4">
                                {/* Title Dropdown */}
                                <select onChange={(e) => handlePassengerChange(index, "title", e.target.value)}>
                                  {/* <option value="Mr">INFANT</option> */}
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Miss">Miss</option>
                                  <option value="Master">Master</option>
                                </select>
                                {/* 
                                
                                {/* Full Name Field */}
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                                />

                                <input
                                  type="number"
                                  placeholder="Age"
                                  className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                                />

                                {/* Sex Field */}
                                <select
                                  // Set the default selected value
                                  className="border border-neutral-300 rounded-lg p-2 w-24 focus:outline-none"
                                  onChange={(e) => handlePassengerChange(index, "sex", e.target.value)} // Handle the change event
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>


                                <select
                                  value={passengerData[index].nationality}
                                  onChange={(e) => handlePassengerChange(index, "nationality", e.target.value)}
                                  className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                >
                                  <option value="Indian">Indian</option>
                                  <option value="Foreigner">Foreigner</option>
                                </select>

                              </div>

                              {passengerData[index].nationality === "Foreigner" && (
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                  <input
                                    type="text"
                                    placeholder="Country"
                                    className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                    onChange={(e) => handlePassengerChange(index, "fcountry", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Passport Number"
                                    className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                    onChange={(e) => handlePassengerChange(index, "fpassport", e.target.value)}
                                  />
                                  <input
                                    type="date"
                                    placeholder="Passport Expiry Date"
                                    className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                                    onChange={(e) => handlePassengerChange(index, "fexpdate", e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <h2 className="mb-0 h2 flex items-center flex-wrap gap-4 text-[var(--neutral-700)]">
                      <span> Add Contact Details </span>
                    </h2>
                  </div>
                  <div className="flight-card bg-white border-dashed rounded-2xl">
                    <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="text"
                          placeholder="Customer Name"
                          value={contactDetails.c_name || ''}
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("c_name", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Email Address"
                          value={contactDetails.c_email || ''}
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("c_email", e.target.value)}
                        />

                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="number"
                          placeholder="Phone Number"
                          value={contactDetails.c_mobile || ''}
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("c_mobile", e.target.value)}
                        />

                        <input
                          type="tel"
                          placeholder="Alternative Number"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("p_contact", e.target.value)}
                        />

                        {/* <input
                          type="tel"
                          placeholder="Number of Passenger"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("no_of_passenger", e.target.value)}
                        /> */}
                        {/* <input
                          type="text"
                          placeholder="Schedule ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("schedule_id", e.target.value)}
                        /> */}
                      </div>

                      {/* <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="text"
                          placeholder="Travel Date"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("travel_date", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Class ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("class_id", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Fare"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("fare", e.target.value)}
                        />
                      </div> */}

                      {/* <div className="flex flex-wrap items-center gap-4">
                        <input
                          type="text"
                          placeholder="TC Check"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("tc_check", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Return Schedule Id"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("return_schedule_id", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Return Travel Date"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("return_travel_date", e.target.value)}
                        />
                      </div> */}

                      <div className="flex flex-wrap items-center gap-4">
                        {/* <input
                          type="text"
                          placeholder="Return Class ID"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("return_class_id", e.target.value)}
                        /> */}
                        {/* <input
                          type="number"
                          placeholder="Return Fare"
                          className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                          onChange={(e) => handleContactChange("return_fare", e.target.value)}
                        /> */}

                      </div>
                      {/* <textarea
                        placeholder="Remark"
                        className="border border-neutral-300 rounded-lg p-2 flex-grow focus:outline-none"
                        onChange={(e) => handleContactChange("c_remark", e.target.value)}
                      /> */}
                    </div>
                  </div>
                </div>


                {/* <button onClick={handleSubmit}>Submit</button> */}



                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-2)] rounded-2xl border border-neutral-40 mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">
                    {" "}
                    Terms & Conditions:{" "}
                  </h4>
                  <div className="hr-dashed my-5"></div>
                  <h6 className="mb-4"> Passengers traveling </h6>
                  <ul className="list-disc pl-4 gap-3 mb-8">
                    <li>
                      Passengers are requested to re-confirm their booking one day in advance,Contact Number : Tel: 03192-236677, 237788 | M:+91-8001240006(0900hrs to
                      1700hrs).
                    </li>
                    <li>
                      Correction of NAME is not permitted in ticket ONCE BOOKED. So please make sure for correct NAME.
                    </li>
                    <li>
                      Reporting should be 2 hrs prior to departure.
                    </li>
                  </ul>
                  <ul className="pl-4 list-disc gap-3 mb-8">
                    <li>
                      Passenger should carry a PHOTO IDENTITY CARD & RTPCR report hard copy at the time of Check-In
                    </li>
                    <li>
                      . Cancellation Charges Before 48Hrs of Departure - Rs100 + Taxes are applicable (Documentation Charges Per Ticket No.), Before 24Hrs of Departure - 50% +
                      Taxes are applicable, WITHIN 24 Hrs of Departure - No Refund.

                    </li>
                    <li>
                      Tickets are Non Transferable and Non Re-routable.
                    </li>
                    <li>
                      . LIQUOR & SMOKING is NOT ALLOWED in the vessel by LAW.
                    </li>
                    <li>
                      . Passenger belongings carried in hand will be at their own risk carrier is no way liable in any lose or damage from what so ever it may cause
                    </li>
                    <li>
                      The carrier reserves the right to cancel or change the published voyage for any official purpose and in any manner or to any extent. The carrier shall bear no
                      liability for any loss that passenger may suffer, any consequences thereof or in respect of any changes in scheduled due to Bad weather or Technical reasons, In this
                      case passenger can either claim full refund or can rescheduled His/her Journey on availability
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="link flex items-center gap-2 text-primary">
                    <span className="font-semibold inline-block">
                      Read More
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href="#"
                    className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-1">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="inline-block font-semibold">
                      Previous Flight
                    </span>
                  </Link>
                  <ul className="flex flex-wrap gap-3 justify-center order-3 flex-grow md:order-2">
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-linkedin-in"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                        <i className="lab text-xl la-dribbble"></i>
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-2">
                    <span className="inline-block font-semibold">
                      Next Flight
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
              <div className="flex items-center justify-between gap-4 mb-10">
                <h5 className="mb-0 h2 flex items-center flex-wrap gap-4">
                  <h5> Your Selections </h5>
                </h5>
              </div>
              <h1>Trip 1</h1>
              <div className="flight-card bg-white border-dashed rounded-2xl">
                <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                  <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                    <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                      <div className="grid place-content-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto ms-md-0">
                        <Image
                          width={52}
                          height={27}
                          src={'/img/makruzz.jpg'}
                          alt="image"
                          className=" object-fit-contain"
                        />
                      </div>
                      <p className="mb-0 font-medium">Makruzz</p>
                    </div>
                    <div className="flex md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow w-full md:w-auto">
                      <span className="block text-primary">From</span>
                      <h6 className="mb-0  font-semibold">
                        {formatTime(departureTime1)}
                      </h6>
                      <span className="block text-[var(--neutral-700)]">
                        {from1}
                      </span>
                    </div>
                    <div className="flex w-full md:w-auto justify-center flex-col gap-2 text-center flex-grow">
                      <div className="grid place-content-center w-12 h-12 shadow-lg rounded-full mx-auto">
                        <div className="grid place-content-center w-10 h-10 bg-[var(--primary-light)] text-primary rounded-full">
                          <i className="las la-ship text-2xl"></i>
                        </div>
                      </div>
                      <span className="block clr-neutral-500">
                        {calculateTimeDifference(departureTime1, arrivalTime1)}
                      </span>
                    </div>
                    <div className="flex w-full md:w-auto md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow">
                      <span className="block text-primary">To</span>
                      <h6 className="mb-0  font-semibold">
                        {formatTime(arrivalTime1)}
                      </h6>
                      <span className="block text-[var(--neutral-700)]">
                        {to1}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center text-center gap-3 rounded-xl bg-[#F7F7FE] p-3">
                    <p className="mb-0">
                      Date :
                      <span className="text-amber-700"> {travelDate1} </span>
                    </p>
                    <p className="mb-0">
                      Travel Class :
                      <span className="text-primary"> {shipClassTitle1}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {typeof window !== "undefined" && localStorage.getItem("selectedFerry2") && (
              <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                <h1>Trip 2</h1>
                <div className="flight-card bg-white border-dashed rounded-2xl">
                  <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                    <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                      <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                        <div className="grid place-content-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto ms-md-0">
                          <Image
                            width={52}
                            height={27}
                            src={'/img/makruzz.jpg'}
                            alt="image"
                            className=" object-fit-contain"
                          />
                        </div>
                        <p className="mb-0 font-medium">Makruzz</p>
                      </div>
                      <div className="flex md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow w-full md:w-auto">
                        <span className="block text-primary">From</span>
                        <h6 className="mb-0  font-semibold">
                          {formatTime(departureTime2)}
                        </h6>
                        <span className="block text-[var(--neutral-700)]">
                          {from1}
                        </span>
                      </div>
                      <div className="flex w-full md:w-auto justify-center flex-col gap-2 text-center flex-grow">
                        <div className="grid place-content-center w-12 h-12 shadow-lg rounded-full mx-auto">
                          <div className="grid place-content-center w-10 h-10 bg-[var(--primary-light)] text-primary rounded-full">
                            <i className="las la-ship text-2xl"></i>
                          </div>
                        </div>
                        <span className="block clr-neutral-500">
                          {calculateTimeDifference(departureTime2, arrivalTime2)}
                        </span>
                      </div>
                      <div className="flex w-full md:w-auto md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow">
                        <span className="block text-primary">To</span>
                        <h6 className="mb-0  font-semibold">
                          {formatTime(arrivalTime2)}
                        </h6>
                        <span className="block text-[var(--neutral-700)]">
                          {to1}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center text-center gap-3 rounded-xl bg-[#F7F7FE] p-3">
                      <p className="mb-0">
                        Date :
                        <span className="text-amber-700"> {travelDate2} </span>
                      </p>
                      <p className="mb-0">
                        Travel Class :
                        <span className="text-primary"> {shipClassTitle2}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {typeof window !== "undefined" && localStorage.getItem("selectedFerry3") && (
              <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-10">
                <h1>Trip 3</h1>
                <div className="flight-card bg-white border-dashed rounded-2xl">
                  <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                    <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                      <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                        <div className="grid place-content-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto ms-md-0">
                          <Image
                            width={52}
                            height={27}
                            src={'/img/makruzz.jpg'}
                            alt="image"
                            className="object-fit-contain"
                          />
                        </div>
                        <p className="mb-0 font-medium">Makruzz</p>
                      </div>
                      <div className="flex md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow w-full md:w-auto">
                        <span className="block text-primary">From</span>
                        <h6 className="mb-0 font-semibold">{formatTime(departureTime3)}</h6>
                        <span className="block text-[var(--neutral-700)]">{from1}</span>
                      </div>
                      <div className="flex w-full md:w-auto justify-center flex-col gap-2 text-center flex-grow">
                        <div className="grid place-content-center w-12 h-12 shadow-lg rounded-full mx-auto">
                          <div className="grid place-content-center w-10 h-10 bg-[var(--primary-light)] text-primary rounded-full">
                            <i className="las la-ship text-2xl"></i>
                          </div>
                        </div>
                        <span className="block clr-neutral-500">
                          {calculateTimeDifference(departureTime3, arrivalTime3)}
                        </span>
                      </div>
                      <div className="flex w-full md:w-auto md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow">
                        <span className="block text-primary">To</span>
                        <h6 className="mb-0 font-semibold">{formatTime(arrivalTime3)}</h6>
                        <span className="block text-[var(--neutral-700)]">{to1}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center text-center gap-3 rounded-xl bg-[#F7F7FE] p-3">
                      <p className="mb-0">
                        Date : <span className="text-amber-700"> {travelDate3} </span>
                      </p>
                      <p className="mb-0">
                        Travel Class :
                        <span className="text-primary"> {shipClassTitle3}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}



            <div className="pb-0 mb-6 relative">
              <div className="bg-white rounded-2xl py-8 px-6">
                <Tab.Group>
                  <Tab.Panels className="tab-content mb-8">
                    <Tab.Panel>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500">Trip 1 </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="mb-0 clr-neutral-500">Ship Class Price </p>
                        <p className="mb-0 font-medium"> ₹{shipClassPrice1}</p>
                      </div>
                      <div className="hr-dashed my-4"></div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>


              </div>
            </div>

            {typeof window !== "undefined" && localStorage.getItem("selectedFerry2") && (
              <div className="pb-0 mb-6 relative">
                <div className="bg-white rounded-2xl py-8 px-6">
                  <Tab.Group>
                    <Tab.Panels className="tab-content mb-8">
                      <Tab.Panel>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">Trip 2</p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">Ship Class Price</p>
                          <p className="mb-0 font-medium"> ₹{shipClassPrice2}</p>
                        </div>
                        <div className="hr-dashed my-4"></div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            )}

            {typeof window !== "undefined" && localStorage.getItem("selectedFerry3") && (
              <div className="pb-0 mb-6 relative">
                <div className="bg-white rounded-2xl py-8 px-6">
                  <Tab.Group>
                    <Tab.Panels className="tab-content mb-8">
                      <Tab.Panel>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">Trip 3</p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">Ship Class Price</p>
                          <p className="mb-0 font-medium"> ₹{shipClassPrice3}</p>
                        </div>
                        <div className="hr-dashed my-4"></div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pl-6 pt-6 pr-6">
              <p className="mb-0 clr-neutral-500">
                {" "}
                Total Price{" "}
              </p>
              <p className="mb-0 font-medium"> ₹{totalPrice} </p>
            </div>
            {/* <Link
              href="/ferry-payment"
              className="mt-6 link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6">
              <span className="inline-block"> Proceed Booking </span>
            </Link> */}

            <RazorpayFerryBtn
              grandTotal={Number(totalPrice) * 100} // convert to paise
              // grandTotal={2 * 100} // convert to paise
              currency="INR"
              onPaymentSuccess={handlePaymentSuccess} // Pass the success handler here
            >
            </RazorpayFerryBtn>

          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FerryDetailsPage />
  </Suspense>
);


export default Page;
