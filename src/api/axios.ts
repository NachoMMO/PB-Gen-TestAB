import axios from 'axios';

const token = '2:G6XQOg3zZVtQBmUwrR0VCSpLia-08FIVmugsipmusZ6FHjvPyGqw';

const configDefault = () => {
  axios.defaults.baseURL = 'https://api.optimizely.com/v2';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
}

configDefault();

export default axios.create();