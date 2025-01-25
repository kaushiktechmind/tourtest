import { Key, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import SubHeadingBtn from "../SubHeadingBtn";
import { StaticImport } from "next/dist/shared/lib/get-img-props";


interface Package {
  id: number;
  location_name: string;
  package_title: string;
  package_content: string;
  youtube_video_link: string;
  duration: string;
  tour_min_people: number;
  tour_max_people: number;
  pickup_point: string;
  banner_image: string[]; // Assuming it's an array of strings
  tour_price: number;
  sale_price: number | null; // Sale price can be null
}


const Featured = () => {
  const [packages, setPackages] = useState<Package[]>([]);

  
  // Fetch the API data on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_package");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="relative py-[60px] lg:py-[120px] px-3">
      <div className="container">
        <div className="flex flex-wrap items-center gap-4 justify-between mb-10 lg:mb-12">
          <div>
            <SubHeadingBtn text="Featured Package" classes="bg-white" />
            <h2 className="h2 mt-3 ">Our Best Packages</h2>
          </div>
          <Link className="btn-outline font-semibold" href="/package-listing">
            See All Package
          </Link>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {packages.map(({ id, location_name, package_title, package_content, youtube_video_link, duration, tour_min_people, tour_max_people, pickup_point, banner_image, tour_price, sale_price }) => (
            <div key={id} className="col-span-12 md:col-span-6 xl:col-span-4 group">
              <div className="bg-white rounded-2xl hover:shadow-lg duration-300 p-3">
                <div className="relative">
                  <div className="rounded-2xl">
                    {banner_image && banner_image.length > 1 ? (
                      <Swiper
                        loop={true}
                        pagination={{ el: ".property-card-pagination" }}
                        navigation={{
                          nextEl: ".property-card-next",
                          prevEl: ".property-card-prev",
                        }}
                        modules={[Navigation, Pagination]}
                        className="swiper property-card-slider"
                      >
                        {banner_image.map((item: string | StaticImport, index: Key | null | undefined) => (
                          <SwiperSlide key={index}>
                            <Image
                              width={400}
                              height={306}
                              src={item}
                              alt={`package-image-${id}`}
                              className="w-full rounded-2xl"
                            />
                          </SwiperSlide>
                        ))}
                        <div className="swiper-pagination property-card-pagination"></div>
                        <div className="swiper-button-prev !opacity-0 group-hover:!opacity-100 duration-300 property-card-prev"></div>
                        <div className="swiper-button-next !opacity-0 group-hover:!opacity-100 duration-300 property-card-next"></div>
                      </Swiper>
                    ) : (
                      <Image
                        width={400}
                        height={306}
                        src={banner_image ? banner_image[0] : "/img/featured-package-1.jpg"}
                        alt="image"
                        className="w-full rounded-2xl"
                      />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Link href="/tour-listing-details" className="link block flex-grow text-xl font-medium">
                      {package_title}
                    </Link>
                    <div className="flex gap-1 items-center shrink-0">
                      <i className="las la-star text-[var(--tertiary)]"></i>
                      <span className="block"> 5 </span> {/* Assuming rating */}
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3 mt-4">
                    <li className="col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <i className="las la-clock text-xl text-[#22804A]"></i>
                        <span className="block"> {duration} </span>
                      </div>
                    </li>
                    <li className="col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <i className="las la-user-friends text-xl text-[#22804A]"></i>
                        <span className="block"> Capacity {tour_min_people} - {tour_max_people} </span>
                      </div>
                    </li>
                    <li className="col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                        <span className="block"> Pickup Point: {pickup_point} </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border-b border-dash-long my-2 mx-4"></div>

                <div className="p-4">
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="block text-xl font-medium text-primary">
                      ${sale_price ? sale_price : tour_price}
                      <span className="inline-block font-normal text-base"> /Pax</span>
                    </span>
                    <Link href={`/package-listing-details?packageId=${id}`} className="btn-outline font-semibold">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Featured;
