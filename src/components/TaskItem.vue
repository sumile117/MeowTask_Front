<template>
  <li class="task-item" @click="handleClick">
    <img src="@/assets/xian.png" alt="毛线" class="button" @click.stop="completeTask" />
    {{ task.content }}
    <span class="date">{{ task.date }}</span>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click', 'complete'])

const handleClick = () => {
  emit('click')
}

const completeTask = () => {
  props.task.completed = true
  emit('complete', props.task.id)
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background-color: #f0f0f0;
  transform: translateX(5px);
}

.button {
  width: 24px;
  height: 24px;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: scale(1.1);
}

.date {
  margin-left: auto;
  color: #888;
  font-size: 14px;
}
</style>