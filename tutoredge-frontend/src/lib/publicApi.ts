import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  timeout: 10000,
});

export default publicApi;
