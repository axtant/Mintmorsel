import React from 'react';
import Header from '../../components/Header';
import PaymentQRGenerator from '../../components/PaymentQRGenerator';

const ConfirmPayments = () => {
  const totalAmount = 1000;
  const upiPaymentUrl = `tez://upi/pay?pa=merchant@upi&am=${totalAmount}&tn=FoodOrder&cu=INR`;

  const openPaymentLink = () => {
    window.open(upiPaymentUrl, '_blank');
  };

  return (
    <div className="confirm-payments">
      {/* Header with title */}
      <Header title="Confirmation" showBackButton={true} />

      {/* Cash on Delivery/ Gpay Button */}
      <div className="grid gap-6 justify-center my-6 mt-20">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Cash on Delivery
        </button>

        <button
          onClick={openPaymentLink}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pay with GPAY
        </button>
      </div>

      {/* QR Code for UPI Payment */}
      <div className="flex justify-center">
        <PaymentQRGenerator totalAmount={totalAmount} />
      </div>
    </div>
  );
};

export default ConfirmPayments;
