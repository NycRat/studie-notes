import { useNavigate, useParams } from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {logout} from "../../app/loginSlice";
import styles from "./UserPage.module.scss";

const UserPage = (): JSX.Element => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!username) {
    return <h1>404 User not found</h1>;
  }

  const handleSignout = () => {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="page">
      <h1 className={styles.username}>{username}</h1>
      <div className={styles.logoutButton} onClick={handleSignout}>Logout</div>
    </div>
  );
};

export default UserPage;
