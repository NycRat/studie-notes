import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  apiGetNoteData,
  apiGetNoteList,
  apiPostNewNote,
  apiPostUpdateNoteData,
} from "./notesPageAPI";

export interface NotesPageState {
  noteList: string[];
  currentNote: string;
  currentNoteData: string;
}

const initialState: NotesPageState = {
  noteList: [],
  currentNote: "",
  currentNoteData: "",
};

export const refreshNotesListAsync = createAsyncThunk(
  "notesPage/refreshNotesList",
  async (className: string) => {
    return await apiGetNoteList(className);
  }
);

export const postNewNoteAsync = createAsyncThunk(
  "notesPage/postNewNote",
  async (data: { className: string; noteName: string }) => {
    let res = await apiPostNewNote(data.className, data.noteName);
    console.log(res);
    return { status: res, noteName: data.noteName };
  }
);
export const getNoteData = createAsyncThunk(
  "notePage/getNoteData",
  async (data: { className: string; noteName: string }) => {
    let res = await apiGetNoteData(data.className, data.noteName);
    console.log(res);
    return {
      name: data.noteName,
      data: res,
    };
  }
);

export const postUpdateNoteData = createAsyncThunk(
  "notePage/postUpdateNotData",
  async (data: {
    className: string;
    noteName: string;
    newNoteData: string;
  }) => {
    let res = await apiPostUpdateNoteData(
      data.className,
      data.noteName,
      data.newNoteData
    );
    console.log(res);
    return {
      status: res,
      name: data.noteName,
      data: data.newNoteData,
    };
  }
);

export const notesPageSlice = createSlice({
  name: "notesPage",
  initialState,
  reducers: {
    clearCurrentNote: (state) => {
      state.currentNote = "";
      state.currentNoteData = "";
    }
  },
  extraReducers(builder) {
    builder.addCase(refreshNotesListAsync.fulfilled, (state, action) => {
      state.noteList = action.payload;
    });
    builder.addCase(postNewNoteAsync.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.noteList.push(action.payload.noteName);
      }
    });
    builder.addCase(getNoteData.fulfilled, (state, action) => {
      state.currentNote = action.payload.name;
      state.currentNoteData = action.payload.data;
    });
    builder.addCase(postUpdateNoteData.fulfilled, (state, action) => {
      // if (action.payload.status) {
      //   // state.currentNote = action.payload.name;
      //   // state.currentNoteData = action.payload.data;
      // }
    });
  },
});

export const { clearCurrentNote } = notesPageSlice.actions;

export const selectNoteList = (state: RootState) => state.notesPage.noteList;
export const selectCurrentNote = (state: RootState) =>
  state.notesPage.currentNote;
export const selectCurrentNoteData = (state: RootState) =>
  state.notesPage.currentNoteData;
// export const selectNoteList = (state: RootState) => state.notesPage.noteList;

export default notesPageSlice.reducer;
