import { HeartIconOutline } from "@/public/data/icons";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tooltip } from "react-tooltip";

const HotelListingList = ({
  item,
  loc,
}: {
  item: any;
  adults: number;
  numChildren: number;
  infants: number;
  loc: string;
  type: string;
  startdate: string;
  enddate: string;
  noOfRooms: number;
  seo_title: string;
}) => {
  const {
    id,
    hotel_id,
    banner_images,
    location_name,
    starting_price,
    highest_price,
    ratings,
    hotel_name,
    seo_title,
    amenity_name1,
    amenity_logo1,
    amenity_name2,
    amenity_logo2,
    amenity_name3,
    amenity_logo3,
    amenity_name4,
    amenity_logo4,
    amenity_name5,
    amenity_logo5,
  } = item;

  if (!loc) {
    loc = location_name;
  }

  const tooltipStyle = {
    backgroundColor: "#3539E9",
    color: "#fff",
    borderRadius: "10px",
  };

  // Array of amenities
  const amenities = [
    { name: amenity_name1, logo: amenity_logo1 },
    { name: amenity_name2, logo: amenity_logo2 },
    { name: amenity_name3, logo: amenity_logo3 },
    { name: amenity_name4, logo: amenity_logo4 },
    { name: amenity_name5, logo: amenity_logo5 },
  ];

  // Filter out any invalid amenities
  const validAmenities = amenities.filter(
    (amenity) =>
      typeof amenity.name === "string" && typeof amenity.logo === "string"
  );

  // Debugging: Log validAmenities to ensure they are strings
  // console.log("Valid Amenities:", validAmenities);

  return (
    <div key={id || hotel_id} className="col-span-12">
      <div className="flex flex-col lg:flex-row p-2 rounded-2xl bg-white hover:shadow-lg duration-300 border">
        <div className="relative">
          <div className="rounded-2xl">
            <Image
              width={369}
              height={400}
              src={
                banner_images && banner_images.length > 0
                  ? banner_images[0]
                  : "fallback-image-url"
              }
              alt={hotel_name}
              className="rounded-2xl h-[300px] object-cover"
            />
          </div>
        </div>
        <div className="flex-grow p-2 sm:p-3 lg:p-4 xxl:py-6 xxl:px-8">
          <div className="property-card__body">
            <div className="flex justify-between mb-2">
              <Link
                // href={`/hotel?hotelDetailsId=${id || hotel_id}`}
                href={`/hotel/${seo_title}`}
                className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
                onClick={() => {
                  if (location_name) {
                    localStorage.setItem("storedLocation", location_name);
                    localStorage.setItem("hotelId", id || hotel_id);
                    localStorage.setItem("fromHome", "200");
                  }
                }}
              >
                {hotel_name}
              </Link>
              <div className="flex items-center shrink-0">
                <div className="flex">
                  {Array.from({ length: Math.round(ratings) }, (_, index) => (
                    <StarIcon
                      key={index}
                      className="w-5 h-5 text-[var(--tertiary)]"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                <span className="inline-block">{location_name}</span>
              </div>
            </div>
            <ul className="flex items-center flex-wrap gap-7">
              {validAmenities.map((amenity, index) => (
                <li key={index}>
                  <div
                    data-tooltip-id={amenity.name}
                    className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary"
                  >
                    <Image
                      width={28}
                      height={28}
                      src={amenity.logo}
                      alt={amenity.name}
                      className="w-7 h-7 object-fit-contain"
                    />
                  </div>
                  <Tooltip
                    id={amenity.name}
                    style={tooltipStyle}
                    offset={7}
                    content={amenity.name}
                  />
                </li>
              ))}
            </ul>
            <div className="my-5 xl:my-7">
              <div className="border border-dashed"></div>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <span className="block  font-medium line-through">
                ₹{starting_price}
                <span className="inline-block font-medium text-xl text-primary pl-2">
                  {" "}
                  ₹{highest_price}
                </span>
              </span>
              <Link
                // href={`/hotel?hotelDetailsId=${id || hotel_id}`}
                href={`/hotel/${seo_title}`}
                className="btn-outline font-semibold"
                onClick={() => {
                  if (location_name) {
                    localStorage.setItem("storedLocation", location_name);
                    localStorage.setItem("hotelId", id || hotel_id);
                    localStorage.setItem("fromHome", "200");
                  }
                }}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListingList;
