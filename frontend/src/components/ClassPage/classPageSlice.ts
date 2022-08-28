import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {apiPostNewClass} from "./classPageAPI";

export interface ClassPageState {
  classList: string[];
}

const initialState: ClassPageState = {
  classList: ["Math", "Science", "English"],
};

export const classPageSlice = createSlice({
  name: "classPage",
  initialState,
  reducers: {
    addClass: (state, action: PayloadAction<string>) => {
      apiPostNewClass(action.payload);
      state.classList.push(action.payload);
    },
  },
});

export const { addClass } = classPageSlice.actions;

export const selectClassList = (state: RootState) => state.classPage.classList;

export default classPageSlice.reducer;
