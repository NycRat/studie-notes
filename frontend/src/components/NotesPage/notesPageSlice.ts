import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {apiGetNoteList, apiPostNewNote} from "./notesPageAPI";

export interface NotesPageState {
  className: string;
  noteList: string[];
  currentNote: string;
}

const initialState: NotesPageState = {
  className: "",
  noteList: [],
  currentNote: "",
};

export const refreshNotesListAsync = createAsyncThunk(
  "notesPage/refreshNotesList",
  async (className: string) => {
    return await apiGetNoteList(className);
  }
);

export const postNewNoteAsync = createAsyncThunk(
  "notesPage/postNewNote",
  async (data: {className: string, noteName: string}) => {
    let res = await apiPostNewNote(data.className, data.noteName);
    console.log(res);
    return {status: res, noteName: data.noteName};
  }
);

export const notesPageSlice = createSlice({
  name: "notesPage",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(refreshNotesListAsync.fulfilled, (state, action) => {
      state.noteList = action.payload;
    })
    builder.addCase(postNewNoteAsync.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.noteList.push(action.payload.noteName);
      }
    })
  },
});

export const selectNoteList = (state: RootState) => state.notesPage.noteList;
// export const selectCurrentNote = (state: RootState) => state.notesPage.noteList;
// export const selectNoteList = (state: RootState) => state.notesPage.noteList;

export default notesPageSlice.reducer;
