import axios from "axios";

const instance = axios.create({
    //baseURL: `${import.meta.env.VITE_BACKEND_ADDRESS}`,
    baseURL: "http://localhost:8661",
    withCredentials: true,
    timeout: 10000,
});

export default instance;