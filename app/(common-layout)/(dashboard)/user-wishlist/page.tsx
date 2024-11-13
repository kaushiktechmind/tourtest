"use client";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import HotelListingList from "@/components/HotelListingList";
import { featuredHotels } from "@/public/data/featuredhotel";
import { TrashIcon } from "@heroicons/react/24/outline";

const Page = () => {
  const tooltipStyle = {
    backgroundColor: "#3539E9",
    color: "#fff",
    borderRadius: "10px",
  };
  return (
    <>
      <ul>
        <li>
          <div className="p-3 sm:p-4 lg:p-6 p-xl-10 rounded-2xl bg-white shadow-3">
            <h3 className="mb-0 h3 flex-grow"> My Wishlist </h3>
            <div className="border-t my-6"></div>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <div className="flex items-center shrink-0 gap-4">
                <p className="mb-0 clr-neutral-500 flex-grow whitespace-nowrap">
                  {" "}
                  Sort By :{" "}
                </p>
                <div className="border rounded-full pr-3">
                  <select className="w-full bg-transparent px-5 py-3 focus:outline-none">
                    <option>Hotels</option>
                    <option value="1">Resort</option>
                    <option value="3">Motel</option>
                  </select>
                </div>
              </div>
              <Link
                href="#"
                className="btn-outline text-primary font-semibold shrink-0"
              >
                <TrashIcon className="w-5 h-5" /> Remove All
              </Link>
            </div>
            <h5 className="font-medium mb-3"> Wishlist (4) </h5>
            <div className="grid grid-cols-12 gap-4">
              {featuredHotels.map((item) => (
                <HotelListingList
                  key={item.id}
                  item={item}
                  adults={0}
                  numChildren={0}
                  infants={0}
                  loc={""}
                  startdate={""}
                  enddate={""}
                  noOfRooms={0}
                />
              ))}
            </div>
          </div>
        </li>
      </ul>
      <Tooltip
        id="parking"
        style={tooltipStyle}
        offset={10}
        content="Parking"
      />
      <Tooltip
        id="restaurent"
        style={tooltipStyle}
        offset={10}
        content="Restaurent"
      />
      <Tooltip
        id="room"
        style={tooltipStyle}
        offset={10}
        content="Room Service"
      />
      <Tooltip
        id="fitness"
        style={tooltipStyle}
        offset={10}
        content="Fitness"
      />
      <Tooltip
        id="swimming"
        style={tooltipStyle}
        offset={10}
        content="Swimming"
      />
      <Tooltip
        id="laundry"
        style={tooltipStyle}
        offset={10}
        content="Laundry"
      />
      <Tooltip
        id="free"
        style={tooltipStyle}
        offset={10}
        content="Free Internet"
      />
    </>
  );
};

export default Page;
