import axios from "axios";
import { Cookies } from "react-cookie";
import SERVER_URL from "../../serverURL";

export const apiGetClassList = async (user: string): Promise<string[]> => {
  const res = await axios.get(`${SERVER_URL}/classes/list?user=${user}`);
  return res.data.data;
};

export const apiPostNewClass = async (className: string) => {
  const token = new Cookies().get("user_token");
  const res = await axios.post(
    `${SERVER_URL}/classes/new`,
    { className },
    {
      headers: {
        token: token,
      },
    }
  );
};
