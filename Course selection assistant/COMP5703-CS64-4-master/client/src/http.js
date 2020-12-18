import axios from 'axios'

axios.defaults.withCredentials = true

var instance = axios.create({
    baseURL: 'http://localhost:5000/'
});

export default instance;