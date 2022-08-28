import axios from "axios";
import SERVER_URL from "../../serverURL";

export const apiPostNewUser = async (username: string, password: string) => {
  let res = await axios.post(
    `${SERVER_URL}/user/new`,
    {},
    {
      auth: { username, password },
    }
  );
  return res.data.data;
};

export const apiGetLogin = async (username: string, password: string) => {
  let res = await axios.get(
    `${SERVER_URL}/user/login`,
    {
      auth: { username, password },
    }
  );
  return res.data.data;
};
