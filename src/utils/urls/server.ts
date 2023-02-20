import axios from "axios";

// windowオブジェクトがなければ、SSRなのでdockerを使う
const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";
export const DOCKER_API_SERVER = "http://api:3001/api/v1";
export const API_SERVER =
  typeof window === "undefined" ? DOCKER_API_SERVER : DEFAULT_API_LOCALHOST;

const serverUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://pokeline-yuya-back.herokuapp.com/api/v1";
  } else {
    return API_SERVER;
  }
};
export const apiLocalhost = axios.create({
  baseURL: serverUrl(),
  headers: {
    "Access-Control-Allow-Origin": "https://poke-line.vercel.app",
  },
  withCredentials: true,
});
