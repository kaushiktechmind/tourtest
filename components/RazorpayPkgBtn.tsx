import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RazorpayButtonProps {
  grandTotal: number;
  currency: string;
  adults: number;
  children?: number;
  infants: number;
  hotelId: number;
}
const roomId = localStorage.getItem("roomId");

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ grandTotal, name, email, mobile_number, passport, country, bookingID, currency, hotelId, address }) => {
  const router = useRouter();
  const [hotelDetails, setHotelDetails] = useState<{ hotel_or_home_stay: string; hotel_name: string } | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
 
   useEffect(() => {
    const fetchRoomName = async () => {
      const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${roomId}`);
      const data = await response.json();
      setRoomName(data.room.room_name);
    };

    fetchRoomName();
  }, [roomId]);


  // Fetch hotel details dynamically
  useEffect(() => {
    if (hotelId) {
      const fetchHotelDetails = async () => {
        try {
          const response = await axios.get(
            `https://yrpitsolutions.com/tourism_api/api/admin/hotels/${hotelId}`
          );

          // Log the entire API response and nested `data` object
          console.log('Full API Response:', response.data);
          console.log('Nested Data:', response.data.data);

          const data = response.data.data; // Access the nested `data` object

          // Log specific property for verification
          console.log('API hotel_or_home_stay:', data.hotel_or_home_stay);
          console.log('API hotel_or_home_stay:', data.hotel_name);

          // Update state with the correct data
          setHotelDetails({
            hotel_or_home_stay: data.hotel_or_home_stay || 'N/A',
            hotel_name: data.hotel_name || 'Unknown Hotel',
          });
        } catch (error) {
          console.error('Error fetching hotel details:', error);
        }
      };

      fetchHotelDetails();
    } else {
      console.warn('Hotel ID is not defined');
    }
  }, [hotelId]);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  




  const totalCounts = JSON.parse(localStorage.getItem("totalCounts"));
  const { adults, children, infants, totalRooms, extraBeds } = totalCounts;
  const storedChildPrice = localStorage.getItem("storedChildPrice");
  const storedExtraBedPrice = localStorage.getItem("storedExtraBedPrice");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const location = localStorage.getItem("storedLocation");

  const handlePayment = async () => {
    const accessToken = localStorage.getItem('access_token');
    const customerId = localStorage.getItem('id');

    if (!accessToken) {
      router.push('/sign-in');
      return;
    }

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount: grandTotal, currency }),
    });

    const data = await response.json();

    const options = {
      key: 'rzp_test_nhTux7zMPEixo1',
      amount: data.amount,
      currency: data.currency,
      name: hotelDetails?.hotel_name || 'Hotel Booking',
      description: hotelDetails?.hotel_or_home_stay || 'Booking Description',
      order_id: data.id,
      handler: async function (response: any) {
        try {
          localStorage.setItem("address", address);
          // Navigate to receipt page with query parameters
          router.push(`/receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&roomId=${roomId}`);
          
          // Create payment data
          const paymentData = {
            invoice_id: response.razorpay_payment_id,
            service_type: hotelDetails?.hotel_or_home_stay || '',
            booking_id: bookingID,
            adults: adults,
            childs: children,
            infants: infants,
            no_of_rooms: totalRooms,
            child_price: storedChildPrice,
            extra_bed_price: storedExtraBedPrice,
            extra_bed_count: extraBeds,
            customer_id: customerId,
            customer_name: name || 'Guest',
            customer_email: email || '',
            customer_mobile_number: mobile_number || '',
            payment_method: 'Razorpay',
            amount: data.amount / 100,
            invoice_pdf: '',
            starting_date: startDate,
            end_date: endDate,
            hotel_name: hotelDetails?.hotel_name,
            room_name: roomName,
            address: address,
            passport_no: passport,
            country: country,
            razorpay_payment_id: response.razorpay_payment_id,
          };
      
          // Store payment details via API
          await axios.post(
            'https://yrpitsolutions.com/tourism_api/api/user/store_payment',
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
      
          console.log('Payment data stored successfully');
      

        } catch (error) {
          console.error('Error during post-payment processing:', error);
        }
      },
      
      prefill: {
        name: name || 'Customer Name',
        email: email || 'customer@example.com',
        contact: mobile_number || '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      onClick={handlePayment}
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;
