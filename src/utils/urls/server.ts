import axios from "axios";

// windowオブジェクトがなければ、SSRなのでdockerを使う
const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";
export const DOCKER_API_SERVER = "http://api:3001/api/v1";
export const API_SERVER =
  typeof window === "undefined" ? DOCKER_API_SERVER : DEFAULT_API_LOCALHOST;

const serverUrl = () => {
  // if (process.env.NODE_ENV === "production") {
  //   return "http://13.230.250.192:3000/api/v1/";
  // } else {
  return API_SERVER;
  // }
};
export const apiLocalhost = axios.create({
  baseURL: serverUrl(),
});
