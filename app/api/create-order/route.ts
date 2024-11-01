import { NextResponse, NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_nhTux7zMPEixo1', // Your Razorpay Key ID
  key_secret: 'iL48WHoFIDSuyTPGhtUiuNeg', // Your Razorpay Key Secret
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json(); // Extract amount and currency from the request body

    const order = await razorpay.orders.create({
      amount: amount, // Use the received amount
      currency: currency, // Use the received currency
      receipt: Math.random().toString(),
    });

    return NextResponse.json(
      { orderId: order.id, amount: order.amount, currency: order.currency },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Here", error);
    return NextResponse.json(
      { error: "Error Creating Order" },
      { status: 500 }
    );
  }
}
  