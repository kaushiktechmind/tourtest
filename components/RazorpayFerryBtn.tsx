import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axios from 'axios';

interface RazorpayFerryBtnProps {
  grandTotal: number;
  currency: string;
  cbookingId: string;
  passengerData: any;
  contactDetails: any;
  onPaymentSuccess: (paymentData: any) => void;  
 
}

const RazorpayFerryBtn: React.FC<RazorpayFerryBtnProps> = ({ grandTotal, passengerData, contactDetails, cbookingId,  currency, onPaymentSuccess }) => {
    const router = useRouter();


    const [loading, setLoading] = useState(false);
    
  
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }, []);
  
    const handlePayment = async () => {
      let isValid = true;

      // Check if all "Full Name" fields are filled
      passengerData.forEach((passenger: { name: any; age: any; }, index: number) => {
        if (!passenger.name || !passenger.age) {
          isValid = false;
          alert(`Fill All the Details For Entry ${index + 1}`);
        }
      });
      if(!contactDetails.p_contact || !contactDetails.c_email || !contactDetails.c_mobile || !contactDetails.c_name ){
        isValid = false;
        alert(`Fill All the Details For Entry`);
      }
      if (!isValid) {
        return;  // Exit the function early
      }

      const customerId = localStorage.getItem('id');
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        router.replace('/sign-in');
        return;
      }

      setLoading(true);
  
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
        name: 'Ferry Booking',
        description: 'Secure Booking for Ferry',
        order_id: data.id,
        handler: async function (response: any) {
          try {
            // Ensure `onPaymentSuccess` is invoked correctly
            onPaymentSuccess(response);

            setLoading(false);



          } catch (error) {
            console.error('Error during post-payment processing:', error);
          }
        },

        modal: {
          ondismiss: function () {
              setLoading(false); // Set loading to false if the payment is dismissed
          }
      },

        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };
  
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    };
    
  
    return (
      <div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <button onClick={handlePayment} className="bg-blue-500 text-white px-4 py-2 rounded">
        Pay Now
      </button>
    </div>
    );
  };
  

export default RazorpayFerryBtn;

