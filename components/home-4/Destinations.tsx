import destinationimg1 from "@/public/img/destination-img-1.jpg";
import destinationimg2 from "@/public/img/destination-img-2.jpg";
import destinationimg3 from "@/public/img/destination-img-3.jpg";
import destinationimg4 from "@/public/img/destination-img-4.jpg";
import destinationimg5 from "@/public/img/destination-img-5.jpg";
import Image from "next/image";
import Link from "next/link";
import SubHeadingBtn from "../SubHeadingBtn";

const Destinations = () => {
  return (
    <div className="py-[60px] lg:py-[120px] bg-white relative">
      <div className="container">
        <div className="max-w-[630px] mx-auto flex flex-col items-center text-center px-3">
          <SubHeadingBtn
            text="Explore Destination"
            classes="bg-[var(--primary-light)]"
          />
          <h2 className="h2 mt-3 leading-tight">
            Explore Your Destination with Our Helpful Guides and Tips
          </h2>
          <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
            Real estate can be bought, sold, leased, or rented, and can be a
            valuable investment opportunity. The value of real estate can be...
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:gap-6 px-3 xl:px-0">
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="relative rounded-2xl group">
                <div className="listing-card__img">
                  <Image
                    src={destinationimg1}
                    alt="image"
                    className=" w-full rounded-2xl"
                  />
                </div>
                <div className="absolute top-0 left-0 flex flex-col justify-between h-full w-full before:w-full before:absolute before:h-full before:bottom-0 before:left-0 before:bg-gradient-to-t before:rounded-b-2xl before:from-slate-800 before:to-transparent group-hover:after:w-full group-hover:after:absolute group-hover:after:h-full group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:bg-gradient-to-t group-hover:after:rounded-b-2xl group-hover:after:from-[var(--primary)] group-hover:after:to-transparent group-hover:after:opacity-60">
                  <div>
                    <Link
                      href="hotels"
                      className="inline-block py-2 px-5 rounded-full bg-[var(--tertiary)] absolute top-6 left-6 w-max">
                      25+ New
                    </Link>
                  </div>
                  <div className="self-end px-5 pb-5 flex flex-wrap w-full gap-4 items-center justify-between z-10">
                    <div>
                      <div className="flex gap-2 items-center">
                        <i className="las la-map-marker-alt text-3xl text-[#9C742B]"></i>
                        <h4 className="text-2xl text-white font-semibold">
                          Paris, France
                        </h4>
                      </div>
                      <span className="text-white text-lg">320+ Hotel</span>
                    </div>
                    <Link
                      href="/hotels"
                      className="inline-flex w-11 h-11 rounded-full border items-center justify-center group-hover:bg-[var(--secondary)] text-[var(--secondary)] group-hover:text-neutral-900 duration-300 border-[var(--secondary)]">
                      <i className="las la-angle-right text-3xl"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl group">
                <div className="listing-card__img">
                  <Image
                    src={destinationimg2}
                    alt="image"
                    className=" w-full rounded-2xl"
                  />
                </div>
                <div className="absolute top-0 left-0 flex h-full items-end w-full before:w-full before:absolute before:h-full before:bottom-0 before:left-0 before:bg-gradient-to-t before:rounded-b-2xl before:from-slate-800 before:to-transparent group-hover:after:w-full group-hover:after:absolute group-hover:after:h-full group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:bg-gradient-to-t group-hover:after:rounded-b-2xl group-hover:after:from-[var(--primary)] group-hover:after:to-transparent group-hover:after:opacity-60">
                  <div className="self-end px-5 pb-5 flex flex-wrap w-full z-10 gap-4 items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <i className="las la-map-marker-alt text-3xl text-[#9C742B]"></i>
                        <h4 className="text-2xl text-white font-semibold">
                          Paris, France
                        </h4>
                      </div>
                      <span className="text-white text-lg">320+ Hotel</span>
                    </div>
                    <Link
                      href="/hotels"
                      className="inline-flex w-11 h-11 rounded-full border items-center justify-center group-hover:bg-[var(--secondary)] text-[var(--secondary)] group-hover:text-neutral-900 duration-300 border-[var(--secondary)]">
                      <i className="las la-angle-right text-3xl"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4 relative group">
            <div className="listing-card h-full">
              <div className="listing-card__img h-full">
                <Image
                  src={destinationimg3}
                  alt="image"
                  className=" w-full rounded-2xl h-full objec-fit-cover"
                />
              </div>
              <div className="absolute top-0 left-0 w-full flex items-end h-full before:w-full before:absolute before:h-full before:bottom-0 before:left-0 before:bg-gradient-to-t before:rounded-b-2xl before:from-slate-800 before:to-transparent group-hover:after:w-full group-hover:after:absolute group-hover:after:h-full group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:bg-gradient-to-t group-hover:after:rounded-b-2xl group-hover:after:from-[var(--primary)] group-hover:after:to-transparent group-hover:after:opacity-60">
                <div className="flex items-center">
                  <Link
                    href="hotels"
                    className="inline-block py-2 px-5 rounded-full bg-[var(--tertiary)] absolute top-6 left-6 w-max">
                    36+ New
                  </Link>
                </div>
                <div className="self-end z-10 px-5 pb-5 flex flex-wrap w-full gap-4 items-center justify-between">
                  <div>
                    <div className="flex gap-2 items-center">
                      <i className="las la-map-marker-alt text-3xl text-[#9C742B]"></i>
                      <h4 className="text-2xl text-white font-semibold">
                        Paris, France
                      </h4>
                    </div>
                    <span className="text-white text-lg">320+ Hotel</span>
                  </div>
                  <Link
                    href="/hotels"
                    className="inline-flex w-11 h-11 rounded-full border items-center justify-center group-hover:bg-[var(--secondary)] text-[var(--secondary)] group-hover:text-neutral-900 duration-300 border-[var(--secondary)]">
                    <i className="las la-angle-right text-3xl"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="relative rounded-2xl group">
                <div className="listing-card__img">
                  <Image
                    src={destinationimg4}
                    alt="image"
                    className=" w-full rounded-2xl"
                  />
                </div>
                <div className="absolute top-0 left-0 flex h-full items-end w-full before:w-full before:absolute before:h-full before:bottom-0 before:left-0 before:bg-gradient-to-t before:rounded-b-2xl before:from-slate-800 before:to-transparent group-hover:after:w-full group-hover:after:absolute group-hover:after:h-full group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:bg-gradient-to-t group-hover:after:rounded-b-2xl group-hover:after:from-[var(--primary)] group-hover:after:to-transparent group-hover:after:opacity-60">
                  <div className="self-end z-10 px-5 pb-5 flex flex-wrap w-full gap-4 items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <i className="las la-map-marker-alt text-3xl text-[#9C742B]"></i>
                        <h4 className="text-2xl text-white font-semibold">
                          Paris, France
                        </h4>
                      </div>
                      <span className="text-white text-lg">320+ Hotel</span>
                    </div>
                    <Link
                      href="/hotels"
                      className="inline-flex w-11 h-11 rounded-full border items-center justify-center group-hover:bg-[var(--secondary)] text-[var(--secondary)] group-hover:text-neutral-900 duration-300 border-[var(--secondary)]">
                      <i className="las la-angle-right text-3xl"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl group">
                <div className="listing-card__img">
                  <Image
                    src={destinationimg5}
                    alt="image"
                    className=" w-full rounded-2xl"
                  />
                </div>
                <div className="absolute top-0 left-0 flex flex-col h-full w-full justify-between before:w-full before:absolute before:h-full before:bottom-0 before:left-0 before:bg-gradient-to-t before:rounded-b-2xl before:from-slate-800 before:to-transparent group-hover:after:w-full group-hover:after:absolute group-hover:after:h-full group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:bg-gradient-to-t group-hover:after:rounded-b-2xl group-hover:after:from-[var(--primary)] group-hover:after:to-transparent group-hover:after:opacity-60">
                  <div className="flex items-center">
                    <Link
                      href="hotels"
                      className="inline-block py-2 px-5 rounded-full bg-[var(--tertiary)] absolute top-6 left-6 w-max">
                      25+ New
                    </Link>
                  </div>
                  <div className="self-end z-10 px-5 pb-5 flex flex-wrap w-full gap-4 items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <i className="las la-map-marker-alt text-3xl text-[#9C742B]"></i>
                        <h4 className="text-2xl text-white font-semibold">
                          Paris, France
                        </h4>
                      </div>
                      <span className="text-white text-lg">320+ Hotel</span>
                    </div>
                    <Link
                      href="/hotels"
                      className="inline-flex w-11 h-11 rounded-full border items-center justify-center group-hover:bg-[var(--secondary)] text-[var(--secondary)] group-hover:text-neutral-900 duration-300 border-[var(--secondary)]">
                      <i className="las la-angle-right text-3xl"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Link href="/hotels" className="btn-outline  text-primary">
          See All Destination
        </Link>
      </div>
    </div>
  );
};

export default Destinations;
