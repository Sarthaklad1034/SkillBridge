// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Orders.scss";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";

// const Orders = () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//   const navigate = useNavigate();
//   const { isLoading, error, data } = useQuery({
//     queryKey: ["orders"],
//     queryFn: () =>
//       newRequest.get(`/orders`).then((res) => {
//         return res.data;
//       }),
//   });

//   const handleContact = async (order) => {
//     const sellerId = order.sellerId;
//     const buyerId = order.buyerId;
//     const id = sellerId + buyerId;

//     try {
//       const res = await newRequest.get(`/conversations/single/${id}`);
//       navigate(`/message/${res.data.id}`);
//     } catch (err) {
//       if (err.response.status === 404) {
//         const res = await newRequest.post(`/conversations/`, {
//           to: currentUser.seller ? buyerId : sellerId,
//         });
//         navigate(`/message/${res.data.id}`);
//       }
//     }
//   };
//   return (
//     <div className="orders">
//       {isLoading ? (
//         "loading"
//       ) : error ? (
//         "error"
//       ) : (
//         <div className="container">
//           <div className="title">
//             <h1>Orders</h1>
//           </div>
//           <table>
//             <tr>
//               <th>Image</th>
//               <th>Title</th>
//               <th>Price</th>
//               <th>Contact</th>
//             </tr>
//             {data.map((order) => (
//               <tr key={order._id}>
//                 <td>
//                   <img className="image" src={order.img} alt="" />
//                 </td>
//                 <td>{order.title}</td>
//                 <td>{order.price}</td>
//                 <td>
//                   <img
//                     className="message"
//                     src="./img/message.png"
//                     alt=""
//                     onClick={() => handleContact(order)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get(`/orders`).then((res) => res.data),
  });

  // const handleContact = async (order) => {
  //   const sellerId = order.sellerId;
  //   const buyerId = order.buyerId;
  //   const id = sellerId + buyerId;

  //   try {
  //     // First, try to get an existing conversation
  //     const res = await newRequest.get(`/conversations/single/${id}`);
  //     navigate(`/message/${res.data.id}`);
  //   } catch (err) {
  //     if (err.response && err.response.status === 404) {
  //       // If conversation doesn't exist, create a new one
  //       try {
  //         const res = await newRequest.post(`/conversations/`, {
  //           to: currentUser.isSeller ? buyerId : sellerId,
  //         });
  //         navigate(`/message/${res.data.id}`);
  //       } catch (createErr) {
  //         console.error("Error creating conversation:", createErr);
  //       }
  //     } else {
  //       console.error("Error fetching conversation:", err);
  //     }
  //   }
  // };
  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;
  
    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);  // Navigates to the conversation if it exists
    } catch (err) {
      if (err.response.status === 404) {  // If the conversation doesn't exist, create one
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);  // Navigate to the newly created conversation
      }
    }
  };
  

  if (isLoading) return <div className="orders">Loading...</div>;
  if (error) return <div className="orders">Error: {error.message}</div>;

  return (
    <div className="orders">
      <div className="container">
        <h1 className="title">Orders</h1>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order._id}>
                <td>
                  <img className="image" src={order.img} alt={order.title} />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img
                    className="message"
                    src="./img/message.png"
                    alt=""
                    onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;