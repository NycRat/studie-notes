import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addClassAsync,
  refreshClassListAsync,
  selectClassList,
} from "./classPageSlice";
import styles from "./ClassPage.module.scss";
import { createRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ClassPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const classList = useAppSelector(selectClassList);
  const classNameInput = createRef<HTMLInputElement>();

  const [cookies] = useCookies(["username", "password"]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(refreshClassListAsync(cookies.username));
  }, [cookies.password, cookies.username, dispatch]);

  return (
    <div className="page">
      <h1 className={styles.title}>Classes</h1>
      <div className={styles.classList}>
        {classList.map((className, i) => (
          <div
            key={i}
            className={styles.classListItem}
            onClick={() => navigate(`/classes/${className}/notes`)}
          >
            {className}
          </div>
        ))}
        <form
          className={styles.newClassForm}
          onSubmit={(event) => {
            event.preventDefault();
            if (classNameInput.current) {
              dispatch(addClassAsync(classNameInput.current.value));
            }
          }}
        >
          <label>New Class</label>
          <br />
          <input ref={classNameInput} type={"text"} />
          <input
            type={"submit"}
            disabled={classNameInput.current?.value === ""}
          />
        </form>
      </div>
    </div>
  );
};

export default ClassPage;
