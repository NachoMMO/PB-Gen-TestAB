import axios from 'axios';


const configDefault = () => {
  axios.defaults.baseURL = 'https://api.optimizely.com/v2';
  axios.defaults.headers.common['Authorization'] = `Bearer ${Bun.env.OPTIMIZELY_API_KEY}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
}

configDefault();

export default axios.create();