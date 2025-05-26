<template>
  <div class="desk">
    <!-- 主内容区 -->
    <div class="main-content" :class="{ expanded: showRightSection }">
      <div class="header">
        <h1>MeowTask</h1>
        <div class="fish-bar">
          <img v-for="i in 6" :key="i" src="@/assets/fish.jpg" alt="fish" />
        </div>
      </div>
      <!-- 任务列表 -->
      <div class="task-container">
        <ul class="task-list">
          <li v-for="task in tasks" :key="task.id" @click="selectTask(task)">
            <img
              :src="taskIconSrc"
              alt="task-icon"
              class="button"
              @click.stop="completefrTask(task.id)"
            />
            <div class="task-info">
              <div class="task-row">
                <h3>{{ task.name }}</h3>
                <span class="task-date">{{ task.deadline }}</span>
              </div>
            </div>
          </li>
        </ul>
        <img src="@/assets/cat.jpg" alt="cat" class="cat-img" />
        <h3>{{ catinteract }}</h3>
      </div>
      <!-- 添加任务按钮 -->
      <button class="add-button" @click="toggleRightSection">
        <img :src="addSrc" alt="add-task" />
      </button>
      <h3>今天的总coin为{{ coinstoday }}</h3>
    </div>
    <!-- 右侧详情面板 -->
    <div class="details-panel" :class="{ visible: showRightSection }">
      <div class="panel-content">
        <!-- 任务基本信息 -->
        <div class="task-header">
          <input
            v-model="taskName"
            class="task-name-input"
            placeholder="输入任务名称"
            @blur="updateTaskName"
          />
          <!-- <h2>{{ selectedTask?.name || '完成智能系统大作业' }}</h2>  这里要改成可以输入和- -->
          <div class="metrics">
            <span><img :src="coinSrc" alt="coin" /> <input v-model="taskCoin" /></span>
            <span><img :src="timeSrc" alt="time" /> 4h30min</span>
          </div>
        </div>
        <!-- 任务详情表单 -->
        <!-- 任务详情表单 -->
        <div class="task-form">
          <div class="form-row">
            <label>截止日期</label>
            <input type="date" v-model="taskDeadline" />
            <label class="tag-label">标签</label>
            <select v-model="taskTag">
              <option value="重要">重要</option>
              <option value="紧急">紧急</option>
              <option value="常规">常规</option>
            </select>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-container">
          <div class="chat-messages">
            <div
              v-for="(msg, index) in chatMessages"
              :key="index"
              :class="['chat-bubble', msg.from === 'AI' ? 'ai-message' : 'user-message']"
            >
              {{ msg.text }}
            </div>
          </div>

          <!-- AI猫图片 -->
          <div class="ai-cat">
            <img :src="aiCatSrc" alt="AI Cat" />
          </div>

          <!-- 输入区域 -->
          <div class="chat-input">
            <input
              type="text"
              v-model="userInput"
              @keyup.enter="sendMessage"
              placeholder="和小猫聊聊天吧~"
            />
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import { addTask, updateTask, completeTask } from '@/services/taskService.js'
import TaskItem from '../components/TaskItem.vue'
import { onMounted } from 'vue'
import { getTasks } from '@/services/taskService'
export default {
  setup() {
    // 状态管理
    const showRightSection = ref(false)
    const selectedTask = ref(null)
    const userInput = ref('')
    const coinstoday = ref(0)
    const newtask = ref({
      id: Date.now(), // 临时 ID，后端保存后可以替换
      name: '',
      coin: 2,
      deadline: '',
      tag: '',
    })
    // 聊天消息
    const catinteract = computed(() => {
      if (coinstoday.value <= 4) {
        // return "本喵肚子很饿了！{{用户名}}快去工作给我换小鱼干！";
        return '本喵肚子很饿了！快去工作给我换小鱼干！'
      } else if (coinstoday.value <= 8) {
        return '就几条小鱼可打发不了本喵，你就这点实力了喵？'
      } else if (coinstoday.value <= 11) {
        return '已经不饿了喵，但是要是能再吃一条的话...就一条..'
      } else {
        // return "今天已经吃得很饱了喵！谢谢{{用户名}}的款待！";
        return '今天已经吃得很饱了喵！谢谢的款待！'
      }
    })
    const chatMessages = ref([
      { text: '我正在设计一些材料，你什么时候需要？', from: 'AI' },
      { text: '下个月？', from: 'User' },
      { text: '我快完成了，请给我你的邮箱，完成后我会打包发给你。', from: 'AI' },
      { text: 'maciej.kowalski@email.com', from: 'User' },
    ])

    // 任务数据
    // const tasks = ref([
    //   { id: 1, name: '完成智能计算系统大作业', deadline: '2025/05/06', tag: '重要',coin: '2' },
    //   { id: 2, name: '慢跑30分钟', deadline: '2025/05/06' },
    //   { id: 3, name: '准备英语考试', deadline: '2025/05/07' },
    //   { id: 4, name: '阅读30页书籍', deadline: '2025/05/07' },
    //   { id: 5, name: '整理笔记', deadline: '2025/05/08' }  //注意：deadline 格式为 '2025-05-08'
    // ]);

    const tasks = ref([]) // 初始化为空数组

    onMounted(async () => {
      try {
        const response = await getTasks()
        tasks.value = response.data
      } catch (error) {
        console.error('获取任务失败:', error)
      }
    })

    // 资源路径
    // 正确的写法
    const fishSrc = new URL('@/assets/fish.jpg', import.meta.url).href
    const taskIconSrc = new URL('@/assets/xian.png', import.meta.url).href
    const addSrc = new URL('@/assets/add.png', import.meta.url).href
    const coinSrc = new URL('@/assets/coin.png', import.meta.url).href
    const timeSrc = new URL('@/assets/time.png', import.meta.url).href
    const aiCatSrc = new URL('@/assets/AIcat.png', import.meta.url).href // 导入AI猫图片路径

    // 方法
    const toggleRightSection = () => {
      showRightSection.value = !showRightSection.value
      // 如果是关闭面板，重置选中任务
      if (!showRightSection.value) {
        if (!selectedTask.value) {
          console.log(selectedTask.value)
          console.log(taskName.value)
          console.log(newtask.value)
          tasks.value.push({ ...newtask.value })
          addTask({ ...newtask.value })
        } else {
          updateTask(selectedTask.value.id, { ...selectedTask.value })
        }
      }
      selectedTask.value = null
      taskName.value = ''
      taskCoin.value = ''
      taskDeadline.value = ''
      taskTag.value = ''
    }
    const taskName = computed({
      get() {
        return selectedTask.value?.name || newtask.value.name
      },
      set(value) {
        if (selectedTask.value) {
          selectedTask.value.name = value
        } else {
          newtask.value.name = value
        }
      },
    })
    const taskCoin = computed({
      get() {
        return selectedTask.value?.coin || newtask.value.coin
      },
      set(value) {
        if (selectedTask.value) {
          selectedTask.value.coin = value
        } else {
          newtask.value.coin = value
        }
      },
    })
    const taskDeadline = computed({
      get() {
        // let date =   new Date(selectedTask.value?.deadline || newtask.value.deadline)
        // const year = date.getFullYear()
        // const month = String(date.getMonth() + 1).padStart(2, '0')
        // const day = String(date.getDate()).padStart(2, '0')
        // return `${year}-${month}-${day}`
        return selectedTask.value?.deadline || newtask.value.deadline
      },
      set(value) {
        if (selectedTask.value) {
          selectedTask.value.deadline = value
        } else {
          newtask.value.deadline = value
        }
      },
    })
    const taskTag = computed({
      get() {
        return selectedTask.value?.tag || newtask.value.tag
      },
      set(value) {
        if (selectedTask.value) {
          selectedTask.value.tag = value
        } else {
          newtask.value.tag = value
        }
      },
    })
    //完成任务
    const completefrTask = (taskid) => {
      coinstoday.value += Number(tasks.value.find((task) => task.id === taskid).coin) || 0
      tasks.value = tasks.value.filter((task) => task.id !== taskid)
      completeTask(taskid)
    }
    const updateTaskName = () => {
      // 这里可以做保存或校验逻辑，比如：
      if (selectedTask.value) {
        console.log('任务名已更新为：', selectedTask.value.name)
      } else {
        console.log('新建任务：', taskName.value)
      }
    }
    const selectTask = (task) => {
      selectedTask.value = task
      showRightSection.value = true
    }

    const sendMessage = () => {
      if (userInput.value.trim() === '') return

      // 添加用户消息
      chatMessages.value.push({
        text: userInput.value,
        from: 'User',
      })

      // 清空输入
      userInput.value = ''

      // 模拟AI回复（实际应调用API）
      setTimeout(() => {
        chatMessages.value.push({
          text: '这是AI的回复：' + userInput.value.split('').reverse().join(''),
          from: 'AI',
        })
      }, 800)
    }

    return {
      showRightSection,
      selectedTask,
      userInput,
      chatMessages,
      tasks,
      fishSrc,
      taskIconSrc,
      addSrc,
      coinSrc,
      timeSrc,
      aiCatSrc, // 导出AI猫图片路径
      toggleRightSection,
      selectTask,
      sendMessage,
      updateTaskName, //右侧面板数据更新
      // updateCoin,
      // updateDeadline,
      taskName,
      taskCoin,
      taskDeadline,
      taskTag,
      newtask,
      completefrTask,
      coinstoday,
      catinteract,
    }
  },
}
</script>

