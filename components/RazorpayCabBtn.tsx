import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { minify } from 'next/dist/build/swc';

interface RazorpayCabBtnProps {
    name: string;
    email: string;
    mobile_number: string;
    passport: string;
    bookingID: string;
    grandTotal: number;
    address: string;
    country: string;
    currency: string;
    cabId: number;
}
const cabId = localStorage.getItem("cabId");

const RazorpayCabBtn: React.FC<RazorpayCabBtnProps> = ({ grandTotal, name, email, mobile_number, passport, country, bookingID, currency, cabId, address }) => {
    const router = useRouter();
    // const [cabDetails, setCabDetails] = useState<{ serviceCab: string; cab_name: string } | null>(null);
    const [cabName, setCabName] = useState<string | null>(null);


    useEffect(() => {
        const fetchCabName = async () => {
            const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/cab-main-forms/${cabId}`);
            const data = await response.json();
            setCabName(data.cab_name);
           
        };

        fetchCabName();
    }, [cabId]);



    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);



    const storedCabDetails = JSON.parse(localStorage.getItem("storedCabDetails") || "{}");
    const date = storedCabDetails.selectedDate || "";
    const selectedPax = storedCabDetails.selectedPax || "";
    const arrival_place = storedCabDetails.hotelName || "";
    



    if (storedCabDetails.length === 0) {
        console.error("No cab data found in localStorage");
        return; // Exit if no data is found
    }




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
            name: 'Cab Booking',
            description: 'Booking Description',
            order_id: data.id,
            handler: async function (response: any) {
                try {
                    localStorage.setItem("address", address);
                    // Navigate to receipt page with query parameters
                    router.push(`/cab-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&cabId=${cabId}`);

                    // Create payment data
                    const paymentData = {
                        invoice_id: response.razorpay_payment_id,
                        // order_id: "123",
                        service_type: "cab",
                        booking_id: bookingID,
                        customer_id: customerId,
                        customer_name: name || 'Guest',
                        customer_email: email || '',
                        customer_mobile_number: mobile_number || '',
                        // booking_date: 
                        payment_method: 'Razorpay',
                        amount: data.amount / 100,
                        invoice_pdf: '',
                        starting_date: date,

                        cab_name: cabName,
                        arrival_place: arrival_place,
                        min_pax: selectedPax,


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

export default RazorpayCabBtn;
