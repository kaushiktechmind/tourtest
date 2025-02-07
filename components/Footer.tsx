import { PaperPlane } from "@/public/data/icons";
import minilogo from "@/public/img/minilogo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Page {
  id: number;
  page_name: string;
  slug: string;
}

const Footer = () => {

  const [pages, setPages] = useState<Page[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_page");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setPages(data);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, []);

  const handleClick = (id: number) => {
    // Redirect to the `/allpages` route with the `id` as a query parameter
    router.push(`/allpage?id=${id}`);
  };


  return (
    <footer className="bg-[#091E43]">
      <div className="pt-[60px] lg:pt-[120px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-6 text-white px-3 xl:px-0">
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <Link href="./home-2" className="inline-block mb-6">
                <Image src={minilogo} alt="image" width={100} height={50} />
              </Link>


              <ul className="flex gap-3 flex-wrap">
                <li>
                  <Link
                    href="#"
                    className="border border-[#3538ED] duration-300 hover:bg-[#3538ED] grid place-content-center p-[10px] rounded-full"
                  >
                    <i className="lab la-facebook-f text-xl"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="border border-[#3538ED] duration-300 hover:bg-[#3538ED] grid place-content-center p-[10px] rounded-full"
                  >
                    <i className="lab la-twitter text-xl"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="border border-[#3538ED] duration-300 hover:bg-[#3538ED] grid place-content-center p-[10px] rounded-full"
                  >
                    <i className="lab la-linkedin-in text-xl"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="border border-[#3538ED] duration-300 hover:bg-[#3538ED] grid place-content-center p-[10px] rounded-full"
                  >
                    <i className="lab la-instagram text-xl"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="border border-[#3538ED] duration-300 hover:bg-[#3538ED] grid place-content-center p-[10px] rounded-full"
                  >
                    <i className="lab la-dribbble text-xl"></i>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h4 className="text-2xl font-semibold mb-6"> Contact </h4>
              <div className="col-span-12 md:col-span-6 xl:col-span-3">
                <ul className="flex flex-col gap-4">
                  <li>
                    <div className="flex items-center gap-4">
                      <i className="las la-phone-volume bg-primary text-white text-xl p-2 rounded-full"></i>
                      <Link href="tel:3165550116" className="mb-0 clr-neutral-30">
                        +91-9531898558
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-4">
                      <i className="las la-envelope-open bg-[var(--secondary)] text-[var(--neutral-700)] text-xl p-2 rounded-full"></i>
                      <Link href="mailto:example@mail.com" className="mb-0 clr-neutral-30">
                        raja@andamanmangroves.com
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-4">
                      <i className="las la-map-marker-alt bg-[var(--tertiary)] text-[var(--neutral-700)] text-xl p-2 rounded-full"></i>
                      <p className="mb-0 clr-neutral-30">Shop 05, First Floor, Panchayat Market, Sippighat, next to Gram Panchayat Bhavan, Sri Vijaya Puram, Andaman and Nicobar Islands 744105</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>



            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h4 className="text-2xl font-semibold mb-6"> Why Us </h4>
              <p className="clr-neutral-30 mb-6 mt-6 text-justify leading-relaxed">
                Explore the Andaman Islands with Andaman Mangroves Holidays, established in 2012. Enjoy personalized tour packages, stunning landscapes, and well-maintained vehicles suited to your needs. Experience vibrant beaches, lush jungles, and rich culture in the Andaman’s emerald paradise.
              </p>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-3 md:pl-6 ">
              <h4 className="text-2xl font-semibold mb-6">Quick Links</h4>
              <ul className="flex flex-col gap-2">
                {pages.length > 0 ? (
                  pages.map((page) => (
                    <li key={page.id}>
                      <button
                        onClick={() => handleClick(page.id)}
                        className="hover:text-[var(--secondary)] duration-300 text-left"
                      >
                        {page.page_name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li></li>
                )}
                <li>
                  <Link
                    href="/blog-grid"
                    className="hover:text-[var(--secondary)] duration-300 text-left"
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

          </div>


          <div className="px-3">
            <p className="clr-neutral-30 mb-6 mt-6 text-white text-justify leading-relaxed border-b border-dashed border-white pb-4">
              <span className="font-bold">Best Cab Rental in Andaman Island</span> <br />
              Explore reliable <a href="/cabs" className="text-blue-500"> car rental services in Andaman</a> with us. We offer <a href="/cabs" className="text-blue-500"> car rental in Port Blair</a>, <a href="/cabs" className="text-blue-500">car rental in Havelock Island</a>, <a href="/cabs" className="text-blue-500"> car rental in Neil Island</a>, <a href="/cabs" className="text-blue-500">car rental in Swaraj Dweep</a>, <a href="/cabs" className="text-blue-500"> car rental in Shaheed Dweep</a>, and <a href="/cabs" className="text-blue-500">  Sri Vijaya Puram </a>.
                Enjoy seamless <a href="/cabs" className="text-blue-500">Andaman cab booking</a>, car hire, and <a href="/cabs" className="text-blue-500">car rental charges in Port Blair</a> for a smooth travel experience.
            </p>

            <p className="clr-neutral-30 mb-6 mt-6 text-white text-justify leading-relaxed border-b border-dashed border-white pb-4">
              <span className="font-bold">Best Hotels & Homestay in Andaman Island</span> <br />
              We offer a wide range of accommodations for your perfect getaway. explore the <a href="/hotels" className="text-blue-500"> best hotels in andaman</a>, including <a href="/hotels" className="text-blue-500">hotels in port blair</a> and  <a href="/hotels" className="text-blue-500">hotels in havelock island</a> like the <a href="/hotels" className="text-blue-500">resort in havelock</a> and <a href="/hotels" className="text-blue-500">resort in neil island</a>. whether you're looking for <a href="/hotels" className="text-blue-500">luxury resorts in andaman</a>, <a href="/hotels" className="text-blue-500">havelock beach resort</a>, or <a href="/hotels" className="text-blue-500">neil island resorts</a>, we provide excellent options.
               enjoy <a href="/hotels" className="text-blue-500">port blair beach resorts</a>, <a href="/hotels" className="text-blue-500">hotels in port blair near the beach</a>, and <a href="/hotels" className="text-blue-500">best hotels in neil island. </a>
               Book your stay at the <a href="/hotels" className="text-blue-500">best resorts in andaman</a> with us for an unforgettable experience!
            </p>

            <p className="clr-neutral-30 mb-6 mt-6 text-white text-justify leading-relaxed pb-4">
              <span className="font-bold">Best Tour Packages in Andaman Island</span> <br />
              We offer a wide range of <a href="/hotels" className="text-blue-500">andaman tour packages</a>, including <a href="/hotels" className="text-blue-500">andaman nicobar tour packages</a> for
               couples, families, and groups. explore the beauty of <a href="/hotels" className="text-blue-500">andaman and nicobar
                islands tourism,</a> with customized itineraries for 5 days or 7 days. our <a href="/hotels" className="text-blue-500">andaman
                 nicobar packages</a> cover <a href="/hotels" className="text-blue-500">top tourist places in port blair</a>, <a href="/hotels" className="text-blue-500">havelock island</a>, and beyond.
                  we offer affordable <a href="/hotels" className="text-blue-500">andaman trip packages</a>, including port blair packages and
                   <a href="/hotels" className="text-blue-500">andaman and nicobar islands trip cost</a> for 
                   couples and families. book your <a href="/hotels" className="text-blue-500">andaman holiday package</a> with us today for the best deals and experiences!
            </p>

          </div>
        </div>

      </div>

      <div className="container">
        <div className="row">
          <div className="col-span-12">
            <div className="py-8 border-t border-[#3638bd] text-white">
              <div className="grid grid-cols-12 gap-4 ">
                <div className="col-span-12 lg:col-span-6">
                  <p className="m-0 text-center lg:text-start">
                    &copy; {new Date().getFullYear()}
                    <span className="text-[var(--tertiary)]"> Andman Mangroves Holydays </span>. Designed By
                    <Link href="https://techmindscape.in/" className="text-[var(--secondary)]">
                      {" "}
                      Techmindscape
                    </Link>
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <ul className="flex items-center flex-wrap gap-6 justify-center lg:justify-end">
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/paypal.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/payoneer.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/visa.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/master-card.png"
                        alt="image"
                        className=""
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
