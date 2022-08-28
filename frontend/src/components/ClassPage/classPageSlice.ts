import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiGetClassList, apiPostNewClass } from "./classPageAPI";

export interface ClassPageState {
  classList: string[];
}

const initialState: ClassPageState = {
  classList: ["Math", "Science", "English"],
};

export const addClassAsync = createAsyncThunk(
  "classPage/addClassAsync",
  async (className: string) => {
    let res = await apiPostNewClass(className);
    return { status: res, data: className };
  }
);

export const refreshClassListAsync = createAsyncThunk(
  "classPage/refreshClassList",
  async (user: string) => {
    return apiGetClassList(user);
  }
);

export const classPageSlice = createSlice({
  name: "classPage",
  initialState,
  reducers: {
    addClass: (state, action: PayloadAction<string>) => {
      state.classList.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(refreshClassListAsync.fulfilled, (state, action) => {
      state.classList = action.payload;
    });
    builder.addCase(addClassAsync.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.classList.push(action.payload.data);
      }
    });
  },
});

export const selectClassList = (state: RootState) => state.classPage.classList;

export default classPageSlice.reducer;
