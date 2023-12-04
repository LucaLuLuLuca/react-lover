import axios from "axios";
import { setUpInterceptors } from "./interceptor";
import { BaseUrl } from "./environment";

const axiosInstance = setUpInterceptors(axios.create());

export const apiGet = async (path) => axiosInstance.get(`${BaseUrl}${path}`);

export const apiPost = async (path, data) =>
  axiosInstance.post(`${BaseUrl}${path}`, data);

export const apiDelete = async (path) =>
  axiosInstance.delete(`${BaseUrl}${path}`);

export const apiPut = async (path, data) =>
  axiosInstance.put(`${BaseUrl}${path}`, data);
