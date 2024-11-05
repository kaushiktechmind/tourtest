import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RazorpayButtonProps {
  totalCost: number;
  currency: string;
  adults: number;
  children?: number;
  infants: number;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ totalCost, adults, children, infants,  currency }) => {
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
    const customerId = localStorage.getItem('id');
    const mobile_number = localStorage.getItem('mobile_number');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');

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
      body: JSON.stringify({ amount: totalCost, currency }),
    });

    const data = await response.json();

    const options = {
      key: 'rzp_test_nhTux7zMPEixo1',
      amount: data.amount,
      currency: data.currency,
      name: 'Your Company Name',
      description: 'Your Product Description',
      order_id: data.id,
      handler: async function (response: any) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);

        try {
          const paymentData = {
            invoice_id:  response.razorpay_payment_id,
            service_type: 'Hotel/HomeStay', // Update this field based on your data
            adults: adults || 0,
            childs: children || 0,
            infants: infants || 0,
            customer_id: customerId,
            customer_name: name, // Replace with actual customer name
            customer_email: email, // Replace with actual customer email
            customer_mobile_number: mobile_number, // Replace with actual customer mobile number
            payment_method: 'Razorpay',
            amount: data.amount / 100,
            invoice_pdf: '', // Add the URL if available
            razorpay_payment_id: response.razorpay_payment_id,
          };

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
          console.error('Error storing payment data:', error);
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
      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      onClick={handlePayment}
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;
