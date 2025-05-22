import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://your-backend-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 获取任务列表
export const getTasks = () => {
  return apiClient.get('/tasks')
}

// 添加任务
export const addTask = (task) => {
  return apiClient.post('/tasks', task)
}
export const updateTask = (taskId, task) => {
  return apiClient.put(`/tasks/${taskId}`, task)
}
// 完成任务
export const completeTask = (taskId) => {
  return apiClient.put(`/tasks/${taskId}/complete`)
}
