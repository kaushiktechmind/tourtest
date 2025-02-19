import appStore from "@/public/img/appstore-btn.png";
import googlePlay from "@/public/img/playstore-btn.png";
import Image from "next/image";
import Link from "next/link";
import SubHeadingBtn from "./SubHeadingBtn";

const MobileApp = () => {
  return (
    <section className="bg-white px-3 overflow-x-hidden">
      <div className="container relative bg-[var(--secondary-light)] rounded-2xl py-[60px] lg:py-[120px] lg:after:bg-[url('/img/app-img.jpg')] after:bg-right after:bg-cover after:bg-no-repeat after:absolute after:h-full after:w-[42%] after:top-0 after:-right-32 after:rounded-r-3xl after:rounded-[50%] after:scale-[1.2] overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="col-span-2 lg:col-span-1 pl-4 md:pl-10 lg:pl-20 xl:pl-28">
            <SubHeadingBtn
              text="Mobile App"
              classes="bg-[var(--primary-light)]"
            />
            <h2 className="h2 mt-3">Download Our Mobile App</h2>
            <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
              Real estate can be bought, sold, leased, or rented, and can be a
              valuable investment opportunity. The value of real estate can
              be...
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="#"
                className="inline-block py-3 px-4 rounded-md bg-[var(--tertiary)]">
                <Image src={googlePlay} alt="img" />
              </Link>
              <Link
                href="#"
                className="inline-block py-3 px-4 rounded-md bg-[var(--secondary)]">
                <Image src={appStore} alt="img" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
