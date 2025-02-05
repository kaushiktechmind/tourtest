"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const FeaturedCardHome2 = ({ item }: any) => {
  const { id, address, area, seo_title, bed, img, highest_price, starting_price, rooms, title, type } = item;

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Usage:
  const capitalizedType = capitalizeFirstLetter(type);
  

  return (
    <div key={id} className="col-span-12 xl:col-span-6 px-3 xl:px-0">
      <div className="bg-white hover:shadow-lg duration-300 grid grid-cols-12 rounded-2xl p-2 h-full">
        {/* Image Section */}
        <div className="rounded-2xl col-span-12 md:col-span-5 relative group h-70">
          {img.length > 1 ? (
            <Swiper
              loop={true}
              pagination={{
                el: ".property-card-pagination",
                clickable: true,
              }}
              navigation={{
                nextEl: ".property-card-next",
                prevEl: ".property-card-prev",
              }}
              modules={[Navigation, Pagination]}
              className="h-full">
              {img.map((img: any, i: any) => (
                <SwiperSlide key={i} className="h-full">
                  <Image
                    width={270}
                    height={280}
                    src={img}
                    alt="image"
                    className="rounded-2xl object-cover w-full h-full"
                  />
                </SwiperSlide>
              ))}
              <div className="swiper-pagination property-card-pagination"></div>
              <div className="swiper-button-prev !opacity-0 group-hover:!opacity-100 duration-300 property-card-prev"></div>
              <div className="swiper-button-next !opacity-0 group-hover:!opacity-100 duration-300 property-card-next"></div>
            </Swiper>
          ) : (
            <div className="h-full">
              <Image
                width={270}
                height={280}
                src={img[0]}
                alt="image"
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-between h-full">
          <div>
            {/* Address */}
            <div className="flex items-center pt-3 gap-1 mb-3 pl-4 mt-2">
              <i className="las la-map-marker-alt text-lg text-[#9C742B]"></i>
              <span className="inline-block">{address}</span>
            </div>
            {/* Title */}
            <Link
             href={`/hotel/${seo_title}`}
              className="text-xl font-medium text-neutral-700 pl-4">
              {title.substr(0, 20)}
            </Link>
            {/* Room, Bed, Bath, Area */}
            <ul className="flex flex-wrap divide-x divide-dashed justify-between mt-5 pl-3 mb-5">
              <li className="flex flex-col px-2 gap-1">
                <i className="las la-city text-xl"></i>
                <span className="block">{rooms} Room</span>
              </li>
              <li className="flex flex-col px-1 xxl:px-2 gap-1">
                <i className="las la-bed text-xl"></i>
                <span className="block"> {bed} Bed </span>
              </li>
              <li className="flex flex-col px-1 xxl:px-2 gap-1">
              <i className="las la-arrows-alt text-xl"></i>
                <span className="block"> {area}</span>
              </li>
             
            </ul>
          </div>
          <div className="mx-3 lg:mx-5">
            <div className="border-t border-dash-long"></div>
          </div>
          <div className="px-3 sm:px-5 pb-5 pt-4">
            {/* Price Section */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              {/* <span className="text-primary text-xl font-medium">
                ${price}
              </span> */}
              <span className="block  font-medium line-through">
                ₹{starting_price}
                <span className="inline-block font-medium text-xl text-primary pl-2"> ₹{highest_price}</span>
              </span>
              <Link href={`/hotel/${seo_title}`} className="btn-outline ">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default FeaturedCardHome2;
