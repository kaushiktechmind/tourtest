"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import Link from "next/link";

interface PaymentData {
  id: number;
  invoice_id: string;
  order_id: string;
  service_type: string;
  customer_name: string;
  payment_method: string;
  invoice_pdf: string | null;
  created_at: string;
}

const Page = () => {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      const customerId = localStorage.getItem("id");
      if (!customerId) {
        console.error("Customer ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`
        );
        const data = await response.json();
        setPaymentData(data.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  return (
    <div className="container">
      <Swiper
        loop={true}
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {/* Add SwiperSlides as needed */}
      </Swiper>
      <div> -------------------- </div>

      <div className="overflow-x-auto my-10 lg:my-14 mt-[100px]">
        {loading ? (
          <p>Loading...</p>
        ) : paymentData.length > 0 ? (
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="p-3 bg-violet-100">Date</th>
                <th className="p-3 bg-violet-100">Order ID</th>
                <th className="p-3 bg-violet-100">Name</th>
                <th className="p-3 bg-violet-100">Service Type</th>
                <th className="p-3 bg-violet-100">Payment Method</th>
                <th className="p-3 bg-violet-100">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment) => (
                <tr key={payment.id}>
                  <td className="p-3 border-b">
                    {new Date(payment.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-3 border-b">{payment.invoice_id}</td>
                  <td className="p-3 border-b">{payment.customer_name}</td>
                  <td className="p-3 border-b">{payment.service_type}</td>
                  <td className="p-3 border-b">{payment.payment_method}</td>
                  <td className="p-3 border-b">
                    {payment.invoice_pdf ? (
                      <Link href={payment.invoice_pdf} target="_blank">
                        View Invoice
                      </Link>
                    ) : (
                      "Not available"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payment data available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
