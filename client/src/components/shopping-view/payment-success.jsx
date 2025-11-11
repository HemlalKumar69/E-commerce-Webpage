// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react";

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const paymentInfo = location.state;

//   return (
//     <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
//       <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
//       <h1 className="text-3xl font-bold mb-2">Payment Successful 🎉</h1>
//       <p className="text-gray-600 mb-4">
//         Thank you! Your payment has been completed successfully.
//       </p>

//       {paymentInfo && (
//         <div className="bg-white shadow-md rounded-lg p-4 w-80 text-left">
//           <p><strong>Order ID:</strong> {paymentInfo.orderId}</p>
//           <p><strong>Payment ID:</strong> {paymentInfo.paymentId}</p>
//           <p><strong>Signature:</strong> {paymentInfo.signature}</p>
//         </div>
//       )}

//       <button
//         onClick={() => navigate("/")}
//         className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//       >
//         Go Back to Home
//       </button>
//     </div>
//   );
// };

// export default PaymentSuccess;
