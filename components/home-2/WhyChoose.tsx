import Image from "next/image";
import SubHeadingBtn from "../SubHeadingBtn";

const WhyChoose = () => {
  return (
    <section className="py-[60px] lg:py-[120px] relative">
      <div className="px-3">
        <div className="container">
          <div className="max-w-[570px] mx-auto flex flex-col items-center text-center">
            <SubHeadingBtn
              text="Why choose us"
              classes="bg-[var(--primary-light)]"
            />
            <h2 className="h2 mt-3 leading-tight">
              Why Choose Us for Your Next Adventure
            </h2>
            <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
              If you&apos;re looking for an unforgettable travel experience, we
              believe that our tour company is the perfect choice
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="border rounded-2xl hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] hover:border-none p-6 xl:p-8 text-center duration-300">
            <Image
              width={60}
              height={60}
              src="/img/duotone-home.png"
              alt="Best guide"
              className="mx-auto mb-6"
            />
            <h4 className="mb-4 text-2xl font-semibold">Best guide</h4>
            <p>
              Our expert tour guide knows the best about traveling and will
              guide you all the time.
            </p>
          </div>

          <div className="border rounded-2xl hover:shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] hover:border-none p-6 xl:p-8 text-center duration-300">
            <Image
              width={60}
              height={60}
              src="/img/duotone-discount.png"
              alt="Lots of Discount"
              className="mx-auto mb-6"
            />
            <h4 className="mb-4 text-2xl font-semibold">Lots of Discount</h4>
            <p>
              We realize ideas from simple to complex, making everything easy to
              use.
            </p>
          </div>

          <div className="border rounded-2xl hover:shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] hover:border-none p-6 xl:p-8 text-center duration-300">
            <Image
              width={60}
              height={60}
              src="/img/duotone-support.png"
              alt="Support 24/7"
              className="mx-auto mb-6"
            />
            <h4 className="mb-4 text-2xl font-semibold">Support 24/7</h4>
            <p>
              Our customer experience team is available around the clock to
              answer your questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
