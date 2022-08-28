import axios from "axios";
import {Cookies} from "react-cookie";
import SERVER_URL from "../../serverURL";

export const apiGetClassList = async (user: string): Promise<string[]> => {
  const res = await axios.get(`${SERVER_URL}/classes/list?user=${user}`);
  return res.data.data;
};

export const apiPostNewClass = async (
  className: string,
) => {
  let cookies = new Cookies();
  let username = cookies.get("username");
  let password = cookies.get("password");
  const res = await axios.post(
    `${SERVER_URL}/classes/new?class=${className}`,
    {},
    {
      auth: { username, password },
    }
  );
  return res.data.data;
};
