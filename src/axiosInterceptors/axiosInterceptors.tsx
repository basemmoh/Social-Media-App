import axios from "axios";
import { router } from "../AppRouter/AppRouter";

export const axiosInterceptors = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInterceptors.interceptors.request.use(
  function (request) {
    if (localStorage.getItem("user_tkn")) {
      request.headers.token = localStorage.getItem("user_tkn");
    }
    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInterceptors.interceptors.response.use(
  function (response) {
    if(response && response.status === 401){
        localStorage.removeItem("user_tkn");
        // window.location.href = "/login";
        router.navigate("/login");
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);
