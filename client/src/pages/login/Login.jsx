// import React, { useState } from "react";
// import "./Login.scss";
// import newRequest from "../../utils/newRequest";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await newRequest.post("/auth/login", { username, password });
//       localStorage.setItem("currentUser", JSON.stringify(res.data));
//       navigate("/")
//     } catch (err) {
//       setError(err.response.data);
//     }
//   };

//   return (
//     <div className="login">
//       <form onSubmit={handleSubmit}>
//         <h1>Sign in</h1>
//         <label htmlFor="">Username</label>
//         <input
//           name="username"
//           type="text"
//           placeholder="johndoe"
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <label htmlFor="">Password</label>
//         <input
//           name="password"
//           type="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//         {error && error}
//       </form>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setError(err.response.data.message || "An error occurred during login.");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default Login;