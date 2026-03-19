import { createSlice } from "@reduxjs/toolkit";


const loadAuthFromStorage = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const user        = localStorage.getItem("user");
    if (accessToken && user) {
      return {
        user:            JSON.parse(user),
        accessToken,
        isAuthenticated: true,
      };
    }
  } catch {
    // Corrupted data — clear it
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
  return { user: null, accessToken: null, isAuthenticated: false };
};

// Initial State 
const initialState = {
  ...loadAuthFromStorage(),
};

// Slice 
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user            = user;
      state.accessToken     = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },

    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    logout: (state) => {
      state.user            = null;
      state.accessToken     = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;

//Selectors 
export const selectUser            = (state) => state.auth.user;
export const selectAccessToken     = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
