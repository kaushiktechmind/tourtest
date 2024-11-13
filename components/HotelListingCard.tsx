import { HeartIconOutline } from "@/public/data/icons";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

const HotelListingCard = ({
  item,
  adults,
  numChildren,
  infants,
  loc,
  startdate,
  enddate,
  noOfRooms
}: {
  item: any;
  adults: number;
  numChildren: number;
  infants: number;
  loc: string;
  startdate: string;
  enddate: string;
  noOfRooms: number;
}) => {
  const [favorite, setFavorite] = useState(false);
  const {
    id,
    hotel_id,
    banner_images,
    location_name,
    starting_price,
    highest_price,
    ratings,
    hotel_name,
    ...amenitiesData // This will gather all remaining properties
  } = item;

  // Create an array of amenities dynamically
  const amenities = [];
  for (let i = 1; i <= 30; i++) {
    const amenityName = amenitiesData[`amenity_name${i}`];
    const amenityLogo = amenitiesData[`amenity_logo${i}`];

    if (amenityName && amenityLogo) {
      amenities.push({ name: amenityName, logo: amenityLogo });
    }
  }
  const tooltipStyle = {
    backgroundColor: "#3539E9",
    color: "#fff",
    borderRadius: "10px",
  };

  return (
    <div className="col-span-12 md:col-span-6">
      <div className="relative rounded-2xl p-3 bg-white">
        <div className="property-card__head">
          <div className="property-card__img">
            <Image
              width={369}
              height={400}
              src={
                banner_images && banner_images.length > 0
                  ? banner_images[0]
                  : "fallback-image-url"
              }
              alt={hotel_name}
              className="rounded-2xl  h-[300px]  object-cover"
            />
          </div>

        </div>
        <div className="mt-4 p-4">
          <div className="flex justify-between mb-2">
            <Link
              href={`/hotel-listing-details?hotelDetailsId=${id || hotel_id
                }&loc=${loc}&startdate=${startdate}&enddate=${enddate}&noOfRooms=${noOfRooms}`}
              className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
            >
              {hotel_name}
            </Link>
            <div className="flex items-center shrink-0">
              <i className="text-[var(--tertiary)] text-lg las la-star"></i>
              <span className="block text-[var(--neutral-700)]">{ratings}</span>
            </div>
          </div>
          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-1">
              <i className="las la-map-marker-alt text-xl text-[var(--tertiary)]"></i>
              <span className="inline-block">{location_name}</span>
            </div>
          </div>
          <ul className="flex items-center flex-wrap justify-between gap-1">
            <li>
              <div
                data-tooltip-id="parking"
                className="grid place-content-center w-10 h-10 rounded-full bg-[var(--primary-light)]"
              >
                <Image
                  width={24}
                  height={24}
                  src="/img/icon-car-parking.png"
                  alt="image"
                  className="w-7 h-7 object-fit-contain"
                />
              </div>
            </li>
            <li>
              <div
                data-tooltip-id="parking"
                className="grid place-content-center w-10 h-10 rounded-full bg-[var(--primary-light)]"
              >
                <Image
                  width={24}
                  height={24}
                  src="/img/icon-car-parking.png"
                  alt="image"
                  className="w-7 h-7 object-fit-contain"
                />
              </div>
            </li>
            <li>
              <div
                data-tooltip-id="parking"
                className="grid place-content-center w-10 h-10 rounded-full bg-[var(--primary-light)]"
              >
                <Image
                  width={24}
                  height={24}
                   src="/img/icon-breakfast.png"
                  alt="image"
                  className="w-7 h-7 object-fit-contain"
                />
              </div>
            </li>
            <li>
              <div
                data-tooltip-id="parking"
                className="grid place-content-center w-10 h-10 rounded-full bg-[var(--primary-light)]"
              >
                <Image
                  width={24}
                  height={24}
                   src="/img/icon-room-service.png"
                  alt="image"
                  className="w-7 h-7 object-fit-contain"
                />
              </div>
            </li>
            <li>
              <div
                data-tooltip-id="parking"
                className="grid place-content-center w-10 h-10 rounded-full bg-[var(--primary-light)]"
              >
                <Image
                  width={24}
                  height={24}
                   src="/img/icon-fitness.png"
                  alt="image"
                  className="w-7 h-7 object-fit-contain"
                />
              </div>
            </li>
          </ul>
          <Tooltip
              id="parking"
              style={tooltipStyle}
              offset={7}
              content="Parking"
            />
            <Tooltip
              id="restaurent"
              style={tooltipStyle}
              offset={7}
              content="Restaurent"
            />
            <Tooltip
              id="room"
              style={tooltipStyle}
              offset={7}
              content="Room Service"
            />
            <Tooltip
              id="fitness"
              style={tooltipStyle}
              offset={7}
              content="Fitness"
            />
            <Tooltip
              id="swimming"
              style={tooltipStyle}
              offset={7}
              content="Swimming"
            />
            <Tooltip
              id="laundry"
              style={tooltipStyle}
              offset={7}
              content="Laundry"
            />
            <Tooltip
              id="free"
              style={tooltipStyle}
              offset={7}
              content="Free Internet"
            />
        </div>
        <div className="border-b border-dash-long mx-3">
          <div className="hr-dashed"></div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-center">
            <span className="block text-xl font-medium text-primary">
              ${starting_price}
              <span className="inline-block font-medium text-primary">
                - ${highest_price}
              </span>
            </span>
            <Link
                href={`/hotel-listing-details?hotelDetailsId=${id || hotel_id
                  }&loc=${loc}&startdate=${startdate}&enddate=${enddate}&noOfRooms=${noOfRooms}`}
                className="btn-outline font-semibold"
              >
                Book Now
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListingCard;
