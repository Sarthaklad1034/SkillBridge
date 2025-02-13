// import React, { useEffect, useState } from "react";
// import "./Pay.scss";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import newRequest from "../../utils/newRequest";
// import { useParams } from "react-router-dom";
// import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

// const stripePromise = loadStripe(
//   "paste your public key"
// );

// const Pay = () => {
//   const [clientSecret, setClientSecret] = useState("");

//   const { id } = useParams();

//   useEffect(() => {
//     const makeRequest = async () => {
//       try {
//         const res = await newRequest.post(
//           `/orders/create-payment-intent/${id}`
//         );
//         setClientSecret(res.data.clientSecret);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     makeRequest();
//   }, []);

//   const appearance = {
//     theme: 'stripe',
//   };
//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return <div className="pay">
//     {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       )}
//   </div>;
// };

// export default Pay;
import React, { useEffect, useState } from "react";
import "./Pay.scss";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";

const Pay = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(`/orders/create/${id}`);
        setOrderDetails(res.data);
        initPayment(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, [id]);

  const initPayment = (data) => {
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "SkillBridge",
      description: "Payment for gig",
      order_id: data.orderId,
      handler: async (response) => {
        try {
          const res = await newRequest.post("/orders/confirm", response);
          console.log(res.data);
          // Handle successful payment (e.g., redirect to success page)
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: "#3399cc"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="pay">
      <h1>Complete your purchase</h1>
      {orderDetails && (
        <div>
          <p>Amount: {orderDetails.amount / 100} {orderDetails.currency}</p>
          {/* Add more order details as needed */}
        </div>
      )}
    </div>
  );
};

export default Pay;