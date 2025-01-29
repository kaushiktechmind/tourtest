"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Children, Suspense } from "react";

import { useEffect, useState } from "react";
import RazorpayPkgBtn from "@/components/RazorpayPkgBtn";
RazorpayPkgBtn;


interface PaymentData {
  country: string;
  id: number;
  booking_id: string;
  invoice_id: string;
  service_type: string;
  adults: string;
  childs: string;
  infants: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  address: string;
  passport_no: string;
}

interface ItineraryItem {
  day: string;
  title: string;
  description: string;
  image: string;
}



const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const storedPackageData = JSON.parse(localStorage.getItem("packageData") || "[]");
const packageData = storedPackageData[0];

// Access the properties from the parsed object
const adult = Number(packageData?.adult); // Default to 0 if undefined
const child = Number(packageData?.child || 0);
const infant = Number(packageData?.infant || 0);

const adultPrice = Number(packageData?.adultPrice || 0);
const childPrice = Number(packageData?.childPrice || 0);
const infantPrice = Number(packageData?.infantPrice || 0);
const totalPrice = Number(packageData?.totalPrice);
const extraPrice = Number(packageData?.extraPrice);
const serviceFee = Number(packageData?.serviceFee);

const reservationDate = packageData?.date; // "2025-02-19"
const [year, month, day] = reservationDate.split('-');
const formattedDate2 = `${day}-${month}-${year}`;

const generateBookingID = () => {
  // Generate a random number with a fixed length
  const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
};