<style scoped>
/* 基础布局 */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  transform-origin: center center;
  padding: 20px;
  width: 100%;
  max-width: 1600px; /* 增加最大宽度从1200px到1600px */
  margin: 0 auto;
}

.main-content.expanded {
  transform: scale(0.8) translateX(-25%);
}

.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.fish-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.fish-bar img {
  width: 30px;
  height: 30px;
}

.task-container {
  flex: 1;
  width: 100%;
  max-width: 1200px; /* 增加最大宽度从800px到1200px */
  overflow-y: auto;
  padding: 0 20px; /* 添加左右内边距 */
}

.task-list {
  list-style: none;
  padding: 0;
  width: 100%; /* 确保列表占满容器宽度 */
}

.task-list li {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 800px; /* 修改为固定宽度 */
  min-height: 20px;
  margin-left: auto; /* 添加这行使其居中 */
  margin-right: auto; /* 添加这行使其居中 */
}

.task-list li:hover {
  transform: translateX(5px);
}

.task-list img {
  width: 24px;
  height: 24px;
  margin-right: 15px;
}

.task-info {
  flex: 1;
}

.task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.task-row h3 {
  margin: 0;
  font-size: 16px;
  flex: 1;
}

.task-date {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
}

.task-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
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
.add-button {
  position: fixed;
  bottom: 30px;
  background: none;
  border: none;
  cursor: pointer;
}

