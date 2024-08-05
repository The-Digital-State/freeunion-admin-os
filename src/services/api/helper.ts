import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { API_URL } from './config';

function api(): AxiosInstance;
function api<T>(config: AxiosRequestConfig): AxiosPromise<T>;
function api(config?): any {
  const token = localStorage.getItem('token');

  const instance = axios.create({ baseURL: API_URL });

  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        const redirect = window.location.pathname + window.location.search;
        window.location.href = `/signin?redirect=${redirect}`;
      }
      return Promise.reject(error);
    }
  );

  return config ? instance(config) : instance;
}

export { api };
