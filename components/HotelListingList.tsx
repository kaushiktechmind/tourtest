import { HeartIconOutline } from "@/public/data/icons";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const HotelListingList = ({
  item,
  adults,
  children,
  infants,
  loc,
  startdate,
  enddate,
}: {
  item: any;
  adults: number;
  children: number;
  infants: number;
  loc: string;
  startdate: string;
  enddate: string;
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

  return (
    <div key={id || hotel_id} className="col-span-12">
      <div className="flex flex-col lg:flex-row p-2 rounded-2xl bg-white hover:shadow-lg duration-300 border">
        <div className="relative">
          <div className="rounded-2xl">
            <Image
              width={369}
              height={282}
              src={
                banner_images && banner_images.length > 0
                  ? banner_images[0]
                  : "fallback-image-url"
              }
              alt={hotel_name}
              className="rounded-2xl"
            />
          </div>
          {/* <button
            onClick={() => setFavorite(!favorite)}
            className="absolute z-10 inline-block text-primary top-3 sm:top-6 right-3 sm:right-6 rounded-full bg-white p-2.5"
          >
            {favorite ? (
              <HeartIcon className="w-5 h-5 text-[var(--tertiary)]" />
            ) : (
              <HeartIconOutline />
            )}
          </button> */}
        </div>
        <div className="flex-grow p-2 sm:p-3 lg:p-4 xxl:py-6 xxl:px-8">
          <div className="property-card__body">
            <div className="flex justify-between mb-2">
              <Link
                href={`/hotel-listing-details?hotelDetailsId=${
                  id || hotel_id
                }&loc=${loc}&startdate=${startdate}&enddate=${enddate}&adults=${adults}&children=${children}&infants=${infants}`}
                className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
              >
                {hotel_name}
              </Link>
              <div className="flex items-center shrink-0">
                <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                <span className="block text-[var(--neutral-700)]">
                  {ratings}
                </span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                <span className="inline-block">{location_name}</span>
              </div>
            </div>
            {/* <ul className="flex items-center flex-wrap gap-3">
              {amenities.map((amenity, index) => (
                <li key={index}>
                  <div
                    data-tooltip-id="amenity"
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
                  <span className="text-sm text-center">{amenity.name}</span>
                </li>
              ))}
            </ul> */}
             <ul className="flex items-center flex-wrap gap-3">
              <li>
                <div
                  data-tooltip-id="parking"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-car-parking.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="restaurent"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-breakfast.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="room"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-room-service.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="fitness"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-fitness.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="swimming"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-swimming-pool.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="laundry"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-laundry.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
              <li>
                <div
                  data-tooltip-id="free"
                  className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary">
                  <Image
                    width={28}
                    height={28}
                    src="/img/icon-glob.png"
                    alt="image"
                    className=" w-7 h-7 object-fit-contain"
                  />
                </div>
              </li>
            </ul>
            <div className="flex flex-wrap justify-between items-center">
              <span className="block text-xl font-medium text-primary">
                ${starting_price}
                <span className="inline-block font-medium text-primary">
                  - ${highest_price}
                </span>
              </span>
              <Link
                href={`/hotel-listing-details?hotelDetailsId=${
                  id || hotel_id
                }&loc=${loc}&startdate=${startdate}&enddate=${enddate}&adults=${adults}&children=${children}&infants=${infants}`}
                className="btn-outline font-semibold"
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
