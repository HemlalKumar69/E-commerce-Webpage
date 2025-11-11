import React from "react";

const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-50">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for your purchase! Your payment has been successfully processed.
      </p>
      <a
        href="/"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
      >
        Go to Home
      </a>
    </div>
  );
};

export default PaymentSuccessPage;
