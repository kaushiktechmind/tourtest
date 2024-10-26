import WhyChooseImg1 from "@/public/img/home-4-why-choose/img-1.png";
import WhyChooseImg2 from "@/public/img/home-4-why-choose/img-2.png";
import Image from "next/image";
import Link from "next/link";
import SubHeadingBtn from "../SubHeadingBtn";

const WhyChoose = () => {
  return (
    <div className="py-[60px] lg:pt-[120px] relative bg-white px-3 overflow-x-hidden">
      <div className="container">
        <div className="grid grid-cols-12 gap-5 sm:gap-10">
          <div className="col-span-12 lg:col-span-6 xxl:col-span-5 relative">
            <div className="min-h-[600px] max-lg:mx-3 gap-3">
              <Image
                className="absolute rounded-2xl top-0 left-0"
                src={WhyChooseImg1}
                alt="why choose us"
              />
              <Image
                className="absolute rounded-2xl bottom-0 right-0 border-[5px] border-white "
                src={WhyChooseImg2}
                alt="why choose us"
              />

              <Image
                width={830}
                height={719}
                src="/img/why-choose-el-3.png"
                alt="image"
                className="absolute top-8 xl:top-40 right-10 xxl:scale-125"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 xxl:col-start-7">
            <div className="max-w-[570px]">
              <SubHeadingBtn
                text="Why Choose Us"
                classes="bg-[var(--primary-light)]"
              />
              <h2 className="h2 mt-3 leading-tight">
                Why Choose Us for Your Next Hotel Booking
              </h2>
              <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
                At our hotel booking website, we pride ourselves on providing a
                top-notch booking experience that is both easy and enjoyable.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <div className="grid place-content-center w-20 h-20 rounded-full bg-[var(--primary-light)] mb-6">
                  <Image
                    width={48}
                    height={48}
                    src="/img/icon-breakfast.png"
                    alt="image"
                    className="w-12 h-12 object-fit-contain"
                  />
                </div>
                <h4 className="mb-3 text-2xl font-semibold"> Quality Food </h4>
                <p className="mb-0">
                  Hotel facilities are the services and amenities that hotels
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="grid place-content-center w-20 h-20 rounded-full bg-[#EBFAF1] mb-6">
                  <Image
                    width={48}
                    height={48}
                    src="/img/icon-room-service-secondary.png"
                    alt="image"
                    className="w-12 h-12 object-fit-contain"
                  />
                </div>
                <h4 className="mb-3 text-2xl font-semibold">Quick Services</h4>
                <p className="mb-0">
                  Hotel facilities are the services and amenities that hotels
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="grid place-content-center w-20 h-20 rounded-full bg-[#FFF6E4] mb-6">
                  <Image
                    width={48}
                    height={48}
                    src="/img/icon-secure-tertiary.png"
                    alt="image"
                    className="w-12 h-12 object-fit-contain"
                  />
                </div>
                <h4 className="mb-3 text-2xl font-semibold"> High Security </h4>
                <p className="mb-0">
                  Hotel facilities are the services and amenities that hotels
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="grid place-content-center w-20 h-20 rounded-full bg-[var(--primary-light)] mb-6">
                  <Image
                    width={48}
                    height={48}
                    src="/img/icon-service.png"
                    alt="image"
                    className="w-12 h-12 object-fit-contain"
                  />
                </div>
                <h4 className="mb-3 text-2xl font-semibold">24 Hours Alert</h4>
                <p className="mb-0">
                  Hotel facilities are the services and amenities that hotels
                </p>
              </div>
            </div>
            <div className="border-b border-dashed my-10"></div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Link href="about-us" className="btn-primary-lg font-semibold">
                Discover More
              </Link>
              <div className="flex items-center gap-4 flex-wrap">
                <ul className="flex user-group">
                  <li>
                    <div className="w-13 h-13 border rounded-full overflow-hidden -mr-4">
                      <Image
                        width={50}
                        height={50}
                        src="/img/user-1.jpg"
                        alt="image"
                        className="w-full h-full object-fit-cover"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="w-13 h-13 border rounded-full overflow-hidden -mr-4">
                      <Image
                        width={50}
                        height={50}
                        src="/img/user-2.jpg"
                        alt="image"
                        className="w-full h-full object-fit-cover"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="w-13 h-13 border rounded-full overflow-hidden -mr-4">
                      <Image
                        width={50}
                        height={50}
                        src="/img/user-3.jpg"
                        alt="image"
                        className="w-full h-full object-fit-cover"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="w-13 h-13 border rounded-full overflow-hidden relative">
                      <Image
                        width={50}
                        height={50}
                        src="/img/user-4.jpg"
                        alt="image"
                        className="w-full h-full object-fit-cover"
                      />
                      <span className="grid place-content-center w-full h-full absolute top-0 bg-[#3639ed8c]">
                        <i className="las la-plus text-white text-2xl"></i>
                      </span>
                    </div>
                  </li>
                </ul>
                <p className="mb-0 text-lg">
                  <span className="text-primary font-medium">500k+</span>
                  Happy Customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
