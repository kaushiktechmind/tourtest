import { PaperPlane } from "@/public/data/icons";
import logolight from "@/public/img/logo-light.png";
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
      <div className="py-[60px] lg:py-[120px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-6 text-white px-3 xl:px-0">
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <Link href="./home-2" className="inline-block mb-6">
                <Image src={logolight} alt="image" className="" />
              </Link>

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
              <p className="clr-neutral-30 mb-6 mt-6 text-justify leading-relaxed">
                Explore the Andaman Islands with Andaman Mangroves Holidays, established in 2012. Enjoy personalized tour packages, stunning landscapes, and well-maintained vehicles suited to your needs. Experience vibrant beaches, lush jungles, and rich culture in the Andaman’s emerald paradise.
              </p>
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
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h4 className="text-2xl font-semibold mb-6"> Contact </h4>
              {/* <ul className="flex flex-col gap-4">
                <li>
                  <div className="flex items-center gap-4">
                    <i className="las la-phone-volume bg-primary text-white text-xl p-2 rounded-full"></i>
                    <Link href="tel:3165550116" className="mb-0 clr-neutral-30">
                      (316) 555-0116
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-4">
                    <i className="las la-envelope-open bg-[var(--secondary)] text-[var(--neutral-700)] text-xl p-2 rounded-full"></i>
                    <Link href="mailto:example@mail.com" className="mb-0 clr-neutral-30">
                      example@mail.com
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-4">
                    <i className="las la-map-marker-alt bg-[var(--tertiary)] text-[var(--neutral-700)] text-xl p-2 rounded-full"></i>
                    <p className="mb-0 clr-neutral-30">31 Brandy Way, Sutton, SM2 6SE</p>
                  </div>
                </li>
              </ul> */}
            </div>
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h4 className="text-2xl font-semibold mb-6"> Newsletter </h4>
              <p className="mb-6 clr-neutral-30">Subscribe our newsletter to get our latest update & news</p>
              <div className="p-2 rounded-full border border-neutral-200">
                <form action="#" className="flex items-center">
                  <input
                    type="text"
                    placeholder="Email address"
                    className="w-full border-0 bg-transparent clr-neutral-30 px-3 py-2 ::placeholder-neutral-30 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="grid place-content-center px-6 py-3 rounded-full bg-[var(--tertiary)]  border-0"
                  >
                    <PaperPlane />
                  </button>
                </form>
              </div>
            </div>
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
