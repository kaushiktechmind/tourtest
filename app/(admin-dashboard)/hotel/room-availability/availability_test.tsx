// "use client";
// import React, { Fragment, useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { Dialog, Transition } from "@headlessui/react";
// import Footer from "@/components/vendor-dashboard/Vendor.Footer";
// import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import CheckboxCustom from "@/components/Checkbox";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import SelectUI from "@/components/SelectUI";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";

// export default function DemoApp() {
//   const [roomData, setRoomData] = useState<any[]>([]); // Initialize roomData
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const hotelId = searchParams.get("hotelId");
//   const [active, setActive] = useState<number | null>(null);
//   const [roomDetails, setRoomDetails] = useState<any>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [status, setStatus] = useState("");

//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [location_name, setLocation] = useState<string>("");
//   const [roomPrice, setRoomPrice] = useState("");
//   const [noOfRooms, setNoOfRooms] = useState("");
//   // const [fetchRoomDetails, setFetchRoomDetails] = useState(null);


//   const handleSaveRoomManagement = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         console.error("Token not found!");
//         return;
//       }

//       // Format date without converting to UTC
//       const formatDate = (date: Date | null) =>
//         date
//           ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//             date.getDate()
//           ).padStart(2, "0")}`
//           : null;

//       const formattedStartDate = formatDate(startDate);

//       const payload = {
//         hotel_id: hotelId,
//         room_id: active,
//         start_date: formattedStartDate,
//         end_date: formatDate(endDate),
//         room_price: roomPrice,
//         no_of_rooms: noOfRooms,
//         location_name: location_name,
//         status,
//       };

//       // Fetch room details with fallback logic
//       let fetchedRoomDetails = [];
//       try {
//         const firstResponse = await fetch(
//           `https://yrpitsolutions.com/tourism_api/api/admin/get_room_management_by_room_id/${active}`
//         );
//         const firstData = await firstResponse.json();

//         if (firstData.length > 0) {
//           console.log("Data from first API:", firstData);
//           fetchedRoomDetails = firstData;
//         } else {
//           console.log("No data from first API, calling second API...");
//           const secondResponse = await fetch(
//             `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${active}`
//           );
//           const secondData = await secondResponse.json();

//           if (secondData?.room) {
//             console.log("Data from second API:", secondData);
//             fetchedRoomDetails = [secondData.room]; // Wrap in array for consistency
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching room details:", error);
//         alert("Failed to fetch room details.");
//         return;
//       }

//       // Debugging fetched room details
//       console.log("Fetched roomDetails:", JSON.stringify(fetchedRoomDetails, null, 2));

//       // Adjust logic for finding existing room
//       const existingRoom = fetchedRoomDetails?.find((room: any) => {
//         const roomStartDate = room.start_date?.split(" ")[0]; // Extract date part
//         console.log(
//           `Checking room - room_id: ${room.room_id}, roomStartDate: ${roomStartDate}`
//         );
//         return room.room_id === active && roomStartDate === formattedStartDate;
//       });

//       console.log("existingRoom:", existingRoom);

//       let response;
//       if (existingRoom) {
//         // If room management data already exists, call the update API
//         response = await axios.put(
//           `https://yrpitsolutions.com/tourism_api/api/admin/update_room_management_by_id/${existingRoom.id}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       } else {
//         // If no existing data, call the save API
//         response = await axios.post(
//           "https://yrpitsolutions.com/tourism_api/api/admin/save_room_management",
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       }

//       if (response.status === 200) {
//         alert(
//           existingRoom
//             ? "Room management details updated successfully!"
//             : "Room management details saved successfully!"
//         );
//         closeModal();
//         fetchRoomDetails();
//       }
//     } catch (error) {
//       console.error("Error saving or updating room management:", error);
//       alert("Failed to save or update room management details.");
//     }
//   };



//   useEffect(() => {
//     const fetchRoomDetailsForDate = async () => {
//       if (active && startDate) {
//         try {
//           const formattedStartDate = startDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
//           const response = await fetch(
//             `https://yrpitsolutions.com/tourism_api/api/admin/get_room_management_by_room_id/${active}`
//           );
//           const data = await response.json();

