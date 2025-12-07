import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // function handleInitiatePaypalPayment() {
  //   if (cartItems.length === 0) {
  //     toast({
  //       title: "Your cart is empty. Please add items to proceed",
  //       variant: "destructive",
  //     });

  //     return;
  //   }
  //   if (currentSelectedAddress === null) {
  //     toast({
  //       title: "Please select one address to proceed.",
  //       variant: "destructive",
  //     });

  //     return;
  //   }

  //   const orderData = {
  //     userId: user?._id,
  //     cartId: cartItems?._id,
  //     cartItems: cartItems.items.map((singleCartItem) => ({
  //       productId: singleCartItem?.productId,
  //       title: singleCartItem?.title,
  //       image: singleCartItem?.image,
  //       price:
  //         singleCartItem?.salePrice > 0
  //           ? singleCartItem?.salePrice
  //           : singleCartItem?.price,
  //       quantity: singleCartItem?.quantity,
  //     })),
  //     addressInfo: {
  //       addressId: currentSelectedAddress?._id,
  //       address: currentSelectedAddress?.address,
  //       city: currentSelectedAddress?.city,
  //       pinCode: currentSelectedAddress?.pinCode,
  //       phone: currentSelectedAddress?.phone,
  //       notes: currentSelectedAddress?.notes,
  //     },
  //     orderStatus: "pending",
  //     paymentMethod: "razorpay",
  //     paymentStatus: "pending",
  //     totalAmount: totalCartAmount,
  //     orderDate: new Date(),
  //     orderUpdateDate: new Date(),
  //     paymentId: "",
  //     payerId: "",
  //   };

  //   dispatch(createNewOrder(orderData))
  //     .unwrap()
  //     .then((res) => {
  //       console.log(res, "hemlal");
  //       if (res?.success) {
  //         console.log("success i get");

  //         setIsPaymentStart(true);
  //       } else {
  //         setIsPaymentStart(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Order creation failed:", err);
  //       setIsPaymentStart(false);
  //     });
  // }

  function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pinCode: currentSelectedAddress?.pinCode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData))
      .unwrap()
      .then(async (res) => {
        console.log(res, "order created response");

        if (res?.success && res?.order) {

          //  Load Razorpay Checkout options
          const options = {
            key: "rzp_test_Rbdj8WrNdv5dOL", 
            amount: res.order.amount, 
            currency: res.order.currency,
            name: "E-Shop",
            description: "Order Payment",
            order_id: res.order.id, 
            handler: async function (response) {

              //  Payment success callback
              console.log("Payment success:", response);

              await fetch(
                "https://e-commerce-webpage-n7jl.onrender.com/api/shop/order/verify-payment",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: res.orderId,
                    razorpay_payment_id: response.razorpay_payment_id,
                  }),
                }
              );

              toast({ title: "Payment successful!" });
            },
            prefill: {
              name: user?.username || "Guest User",
              email: user?.email || "guest@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#3399cc",
            },
          };

          //  Open Razorpay modal
          const rzp1 = new window.Razorpay(options);
          rzp1.open();

          rzp1.on("payment.failed", function (response) {
            toast({
              title: "Payment failed",
              description: response.error.description,
              variant: "destructive",
            });
          });
        } else {
          toast({
            title: "Something went wrong creating the order",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.error("Order creation failed:", err);
        toast({
          title: "Order creation failed",
          variant: "destructive",
        });
      });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiateRazorpayPayment}
              className="w-full btn btn-primary"
            >
              {isPaymentStart
                ? "Processing Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
