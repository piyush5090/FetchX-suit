import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../../services/auth";

const savedSession = JSON.parse(localStorage.getItem("userSession"));

const initialState = savedSession
  ? {
      isAuthenticated: true,
      token: savedSession.token,
      user: savedSession.user,
      status: "idle",
      error: null,
    }
  : {
      isAuthenticated: false,
      token: null,
      user: null,
      status: "idle",
      error: null,
    };

/** ------------------------------------
 * Fetch logged-in user's profile using JWT
 * -------------------------------------- */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await getProfile(token); // <-- token is used now
    return response.user; // because backend returns { user: {...} }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** LOGIN SUCCESS (email/github/google) */
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      state.isAuthenticated = true;
      state.token = token;
      state.user = user;

      localStorage.setItem(
        "userSession",
        JSON.stringify({ token, user })
      );
    },

    /** LOGOUT */
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("userSession");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Replace user object in session
        state.user = action.payload;

        localStorage.setItem(
          "userSession",
          JSON.stringify({ token: state.token, user: state.user })
        );
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
