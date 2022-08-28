import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addClass, selectClassList } from "./classPageSlice";
import styles from "./ClassPage.module.scss";
import { createRef, useState } from "react";

const ClassPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const classList = useAppSelector(selectClassList);
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(-1);
  const classNameInput = createRef<HTMLInputElement>();

  return (
    <div className="page">
      <div className={styles.classList}>
        {classList.map((className, i) => (
          <div
            key={i}
            className={styles.classListItem}
            onClick={() => setSelectedClassIndex(i)}
          >
            {className}
          </div>
        ))}
        <form className={styles.newClassForm} onSubmit={(event) => {
          event.preventDefault();
          if (classNameInput.current) {
            console.log(classNameInput.current.value);
            dispatch(addClass(classNameInput.current.value));
          }
        }}>
          <label>New Class</label>
          <br />
          <input ref={classNameInput} type={"text"} />
          <input type={"submit"} disabled={classNameInput.current?.value === ""} />
        </form>
      </div>
      <div className={styles.classPreview}>
        {selectedClassIndex !== -1 ? <h1>idk</h1> : <h1>Class Preview</h1>}
      </div>
    </div>
  );
};

export default ClassPage;
