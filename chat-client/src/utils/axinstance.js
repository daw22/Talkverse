import axios from "axios";

const token = localStorage.getItem('accessToken');

let instance;
if (token) {
  instance = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
} else {
  instance = axios.create({
    baseURL: "http://localhost:5000",
  });
}


export default instance;
