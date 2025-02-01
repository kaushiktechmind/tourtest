import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfileDropdown() {
  const [userData, setUserData] = useState({
    name: "Guest User",
    profilePhoto: "/img/user-1.jpg", // Default profile photo
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("id"); // Retrieve user ID from localStorage
      const token = localStorage.getItem("access_token"); // Retrieve access token

      if (userId && token) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/get_user_by_id/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Pass token for authorization
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserData({
              name: data.name || "Guest User",
              profilePhoto: data.profile_photo || "/img/user-1.jpg",
              email: data.email || "",
              mobileNumber: data.mobile_number || "",
            });
          } else {
            console.error("Failed to fetch user data:", response.statusText);
          }
        } catch (error) {
          console.error("An error occurred while fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/user/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.clear(); // Clear all localStorage items
        window.location.href = "/sign-in"; // Redirect to sign-in page
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="text-left z-10">
      <Menu as="div" className="relative inline-block top-1 md:top-[2px]">
        <Menu.Button className="flex justify-center items-center rounded-full focus:outline-none">
          <Image
            className="rounded-full object-cover w-[45px] h-[45px]"
            src={userData.profilePhoto}
            width={45}
            height={45}
            alt="profile"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-[-80px] lg:right-0 lg:left-auto mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-3 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <div className="flex gap-3 pb-3 items-center border-b border-dashed">
                  <Image
                    src={userData.profilePhoto}
                    alt="profile"
                    className="rounded-full object-cover"
                    width={55}
                    height={55}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />

                  <div className="flex flex-col">
                    <span className="text-gray-800 text-xl font-semibold">
                      {userData.name}
                    </span>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/userprofile"
                    className={`${
                      active ? "bg-gray-200 text-gray-800" : ""
                    } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm mt-2`}
                  >
                    <UserIcon />
                    My Account
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/offers"
                    className={`${
                      active ? "bg-gray-200 text-gray-800" : ""
                    } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CalenderIcon />
                    My Bookings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-gray-200 text-gray-800" : ""
                    } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <LogOutIcon />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const CalenderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 002.25-2.25V15"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 12l-3-3m3 3l-3 3m3-3H9"
    />
  </svg>
);