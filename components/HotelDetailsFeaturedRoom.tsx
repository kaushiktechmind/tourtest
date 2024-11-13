import Image from "next/image";
import Link from "next/link";
import AddRoom from "@/components/home-2/AddRoom";
import { useEffect, useState, useRef } from "react";

const HotelDetailsFeaturedRoom = ({
  item,
  onSelectionChange,
<<<<<<< HEAD
  onBookNowClick,
=======
  onRoomSelect,
  noOfRooms,
  noOfNights,
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
}: any) => {
  const { id, img, price, title, extra_bed_price, child_price, amenity_name1, amenity_name2, amenity_name3, amenity_name4, amenity_logo1, amenity_logo2, amenity_logo3, amenity_logo4, } = item;

<<<<<<< HEAD
  const [rooms, setRooms] = useState<any[]>([]);
  const prevTotals = useRef({ adultTotal: 0, childTotal: 0, extraBedTotal: 0 });
  const prevCounts = useRef({
    totalAdultCount: 0,
    totalChildrenCount: 0,
    totalInfantCount: 0,
  });
  const [totals, setTotals] = useState({
    totalAdultCount: 0,
    totalChildrenCount: 0,
    totalInfantCount: 0,
  });

  const handleTotalChange = (newTotals) => {
    setTotals(newTotals);
=======
  const [selectedValue, setSelectedValue] = useState(0);
  const handleDropdownChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    const changeAllowed = onSelectionChange(selectedValue, newValue, price, child_price, id);
    if (changeAllowed) {
      setSelectedValue(newValue);
    } else {
      alert("Selection exceeds the allowed limit!");
    }
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
  };
  

  // Calculate total prices for adults, children, and extra beds
  const calculateTotalPrices = () => {
    let adultTotal = 0;
    let childTotal = 0;
    let extraBedTotal = 0;

    rooms.forEach((room) => {
      if (room.adults === 1 || room.adults === 2) {
        adultTotal += price;
      } else if (room.adults >= 3) {
        adultTotal += price;
        extraBedTotal += extra_bed_price;
      }
      childTotal += child_price * room.children;
    });

    return { adultTotal, childTotal, extraBedTotal };
  };
<<<<<<< HEAD

  // Update totals when rooms state changes
  useEffect(() => {
    const { adultTotal, childTotal, extraBedTotal } = calculateTotalPrices();
    const { totalAdultCount, totalChildrenCount, totalInfantCount } = totals;

    onSelectionChange(
      id, 
      adultTotal,
      childTotal,
      extraBedTotal,
      prevTotals.current.adultTotal,
      prevTotals.current.childTotal,
      prevTotals.current.extraBedTotal,
      totals.totalAdultCount,
      totals.totalChildrenCount,
      totals.totalInfantCount,
      prevCounts.current.totalAdultCount,
      prevCounts.current.totalChildrenCount,
      prevCounts.current.totalInfantCount
    );

    prevTotals.current = { adultTotal, childTotal, extraBedTotal };

    prevCounts.current = {
      totalAdultCount,
      totalChildrenCount,
      totalInfantCount,
    };
  }, [rooms, totals]);

  const { adultTotal, childTotal, extraBedTotal } = calculateTotalPrices();

  const handleBookNow = () => {
    // Call onBookNowClick with the room ID
    onBookNowClick(id);
  };
=======
  
  
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de

  return (
    <li key={id}>
      <div className="p-2 rounded-2xl flex flex-col md:flex-row bg-[var(--bg-2)]">
        <div className="relative" style={{ height: "300px", width: "348px" }}>
          <div className="rounded-2xl overflow-hidden h-full w-full">
            <Image
              src={img}
              alt="image"
              layout="fill" // Ensures the image takes the size of the container
              objectFit="cover" // Ensures the image scales within the container without distortion
              className="rounded-2xl"
            />
          </div>
        </div>
        {/* <h1>aaaaaaaaaaaa{amenity_name1}</h1> */}


        <div className="p-2 sm:p-4 flex-grow">
          <div className="property-card__body">
            <div className="flex justify-between mb-2">
              <Link
                href="hotel-listing-details"
                className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
              >
                {title} 
              </Link>
<<<<<<< HEAD
=======
              <p>{noOfNights} Nights :  </p>
              <select
                value={selectedValue}
                onChange={handleDropdownChange}
                className="mt-2 p-2 border rounded"
              >
                {[...Array(noOfRooms + 1)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
            </div>

            <p className="mb-4">Free Cancellation after 5 hours of booking</p>
            <ul className="columns-1 sm:columns-2">
              <li className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <Image
                    width={24}
                    height={24}
                    src={amenity_logo1}
                    alt="AC"
                    className="w-6 h-6 object-fit-contain"
                  />
                  <span className="block">{amenity_name1}</span>
                </div>
              </li>
              <li className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <Image
                    width={24}
                    height={24}
                    src="/img/icon-wifi-secondary.png"
                    alt="WiFi"
                    className="w-6 h-6 object-fit-contain"
                  />
                  <span className="block">Wifi</span>
                </div>
              </li>
              <li className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <Image
                    width={24}
                    height={24}
                    src="/img/icon-bed-secondary.png"
                    alt="Bed"
                    className="w-6 h-6 object-fit-contain"
                  />
                  <span className="block">Deluxe Bed Suite</span>
                </div>
              </li>
              <li className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <Image
                    width={24}
                    height={24}
                    src="/img/icon-kitchen-secondary.png"
                    alt="Kitchen"
                    className="w-6 h-6 object-fit-contain"
                  />
                  <span className="block">Kitchen</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Pass `rooms` and `setRooms` as props to AddRoom */}
          <AddRoom
            rooms={rooms}
            setRooms={setRooms}
            onTotalChange={handleTotalChange}
          />

          <div className="property-card__body py-0 pt-4">
            <div className="hr-dashed"></div>
          </div>

          {/* Display individual and total prices */}
          <div className="property-card__body">
            <div className="flex flex-wrap justify-between items-center">
              <span className="block text-xl font-medium text-primary">
              ₹{price}
                <span className="inline-block text-gray-600 text-base font-normal">
                  /per night
                </span>
              </span>
              <button
<<<<<<< HEAD
                onClick={handleBookNow} // Trigger handleBookNow on button click
=======
                onClick={() =>
                  onRoomSelect({
                    room_price: price,
                    extra_bed_price,
                    child_price,
                    id,
                  })
                }
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
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
