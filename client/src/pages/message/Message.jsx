// import React, { useState, useEffect, useRef } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Link, useParams } from "react-router-dom";
// import newRequest from "../../utils/newRequest";
// import moment from "moment";
// import "./Message.scss";

// const Message = () => {
//   const { id } = useParams();
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const [newMessage, setNewMessage] = useState("");
//   const [conversation, setConversation] = useState(null);
//   const messagesEndRef = useRef(null);
//   const queryClient = useQueryClient();

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["messages", id],
//     queryFn: () =>
//       newRequest.get(`/messages/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   useEffect(() => {
//     if (data && data.conversation) {
//       setConversation(data.conversation);
//     }
//   }, [data]);

//   const mutation = useMutation({
//     mutationFn: (message) => {
//       return newRequest.post(`/messages`, message);
//     },
//     onSuccess: (newMessage) => {
//       queryClient.setQueryData(["messages", id], (oldData) => {
//         if (oldData && Array.isArray(oldData.messages)) {
//           return {
//             ...oldData,
//             messages: [...oldData.messages, newMessage.data]
//           };
//         }
//         return oldData;
//       });
//       setNewMessage("");
//     },
//   });

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [data]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const messageToSend = {
//       conversationId: id,
//       desc: newMessage,
//     };
//     mutation.mutate(messageToSend);
    
//     // Optimistically update UI
//     queryClient.setQueryData(["messages", id], (oldData) => {
//       if (oldData && Array.isArray(oldData.messages)) {
//         return {
//           ...oldData,
//           messages: [...oldData.messages, {
//             ...messageToSend,
//             _id: Date.now().toString(), // Temporary ID
//             userId: currentUser._id,
//             createdAt: new Date().toISOString()
//           }]
//         };
//       }
//       return oldData;
//     });
    
//     setNewMessage("");
//   };

//   const otherUser = conversation && (currentUser.isSeller ? conversation.buyerId : conversation.sellerId);

//   if (isLoading) return "Loading...";
//   if (error) return "An error has occurred: " + error.message;

//   const messages = data?.messages || [];

//   return (
//     <div className="message-page">
//       <div className="chat-container">
//         <div className="chat-header">
//           <Link to="/messages" className="back-button">←</Link>
//           {otherUser && (
//             <div className="user-info">
//               <img src={otherUser.avatar || "/img/noavatar.jpg"} alt={otherUser.username} />
//               <h2>{otherUser.username}</h2>
//             </div>
//           )}
//         </div>
//         <div className="chat-messages">
//           {Array.isArray(messages) && messages.map((m) => (
//             <div
//               className={`message-bubble ${
//                 m.userId === currentUser._id ? "sent" : "received"
//               }`}
//               key={m._id}
//             >
//               <p>{m.desc}</p>
//               <span className="timestamp">{moment(m.createdAt).format('LT')}</span>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <form className="chat-input" onSubmit={handleSubmit}>
//           <textarea
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button type="submit">Send</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Message;
import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import moment from "moment";
import "./Message.scss";

// Helper function to validate ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const Message = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => {
      if (!isValidObjectId(id)) {
        throw new Error("Invalid conversation ID");
      }
      return newRequest.get(`/messages/${id}`).then((res) => res.data);
    },
    retry: false,
    onError: (error) => {
      console.error("Error fetching messages:", error);
      navigate("/messages"); // Redirect to messages list on error
    }
  });

  useEffect(() => {
    if (data && data.conversation) {
      setConversation(data.conversation);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messages", id], (oldData) => {
        if (oldData && Array.isArray(oldData.messages)) {
          return {
            ...oldData,
            messages: [...oldData.messages, newMessage.data]
          };
        }
        return oldData;
      });
      setNewMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      // You can add a toast notification here to inform the user of the error
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      mutation.mutate({
        conversationId: id,
        desc: newMessage,
      });
    }
  };

  const otherUser = conversation && (currentUser.isSeller ? conversation.buyerId : conversation.sellerId);

  if (isLoading) return <div className="loading">Loading conversation...</div>;
  if (error) return <div className="error">Error loading conversation. Please try again.</div>;

  const messages = data?.messages || [];

  return (
    <div className="message-page">
      <div className="chat-container">
        <div className="chat-header">
          <Link to="/messages" className="back-button">←</Link>
          {otherUser && (
            <div className="user-info">
              <img src={otherUser.avatar || "/img/noavatar.jpg"} alt={otherUser.username} />
              <h2>{otherUser.username}</h2>
            </div>
          )}
        </div>
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((m) => (
              <div
                className={`message-bubble ${
                  m.userId === currentUser._id ? "sent" : "received"
                }`}
                key={m._id}
              >
                <p>{m.desc}</p>
                <span className="timestamp">{moment(m.createdAt).format('LT')}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSubmit}>
          <textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={!newMessage.trim() || mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;