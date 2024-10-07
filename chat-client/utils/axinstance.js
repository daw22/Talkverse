import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://your-api-base-url'
});

export default instance;