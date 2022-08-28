import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import classPageReducer from "../components/ClassPage/classPageSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    classPage: classPageReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
