import { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LocationEntry from "../home-3/LocationEntry";
import WhatsAppAndScroll from "../WhatsAppAndScroll";
import { FaHotel, FaHome, FaCar, FaSuitcase, FaMountain, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css"; // Ensure Swiper styles are imported
import { Autoplay, Navigation } from "swiper"; // Import necessary Swiper modules

const Hero = () => {
  const [locationName, setLocationName] = useState(""); // State to hold the location name
  const [selectedCategory, setSelectedCategory] = useState("Hotel"); // State for the selected category
  const [banners, setBanners] = useState<any[]>([]); // State to hold the banners
  const [isMobile, setIsMobile] = useState(false); // State for mobile view check

  const swiperRef = useRef<any>(null); // Create a reference to the Swiper instance

  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [promoImage, setPromoImage] = useState<string | null>(null);
  const [promoUrl, setPromoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if the promo banner has been seen before
    const hasSeenBanner = localStorage.getItem("hasSeenPromoBanner");
    if (!hasSeenBanner) {
      setShowPromoBanner(true);
    }

    // Fetch the promotional image from the API
    const fetchPromoImage = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_promotion_by_id/1");
        const data = await response.json();
        if (data) {
          setPromoImage(data.photo);
          setPromoUrl(data.url); // Assuming the photo URL is in `data.data.photo`
        }
      } catch (error) {
        console.error("Error fetching promotional image:", error);
      }
    };

    fetchPromoImage();
  }, []);

  useEffect(() => {
    // Check if the window width is below the mobile breakpoint
    const checkIfMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true); // Set to true for mobile
      } else {
        setIsMobile(false); // Set to false for desktop
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile); // Listen for window resize to update state

    return () => {
      window.removeEventListener("resize", checkIfMobile); // Cleanup listener
    };
  }, []);

  const handleCloseBanner = () => {
    setShowPromoBanner(false);
    localStorage.setItem("hasSeenPromoBanner", "true");
  };

  // Fetch banners data from the API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_home_banner");
        const data = await response.json();
        if (data.message === "Home Banners Retrieved Successfully.") {
          setBanners(data.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const handleSearch = () => {
    localStorage.setItem("fromHome", "200");
    localStorage.setItem("storedLocation", locationName);
    if (!locationName) {
      alert("Please Select Location.");
      return;
    }

    let searchUrl = "";
    switch (selectedCategory) {
      case "Hotel":
        searchUrl = `/hotels`;
        break;
      case "Homestay":
        searchUrl = `/homestays`;
        break;
      case "Package":
        searchUrl = `/packages`;
        break;
      case "Cab":
        searchUrl = `/cabs`;
        break;
      case "Activity":
        searchUrl = `/activities`;
        break;
      default:
        searchUrl = `/hotels`;
        break;
    }

    window.location.href = searchUrl;
  };

  const categories = [
    { name: "Hotel", icon: FaHotel },
    { name: "Homestay", icon: FaHome },
    { name: "Package", icon: FaSuitcase },
    { name: "Cab", icon: FaCar },
    { name: "Activity", icon: FaMountain },
  ];

  return (
    <section className="relative min-h-screen flex items-center py-20 z-[10]">

      {showPromoBanner && promoImage && promoUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative max-w-[90%] md:max-w-[500px]">
            <a href={promoUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={promoImage}
                alt="Promotional Banner"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </a>
            <button
              onClick={handleCloseBanner}
              className="absolute top-2 right-2 text-white p-2 rounded-full shadow"
            >
              ✕
            </button>

          </div>
        </div>
      )}

      {/* Swiper Carousel as Background */}
      <Swiper
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false, // Make autoplay continue after interaction
        }}
        modules={[Autoplay]} // Only include Autoplay module
        className="absolute top-0 left-0 w-full h-full z-[-1]" // Ensure Swiper is behind the content
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Set the swiper instance on mount
      >
        {banners.length > 0 &&
          banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <img
                src={isMobile ? banner.mobile_banner : banner.desktop_banner} // Conditional banner rendering
                alt={`Banner ${banner.id}`}
                className="object-cover w-full h-[620px]"
              />
            </SwiperSlide>
          ))}

      </Swiper>

      {/* Content Layer - Centered */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10 text-center">
        <h1 className="text-white font-semibold mb-10 text-3xl md:text-5xl">
          Welcome to Andman Mangroves
        </h1>

        {/* Category Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center gap-2 text-white font-bold transition-all duration-300 ease-in-out ${selectedCategory === category.name
                  ? "hover:text-white "
                  : "hover:text-white/80"
                  }`}
              >
                <div
                  className={`p-3 rounded-full transition-all ${selectedCategory === category.name
                    ? "bg-white text-primary shadow-lg"
                    : "bg-transparent text-white border border-white"
                    }`}
                >
                  <Icon size={24} />
                </div>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input and Button */}
        <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center w-[90%] items-center sm:w-[40%] md:w-[50%] lg:w-[40%] mx-auto">
          <LocationEntry
            placeholder="Location"
            onChange={(value) => setLocationName(value)} // Set location name on change
          // Ensure the input takes full width
          />
          <button
            onClick={handleSearch} // Call the search function on click
            className="py-3 px-6 w-full sm:w-auto flex justify-center items-center bg-primary text-white rounded-full"
          >
            <span className="ml-2">Search</span>
          </button>
        </div>

      </div>

      <WhatsAppAndScroll whatsappNumber={""} />

      {/* Custom Navigation Arrows */}
      <div
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-50 bg-white text-primary rounded-full p-3 shadow-md cursor-pointer flex items-center justify-center w-10 h-10"
        onClick={() => swiperRef.current?.slidePrev()} // Trigger slidePrev when the button is clicked
      >
        <FaChevronLeft size={16} />
      </div>
      <div
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-50 bg-white text-primary rounded-full p-3 shadow-md cursor-pointer flex items-center justify-center w-10 h-10"
        onClick={() => swiperRef.current?.slideNext()} // Trigger slideNext when the button is clicked
      >
        <FaChevronRight size={16} />
      </div>
    </section>
  );
};

export default Hero;