.add-button img {
  width: 60px;
  height: 60px;
}

/* 右侧详情面板 */
.details-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background-color: #f0f0f0;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  padding: 60px;
  overflow-y: auto;
}

.details-panel.visible {
  transform: translateX(0);
}

.panel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-header {
  text-align: center;
  margin-bottom: 20px;
}
.task-name-input {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  border: none;
  background: transparent;
  border-bottom: 2px solid #ddd;
  padding: 5px;
  margin-bottom: 10px;
}

.task-name-input:focus {
  outline: none;
  border-bottom-color: #007bff;
}
.metrics {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.metrics span {
  display: flex;
  align-items: center;
}

.metrics img {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.task-form {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row label {
  white-space: nowrap;
  font-weight: bold;
}

.tag-label {
  margin-left: 20px; /* 给标签标题添加左边距 */
}

.form-row input,
.form-row select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1; /* 让输入框和下拉框平均分配剩余空间 */
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 60px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  max-height: calc(100% - 100px);
  background-color: #e2e2e2;
  /* max-width: 1600px;  /* 添加最大宽度限制 */
  /* margin-left: auto;  /* 使聊天区域居中 */
  /* margin-right: auto;   */
}

.chat-bubble {
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.user-message {
  background-color: #f5f5f5;
  color: #333;
  margin-right: auto; /* 修改：从 margin-left: auto 改为 margin-right: auto */
  border-bottom-left-radius: 4px; /* 修改：从 right 改为 left */
}

.ai-message {
  background-color: #007bff;
  color: white;
  margin-left: auto; /* 修改：从 margin-right: auto 改为 margin-left: auto */
  border-bottom-right-radius: 4px; /* 修改：从 left 改为 right */
}

.ai-cat {
  text-align: center;
  margin: 10px 0;
  position: absolute;
  bottom: -50px; /* 修改：将猫咪移到底部 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1; /* 添加：确保猫咪显示在最上层 */
}

.ai-cat img {
  width: 300px; /* 调整猫咪大小 */
  height: auto;
  border-radius: 8px;
}

.chat-input {
  display: flex;
  position: absolute;
  bottom: 100px; /* 修改：将输入框移到猫咪上方 */
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.chat-input button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
</style><!-- <template> -->
  <!-- <div class="box">
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
              <span class="info-label">{{ selectedTask ? selectedTask.coin : '-' }}</span>
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
  { id: 1, content: '完成智能计算系统大作业', date: '2025/05/06', coin: 2, completed: false },
  { id: 2, content: '慢跑30分钟', date: '2025/05/06', coin: 2, completed: false },
  { id: 3, content: '阅读30分钟', date: '2025/05/07', coin: 2, completed: false },
  { id: 4, content: '购买猫粮', date: '2025/05/08', coin: 2, completed: false },
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
      coin: parseInt(newTaskPoints.value) || 2,
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
            coin: parseInt(newTaskPoints.value) || 2,
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
</style> -->
