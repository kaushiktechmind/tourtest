import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RazorpayActBtnProps {
    name: string;
    email: string;
    mobile_number: string;
    passport: string;
    bookingID: string;
    grandTotal: number;
    address: string;
    country: string;
    currency: string;
    activityId: number;
}
const activityId = localStorage.getItem("activityId");

const RazorpayActBtn: React.FC<RazorpayActBtnProps> = ({ grandTotal, name, email, mobile_number, passport, country, bookingID, currency, activityId, address }) => {
    const router = useRouter();
    // const [activityDetails, setActivityDetails] = useState<{ serviceActivity: string; activity_name: string } | null>(null);
    const [activityName, setActivityName] = useState<string | null>(null);
    const [no_of_available_tickets1, set_no_of_available_tickets1] = useState<string | null>(null);
    const [no_of_available_tickets2, set_no_of_available_tickets2] = useState<string | null>(null);
    const [no_of_available_tickets3, set_no_of_available_tickets3] = useState<string | null>(null);
    const [no_of_available_tickets4, set_no_of_available_tickets4] = useState<string | null>(null);
    const [no_of_available_tickets5, set_no_of_available_tickets5] = useState<string | null>(null);
    
    

    useEffect(() => {
        const fetchActivityName = async () => {
            const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_activity_by_id/${activityId}`);
            const data = await response.json();
            setActivityName(data.activity_title);
            set_no_of_available_tickets1(data.no_of_available_tickets1);
            set_no_of_available_tickets2(data.no_of_available_tickets2);
            set_no_of_available_tickets3(data.no_of_available_tickets3);
            set_no_of_available_tickets4(data.no_of_available_tickets4);
            set_no_of_available_tickets5(data.no_of_available_tickets5);
        };

        fetchActivityName();
    }, [activityId]);



    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);



    const storedActivityData = JSON.parse(localStorage.getItem("storedActivityData") || "{}");
    const tickets = storedActivityData.tickets || [];
    const date = storedActivityData.date || "";

    const ticket_name1 = tickets[0]?.ticketName || "";
    const ticket_total_price1 = tickets[0]?.totalPrice || 0;
    const no_of_person1 = tickets[0]?.quantity || 0;

    const ticket_name2 = tickets[1]?.ticketName || "";
    const ticket_total_price2 = tickets[1]?.totalPrice || 0;
    const no_of_person2 = tickets[1]?.quantity || 0;

    const ticket_name3 = tickets[2]?.ticketName || "";
    const ticket_total_price3 = tickets[2]?.totalPrice || 0;
    const no_of_person3 = tickets[2]?.quantity || 0;

    const ticket_name4 = tickets[3]?.ticketName || "";
    const ticket_total_price4 = tickets[3]?.totalPrice || 0;
    const no_of_person4 = tickets[3]?.quantity || 0;

    const ticket_name5 = tickets[4]?.ticketName || "";
    const ticket_total_price5 = tickets[4]?.totalPrice || 0;
    const no_of_person5 = tickets[4]?.quantity || 0;



   const  ticketCount1 = Number(no_of_available_tickets1) - no_of_person1;
   const  ticketCount2 = Number(no_of_available_tickets2) - no_of_person2;
   const  ticketCount3 = Number(no_of_available_tickets3) - no_of_person3;
   const  ticketCount4 = Number(no_of_available_tickets4) - no_of_person4;
   const  ticketCount5 = Number(no_of_available_tickets5) - no_of_person5;

//    console.log("zzzzzzzzzzz", ticketCount1);
//    console.log("zzzzzzzzzzz", ticketCount2);
//    console.log("zzzzzzzzzzz", ticketCount3);
//    console.log("zzzzzzzzzzz", ticketCount4);
//    console.log("zzzzzzzzzzz", ticketCount5);



    //const  no of available tickets = no_of_available_tickets - no_of_person;





    if (storedActivityData.length === 0) {
        console.error("No activity data found in localStorage");
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
            name: 'Activity Booking',
            description: 'Booking Description',
            order_id: data.id,
            handler: async function (response: any) {
                try {
                    localStorage.setItem("address", address);
                    // Navigate to receipt page with query parameters
                    router.push(`/activity-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&activityId=${activityId}`);

                    // Create payment data
                    const paymentData = {
                        invoice_id: response.razorpay_payment_id,
                        // order_id: "123",
                        service_type: "activity",
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
                        activity_name: activityName,


                        ticket_name1: ticket_name1,
                        ticket_name2: ticket_name2,
                        ticket_name3: ticket_name3,
                        ticket_name4: ticket_name4,
                        ticket_name5: ticket_name5,

                        ticket_total_price1: ticket_total_price1,
                        ticket_total_price2: ticket_total_price2,
                        ticket_total_price3: ticket_total_price3,
                        ticket_total_price4: ticket_total_price4,
                        ticket_total_price5: ticket_total_price5,

                        no_of_person1: no_of_person1,
                        no_of_person2: no_of_person2,
                        no_of_person3: no_of_person3,
                        no_of_person4: no_of_person4,
                        no_of_person5: no_of_person5,

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

                    const ticketUpdateData = {
                        no_of_available_tickets1: ticketCount1,
                        no_of_available_tickets2: ticketCount2,
                        no_of_available_tickets3: ticketCount3,
                        no_of_available_tickets4: ticketCount4,
                        no_of_available_tickets5: ticketCount5,

                    };
            
                    await axios.put(
                        `https://yrpitsolutions.com/tourism_api/api/activity_ticket_count_minus/${activityId}`,
                        ticketUpdateData
                    );
            
                    console.log('Ticket counts updated successfully');
                    

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

export default RazorpayActBtn;
