import Faq from "@/components/home-1/Faq";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import giftCard from "@/public/img/gift-card.png";

const page = () => {
  return (
    <>
      {/* Gift card details */}
      <section className="bg-[var(--bg-2)] py-[60px] lg:py-[120px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="text-3xl lg:text-5xl xxl:text-7xl font-semibold leading-normal mb-3">
                Gift Card for 400 USD
              </h2>
              <p className="mb-6 lg:mb-9">
                A great gift idea is a coupon to our Placewish space.
              </p>
              <Link href="#" className="btn-primary">
                Add to Cart <ArrowLongRightIcon className="w-5 h-5" />
              </Link>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-[url('/img/gift-card-bg.png')] rounded-2xl bg-no-repeat flex flex-col bg-cover min-h-[308px] px-8 lg:px-10 py-8">
                <div className="text-white flex justify-between w-full flex-grow">
                  <span>Coupon</span>
                  <h2 className="h2 text-white">$400</h2>
                </div>
                <p className="text-white text-lg font-medium">
                  Can be used while booking a stay out Placewish space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Faq */}
      <Faq />
      <section className="bg-white py-[60px] lg:pt-[138px] lg:pb-[120px]">
        <div className="px-3 sm:px-10 md:px-16 3xl:px-[152px] rounded-xl bg-[var(--bg-2)] max-w-[1600px] mx-auto">
          <div className="container grid grid-cols-2 gap-6">
            <div className="col-span-2 lg:col-span-1">
              <div className="max-w-[636px] py-[60px] lg:py-[120px]">
                <h2 className="h2 leading-tight mb-2">
                  Surprise Someone Special with a Placewish Gift Card
                </h2>
                <p className="mb-6 lg:mb-8">
                  To purchase a Placewish gift card, simply visit our website
                  and select the amount you wish to gift.
                </p>
                <Link className="btn-primary" href="#">
                  Buy Template <ArrowLongRightIcon className="w-4 h-5" />
                </Link>
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Image
                src={giftCard}
                width={617}
                height={634}
                className="xxl:-mt-[150px] 3xl:translate-x-20"
                alt="Gift card img"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
