<template>
  <div class="box">
    <div class="desk">
      <button @click="toggleLeftColumn" class="toggle-button">+</button>
      <div v-if="leftColumnOpen" class="overlay" @click="toggleLeftColumn"></div>
      <div class="left-column" :class="{ open: leftColumnOpen }">
        <h1 v-if="leftColumnOpen">MeowTask</h1>
        <div v-if="leftColumnOpen" class="form-group">
          <label for="newTask">任务内容：</label>
          <input
            v-model="newTask"
            placeholder="输入新任务"
            @keyup.enter="addTask"
            class="rectangle-2"
          />
        </div>
        <div v-if="leftColumnOpen" class="form-group">
          <label for="newTaskTime">任务时间：</label>
          <input
            v-model="newTaskTime"
            type="datetime-local"
            placeholder="设置任务时间"
            @keyup.enter="addTask"
            class="rectangle-3"
          />
        </div>
        <div v-if="leftColumnOpen" class="form-group">
          <label for="newTaskTag">任务标签：</label>
          <input
            v-model="newTaskTag"
            placeholder="添加标签"
            @keyup.enter="addTask"
            class="rectangle-4"
          />
        </div>
        <div v-if="leftColumnOpen" class="form-group">
          <label for="newTaskPoints">任务积分：</label>
          <input
            v-model.number="newTaskPoints"
            type="number"
            placeholder="积分（默认2）"
            @keyup.enter="addTask"
            class="rectangle-5"
          />
        </div>
        <button v-if="leftColumnOpen" @click="addTask" class="ellipse">添加任务</button>
      </div>
      <div class="middle-column" :class="{ 'with-sidebar': selectedTask }">
        <div class="fish-container">
          <img
            v-for="index in 6"
            :key="index"
            src="@/assets/fish.jpg"
            alt="小鱼"
            class="fish-img"
          />
        </div>
        <ul class="task-list">
          <TaskItem
            v-for="(task, index) in filteredTasks"
            :key="task.id"
            :task="task"
            @click="selectTask(index)"
            @complete="handleTaskComplete"
          />
        </ul>
      </div>
      <div class="right-column" :class="{ hidden: !selectedTask }">
        <div class="detail-content">
          <div class="header">
            <h2 class="task-title">{{ selectedTask?.content || '请选择任务' }}</h2>
            <button class="close-button" @click="hideRightColumn">×</button>
          </div>
          <div class="info-container">
            <div class="info-item">
              <img src="@/assets/coin.png" alt="coin" class="icon" />
              <span class="info-label">30</span>
            </div>
            <div class="info-item">
              <img src="@/assets/time.png" alt="time" class="icon" />
              <span class="info-label">4h30min</span>
            </div>
          </div>

          <div class="editable-section">
            <textarea
              v-model="taskNotes"
              placeholder="编辑任务备注..."
              class="edit-textarea"
            ></textarea>
            <textarea
              v-model="taskPlan"
              placeholder="编辑任务计划..."
              class="edit-textarea"
            ></textarea>
          </div>
        </div>

        <div class="cat-container">
          <img src="@/assets/AIcat.png" alt="AIcat" class="cat-img" />
          <div class="chat-section">
            <img src="@/assets/dialogue.png" alt="dialogue" class="chat-icon" />
            <p class="cat-text">和小猫聊聊天吧~</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import TaskItem from '../components/TaskItem.vue'

const tasks = ref([
  { id: 1, content: '完成智能计算系统大作业', date: '2025/05/06', completed: false },
  { id: 2, content: '慢跑30分钟', date: '2025/05/06', completed: false },
  { id: 3, content: '阅读30分钟', date: '2025/05/07', completed: false },
  { id: 4, content: '购买猫粮', date: '2025/05/08', completed: false },
])
const newTask = ref('')
const newTaskTime = ref('')
const newTaskTag = ref('')
const newTaskPoints = ref(2)

// 当前选中的任务
const selectedTask = ref(null)
const taskNotes = ref('')
const taskPlan = ref('')

// 选择任务（使用索引）
const selectTask = (index) => {
  selectedTask.value = filteredTasks.value[index] // 使用 filteredTasks 而不是 tasks
  taskNotes.value = `关于${selectedTask.value.content}的详细说明...`
  taskPlan.value = `和大模型的交互内容`
}

// 从后端读取任务数据
let socket = null

