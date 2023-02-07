import axios from "axios";

export const apiLocalhost = axios.create({
  baseURL: "http://localhost:3001/api/v1",
});
