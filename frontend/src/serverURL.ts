const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "deployed"
    : "http://localhost:8000/api";

export default SERVER_URL;
