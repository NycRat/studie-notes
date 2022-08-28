import { Counter } from "./components/counter/Counter";
import "./App.scss";
import {Route, Routes} from "react-router-dom";
import ClassPage from "./components/ClassPage/ClassPage";
import LoginPage from "./components/LoginPage/LoginPage";
import {useAppSelector} from "./app/hooks";
import {selectUsername} from "./app/loginSlice";

const App = (): JSX.Element => {

  const currentUsername = useAppSelector(selectUsername);

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/#/">Home</a>
        <a href="/#/classes">Classes</a>
        <a href="/#/notes">Notes</a>
        {currentUsername === "" ? <a href="/#/login">Login</a> : <a href={"/#/user/" + currentUsername}>Profile</a>}
      </nav>
      <Routes>
        <Route path="/" element={<Counter />} />
        <Route path="/classes" element={<ClassPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
      
    </div>
  );
};

export default App;
