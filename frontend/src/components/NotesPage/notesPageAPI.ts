import axios from "axios";
import { Cookies } from "react-cookie";
import SERVER_URL from "../../serverURL";

export const apiPostNewNote = async (
  className: string,
  noteName: string
): Promise<boolean> => {
  let cookies = new Cookies();
  let username = cookies.get("username");
  let password = cookies.get("password");
  let res = await axios.post(
    `${SERVER_URL}/notes/new?class=${className}&note=${noteName}`,
    {},
    {
      auth: { username, password },
    }
  );
  return res.data.data;
};

export const apiGetNoteList = async (className: string): Promise<string[]> => {
  let cookies = new Cookies();
  let username = cookies.get("username");
  let password = cookies.get("password");
  let res = await axios.get(`${SERVER_URL}/notes/list?class=${className}`, {
    auth: { username, password },
  });
  return res.data.data;
};

export const apiGetNoteData = async (
  className: string,
  noteName: string
): Promise<string> => {
  let cookies = new Cookies();
  let username = cookies.get("username");
  let password = cookies.get("password");
  let res = await axios.get(
    `${SERVER_URL}/notes?class=${className}&note=${noteName}`,
    {
      auth: { username, password },
    }
  );
  console.log(res);
  return res.data;
};

export const apiPostUpdateNoteData = async (
  className: string,
  noteName: string,
  newNoteData: string
): Promise<string> => {
  let cookies = new Cookies();
  let username = cookies.get("username");
  let password = cookies.get("password");
  let res = await axios.post(
    `${SERVER_URL}/notes?class=${className}&note=${noteName}`,
    newNoteData,
    {
      auth: { username, password },
    }
  );
  console.log(res);
  return res.data;
};
