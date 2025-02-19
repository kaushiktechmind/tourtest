"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/img/logo.png";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { SearchIcon } from "@/public/data/icons";
import { MouseEvent, useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { sidenavData } from "@/public/data/adminsidenav";
import AdminProfileDropdown from "@/components/AdminProfileDropdown";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [opened, setOpened] = useState<null | number>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const path = usePathname();

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/get_admin_setting/1"
      );
      const data = await response.json();
      console.log(data);
      if (data?.data?.logo) {
        setLogoUrl(data.data.logo); // Set the logo URL from the API response
      }
    } catch (error) {
      console.error("Error fetching admin settings:", error);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("email");

    if (email!=="admin@gmail.com" && path.startsWith("/admin")) {
      // Redirect to signin page if token is not found
      window.location.href = "/auth/signin";
    } else {
      setIsLoggedIn(!!token);
    }
  }, [path]);

  // Define routes where the sidebar and header should not be displayed
  const noNavRoutes = ["/auth/signin", "/auth/signup", "/auth/adminprofile"];

  // Determine whether to show the sidebar and header
  const showNav = !noNavRoutes.includes(path);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setNavOpen(!navOpen);
  };

  return (
    <>
      {showNav && (
        <section className="bg-white">
          <nav
            className={`${navOpen ? "ml-0" : "ml-[-312px]"
              } lg:ml-0 w-[270px] sm:w-[312px] transiton-all duration-300 ease-out z-20 overflow-x-hidden overflow-y-auto fixed top-0 bottom-0 bg-white flex flex-col border-r p-3 md:p-8 min-h-screen shadow-lg lg:shadow-none scrollbarthin`}>
            <div className="grow">
              <Link
                href="/"
                className="inline-flex items-center pb-4 lg:pb-9 border-b border-dashed">
                <Image  src="https://www.andamanmangroves.com/static/media/logo.00922eff5313640b23f9.png" width={150} height={150} alt="logo" />
              </Link>
              <ul className="py-5">
                <li>
                  <Link
                    href="/admin"
                    className={`flex items-center hover:bg-primary hover:text-white gap-2 rounded-md px-5 py-3 duration-300 ${path == "/admin" && "bg-primary text-white"
                      }`}>
                    <BuildingStorefrontIcon className="w-5 h-5" />
                    Dashboard
                  </Link>
                </li>
              </ul>
              {/* <span className="text-xs">Pages</span> */}
              <ul className="py-5 flex flex-col gap-1 font-medium">
                {sidenavData.map(({ icon, id, name, submenus, url }) => (
                  <li key={id}>
                    {url ? (
                      <Link
                        href={url}
                        className={`flex items-center hover:bg-primary hover:text-white gap-2 rounded-md px-5 py-3 duration-300 ${path == url && "bg-primary text-white"
                          }`}>
                        {icon}
                        {name}
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          setOpened((prev) => (prev == id ? null : id))
                        }
                        className={`justify-between px-5 py-3 hover:bg-primary hover:text-white rounded-md duration-300 flex w-full items-center ${id == opened && "bg-primary text-white"
                          }`}>
                        <span className="flex gap-2 items-center">
                          {icon}
                          {name}
                        </span>
                        {submenus && (
                          <ChevronDownIcon
                            className={`w-5 h-5 duration-300 ${id == opened && "rotate-180"
                              }`}
                          />
                        )}
                      </button>
                    )}
                    {submenus && (
                      <AnimateHeight
                        duration={300}
                        height={opened == id ? "auto" : 0}>
                        <ul className={`px-3 mt-1 flex flex-col gap-1`}>
                          {submenus.map((item) => (
                            <li key={item.title}>
                              <Link
                                href={item.url}
                                className={`flex gap-2 items-center pl-4 pr-1 py-3 hover:bg-violet-200 duration-300 rounded-md ${item.url == path && "bg-violet-200"
                                  }`}>
                                {icon}
                                {item.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AnimateHeight>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* <ul>
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-2 rounded-md px-6 py-3 hover:bg-primary hover:text-white duration-300`}>
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Log out
                </Link>
              </li>
            </ul> */}
          </nav>
          <div
            className={`lg:ml-[312px] relative ${navOpen &&
              "after:bg-black after:bg-opacity-70 after:absolute after:inset-0 after:z-10 after:duration-300 overflow-y-hidden"
              }`}
            onClick={() => setNavOpen(false)}>
            <header className="px-4 md:px-8 py-3 lg:py-6 flex items-center justify-between">
              <button
                onClick={handleOpen}
                className="lg:hidden order-2 select-none">
                <Bars3Icon className="w-8 h-8" />
              </button>

              <div className="flex-1 flex justify-end items-center gap-4">
                {!isLoggedIn && (
                  <Link href="/auth/signin" className="btn-primary-lg hidden md:block">
                    Signin
                  </Link>
                )}
                {isLoggedIn && <AdminProfileDropdown />}
              </div>
            </header>

            <section>{children}</section>
          </div>
        </section>
      )}
      {!showNav && <section>{children}</section>}
    </>
  );
}
