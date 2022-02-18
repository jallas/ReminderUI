/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { API_BASE_URL } from '../configs/AppConfigs';
const AUTH_TOKEN = "auth_token";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 60000,
});

// Intercept all requests
client.interceptors.request.use(
  (config) => {
    console.log(`${config.method.toUpperCase()} - ${config.url}:`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept all responses
client.interceptors.response.use(
  async (response) => {
    console.log(`${response.status} - ${response.config.url}:`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN);
      window.location.href = '/login';
      return null;
    }
    return Promise.reject(error);
  },
);

export default async (needsAuth = true) => {
    console.log(needsAuth);
  if (needsAuth) {
    client.defaults.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
  }
  return client;
};
