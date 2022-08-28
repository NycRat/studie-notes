const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://studie-notes.herokuapp.com/api"
    : "http://localhost:8000/api";

export default SERVER_URL;
