import axios from "axios";

const serverUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "http://13.230.250.192:3000/api/v1/";
  } else {
    return "http://localhost:3001/api/v1";
  }
};
export const apiLocalhost = axios.create({
  baseURL: serverUrl(),
});
