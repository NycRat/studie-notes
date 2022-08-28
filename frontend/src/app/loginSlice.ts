import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  apiGetLogin,
  apiPostNewUser,
} from "../components/LoginPage/loginPageAPI";
import { RootState } from "./store";

export interface LoginState {
  username: string;
  password: string;
}

const initialState: LoginState = {
  username: "",
  password: "",
};

export const loginAsync = createAsyncThunk(
  "loginSlice/login",
  async (loginInfo: LoginState) => {
    if (await apiGetLogin(loginInfo.username, loginInfo.password)) {
      return "logged in";
    }
    return "failed login";
  }
);

export const signupAsync = createAsyncThunk(
  "loginSlice/signup",
  async (loginInfo: LoginState) => {
    return await apiPostNewUser(loginInfo.username, loginInfo.password);
  }
);

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = "";
      state.password = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      if (action.payload === "logged in") {
        alert("You are logged");
      } else {
        alert("Failed to login");
      }
      console.log(action);
    });
    builder.addCase(loginAsync.pending, (state, action) => {
      console.log(action);
    });
    builder.addCase(signupAsync.fulfilled, (state, action) => {
      console.log(action);
      if (action.payload === "User created") {
        alert("nice");
      } else {
        alert(action.payload);
      }
    });
  },
});

export const { logout } = loginSlice.actions;

export const selectUsername = (state: RootState) => state.login.username;

export default loginSlice.reducer;
