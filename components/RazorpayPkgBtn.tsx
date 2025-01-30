import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

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

const RazorpayPkgBtn: React.FC<RazorpayPkgBtnProps> = ({ name, email, mobile_number, passport, country, bookingID, currency, packageId, address }) => {
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
    infant1, infant2, infantPrice1, infantPrice2, date, grandTotal
  } = storedPackageData[0];


  // console.log("adult and date is", adult, date, adultPrice);
  const storedChildPrice = localStorage.getItem("storedChildPrice");
  const storedExtraBedPrice = localStorage.getItem("storedExtraBedPrice");
  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const location = localStorage.getItem("storedLocation")

  const handlePayment = async () => {
    const accessToken = localStorage.getItem('access_token');
    const customerId = localStorage.getItem('id');

    if (!accessToken) {
      router.push('/sign-in');
      return;
    }

    if (!address) {
      alert("Enter all fields");
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
          router.replace(`/package-receipt?payment_id=${response.razorpay_payment_id}&amount=${data.amount / 100}&packageId=${packageId}`);
          // const companyLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";

          // Generate PDF Invoice HTML content with inline CSS
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
				<p>Address : 31 Brandy Way, Sutton, SM2 6SE</p>
				<p>GSTIN : GSAB12 </p>
			</div>

			<br>
			<br>
			<div>
				
          

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
				<h4 style="font-weight: 800;">Billing Address</h4>
				  <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Mobile: ${mobile_number}</p>
          <p>Address: ${address}</p>
          <p>Country: ${country}</p>
          <p>Passport: ${passport}</p>
			</div>

			<div class="booking-info" style="width: 50%;">
				<h4 style="font-weight: 800;">Booking Details</h4>
				  <p>Booking ID: ${bookingID}</p>
          <p>Booking Date: ${date}</p>
				<p>Reservation Date: ${startDate}</p>
				<p>Transaction ID: TXN123456</p>
			</div>
		</div>
		<br>
    <hr>
    <br>

		<div class="main-header">
			<h4>Price Breakup</h4>
			<br>
			<table>
				<tr>
					<th>Description</th>
					<th>Quantity</th>
					<th>Unit Price</th>
					<th>Total</th>
				</tr>
				<tr>
					 <td>Adult (12+)</td>
            <td>${adult}</td>
            <td>₹${adultPrice}</td>
            <td>₹${adult * adultPrice}</td>
				</tr>
				<tr>
					  <td>Child (6-8)</td>
            <td>${child1}</td>
            <td>₹${childPrice1}</td>
            <td>₹${child1 * childPrice1}</td>
				</tr>
				
				<tr>
					  <td>Child (5-6)</td>
            <td>${child2}</td>
            <td>₹${childPrice2}</td>
            <td>₹${child2 * childPrice2}</td>
				</tr>
        	<tr>
					  <td>Child (6-8)</td>
            <td>${child3}</td>
            <td>₹${childPrice3}</td>
            <td>₹${child3 * childPrice3}</td>
				</tr>
        <tr>
					<td>Child (5-6)</td>
					<td>${infant1}</td>
					<td>₹${infantPrice1}</td>
					<td>₹${infant1 * infantPrice1}</td>
				</tr>
				<tr>
					<td>Child (5-6)</td>
					<td>${infant2}</td>
					<td>₹${infantPrice2}</td>
					<td>₹${infant2 * infantPrice2}</td>
				</tr>
				<tr>
					<td colspan="3" align="right"><strong>Subtotal</strong></td>
					<td><strong>₹${grandTotal}</strong></td>
				</tr>
				<tr>
					<td colspan="3" align="right"><strong>Amount Paid</strong></td>
					<td><strong>₹${grandTotal}</strong></td>
				</tr>
			</table>
		</div>

		<br />
		<br />
		<br />
		<br />
		<br />
		<br />
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>


		<div class="itinerary" style="width: 100%;">
			<h1 class="main-header">Itinerary</h1>

			<!-- Day 1 -->
			<div style="display: flex; align-items: center; gap: 20px; padding: 10px 0;">
				<div style="width: 10%; font-weight: bold;">Day 1</div>
			
				<div style="width: 70%;">
					<strong>Arrive at the Destination</strong>
					<p>Begin your introductory tour. Explore the local area and relax at the hotel.</p>
				</div>
			</div>

			<!-- Day 2 -->
			<div style="display: flex; align-items: center; gap: 20px; padding: 10px 0;">
				<div style="width: 10%; font-weight: bold;">Day 2</div>
			
				<div style="width: 70%;">
					<strong>Explore the City's Landmarks</strong>
					<p>Visit historical monuments, parks, and museums to experience the city's heritage.</p>
				</div>
			</div>

			<!-- Day 3 -->
			<div style="display: flex; align-items: center; gap: 20px; padding: 10px 0;">
				<div style="width: 10%; font-weight: bold;">Day 3</div>
			
				<div style="width: 70%;">
					<strong>Relax at the Beach</strong>
					<p>Enjoy the sun, sand, and water sports at the beautiful coastline.</p>
				</div>
			</div>
		</div>
    <br>
     <br>

		<div class="inclusions">
			<h1 class="main-header">Inclusions</h1>
			<ul>
				<li>Inclusion Item 1</li>
				<li>Inclusion Item 1</li>
				<li>Inclusion Item 1</li>
				<li>Inclusion Item 1</li>
			</ul>
		</div>

		<div class="exclusions">
			<h1 class="main-header">Exclusions</h1>
			<ul>
				<li>Exclusion Item 1</li>
				<li>Exclusion Item 2</li>
				<li>Exclusion Item 3</li>
				<li>Exclusion Item 4</li>
			</ul>
		</div>
		<hr>
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

		<div class="invoice-footer" style="text-align: center;">
			<p>*** This is a system-generated invoice. ***</p>
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
            .get('pdf')
            .then(async (pdf) => {
              // Convert PDF to binary data (ArrayBuffer or Base64)
              const pdfBinary = pdf.output('arraybuffer');  // Raw binary format

              // Convert ArrayBuffer to Blob to send as file
              const pdfBlob = new Blob([pdfBinary], { type: 'application/pdf' });

              // Create FormData to send the PDF as a file
              const formData = new FormData();
              formData.append('invoice_pdf', pdfBlob, `${response.razorpay_payment_id}.pdf`);  // Attach the PDF

              // Append invoice data to FormData
              formData.append('invoice_id', response.razorpay_payment_id);
              formData.append('order_id', bookingID); // Ensure this is correct
              formData.append('customer_id', customerId || ''); // Ensure this is a valid customer ID
              formData.append('customer_name', name || 'Guest');
              formData.append('customer_email', email || '');
              formData.append('customer_mobile_number', mobile_number || '');
              formData.append('amount', (data.amount / 100).toString());
              formData.append('package_name', packageName || '');
              formData.append('address', address || '');
              formData.append('passport_no', passport || '');
              formData.append('country', country || '');
              formData.append('starting_date', "02-10-2025"); // Replace with correct value
              formData.append('service_type', "Pkg"); // Adjust if needed
              formData.append('booking_id', "11111");

              // Send the PDF binary data and form data to the backend
              await axios.post('https://yrpitsolutions.com/tourism_api/api/user/store_payment', formData, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'multipart/form-data',  // Specify the correct content type
                }
              });

              console.log('Payment data stored and invoice generated successfully');
            });
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
