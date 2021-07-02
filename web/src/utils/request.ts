import axios, { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";

let service: AxiosInstance;
// 创建axios实例
service = axios.create({
  baseURL: import.meta.env.VITE_API_HOST as string, // api的base_url
  timeout: 20000, // 请求超时时间
  withCredentials: false,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Do something with request error
    console.log("error:" + error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (res.code === 500) {
      console.log(res.message);
      ElMessage({
        // message: res.message,
        message:
          typeof res.message === "undefined" || res.message === null
            ? "操作失败"
            : res.message,
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(res);
    } else {
      return response.data;
    }
  },
  (error) => {
    if (!error.response) {
      ElMessage({
        message: "网络异常",
        type: "error",
        duration: 3 * 1000,
      });
      return Promise.reject(error);
    }
    const res = error.response;
    // 401:非法的token
    // if (res.status === 401) {
    // } else if (res.status === 403) {
    //   // @TODO
    // } else if (res.status === 400) {
    //   // @TODO
    // } else
    if (res.status === 500) {
      ElMessage({
        message: "操作失败",
        type: "error",
        duration: 5 * 1000,
      });
    } else {
      console.log("err" + error); // for debug
      ElMessage({
        message: error.message,
        type: "error",
        duration: 3 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
