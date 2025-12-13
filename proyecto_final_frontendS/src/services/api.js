import axios from 'axios';

const API_BASE_URL = 'https://proyecto-final-compilado-jc.onrender.com/api';
//const API_URL = 'http://localhost:1578/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    
});

export default api;