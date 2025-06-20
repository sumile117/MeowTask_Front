// src/services/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

export default apiClient