//           if (data.length > 0) {
//             const matchingRoom = data.find(
//               (room: any) => room.start_date.split(" ")[0] === formattedStartDate
//             );
//             if (matchingRoom) {
//               setStatus(matchingRoom.status || ""); // Prefill status
//               setRoomPrice(matchingRoom.room_price || ""); // Prefill room price
//               setNoOfRooms(matchingRoom.no_of_rooms || ""); // Prefill no of rooms
//             } else {
//               // Reset fields if no data exists for the date
//               setStatus("");
//               setRoomPrice("");
//               setNoOfRooms("");
//             }
//           } else {
//             console.log("No room management data found for this room.");
//           }
//         } catch (error) {
//           console.error("Error fetching room details for the selected date:", error);
//         }
//       }
//     };

//     fetchRoomDetailsForDate();
//   }, [active, startDate]);





//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await fetch(
//           `https://yrpitsolutions.com/tourism_api/api/hotels/${hotelId}/rooms`
//         );
//         const data = await response.json();
//         setRoomData(data.data); // Assuming data contains an array of rooms in the 'data' property
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//       }
//     };
//     fetchRooms();
//   }, [hotelId]);

//   const fetchRoomDetails = async () => {
//     if (active) {
//       try {
//         // First API call
//         const response = await fetch(
//           `https://yrpitsolutions.com/tourism_api/api/admin/get_room_management_by_room_id/${active}`
//         );
//         const data = await response.json();

//         if (data.length > 0) {
//           // If data exists from the first API
//           console.log("Data from first API:", data);
//           setRoomDetails(data); // Store all room details
//           setLocation(data[0]?.location_name || "");
//         } else {
//           // If no data, fallback to second API
//           console.log("No data in first API, calling second API...");
//           const fallbackResponse = await fetch(
//             `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${active}`
//           );
//           const fallbackData = await fallbackResponse.json();

//           if (fallbackData?.room) {
//             console.log("Data from second API:", fallbackData);
//             setRoomDetails([fallbackData.room]); // Store room details in array format for consistency
//             setLocation(fallbackData.room.location_name || ""); // Use location_name if available
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching room details:", error);
//       }
//     }
//   };

//   // useEffect to call fetchRoomDetails when 'active' changes
//   useEffect(() => {
//     fetchRoomDetails();
//   }, [active]);


//   function closeModal() {
//     setIsOpen(false);

//   }

//   function openModal() {
//     setIsOpen(true);
//   }


//   function dayRender(dayRenderInfo: any) {
//     const dateString = dayRenderInfo.date.toLocaleDateString('en-CA'); // Format the date in 'YYYY-MM-DD' format

//     // Ensure roomDetails is an array and then find matching room
//     const matchingRoom = Array.isArray(roomDetails) && roomDetails.length > 0
//       ? roomDetails.find((room: any) => {
//         // Convert room start date to the same timezone as dayRenderInfo.date
//         const startDate = new Date(room.start_date).toLocaleDateString('en-CA');
//         return startDate === dateString;
//       })
//       : null;

//     // If there's a matching room and status is 0, disable the cell
//     if (matchingRoom) {
//       const isDisabled = matchingRoom.status === "0"; // Check if status is 0

//       return (
//         <div className={`flex flex-col justify-center ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
//           <h2 className="h2 my-4 text-center leading-tight">
//             {dayRenderInfo.dayNumberText}
//           </h2>
//           <div className="hidden sm:block">
//             <p className="py-1 text-xs md:text-base">
//               {matchingRoom.room_price}
//             </p>
//             <p className="py-1 text-xs md:text-base">
//               X {matchingRoom.no_of_rooms}
//             </p>
//           </div>
//         </div>
//       );
//     }

//     // Default rendering if no matching room found
//     return (
//       <div className="flex flex-col justify-center">
//         <h2 className="h2 my-4 text-center leading-tight">
//           {dayRenderInfo.dayNumberText}
//         </h2>
//       </div>
//     );
//   }

//   function handleDateClick(arg: any) {
//     const clickedDate = new Date(arg.dateStr); // The clicked date
//     const endDate = new Date(clickedDate); // Set endDate to 1 day after the clicked date
//     endDate.setDate(clickedDate.getDate() + 1); // Add 1 day to the clicked date

//     setStartDate(clickedDate); // Set the clicked date as start date
//     setEndDate(endDate); // Set the calculated end date
//     openModal(); // Open the modal to display the date picker
//   }




//   const calendarOptions: any = {
//     plugins: [dayGridPlugin, interactionPlugin],
//     initialView: "dayGridMonth",
//     weekends: false,
//     eventContent: renderEventContent,
//     dateClick: handleDateClick,
//     dayRender: dayRender,
//   };


