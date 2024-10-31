"use client";
import React, { Fragment, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Transition } from "@headlessui/react";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CheckboxCustom from "@/components/Checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectUI from "@/components/SelectUI";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function DemoApp() {
  const [roomData, setRoomData] = useState<any[]>([]); // Initialize roomData
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  // const [status, setStatus] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  // const [startDate, endDate] = dateRange;
  // const [roomPrice, setRoomPrice] = useState<string>('');
  // const [noOfRooms, setNoOfRooms] = useState<string>('');
  const [roomDetails, setRoomDetails] = useState<any>(null);


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [noOfRooms, setNoOfRooms] = useState('');
  const [location_name, setLocation] = useState('');

  // const handleUpdateRoomManagement = async () => {


  //   if (active === null) return; // Ensure an active room ID exists

  //   const payload = {
  //     room_id: active,
  //     hotel_id: hotelId,
  //     start_date: startDate?.toISOString().split('T')[0],
  //     end_date: endDate?.toISOString().split('T')[0],
  //     room_price: roomPrice,
  //     no_of_rooms: noOfRooms,
  //     status: status,
  //   };
  //   console.log("Payload:", payload); // Log the payload

  //   try {
  //     const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_room_management_by_room_id/${active}`, {
  //       method: 'PUT', // Change to PUT method
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert(data.message);
  //       // Optionally, you can refresh or update your room data here
  //     } else {
  //       alert(`Error: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating room management:", error);
  //     alert("An error occurred while updating room management.");
  //   }
  // };


  const handleSaveRoomManagement = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Token not found!");
        return;
      }

      // Construct payload
      const payload = {
        hotel_id: hotelId,
        room_id: active,
        start_date: startDate ? startDate.toISOString().split('T')[0] : null, // Format the start date
        end_date: endDate ? endDate.toISOString().split('T')[0] : null, // Format the end date
        room_price: roomPrice,
        no_of_rooms: noOfRooms,
        location_name: location_name,
        status,
      };

      // Make the POST request
      const response = await axios.post(
        'https://yrpitsolutions.com/tourism_api/api/admin/save_room_management',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle success
      if (response.status === 200) {
        alert("Room management details saved successfully!");
        closeModal(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error saving room management:", error);
      alert("Failed to save room management details.");
    }
  };



  useEffect(() => {
    // Fetch rooms list for a specific hotel
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/hotels/${hotelId}/rooms`
        );
        const data = await response.json();
        setRoomData(data.data); // Assuming data contains an array of rooms in the 'data' property
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [hotelId]);


  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (active) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/get_room_management_by_room_id/${active}`
          );
          const data = await response.json();
          setRoomDetails({
            room_price: data.room_price,
            no_of_rooms: data.no_of_rooms,
          });
          setLocation(data.location_name || ''); // Update 'location_name' state here
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      }
    };
    fetchRoomDetails();
  }, [active]);


  function handleDateClick(arg: any) {
    console.log("Clicked on date: ", arg.dateStr);
    openModal();
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function dayRender(dayRenderInfo: any) {
    return (
      <div className="flex flex-col justify-center">
        <h2 className="h2 my-4 text-center leading-tight">
          {dayRenderInfo.dayNumberText}
        </h2>
        {roomDetails && (
          <div className="hidden sm:block">
            <p className="py-1 text-xs md:text-base">{roomDetails.room_price}</p>
            <p className="py-1 text-xs md:text-base">X {roomDetails.no_of_rooms}</p>
          </div>
        )}
      </div>
    );
  }

  const calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    weekends: false,
    eventContent: renderEventContent,
    dateClick: handleDateClick,
    dayRender: dayRender,
  };





  return (
    <div className="">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Room Availability</h2>
        <Link href="/tour/add-new-tour" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Packages
        </Link>
      </div>
      <div className="relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="grid grid-cols-12 gap-6 mx-3 lg:mx-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl relative z-[1] bg-white p-3 md:p-5 lg:p-8 border">
              <h3 className="h3 border-b pb-4 mb-4">Availability</h3>
              {roomData.map((room) => (
                <button
                  onClick={() => setActive(room.id)}
                  className={`block w-full font-medium text-left rounded-lg p-3 lg:px-6 ${active === room.id &&
                    "bg-[var(--primary-light)] text-primary"
                    }`}
                  key={room.id}
                >
                  {room.room_name.slice(0, 20)} ...
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-9">
            <div className="rounded-2xl relative z-[1] bg-white p-3 md:p-5 lg:p-8 border">
              <FullCalendar {...calendarOptions} dayCellContent={dayRender} />
              <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>
                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden lg:min-w-[768px] rounded-2xl bg-white p-6 lg:p-10 text-left align-middle shadow-xl transition-all">
                          <div className="mt-2 flex justify-between items-center border-b pb-3">
                            <h3 className="h3">Date Information</h3>
                            <XMarkIcon onClick={closeModal} className="w-5 h-5 cursor-pointer" />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4 lg:gap-6">
                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="date-range">Date Ranges :</label>
                              <DatePicker
                                placeholderText="03/08/2023 - 05/08/2023"
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                  setStartDate(update[0]);
                                  setEndDate(update[1]);
                                }}
                                className="w-full p-3 border rounded focus:outline-none"
                              />
                            </div>

                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="status">Status :</label>
                              <input
                                type="text"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>
                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="location">Location :</label>
                              <input
                                type="text"
                                value={location_name} // Use the location_name state directly
                                onChange={(e) => setLocation(e.target.value)}
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>

                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="hotel-id">Hotel ID :</label>
                              <input
                                type="number"
                                value={hotelId || ""}
                                readOnly
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>

                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="room-id">Room ID :</label>
                              <input
                                type="text"
                                value={active || ""}
                                readOnly
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>

                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="room-price">Room Price :</label>
                              <input
                                type="text"
                                value={roomPrice}
                                onChange={(e) => setRoomPrice(e.target.value)}
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>

                            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                              <label className="text-xl font-medium" htmlFor="no-of-rooms">Number of Rooms :</label>
                              <input
                                type="text"
                                value={noOfRooms}
                                onChange={(e) => setNoOfRooms(e.target.value)}
                                className="border py-[10px] px-2 rounded focus:outline-none focus:border-primary focus:border"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 flex-wrap mt-6 lg:mt-10">
                            <button className="btn-primary" onClick={handleSaveRoomManagement}>
                              Save Changes
                            </button>
                            <button className="btn-outline" onClick={closeModal}>Cancel</button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
