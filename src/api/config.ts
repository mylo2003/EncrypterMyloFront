import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://encryptermylo.onrender.com/encrypter/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;