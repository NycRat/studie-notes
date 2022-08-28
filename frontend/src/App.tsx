import "./App.scss";
import { Route, Routes } from "react-router-dom";
import ClassPage from "./components/ClassPage/ClassPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loginAsync, selectUsername } from "./app/loginSlice";
import NotesPage from "./components/NotesPage/NotesPage";
import UserPage from "./components/UserPage/UserPage";

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [cookies] = useCookies(["username", "password"]);
  const currentUsername = useAppSelector(selectUsername);

  useEffect(() => {
    dispatch(
      loginAsync({ username: cookies.username, password: cookies.password })
    );
  }, [cookies.password, cookies.username, dispatch]);

  return !currentUsername ? (
    <div className="app">
      <nav className="navbar">
        <a href="/#/login">Login</a>
      </nav>
      <LoginPage />
    </div>
  ) : (
    <div className="app">
      <nav className="navbar">
        <a href="/#/">Studie Notes</a>
        <a href="/#/classes">Classes</a>
        {currentUsername === "" ? (
          <a href="/#/login">Login</a>
        ) : (
          <a href={"/#/user/" + currentUsername}>Profile</a>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<ClassPage />} />
        <Route path="/classes" element={<ClassPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/classes/:className/notes" element={<NotesPage />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
