"use client";
import SubHeadingBtn from "../SubHeadingBtn";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import testimonialImg from "@/public/img/testimonial-img.jpg";

// Import required modules
import { Navigation } from "swiper";
import { agents } from "@/public/data/agent";
import { MapPinIcon } from "@heroicons/react/24/outline";

// Function to render dynamic stars based on rating
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="las la-star"></i>);
  }

  if (halfStar) {
    stars.push(<i key="half" className="las la-star-half-alt"></i>);
  }

  while (stars.length < 5) {
    stars.push(<i key={`empty-${stars.length}`} className="las la-star text-gray-300"></i>);
  }

  return stars;
};

const Authors = () => {
  return (
    <section className="bg-white py-[60px] lg:py-[120px] px-3 xl:px-0 relative">
      <div className="container">
        <div className="flex justify-between gap-4 mb-8 flex-wrap">
          <div>
            <SubHeadingBtn
              text="Testimonial"
              classes="bg-[var(--primary-light)]"
            />
            <h2 className="h2 mt-4 md:mb-6">Our Satisfied Customers Says</h2>
          </div>
          <div className="flex gap-4">
            <div className="prev-btn rounded-full border flex items-center text-primary justify-center hover:bg-primary cursor-pointer duration-300 hover:text-white border-[var(--primary)] w-12 h-12 self-center">
              <i className="las la-angle-left text-2xl"></i>
            </div>
            <div className="next-btn rounded-full border flex items-center text-primary justify-center hover:bg-primary cursor-pointer duration-300 hover:text-white border-[var(--primary)] w-12 h-12 self-center">
              <i className="las la-angle-right text-2xl"></i>
            </div>
          </div>
        </div>

        <Swiper
          loop={true}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          breakpoints={{
            992: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }}
          modules={[Navigation]}
          className="auth-slider"
        >
          {agents.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="p-2 sm:p-5 rounded-2xl border bg-white">
                <div className="bg-[var(--bg-1)] rounded-2xl p-3 sm:p-5 lg:p-8">
                  {/* Dynamic Star Ratings */}
                  <div className="flex items-center gap-1 flex-wrap mb-3 text-2xl text-[var(--tertiary)]">
                    {renderStars(item.rating)}
                  </div>

                  <p className="text-lg md:text-xl mb-0">{item.review}</p>

                  <div className="border-b border-dashed my-4 lg:my-8"></div>

                  <div className="inline-flex items-center gap-5">
                    {/* <div className="w-15 h-15 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={item.img}  // Dynamically load agent image
                        alt={item.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div> */}

                    <div className="flex-grow">
                      <span className="block text-xl font-semibold mb-1 text-start">
                        {item.name}
                      </span>
                      {/* <div className="flex items-center gap-1">
                        <MapPinIcon className="text-[#9C742B] w-5 h-5" />
                        <span className="inline-block">{item.address}</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Authors;
