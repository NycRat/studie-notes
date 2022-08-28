import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Cookies} from "react-cookie";
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
      return {status: "logged in", username: loginInfo.username, password: loginInfo.password};
    }
    return {status: "failed login", username: "", password: ""};
  }
);

export const signupAsync = createAsyncThunk(
  "loginSlice/signup",
  async (loginInfo: LoginState) => {
    let status = await apiPostNewUser(loginInfo.username, loginInfo.password);
    return {status: status, username: loginInfo.username, password: loginInfo.password}
  }
);

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = "";
      state.password = "";
      let cookies = new Cookies();
      cookies.remove("username");
      cookies.remove("password");
    },
  },
  extraReducers(builder) {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      if (action.payload.status === "logged in") {
        state.username = action.payload.username;
        state.password = action.payload.password;
        let cookies = new Cookies();
        cookies.set("username", action.payload.username);
        cookies.set("password", action.payload.password);
      } else {
        let cookies = new Cookies();
        cookies.set("username", "");
        cookies.set("password", "");
      }
    });
    builder.addCase(signupAsync.fulfilled, (state, action) => {
      console.log(action);
      if (action.payload.status === "User created") {
        alert("You are logged");
        state.username = action.payload.username;
        state.password = action.payload.password;
        let cookies = new Cookies();
        cookies.set("username", action.payload.username);
        cookies.set("password", action.payload.password);
      } else {
        alert(action.payload);
      }
    });
  },
});

export const { logout } = loginSlice.actions;

export const selectUsername = (state: RootState) => state.login.username;

export default loginSlice.reducer;
