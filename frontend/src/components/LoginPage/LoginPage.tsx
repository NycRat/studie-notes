import { createRef, useState } from "react";
import styles from "./LoginPage.module.scss";
import { useAppDispatch } from "../../app/hooks";
import { loginAsync, signupAsync } from "../../app/loginSlice";

const LoginPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const usernameInput = createRef<HTMLInputElement>();
  const passwordInput = createRef<HTMLInputElement>();

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (usernameInput.current && passwordInput.current) {
      const loginInfo = {
        username: usernameInput.current.value,
        password: passwordInput.current.value,
      };
      if (isSigningUp) {
        dispatch(signupAsync(loginInfo));
      } else {
        dispatch(loginAsync(loginInfo));
      }
    }
  };

  return (
    <div className="page">
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>
          <label className={styles.label}>Username: </label>
          <input
            className={styles.input}
            type={"username"}
            ref={usernameInput}
          />
          <br />
          <label className={styles.label}>Password: </label>
          <input
            className={styles.input}
            type={"password"}
            ref={passwordInput}
          />
          <br />
          <input
            className={styles.submit}
            type={"submit"}
            value={isSigningUp ? "Sign Up" : "Login"}
          />
        </form>
        {isSigningUp ? (
          <div>
            <p>Already have an account?</p>
            <button onClick={() => setIsSigningUp(false)}>Login</button>
          </div>
        ) : (
          <div>
            <p>Don't have an account?</p>
            <button onClick={() => setIsSigningUp(true)}>Sign up</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
