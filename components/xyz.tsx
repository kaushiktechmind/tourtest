import Image from "next/image";
import { useEffect, useState } from "react";

const HotelDetailsFeaturedRoom = ({
  item,
  startdate,
  onSelectionChange,
  onBookNowClick,
}: any) => {
  const { id, img, price, type, title, extra_bed_price, child_price } = item;

  const [rooms, setRooms] = useState<any[]>([]);
  if(type=='null'){
    const [price, setPrice] = useState<number | null>(null);
    }
  const [status, setStatus] = useState<number | null>(null);
  const [roomAvailableNo, setRoomAvailableNo] = useState<number>(5);
  
  // State for calculated prices
  const [totalPrices, setTotalPrices] = useState({
    adultTotal: 0,
    childTotal: 0,
    extraBedTotal: 0,
  });

  useEffect(() => {
    if (!id || !startdate) {
      console.error("Room ID or startdate is missing");
      return;
    }
  
    const fetchRoomPrice = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/get_data_by_room_id_start_date/${id}/${startdate}`
        );
        const data = await response.json();
  
        // Check if data exists and contains room_price
        if (data && data.data && data.data.room_price) {
          const fetchedPrice = parseFloat(data.data.room_price); // Access room_price from the data field
  
          if (!isNaN(fetchedPrice)) {
            setPrice(fetchedPrice); // Update price if valid
          } else {
            setPrice(null); // Set price to null if not a valid number
          }
        } else {
          setPrice(null); // Set price to null if room_price is missing
        }
        setroomAvailbleNo(data.data.no_of_rooms);
        setStatus(data.data.status);
      } catch (error) {
        console.error("Error fetching room price:", error);
        setPrice(null); // Set price to null in case of an error
      }
    };
  
    fetchRoomPrice();
  }, [id, startdate]);  // Re-fetch if id or startdate changes
  

  // Calculate total prices for adults, children, and extra beds
  const calculateTotalPrices = () => {
    let adultTotal = 0;
    let childTotal = 0;
    let extraBedTotal = 0;

    // Retrieve added rooms from localStorage
    const addedRooms = JSON.parse(localStorage.getItem('addedRooms') || '[]');
    
    addedRooms.forEach((room: any) => {
      // Calculate the total price for adults and extra beds
      if (room.adults >= 1) {
        adultTotal += price * room.adults;
      }
      if (room.adults >= 3) {
        extraBedTotal += extra_bed_price * room.adults; // Assuming extra bed for adults >= 3
      }
      childTotal += child_price * room.children;
    });

    setTotalPrices({ adultTotal, childTotal, extraBedTotal });
  };

  const handleBookNow = () => {
    calculateTotalPrices(); // Update the total prices when 'Book Now' is clicked
    onBookNowClick(id); // Call onBookNowClick with the room ID
  };

  if (status === 0) {
    return null; // Render nothing if status is 0
  }

  return (
    <li key={id}>
      <div className="p-2 rounded-2xl flex flex-col md:flex-row bg-[var(--bg-2)]">
        <div className="relative" style={{ height: "300px", width: "348px" }}>
          <div className="rounded-2xl overflow-hidden h-full w-full">
            <Image
              src={img}
              alt="image"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        </div>

        <div className="p-2 sm:p-4 flex-grow">
          <div className="property-card__body py-0 pt-4">
            <div className="hr-dashed"></div>
          </div>

          {/* Display individual and total prices */}
          <div className="property-card__body">
            <div className="flex flex-wrap justify-between items-center">
              <span className="block text-xl font-medium text-primary">
                ₹{price}
                <span className="inline-block text-gray-600 text-base font-normal"></span>
              </span>
              <button
                onClick={handleBookNow}
                className="btn-outline font-semibold"
              >
                Book Now
              </button>
            </div>

            {/* Display total prices */}
            <div className="mt-4">
              <div>Total Adult Price: ₹{totalPrices.adultTotal}</div>
              <div>Total Child Price: ₹{totalPrices.childTotal}</div>
              <div>Total Extra Bed Price: ₹{totalPrices.extraBedTotal}</div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default HotelDetailsFeaturedRoom;
