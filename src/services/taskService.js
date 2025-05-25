import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
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
//  更新任务
export const updateTask = (taskId, task) => {
  return apiClient.put(`/tasks/id/${taskId}`, task)
}
// 完成任务
export const completeTask = (taskId) => {
  return apiClient.delete(`/tasks/id/${taskId}`)
}
