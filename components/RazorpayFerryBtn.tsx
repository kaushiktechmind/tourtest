import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RazorpayFerryBtnProps {
  grandTotal: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;  
 
}

const RazorpayFerryBtn: React.FC<RazorpayFerryBtnProps> = ({ grandTotal, currency, onPaymentSuccess }) => {
    const router = useRouter();
  
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
      const accessToken = localStorage.getItem('access_token');
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
        name: 'Package Booking',
        description: 'Booking Description',
        order_id: data.id,
        handler: async function (response: any) {
          try {
            // Ensure `onPaymentSuccess` is invoked correctly
            onPaymentSuccess(response);
          } catch (error) {
            console.error('Error during post-payment processing:', error);
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
      <button
        className="mt-6 link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6"
        onClick={handlePayment}
      >
        Proceed Booking
      </button>
    );
  };
  

export default RazorpayFerryBtn;