const PackageReciept = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const [packageItem, setPackageItem] = useState<any>(null);

  const [bookingID, setBookingID] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);

  const [itineraryData, setItineraryData] = useState<ItineraryItem[]>([]);
  const inclusions = packageItem ? JSON.parse(packageItem.package_includes) : [];
  const exclusions = packageItem ? JSON.parse(packageItem.package_excludes) : [];



  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [mobile_number, setMobileNumber] = useState(localStorage.getItem("mobile_number") || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value);
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };



  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6  mt-[40px]">
          <div className="col-span-12 lg:col-span-8">
            <div className="pb-lg-0">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="mb-0 h3">Your Booking Info</h3>
                  <p className="mb-0 h3 text-right">BKNG-123</p>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-12">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Transaction ID
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">RAZ000123IJKL123</p>
                    </div>
                  </div>

                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-6 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Booking Date
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">02-10-2025</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Reservation Date
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">02-20-2025</p>
                    </div>
                  </div>


                  <div className="col-span-6 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Total Pax
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">4</p>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  {/* Adult Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Adults (12+)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">2</p> {/* Static Adult Value */}
                    </div>
                  </div>

                  {/* Children (9-11) Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (9-11)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">1</p> {/* Static Child 1 Value */}
                    </div>
                  </div>

                  {/* Children (6-8) Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (6-8)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">2</p> {/* Static Child 2 Value */}
                    </div>
                  </div>

                  {/* Children (3-5) Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (3-5)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">1</p> {/* Static Child 3 Value */}
                    </div>
                  </div>

                  {/* Infants (1+) Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Infants (1+)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">1</p> {/* Static Infant 1 Value */}
                    </div>
                  </div>

                  {/* Infants (0) Section */}
                  <div className="col-span-4 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Infants (0)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">0</p> {/* Static Infant 2 Value */}
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex flex-wrap border items-center rounded-2xl w-full relative">
                    <div className="rounded-2xl p-2 w-full md:w-1/3">
                      <Image
                        src={"https://picsum.photos/128/128?random=90"}
                        alt={packageItem?.banner_title || "Default Banner Title"}
                        width={100}
                        height={100}
                        className="h-[200px] w-full rounded-2xl"
                      />
                    </div>
                    <div className="relative w-full md:w-2/3">
                      <div className="p-4">
                        <div className="property-card__body">
                          <Link
                            href={`/package-details/${packageItem?.id}`}
                            className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                          >
                            {packageItem?.package_title || "Package Title"}
                          </Link>
                          <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-1">
                              <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                              <span className="inline-block">
                                {packageItem?.location_name || "Location"}
                              </span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                          <ul className="flex flex-wrap gap-6">
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-globe text-[#22804A]"></i>
                              <span className="block text-sm">
                                {packageItem?.pickup_point || "Pickup Point"}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <i className="las la-clock text-xl text-[#22804A]"></i>
                              <span className="block text-sm">
                                {packageItem?.duration || "Duration"}
                              </span>
                            </li>


                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="p-6 bg-[var(--bg-1)] rounded-lg border border-neutral-40 shadow-lg mb-6 lg:mb-10">
  <h4 className="mb-6 text-2xl font-semibold text-neutral-900">Itinerary</h4>
  <ul className="space-y-6">
    {/* Static Itinerary Item 1 */}
    <li className="flex flex-col lg:flex-row items-start gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
      {/* Day */}
      <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
        <span className="text-sm font-medium">Day</span>
        <span className="text-lg font-bold ml-1">1</span>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h5 className="text-xl font-semibold text-neutral-800 mb-3">Itinerary 1</h5>
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="w-32 h-28 shrink-0">
            <Image
              width={128}
              height={128}
              src="https://picsum.photos/128/128?random=1" // Dummy image from Lorem Picsum
              alt="Image"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
            Arrive at the destination and begin your introductory tour. Explore the local area and relax at the hotel.
          </p>
        </div>
      </div>
    </li>

    {/* Static Itinerary Item 2 */}
    <li className="flex flex-col lg:flex-row items-start gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
      {/* Day */}
      <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
        <span className="text-sm font-medium">Day</span>
        <span className="text-lg font-bold ml-1">2</span>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h5 className="text-xl font-semibold text-neutral-800 mb-3">Itinerary 2</h5>
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="w-32 h-28 shrink-0">
            <Image
              width={128}
              height={128}
              src="https://picsum.photos/128/128?random=2" // Dummy image from Lorem Picsum
              alt="Image"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
            Explore the city&apos;s landmarks, including the famous historical monuments, parks, and museums.
          </p>
        </div>
      </div>
    </li>

    {/* Static Itinerary Item 3 */}
    <li className="flex flex-col lg:flex-row items-start gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
      {/* Day */}
      <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
        <span className="text-sm font-medium">Day</span>
        <span className="text-lg font-bold ml-1">3</span>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h5 className="text-xl font-semibold text-neutral-800 mb-3">Itinerary 3</h5>
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="w-32 h-28 shrink-0">
            <Image
              width={128}
              height={128}
              src="https://picsum.photos/128/128?random=3" // Dummy image from Lorem Picsum
              alt="Image"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
            Spend the day relaxing on the beach. Enjoy the sun, sand, and clear blue waters, with a variety of water sports available.
          </p>
        </div>
      </div>
    </li>
  </ul>
</div>







              <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                <h4 className="mb-0 text-2xl font-semibold">Inclusions & Exclusions</h4>
                <div className="border border-dashed my-5"></div>

                {/* Inclusions Section */}
                <h6 className="mb-4 font-semibold">Inclusions</h6>
                <ul className="flex flex-col gap-4 mb-10">
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 1</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 2</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 3</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 4</span>
                    </div>
                  </li>
                </ul>

                {/* Exclusions Section */}
                <h6 className="mb-4 font-semibold">Exclusions</h6>
                <ul className="flex flex-col gap-4 mb-10">
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 1</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 2</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 3</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 4</span>
                    </div>
                  </li>
                </ul>
              </div>



              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 flex-1">
                <h4 className="mb-3 text-2xl font-semibold">Billing Address</h4>
                <div className="border border-dashed my-6"></div>
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  <div className="col-span-12 md:col-span-6">
                    <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5">
                      Tej Pratap
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5">tejas@gmail.com</p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5"> 9876789543</p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="rounded-full border bg-[var(--bg-1)] pr-4">
                      <p className="w-full bg-transparent px-5 py-3">India</p>
                    </div>
                  </div>
                  {/* <div className="col-span-12">
                    {paymentData[0]?.passport_no !== "N/A" ? (
                      <input
                        type="text"
                        value={paymentData[0]?.passport_no || ""}
                        readOnly
                        className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl py-3 px-6"
                      />
                    ) : null}
                  </div> */}

                  <div className="col-span-12">
                    <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl py-3 px-6"> Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 border">
              <h4 className="mb-0 text-2xl font-semibold">Order Summary</h4>
              <div className="border border-dashed my-8"></div>
              <ul className="flex flex-col gap-4">
                {/* Static Adult Price */}
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-0">Adult Price(12+)</p>
                  <p className="mb-0 font-medium text-right">₹2000</p>
                </li>

                {/* Static Child Price (9-11) */}
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (9-11)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹1500</p>
                </li>

                {/* Static Child Price (6-8) */}
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (6-8)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹1200</p>
                </li>

                {/* Static Child Price (3-5) */}
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (3-5)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹1000</p>
                </li>

                {/* Static Infant Price (1+) */}
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Infant Price (1+)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹500</p>
                </li>

                {/* Static Infant Price (0) */}
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Infant Price(0)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹0</p>
                </li>
              </ul>

              <div className="border border-dashed my-8"></div>
              <div className="grid grid-cols-2 items-center mb-6">
                <p className="mb-0 font-bold">Total Price</p>
                <p className="mb-0 font-medium text-right">₹7000</p>
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PackageReciept />
  </Suspense>
);


export default Page;
