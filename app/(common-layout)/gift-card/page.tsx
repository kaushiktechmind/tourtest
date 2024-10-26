import Faq from "@/components/home-1/Faq";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import giftCard from "@/public/img/gift-card.png";

const page = () => {
  return (
    <>
      {/* Gift Card Items */}
      <section className="bg-[var(--bg-2)] py-[60px] lg:py-[110px] px-3">
        <div className="container">
          <div className="text-center max-w-[630px] mx-auto mb-8 lg:mb-14">
            <h2 className="h2 leading-tight">
              Gift someone a beautiful experience
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="rounded-2xl bg-white p-2">
                <div className="bg-[url('/img/gift-card-bg.png')] rounded-2xl bg-no-repeat flex items-center bg-cover min-h-[196px]">
                  <div className="text-white flex justify-between items-center flex-grow px-8 lg:px-10">
                    <span>Coupon</span>
                    <h3 className="h3 text-white">$200</h3>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <h3 className="h3 mb-2">Gift card for 200 USD</h3>
                  <p className="mb-7">
                    A gift card is a type of prepaid card that is loaded with a
                    certain amount of money
                  </p>
                  <Link className="btn-outline" href="/gift-card-details">
                    See More <ArrowLongRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="rounded-2xl bg-white p-2">
                <div className="bg-[url('/img/gift-card-bg.png')] rounded-2xl bg-no-repeat flex items-center bg-cover min-h-[196px]">
                  <div className="text-white flex justify-between items-center flex-grow px-8 lg:px-10">
                    <span>Coupon</span>
                    <h3 className="h3 text-white">$400</h3>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <h3 className="h3 mb-2">Gift card for 400 USD</h3>
                  <p className="mb-7">
                    A gift card is a type of prepaid card that is loaded with a
                    certain amount of money
                  </p>
                  <Link className="btn-outline" href="/gift-card-details">
                    See More <ArrowLongRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="rounded-2xl bg-white p-2">
                <div className="bg-[url('/img/gift-card-bg.png')] rounded-2xl bg-no-repeat flex items-center bg-cover min-h-[196px]">
                  <div className="text-white flex justify-between items-center flex-grow px-8 lg:px-10">
                    <span>Coupon</span>
                    <h3 className="h3 text-white">$800</h3>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <h3 className="h3 mb-2">Gift card for 800 USD</h3>
                  <p className="mb-7">
                    A gift card is a type of prepaid card that is loaded with a
                    certain amount of money
                  </p>
                  <Link className="btn-outline" href="/gift-card-details">
                    See More <ArrowLongRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Faq Section */}
      <Faq />
      {/*  */}
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