//   return (
//     <div className="">
//       <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
//         <h2 className="h2 text-white">Room Availability</h2>
//         <Link href="/tour/add-new-tour" className="btn-primary">
//           <PlusCircleIcon className="w-5 h-5" /> Add New Packages
//         </Link>
//       </div>
//       <div className="relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
//         <div className="grid grid-cols-12 gap-6 mx-3 lg:mx-6">
//           <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
//             <div className="rounded-2xl relative z-[1] bg-white p-3 md:p-5 lg:p-8 border">
//               <h3 className="h3 border-b pb-4 mb-4">Availability</h3>
//               {roomData.map((room) => (
//                 <button
//                   onClick={() => setActive(room.id)}
//                   className={`block w-full font-medium text-left rounded-lg p-3 lg:px-6 ${active === room.id &&
//                     "bg-[var(--primary-light)] text-primary"
//                     }`}
//                   key={room.id}
//                 >
//                   {room.room_name.slice(0, 20)} ...
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-9">
//             <div className="rounded-2xl relative z-[1] bg-white p-3 md:p-5 lg:p-8 border">
//               <FullCalendar {...calendarOptions} dayCellContent={dayRender} />
//               <Transition appear show={isOpen} as={Fragment}>
//                 <Dialog as="div" className="relative z-10" onClose={closeModal}>
//                   <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                   >
//                     <div className="fixed inset-0 bg-black bg-opacity-25" />
//                   </Transition.Child>
//                   <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center text-center">
//                       <Transition.Child
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0 scale-95"
//                         enterTo="opacity-100 scale-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100 scale-100"
//                         leaveTo="opacity-0 scale-95"
//                       >
//                         <Dialog.Panel className="w-full max-w-md transform overflow-hidden lg:min-w-[768px] rounded-2xl bg-white p-6 lg:p-10 text-left align-middle shadow-xl transition-all">
//                           <div className="mt-2 flex justify-between items-center border-b pb-3">
//                             <h3 className="h3">Date Information</h3>
//                             <XMarkIcon onClick={closeModal} className="w-5 h-5 cursor-pointer" />
//                           </div>

//                           <div className="mt-4 grid grid-cols-2 gap-4 lg:gap-6">
//                             {/* Removed Hotel ID and Room ID input fields */}
//                             <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
//                               <label className="text-xl font-medium" htmlFor="date-range">
//                                 Date Ranges :
//                               </label>
//                               <DatePicker
//                                 placeholderText="03/08/2023 - 05/08/2023"
//                                 selectsRange={true}
//                                 startDate={startDate}
//                                 endDate={endDate}
//                                 onChange={(update) => {
//                                   setStartDate(update[0]);
//                                   setEndDate(update[1]);
//                                 }}
//                                 className="w-full p-3 border rounded focus:outline-none"
//                               />
//                             </div>

//                             <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
//                               <label className="text-xl font-medium" htmlFor="status">
//                                 Status :
//                               </label>
//                               <input
//                                 type="text"
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}

//                                 className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
//                               />
//                             </div>

//                             {/* <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
//             <label className="text-xl font-medium" htmlFor="location">
//                 Location :
//             </label>
//             <input
//                 type="text"
//                 value={location_name}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
//             />
//         </div> */}

//                             <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
//                               <label className="text-xl font-medium" htmlFor="room-price">
//                                 Room Price :
//                               </label>
//                               <input
//                                 type="text"
//                                 value={roomPrice}
//                                 onChange={(e) => setRoomPrice(e.target.value)}
//                                 className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
//                               />
//                             </div>

//                             <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
//                               <label className="text-xl font-medium" htmlFor="no-of-rooms">
//                                 Number of Rooms :
//                               </label>
//                               <input
//                                 type="text"
//                                 value={noOfRooms}
//                                 onChange={(e) => setNoOfRooms(e.target.value)}
//                                 className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
//                               />
//                             </div>
//                           </div>
//                           <div className="flex gap-3 flex-wrap mt-6 lg:mt-10">
//                             <button className="btn-primary" onClick={handleSaveRoomManagement}>
//                               Save Changes
//                             </button>
//                             <button className="btn-outline" onClick={closeModal}>
//                               Cancel
//                             </button>
//                           </div>
//                         </Dialog.Panel>

//                       </Transition.Child>
//                     </div>
//                   </div>
//                 </Dialog>
//               </Transition>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// function renderEventContent(eventInfo: any) {
//   return (
//     <>
//       <b>{eventInfo.timeText}</b>
//       <i>{eventInfo.event.title}</i>
//     </>
//   );
// }
