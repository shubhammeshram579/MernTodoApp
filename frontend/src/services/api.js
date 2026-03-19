import axios from "axios";
import store from "../store/store.js";
import { updateAccessToken, logout } from "../store/slices/authSlice.js";

// Axios Instance 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

// Request Interceptor — attach accessToken
api.interceptors.request.use(
  (config) => {
    
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;

let failedQueue = [];

// Process the queue — retry or reject all queued requests
const processQueue = (error, newAccessToken = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(newAccessToken);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  // Error — check if it's a 401 and attempt silent refresh
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if: status is 401 (Unauthorized)
    const is401          = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry;
    const isRefreshRoute = originalRequest.url?.includes("/auth/refresh-token");

    if (is401 && !alreadyRetried && !isRefreshRoute) {
      originalRequest._retry = true;

      // If a refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Start the refresh process
      isRefreshing = true;

      try {
        // Call backend — refreshToken HttpOnly cookie is sent automatically
        const response = await api.post("/auth/refresh-token");
        const newAccessToken = response.data.data.accessToken;

        // Save new accessToken to Redux + localStorage
        store.dispatch(updateAccessToken(newAccessToken));

        // Update the Authorization header for the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session is truly expired
        // Clear all auth state and redirect to login
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;