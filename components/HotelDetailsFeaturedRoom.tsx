import { HeartIconOutline } from "@/public/data/icons";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const HotelDetailsFeaturedRoom = ({ item, onRoomSelect }: any) => {
  const { id, img, price, title, amenity1, amenity2, amenity3, extra_bed_price, child_price } = item;

  const [favorite, setFavorite] = useState(false);

  return (
    <li key={id}>
      <div className="p-2 rounded-2xl flex flex-col md:flex-row bg-[var(--bg-2)]">
        <div className="relative">
          <div className="rounded-2xl">
            <Image
              width={348}
              height={305}
              src={img}
              alt="image"
              className="rounded-2xl"
            />
          </div>
          <button
            onClick={() => setFavorite(!favorite)}
            className="absolute z-10 inline-block text-primary top-6 right-6 rounded-full bg-white p-2.5 "
          >
            {favorite ? (
              <HeartIcon className="w-5 h-5 text-[var(--tertiary)]" />
            ) : (
              <HeartIconOutline />
            )}
          </button>
        </div>
        <div className="p-2 sm:p-4 flex-grow">
          <div className="property-card__body">
            <div className="flex justify-between mb-2">
              <Link
                href="hotel-listing-details"
                className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
              >
                {title}
              </Link>

            </div>

          </div>
          <div className="property-card__body py-0 pt-4">
            <div className="hr-dashed"></div>
          </div>
          <div className="property-card__body">
            <div className="flex flex-wrap justify-between items-center">
              <span className="block text-xl font-medium text-primary">
                ${price}

              </span>
              <button
                onClick={() => onRoomSelect({ room_price: price, extra_bed_price, child_price, id })}
                className="btn-outline font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default HotelDetailsFeaturedRoom;
