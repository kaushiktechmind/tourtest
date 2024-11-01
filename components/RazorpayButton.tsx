import React, { useEffect } from 'react';

const RazorpayButton: React.FC<{ totalPrice: number; currency: string }> = ({ totalPrice, currency }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalPrice, currency }),
    });
    const data = await response.json();

    const options = {
      key: 'rzp_test_nhTux7zMPEixo1', // Use NEXT_PUBLIC_ prefix for client-side access
      amount: data.amount, // Amount in currency's smallest unit
      currency: data.currency,
      name: 'Your Company Name',
      description: 'Your Product Description',
      order_id: data.id, // Generated Order ID
      handler: function (response: any) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);
        // Add your post-payment logic here (e.g., save the payment info to your database)
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
