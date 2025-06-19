<template>
  <div class="desk">
    <!-- 主内容区 -->
    <div class="main-content" :class="{ expanded: showRightSection }">
      <div class="header">
        <h1>MeowTask</h1>
        <div class="fish-bar">
          <img v-for="i in 6" :key="i" src="@/assets/fish.jpg" alt="fish" />
        </div>
        <h3>今天的总coin为{{ coinstoday }}</h3>
      </div>
      
      <!-- 固定大小的任务容器 - 关键修改 -->
      <div class="task-container-wrapper">
        <div class="task-container">
          <ul class="task-list">
            <li v-for="task in tasks" :key="task.id" @click="selectTask(task)">
              <img
                :src="taskIconSrc"
                alt="task-icon"
                class="button task-complete-btn"
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
          
          <!-- 无任务时显示提示 -->
          <div v-if="tasks.length === 0" class="empty-task-message">
            <p>暂无任务，点击下方"+"添加新任务</p>
          </div>
        </div>
      </div>
      
      <!-- 猫咪图片移到任务容器外部 -->
      <div class="cat-container">
        <img src="@/assets/cat.jpg" alt="cat" class="cat-img" />
        <h3>{{ catinteract }}</h3>
      </div>
      
      <!-- 添加任务按钮 -->
      <button class="add-button" :class="{ 'moved': showRightSection }" @click="toggleRightSection">
        <img :src="addSrc" alt="add-task" />
      </button>
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
          <div class="metrics">
            <span><img :src="coinSrc" alt="coin" /> <input v-model="taskCoin" /></span>
            <span><img :src="timeSrc" alt="time" /> 4h30min</span>
          </div>
        </div>
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
import { onMounted } from 'vue'
import { getTasks } from '@/services/taskService'
export default {
  setup() {
    // 状态管理
    const showRightSection = ref(false)
    const selectedTask = ref(null);
    const userInput = ref('');
    const coinstoday=ref(0);
    const idCount = ref(0);
    const newtask = ref({
   // id: Date.now(), // 临时 ID，后端保存后可以替换
        id:()=>{idCount.value+1;
          return idCount.value;
        },
        name: '',
        coin: 2,
        deadline: '',
        tag: ''
      });
    // 聊天消息
    const catinteract = computed(() => {
      if (coinstoday.value <= 4) {
        return '本喵肚子很饿了！快去工作给我换小鱼干！'
      } else if (coinstoday.value <= 8) {
        return '就几条小鱼可打发不了本喵，你就这点实力了喵？'
      } else if (coinstoday.value <= 11) {
        return '已经不饿了喵，但是要是能再吃一条的话...就一条..'
      } else {
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
    const fishSrc = new URL('@/assets/fish.png', import.meta.url).href
    const taskIconSrc = new URL('@/assets/xian.png', import.meta.url).href
    const addSrc = new URL('@/assets/add.png', import.meta.url).href
    const coinSrc = new URL('@/assets/coin.png', import.meta.url).href
    const timeSrc = new URL('@/assets/time.png', import.meta.url).href
    const aiCatSrc = new URL('@/assets/AIcat.png', import.meta.url).href

    // 方法
    const toggleRightSection = () => {
      showRightSection.value = !showRightSection.value
      // 如果是关闭面板，重置选中任务
      if (!showRightSection.value) {
        if (!selectedTask.value) {
          idCount.value += 1;
          newtask.value.id = idCount.value;
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
      
      // 触发小鱼下落动画
      triggerFishFalling()
    }
    
    // 触发小鱼下落的辅助函数
    const triggerFishFalling = () => {
      const fishElements = document.querySelectorAll('.fish-bar img')
      const activeFish = Array.from(fishElements).find(fish => {
        return !fish.classList.contains('falling')
      })
      
      if (activeFish) {
        // 获取小鱼在视口中的位置
        const fishRect = activeFish.getBoundingClientRect()
        const mainContent = document.querySelector('.main-content')
        const mainRect = mainContent.getBoundingClientRect()
        
        // 创建小鱼克隆用于动画
        const fallingFish = activeFish.cloneNode(true)
        fallingFish.classList.add('falling')
        fallingFish.style.position = 'fixed'
        fallingFish.style.top = `${fishRect.top}px` // 使用视口绝对坐标
        
        // 调整水平位置：增加向右的偏移量
        fallingFish.style.left = `${fishRect.left + 20}px` // 向右偏移20px
        
        fallingFish.style.width = '40px'
        fallingFish.style.height = '40px'
        fallingFish.style.zIndex = '100'
        
        // 获取任务容器和猫咪位置，确定下落终点
        const taskContainer = document.querySelector('.task-container')
        const containerRect = taskContainer.getBoundingClientRect()
        const catImg = document.querySelector('.cat-img')
        const catRect = catImg ? catImg.getBoundingClientRect() : { 
          bottom: containerRect.bottom,
          left: containerRect.left + containerRect.width / 2 // 如果没有猫咪，默认使用容器中心
        }
        
        // 定义动画关键帧
        const keyframes = [
        { transform: 'translateY(0)', opacity: 1 },
        { 
          transform: `translateY(${catRect.top - fishRect.top - 50}px) rotate(180deg)`, 
          opacity: 0.5  // 下落过程中逐渐淡出到50%
        },
        { 
          transform: `translateY(${catRect.bottom - fishRect.top - 20}px) translateX(${catRect.left + catRect.width/2 - fishRect.left}px) rotate(180deg)`, 
          opacity: 0.5  // 保持50%透明度直到接近终点
        },
        { 
          transform: `translateY(${catRect.bottom - fishRect.top}px) translateX(${catRect.left + catRect.width/2 - fishRect.left}px) rotate(180deg)`, 
          opacity: 0  // 最后突然完全透明
        }
        ]
        
        // 定义动画选项
        const options = {
          duration: 4000,
          easing: 'ease-out'
        }
        
        // 执行动画
        const animation = fallingFish.animate(keyframes, options)
        
        // 动画结束后移除克隆的小鱼
        animation.onfinish = () => {
          fallingFish.remove()
        }
        
        // 将动画元素添加到页面
        document.body.appendChild(fallingFish)
      }
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
      aiCatSrc,
      toggleRightSection,
      selectTask,
      sendMessage,
      updateTaskName,
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
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  height: 100%;
}

.main-content.expanded {
  transform: scale(0.8) translateX(-25%);
}



.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  z-index: 10; /* 确保标题在滚动区域上方 */
}

.fish-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  position: relative;
}

.fish-bar img {
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

/* 任务容器包装器 - 关键修改 */
.task-container-wrapper {
  width: 100%;
  max-width: 1200px;
  margin-top: -20px;
  margin-bottom: 30px; /* 为猫咪图片留出空间 */
}

/* 任务容器 - 固定大小 */
.task-container {
  height: 300px; /* 固定高度 */
  width: 100%;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 无任务时的提示信息 */
.empty-task-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-size: 16px;
}

.task-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.task-list li {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 800px;
  min-height: 20px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
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

/* 猫咪容器 */
.cat-container {
  width: 100%;
  max-width: 1200px;
  text-align: left;
  padding: 10px;
}

.cat-img {
  width: 180px;
  border-radius: 4px;
}

/* 添加任务按钮 - 固定位置 */
.add-button {
  position: fixed;
  bottom: 30px;
  right: 650px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
}

.add-button img {
  width: 60px;
  height: 60px;
}

.add-button.moved {
  bottom: 30px;
  right: 800px;
  transform: scale(0.9);
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
  z-index: 100;
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
  margin-left: 20px;
}

.form-row input,
.form-row select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
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
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.ai-message {
  background-color: #007bff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.ai-cat {
  text-align: center;
  margin: 10px 0;
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.ai-cat img {
  width: 300px;
  height: auto;
  border-radius: 8px;
}

.chat-input {
  display: flex;
  position: absolute;
  bottom: 100px;
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

/* 小鱼下落动画 */
.falling {
  animation-play-state: running;
}

/* 自定义滚动条样式 */
.task-container::-webkit-scrollbar {
  width: 8px;
}

.task-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.task-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.task-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>