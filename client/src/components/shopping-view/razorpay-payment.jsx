import React from "react";

const RazorpayPayment = () => {
    const handleRazorpayPayment = async () => {
        const response = await fetch("https://e-commerce-webpage-n7jl.onrender.com/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 500 }),
        });

        const data = await response.json();

        if (!data.success) {
            alert("Failed to create order");
            return;
        }

        const options = {
            key: "rzp_test_Rbdj8WrNdv5dOL",
            amount: data.order.amount,
            currency: "INR",
            name: "Your Shop Name",
            description: "Test Transaction",
            order_id: data.order.id,
            handler: function (response) {
                alert("Payment successful!");
                console.log(response);
                window.location.href = "/payment-success";
            },
            theme: { color: "#3399cc" },
        };

        const razor = new window.Razorpay(options);
        razor.open();
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <button
                onClick={handleRazorpayPayment}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
                Pay with Razorpay
            </button>
        </div>
    );
};

export default RazorpayPayment;
