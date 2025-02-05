import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axios from 'axios';

interface RazorpayFerryBtnProps {
  grandTotal: number;
  currency: string;
  cbookingId: string;
  onPaymentSuccess: (paymentData: any) => void;  
 
}

const RazorpayFerryBtn: React.FC<RazorpayFerryBtnProps> = ({ grandTotal, cbookingId,  currency, onPaymentSuccess }) => {
    const router = useRouter();

    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
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

            const fetchAndStoreInvoiceUrl = async () => {
              if (!customerId) return; // Exit if no customer ID

              try {
                const { data } = await axios.get(`https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`);
                console.log("Full Response Data: ", data); // Log the full response
                const invoiceUrl = data.data[0]?.invoice_pdf;
                console.log("Invoice PDF URL: ", invoiceUrl); // Log the invoice URL

                if (invoiceUrl) {
                  setInvoiceUrl(invoiceUrl); // Set the state only if a valid URL is found
                  openSweetAlert(invoiceUrl, response.razorpay_payment_id, cbookingId);
                } else {
                  console.error("Invoice URL not found in the response.");
                }
              } catch (error) {
                console.error('Error fetching invoice URL:', error);
              }
            };


            // Wait for the invoice URL to be fetched before showing SweetAlert
            await fetchAndStoreInvoiceUrl();
            // router.replace(`/package-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&packageId=${packageId}`);


            setLoading(false);



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

      const openSweetAlert = (invoiceUrl: string, paymentId: string, bookingId: string) => {
            Swal.fire({
                title: 'Cab Booked Successfully!',
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
  

export default RazorpayFerryBtn;

