import axios from "axios";

const token = localStorage.getItem('accessToke');

let instance;
if (token) {
  instance = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `bearer ${token}`
    }
  });
} else {
  instance = axios.create({
    baseURL: "http://localhost:5000",
  });
}


export default instance;