onMounted(() => {
  // 建立 WebSocket 连接
  socket = new WebSocket('ws://localhost:8080/ws')

  // 连接建立成功
  socket.onopen = () => {
    console.log('WebSocket 已连接')
  }

  // 接收到后端推送的数据
  socket.onmessage = (event) => {
    const newTaskList = JSON.parse(event.data)
    tasks.value = newTaskList
  }

  // 连接关闭
  socket.onclose = () => {
    console.log('WebSocket 已关闭')
  }

  // 出错
  socket.onerror = (error) => {
    console.error('WebSocket 错误:', error)
  }
})

// 页面卸载前关闭 WebSocket
onBeforeUnmount(() => {
  if (socket) {
    socket.close()
  }
})

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(), // 前端先临时生成个 id
      content: newTask.value.trim(),
      date: newTaskTime.value,
      // tag: newTaskTag.value,
      // points: parseInt(newTaskPoints.value) || 2,
      completed: false,
    })
    // 发送给后端
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: 'create_task',
          data: {
            content: newTask.value.trim(),
            date: newTaskTime.value,
            // tag: newTaskTag.value,
            // points: parseInt(newTaskPoints.value) || 2,
            completed: false,
          },
        })
      )
    } else {
      console.error('WebSocket 未连接')
    }
    newTask.value = ''
    newTaskTime.value = ''
    newTaskTag.value = ''
    newTaskPoints.value = 2
  }
}

// 计算属性：过滤已完成的任务
const filteredTasks = computed(() => tasks.value.filter((task) => !task.completed))

// 处理任务完成
const handleTaskComplete = (taskId) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    // 本地更新状态
    tasks.value[taskIndex].completed = true

    // 推送给后端
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: 'complete_task',
          data: { id: taskId },
        })
      )
    } else {
      console.error('WebSocket 未连接')
    }
  }
}

// 隐藏右侧详情栏
const hideRightColumn = () => {
  selectedTask.value = null
}

const leftColumnOpen = ref(false)

const toggleLeftColumn = () => {
  leftColumnOpen.value = !leftColumnOpen.value
}
</script>

<style scoped>
.box {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.desk {
  display: flex;
  width: 100%;
  max-width: none; /* 移除最大宽度限制 */
  margin: 0; /* 移除自动边距 */
  /* padding: 20px; */
  transition: all 0.5s ease;
  position: relative; /* 添加相对定位 */
}

.toggle-button {
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 1000;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.left-column {
  position: relative;
  left: -50%;
  top: 0;
  height: 100%;
  transition: left 0.3s ease;
  z-index: 20;
  background-color: rgb(255, 255, 255);
  width: 30%;
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
}

.left-column.open {
  left: 0;
}

.middle-column {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  transition: width 0.5s ease;
  cursor: pointer;
}

.right-column {
  position: fixed; /* 固定定位 */
  right: 0; /* 靠右对齐 */
  top: 0; /* 从顶部开始 */
  height: 100vh; /* 占满整个视口高度 */
  width: 0;
  background-color: #f0f0f0;
  padding: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  z-index: 100; /* 确保在其他内容之上 */
}

.right-column:not(.hidden) {
  width: 400px; /* 固定宽度 */
  padding: 20px;
}

.middle-column {
  width: 100%;
  padding: 20px;
  transition: all 0.5s ease;
  margin-right: 0; /* 默认没有右边距 */
}

.middle-column.with-sidebar {
  margin-right: 400px; /* 当右边栏显示时，添加右边距 */
}

.hidden {
  display: none;
}

.fish-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.fish-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-title {
  margin-top: 0;
}

.info-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.icon {
  width: 30px;
  margin-right: 10px;
}

.edit-textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  resize: vertical;
}

.cat-container {
  position: relative;
  text-align: right;
  margin-top: 30px;
  padding-right: 80px;
}

.cat-img {
  width: 180px;
  border-radius: 4px;
}

.chat-section {
  position: absolute;
  top: -10px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-icon {
  width: 120px;
  height: 80px;
}

.cat-text {
  margin: 0;
  font-style: italic;
  color: #555;
  white-space: nowrap;
}

.rectangle-2 {
  border: 5px solid;
  border-color: #202020;
  border-radius: 10px;
}
.rectangle-3 {
  border: 5px solid;
  border-color: #202020;
  border-radius: 10px;
}
.rectangle-4 {
  border: 5px solid;
  border-color: #202020;
  border-radius: 10px;
}
.rectangle-5 {
  border: 5px solid;
  border-color: #202020;
  border-radius: 10px;
}
.rectangle-6 {
  border: 5px solid;
  border-color: #202020;
  border-radius: 10px;
}
.ellipse {
  border: 5px solid;
  border-color: #202020;
  border-radius: 41.5px / 40.5px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑 */
  z-index: 10;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #eee;
  color: #333;
}
</style>