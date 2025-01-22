import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RazorpayPkgBtnProps {
  grandTotal: number;
  name: string;
  email: string;
  mobile_number: string;
  passport: string;
  country: string;
  bookingID: string;
  address: string;
  currency: string;
  adults: number;
  children?: number;
  infants: number;
  packageId: number;
}
const packageId = localStorage.getItem("packageId");

const RazorpayPkgBtn: React.FC<RazorpayPkgBtnProps> = ({ grandTotal, name, email, mobile_number, passport, country, bookingID, currency, packageId, address }) => {
  const router = useRouter();
  // const [packageDetails, setPackageDetails] = useState<{ servicePackage: string; package_name: string } | null>(null);
  const [packageName, setPackageName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackageName = async () => {
      const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_package_by_id/${packageId}`);
      const data = await response.json();
      setPackageName(data.package_title);
    };

    fetchPackageName();
  }, [packageId]);


  // Fetch package details dynamically
  // useEffect(() => {
  //   if (packageId) {
  //     const fetchPackageDetails = async () => {
  //       try {
  //         const response = await axios.get(
  //           `https://yrpitsolutions.com/tourism_api/api/admin/get_package_by_id/${packageId}`
  //         );

  //         // Log the entire API response and nested `data` object
  //         console.log('Full API Response:', response.data);
  //         console.log('Nested Data:', response.data.data);

  //         const data = response.data.data; // Access the nested `data` object

  //         // Log specific property for verification
  //         console.log('API servicePackage:', data.servicePackage);
  //         console.log('API servicePackage:', data.package_name);

  //         // Update state with the correct data
  //         setPackageDetails({
  //           servicePackage: data.servicePackage || 'N/A',
  //           package_name: data.package_name || 'Unknown Package',
  //         });
  //       } catch (error) {
  //         console.error('Error fetching package details:', error);
  //       }
  //     };

  //     fetchPackageDetails();
  //   } else {
  //     console.warn('Package ID is not defined');
  //   }
  // }, [packageId]);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  const storedPackageData = JSON.parse(localStorage.getItem("packageData") || "[]");

  if (storedPackageData.length === 0) {
    console.error("No package data found in localStorage");
    return; // Exit if no data is found
  }

  // Access the first object in the array
  const {
    adult, adultPrice,
    child1, child2, child3, childPrice1, childPrice2, childPrice3,
    infant1, infant2, infantPrice1, infantPrice2, date
  } = storedPackageData[0];


  // console.log("adult and date is", adult, date, adultPrice);
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
    if (address=="") {
      alert("Enter All Fields")
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
          localStorage.setItem("address", address);
          // Navigate to receipt page with query parameters
          router.replace(`/package-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&packageId=${packageId}`);

          // Create payment data
          const paymentData = {
            invoice_id: response.razorpay_payment_id,
            order_id: "123",
            service_type: "package",
            booking_id: bookingID,
            customer_id: customerId,
            customer_name: name || 'Guest',
            customer_email: email || '',
            customer_mobile_number: mobile_number || '',

            // booking_date: 


            adults: adult,
            child_count1: child1,
            child_count2: child2,
            child_count3: child3,
            child_price1: childPrice1,
            child_price2: childPrice2,
            child_price3: childPrice3,
            infant_count1: infant1,
            infant_count2: infant2,
            infant_price1: infantPrice1,
            infant_price2: infantPrice2,


            payment_method: 'Razorpay',
            amount: data.amount / 100,
            invoice_pdf: '',
            starting_date: date,
            // package_name: packageName?.package_title,
            package_name: packageName,
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

          // Call packages_minus API
          // const packagesMinusURL = `https://yrpitsolutions.com/tourism_api/api/packages_minus/${packageId}/${location}/${packageId}/${startDate}/${endDate}/${totalPackages}`;
          // await axios.get(packagesMinusURL, {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`,
          //   },
          // });

          console.log('Packages minus API called successfully');
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

export default RazorpayPkgBtn;
