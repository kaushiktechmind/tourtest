import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const restrictValue = localStorage.getItem("restrictValue");

const HotelDetailsFeaturedRoom = ({
  item,
  startdate,
  onBookNowClick,
  onTotalPricesCalculated,
}: any) => {
  const {
    id,
    featured_images,
    price,
    sale_price,
    type,
    title,
    extra_bed_price,
    child_price,
    amenity_name1,
    amenity_logo1,
    amenity_name2,
    amenity_logo2,
    amenity_name3,
    amenity_logo3,
    amenity_name4,
    amenity_logo4,
  } = item;

  localStorage.setItem("roomPrice", price);

  const [baseRoomPrice, setBaseRoomPrice] = useState<string | null>(null);
  // if (type == 'null') {
  //   const [price, setPrice] = useState<number | null>(null);
  // }
  const [status, setStatus] = useState<number | null>(null);
  const [roomAvailableNo, setRoomAvailableNo] = useState<number>(5);

  // State for calculated prices
  const [totalPrices, setTotalPrices] = useState({
    adultTotal: 0,
    childTotal: 0,
    extraBedTotal: 0,
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${id}`
        );
        const data = await response.json();
        setBaseRoomPrice(data.room.room_price); // Extract room_price from the API response
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [id]);

  // Calculate total prices for adults, children, and extra beds
  const calculateTotalPrices = () => {
    let adultTotal = 0;
    let childTotal = 0;
    let extraBedTotal = 0;

    // Retrieve added rooms from localStorage
    const addedRooms = JSON.parse(localStorage.getItem("addedRooms") || "[]");

    addedRooms.forEach((room: any) => {
      // Calculate the total price for adults and extra beds
      if (room.adults == 1 || room.adults == 2) {
        adultTotal += price;
      }
      if (room.adults == 3) {
        adultTotal += price;
        extraBedTotal += extra_bed_price; // Assuming extra bed for adults >= 3
      }
      childTotal += child_price * room.children;
    });

    setTotalPrices({ adultTotal, childTotal, extraBedTotal });
    onTotalPricesCalculated({ adultTotal, childTotal, extraBedTotal });
  };

  const handleBookNow = () => {
    const restrictValue = localStorage.getItem("restrictValue");
    if (startdate == null) {
      alert("Choose Date and Search To Proceed");
    } else if (!restrictValue) {
      alert("search for this enrty");
    } else {
      calculateTotalPrices(); // Update the total prices when 'Book Now' is clicked
      onBookNowClick(id); // Call onBookNowClick with the room ID
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const slideInterval = 3000; // 2 seconds interval

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleNext(); // Auto-slide to the next image
  //   }, slideInterval);

  //   return () => clearInterval(interval); // Clean up on component unmount
  // }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featured_images.length);
    }, slideInterval);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentIndex, featured_images.length, slideInterval]); // Add 'currentIndex' and other used variables

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featured_images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + featured_images.length) % featured_images.length
    );
  };

  if (status === 0) {
    return null; // Render nothing if status is 0
  }

  return (
    <li key={id}>
      {/* loop to show all images that is in featured_images */}

      <div className="p-2 rounded-2xl flex flex-col md:flex-row bg-[var(--bg-2)]">
        <div
           className="relative overflow-hidden w-full h-full md:w-[300px]" 
       
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {featured_images.map((image: string, index: number) => (
              <div
                key={index}
                style={{
                  minWidth: "100%",
                  height: "300px",
                  position: "relative",
                }}
              >
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ))}
          </div>

          {/* Arrows for manual control */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 z-10"
            onClick={handlePrev}
          >
            <span className="text-2xl">{`<`}</span> {/* Left Arrow */}
          </button>

          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 z-10"
            onClick={handleNext}
          >
            <span className="text-2xl">{`>`}</span> {/* Right Arrow */}
          </button>
        </div>
        <div className="p-2 sm:p-4 flex-grow">
          <div className="property-card__body">
            <div className="flex justify-between mb-2">
              <Link
                href="hotel"
                className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
              >
                {title}
              </Link>
            </div>

            <p className="mb-4">Free Cancellation after 24 hours of booking</p>
            <ul className="columns-1 sm:columns-2">
              {amenity_name1 && amenity_logo1 && (
                <li className="py-2 sm:py-3">
                  <div className="flex items-center gap-2">
                    <Image
                      width={24}
                      height={24}
                      src={amenity_logo1}
                      alt={amenity_name1}
                      className="w-6 h-6 object-fit-contain"
                    />
                    <span className="block">{amenity_name1}</span>
                  </div>
                </li>
              )}

              {amenity_name2 && amenity_logo2 && (
                <li className="py-2 sm:py-3">
                  <div className="flex items-center gap-2">
                    <Image
                      width={24}
                      height={24}
                      src={amenity_logo2}
                      alt={amenity_name2}
                      className="w-6 h-6 object-fit-contain"
                    />
                    <span className="block">{amenity_name2}</span>
                  </div>
                </li>
              )}

              {amenity_name3 && amenity_logo3 && (
                <li className="py-2 sm:py-3">
                  <div className="flex items-center gap-2">
                    <Image
                      width={24}
                      height={24}
                      src={amenity_logo3}
                      alt={amenity_name3}
                      className="w-6 h-6 object-fit-contain"
                    />
                    <span className="block">{amenity_name3}</span>
                  </div>
                </li>
              )}

              {amenity_name4 && amenity_logo4 && (
                <li className="py-2 sm:py-3">
                  <div className="flex items-center gap-2">
                    <Image
                      width={24}
                      height={24}
                      src={amenity_logo4}
                      alt={amenity_name4}
                      className="w-6 h-6 object-fit-contain"
                    />
                    <span className="block">{amenity_name4}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="property-card__body py-0 pt-4">
            <div className="hr-dashed"></div>
          </div>

          {/* Display individual and total prices */}
          <div className="property-card__body">
            <div className="flex flex-wrap justify-between items-center">
              {/* <span className="block  font-medium line-through">
                ₹ {baseRoomPrice}
                <span className="inline-block font-medium text-xl text-primary pl-2">
                  {" "}
                  ₹{sale_price}
                </span>
              </span> */}
              <span className="block font-medium">₹{baseRoomPrice}</span>

              <button
                onClick={handleBookNow}
                className="btn-outline font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default HotelDetailsFeaturedRoom;
