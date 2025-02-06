import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import html2pdf from "html2pdf.js";
import Swal from 'sweetalert2';

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
    todayDate: string;
    formattedDate: string;
}

const RazorpayActBtn: React.FC<RazorpayActBtnProps> = ({ grandTotal, todayDate, formattedDate, name, email, mobile_number, passport, country, bookingID, currency, activityId, address }) => {
    const router = useRouter();
    // const [activityDetails, setActivityDetails] = useState<{ serviceActivity: string; activity_name: string } | null>(null);
    const [activityName, setActivityName] = useState<string | null>(null);
    const [activityDesc, setActivityDesc] = useState<string | null>(null);
    const [no_of_available_tickets1, set_no_of_available_tickets1] = useState<string | null>(null);
    const [no_of_available_tickets2, set_no_of_available_tickets2] = useState<string | null>(null);
    const [no_of_available_tickets3, set_no_of_available_tickets3] = useState<string | null>(null);
    const [no_of_available_tickets4, set_no_of_available_tickets4] = useState<string | null>(null);
    const [no_of_available_tickets5, set_no_of_available_tickets5] = useState<string | null>(null);

    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        const fetchActivityName = async () => {
            const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_activity_by_id/${activityId}`);
            const data = await response.json();
            setActivityName(data.activity_title);
            setActivityDesc(data.activity_content);
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



    const ticketCount1 = Number(no_of_available_tickets1) - no_of_person1;
    const ticketCount2 = Number(no_of_available_tickets2) - no_of_person2;
    const ticketCount3 = Number(no_of_available_tickets3) - no_of_person3;
    const ticketCount4 = Number(no_of_available_tickets4) - no_of_person4;
    const ticketCount5 = Number(no_of_available_tickets5) - no_of_person5;











    if (storedActivityData.length === 0) {
        console.error("No activity data found in localStorage");
        return;
    }






    const handlePayment = async () => {
        const accessToken = localStorage.getItem("access_token");
        const customerId = localStorage.getItem("id");

        if (!accessToken) {
            router.push("/sign-in");
            return;
        }

        if (!address) {
            alert("Enter all fields");
            return;
        }

        setLoading(true);

        const response = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ amount: grandTotal, currency }),
        });

        const data = await response.json();


        const options = {
            key: "rzp_test_nhTux7zMPEixo1",
            amount: data.amount,
            currency: data.currency,
            name: "Activity Booking",
            description: "Activity Description",
            order_id: data.id,
            handler: async function (response: any) {
                try {



                    const invoiceHTML = `
                     <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Invoice</title>
      <style>
         body {
         font-family: Arial, sans-serif;
         color: black;
         margin: 10px;
         padding: 10px;
         max-width: 800px;
         margin: auto;
         }
         td {
         font-weight: normal;
         }
         h2 {
         text-align: center;
         }
         .main-header {
         text-align: center;
         font-weight: 800;
         }
         table {
         width: 100%;
         border-collapse: collapse;
         margin-bottom: 20px;
         }
         table,
         th,
         td {
         border: 1px solid #ddd;
         padding: 8px;
         text-align: left;
         }
         th {
         background-color: #f4f4f4;
         }
         .print-button {
         text-align: center;
         margin-top: 20px;
         }
         .container-wrapper {
         border: 1px solid black; /* Border around the whole document */
         margin: 10px; /* Space around the border */
         padding: 20px; /* Space between the border and the content */
         }
         .container {
         padding: 20px;
         background-color: #f9f9f9;
         border-radius: 8px;
         /* No border here, as the wrapper div handles it */
         }
      </style>
   </head>
   <body>
      <div class="container-wrapper">
         <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center;">
               <div>
                  <h3 style="font-size: 22px">Andman Mangroves Holidays</h3>
                  <p>Address : Shop 05, First Floor, Panchayat Market, Sippighat, next to Gram Panchayat Bhavan, Sri Vijaya Puram, Andaman and Nicobar Islands 744105</p>
                  <p>GSTIN : GSAB12 </p>
               </div>
               <br>
               <br>
               <div>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="80" viewBox="0 0 260 100">
                     <image xlink:href="data:image/png;base64,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" x="0" y="0" width="260" height="100"/>
                  </svg>
               </div>
            </div>
            <br>
            <div>
               <h1 class="main-header" style="font-size: 25px">INVOICE</h1>
               <br>
               <hr>
               <br>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 20px;">
               <div style="width: 50%;">
                  <h4 style="font-weight: 800; font-size: 20px">Billing Address</h4>
                  <p>Name: ${name}</p>
                  <p>Email: ${email}</p>
                  <p>Mobile: ${mobile_number}</p>
                  <p>Address: ${address}</p>
                  <p>Country: ${country}</p>
                  <p>Passport: ${passport}</p>
               </div>
               <div style="border-left: 1px solid #b6b6b6; height: 200px;"></div>
               <div class="booking-info" style="width: 50%;">
                  <h4 style="font-weight: 800; font-size: 20px ">Booking Details</h4>
                  <p>Activity: ${activityName}</p>
                  <p>Booking ID: ${bookingID}</p>
                  <p>Booking Date: ${todayDate}</p>
                  <p>Reservation Date: ${formattedDate}</p>
                  <p>Transaction ID: ${response.razorpay_payment_id}</p>
               </div>
            </div>
            <br>
            <hr>
            <br>
            <div class="main-header">
               <h4 style="font-size: 20px">Price Breakup</h4>
               <br>
               <table>
                  <tr>
                     <th>Description</th>
                     <th>Quantity</th>
                     <th>Unit Price</th>
                     <th>Total</th>
                  </tr>
                  <!-- Check if ticket_total_price1 and no_of_person1 are valid -->
                  ${ticket_total_price1 && no_of_person1 && Number(ticket_total_price1) > 0 && Number(no_of_person1) > 0 ? `
                  <tr>
                     <td>${ticket_name1}</td>
                     <td>${no_of_person1}</td>
                     <td>₹${Number(ticket_total_price1) / Number(no_of_person1)}</td>
                     <td>₹${ticket_total_price1}</td>
                  </tr>
                  ` : ``}
                  <!-- Check if ticket_total_price2 and no_of_person2 are valid -->
                  ${ticket_total_price2 && no_of_person2 && Number(ticket_total_price2) > 0 && Number(no_of_person2) > 0 ? `
                  <tr>
                     <td>${ticket_name2}</td>
                     <td>${no_of_person2}</td>
                     <td>₹${Number(ticket_total_price2) / Number(no_of_person2)}</td>
                     <td>₹${ticket_total_price2}</td>
                  </tr>
                  ` : ``}
                  <!-- Check if ticket_total_price3 and no_of_person3 are valid -->
                  ${ticket_total_price3 && no_of_person3 && Number(ticket_total_price3) > 0 && Number(no_of_person3) > 0 ? `
                  <tr>
                     <td>${ticket_name3}</td>
                     <td>${no_of_person3}</td>
                     <td>₹${Number(ticket_total_price3) / Number(no_of_person3)}</td>
                     <td>₹${ticket_total_price3}</td>
                  </tr>
                  ` : ``}
                  <!-- Check if ticket_total_price4 and no_of_person4 are valid -->
                  ${ticket_total_price4 && no_of_person4 && Number(ticket_total_price4) > 0 && Number(no_of_person4) > 0 ? `
                  <tr>
                     <td>${ticket_name4}</td>
                     <td>${no_of_person4}</td>
                     <td>₹${Number(ticket_total_price4) / Number(no_of_person4)}</td>
                     <td>₹${ticket_total_price4}</td>
                  </tr>
                  ` : ``}
                  <!-- Check if ticket_total_price5 and no_of_person5 are valid -->
                  ${ticket_total_price5 && no_of_person5 && Number(ticket_total_price5) > 0 && Number(no_of_person5) > 0 ? `
                  <tr>
                     <td>${ticket_name5}</td>
                     <td>${no_of_person5}</td>
                     <td>₹${Number(ticket_total_price5) / Number(no_of_person5)}</td>
                     <td>₹${ticket_total_price4}</td>
                  </tr>
                  ` : ``}
                  <tr>
                     <td colspan="3" align="right"><strong>Subtotal</strong></td>
                     <td><strong>₹${grandTotal / 100}</strong></td>
                  </tr>
                  <tr>
                     <td colspan="3" align="right"><strong>Amount Paid</strong></td>
                     <td><strong>₹${grandTotal / 100}</strong></td>
                  </tr>
               </table>
            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <h4 style="font-size: 20px;" class="main-header">Description</h4>
            <br>
            <p>${activityDesc}</p>
            <br>
            <br>
            <br>
            <br>
            <br>
            <div class="invoice-footer" style="text-align: center;">
               <p>*** This is a system generated invoice. ***</p>
            </div>
         </div>
      </div>
   </body>
</html>
     
                                  `;
                    // Use html2pdf.js to convert the HTML to a PDF
                    const pdf = html2pdf()
                        .from(invoiceHTML) // Use the generated HTML string
                        .toPdf()
                        .get("pdf")
                        .then(async (pdf: { output: (arg0: string) => any }) => {
                            // Convert PDF to binary data (ArrayBuffer or Base64)
                            const pdfBinary = pdf.output("arraybuffer"); // Raw binary format

                            // Convert ArrayBuffer to Blob to send as file
                            const pdfBlob = new Blob([pdfBinary], {
                                type: "application/pdf",
                            });


                            // Create FormData to send the PDF as a file
                            const formData = new FormData();
                            formData.append(
                                "invoice_pdf", pdfBlob, `${response.razorpay_payment_id}.pdf`); // Attach the PDF

                            // Append invoice data to FormData
                            formData.append("invoice_id", response.razorpay_payment_id);
                            formData.append("booking_id", bookingID);
                            formData.append("order_id", "xxx"); // Ensure this is correct
                            formData.append("customer_id", customerId || ""); // Ensure this is a valid customer ID
                            formData.append("customer_name", name || "Guest");
                            formData.append("customer_email", email || "");
                            formData.append("customer_mobile_number", mobile_number || "");
                            formData.append("amount", (data.amount / 100).toString());
                            formData.append("activity_name", String(activityName));
                            formData.append("payment_method", "Razorpay");
                            formData.append("address", address || "");
                            formData.append("passport_no", passport || "");
                            formData.append("country", country || "");
                            formData.append("starting_date", String(formattedDate)); // Replace with correct value
                            formData.append("service_type", "Activity");

                            formData.append("ticket_name1", ticket_name1);
                            formData.append("ticket_name2", ticket_name2);
                            formData.append("ticket_name3", ticket_name3);
                            formData.append("ticket_name4", ticket_name4);
                            formData.append("ticket_name5", ticket_name5);

                            formData.append("ticket_total_price1", ticket_total_price1);
                            formData.append("ticket_total_price2", ticket_total_price2);
                            formData.append("ticket_total_price3", ticket_total_price3);
                            formData.append("ticket_total_price4", ticket_total_price4);
                            formData.append("ticket_total_price5", ticket_total_price5);

                            formData.append("no_of_person1", no_of_person1);
                            formData.append("no_of_person2", no_of_person2);
                            formData.append("no_of_person3", no_of_person3);
                            formData.append("no_of_person4", no_of_person4);
                            formData.append("no_of_person5", no_of_person5);


                            // Send the PDF binary data and form data to the backend
                            await axios.post(
                                "https://yrpitsolutions.com/tourism_api/api/user/store_payment",
                                formData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                        "Content-Type": "multipart/form-data", // Specify the correct content type
                                    },
                                }
                            );

                            // setInvoiceUrl(response.invoice_url); 

                            console.log(
                                "Payment data stored and invoice generated successfully"
                            );



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





                            const fetchAndStoreInvoiceUrl = async () => {
                                if (!customerId) return; // Exit if no customer ID

                                try {
                                    const { data } = await axios.get(`https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`);
                                    console.log("Full Response Data: ", data); // Log the full response
                                    const invoiceUrl = data.data[0]?.invoice_pdf;
                                    console.log("Invoice PDF URL: ", invoiceUrl); // Log the invoice URL

                                    if (invoiceUrl) {
                                        setInvoiceUrl(invoiceUrl); // Set the state only if a valid URL is found
                                        openSweetAlert(invoiceUrl, response.razorpay_payment_id, bookingID);
                                    } else {
                                        console.error("Invoice URL not found in the response.");
                                    }
                                } catch (error) {
                                    console.error('Error fetching invoice URL:', error);
                                }
                            };


                            // Wait for the invoice URL to be fetched before showing SweetAlert
                            await fetchAndStoreInvoiceUrl();
                            router.replace(
                                `/activity-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100
                                }&activityId=${activityId}`
                            );

                            setLoading(false);


                        });

                } catch (error) {
                    console.error("Error during post-payment processing:", error);
                    setLoading(false);
                }
            },

            modal: {
                ondismiss: function () {
                    setLoading(false); // Set loading to false if the payment is dismissed
                }
            },



            prefill: {
                name: name || "Customer Name",
                email: email || "customer@example.com",
                contact: mobile_number || "9999999999",
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const openSweetAlert = (invoiceUrl: string, paymentId: string, bookingId: string) => {
        Swal.fire({
            title: 'Activity Booked Successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Download Invoice',
            cancelButtonText: 'Close',
            html: `
                <p>The invoice is sent to your email, please check:</p>
                <p><strong>Transaction ID:</strong> ${paymentId}</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
            `,
            allowOutsideClick: false, // Prevent closing the modal by clicking outside
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(invoiceUrl || '', "_blank"); // Open the invoice URL in a new tab
            }
        });
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

export default RazorpayActBtn;
