import { createRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getNoteData,
  postNewNoteAsync,
  refreshNotesListAsync,
  selectCurrentNote,
  selectCurrentNoteData,
  selectNoteList,
} from "./notesPageSlice";
import styles from "./NotesPage.module.scss";
import { useParams } from "react-router-dom";

const NotesPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const newNoteInput = createRef<HTMLInputElement>();

  const noteList = useAppSelector(selectNoteList);
  const currentNote = useAppSelector(selectCurrentNote);
  const currentNoteData = useAppSelector(selectCurrentNoteData);

  const { className } = useParams();

  useEffect(() => {
    if (className) {
      dispatch(refreshNotesListAsync(className));
    }
  }, [className, dispatch]);

  if (!className) {
    return <h1>404 Class not found</h1>;
  }

  const handleSubmitNewNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newNoteInput.current) {
      dispatch(
        postNewNoteAsync({
          className: className,
          noteName: newNoteInput.current.value,
        })
      );
    }
  };

  const handleSelectNote = (noteName: string) => {
    dispatch(
      getNoteData({
        className: className,
        noteName: noteName,
      })
    );
  };

  return (
    <div className="page">
      <h1 className={styles.noteTitle}>{currentNote}</h1>
      <textarea className={styles.noteTextarea} defaultValue={currentNoteData} />

      <div className={styles.noteList}>
        <h1 className={styles.title}>{className}</h1>

        {noteList.map((noteName, i) => (
          <div
            className={styles.noteListItem}
            key={i}
            onClick={() => handleSelectNote(noteName)}
          >
            {noteName}
          </div>
        ))}

        <form className={styles.newNoteForm} onSubmit={handleSubmitNewNote}>
          <label>New Note</label>
          <input
            className={styles.newNoteInput}
            type={"text"}
            ref={newNoteInput}
          />
          <input className={styles.newNoteSubmit} type={"submit"} />
        </form>
      </div>
    </div>
  );
};

export default NotesPage;