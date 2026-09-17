import axios from "axios";

const ssrApi = axios.create({
  baseURL: "http://127.0.0.1:3001/api/v1",
  timeout: 10000,
});

export default ssrApi;