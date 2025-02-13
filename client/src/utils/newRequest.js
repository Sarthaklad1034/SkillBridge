import axios from "axios";

const baseURL =
    import.meta.env.VITE_NODE_ENV === 'production' ?
    '/api/' :
    import.meta.env.VITE_API_URL || "http://localhost:8800/api/";

const newRequest = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export default newRequest;