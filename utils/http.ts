import axios from "axios";
import { GetUserData, Logout } from "./user";
import { Platform } from "react-native";

const httpInstance = axios.create({
  baseURL: "http://61.184.3.214:8080/api",
  // baseURL: "http://api.congyan.mengchen.xyz:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
httpInstance.interceptors.request.use(
  async function (config) {
    // 在发送请求之前做些什么
    const user = await GetUserData();
    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user?.token}`;
    }

    if (Platform.OS === "android") {
      console.info("Android", config.url, config.data);
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
httpInstance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.status == 1) {
      if (response.data.code == "tokenInvalid") {
        Logout();
      }
    }
    console.info(response.config.url, response.status, response.data);

    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.error(error.config.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);

export default httpInstance;
