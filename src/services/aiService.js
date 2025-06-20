import apiClient from './apiClient'


const chatWithAI = async (message) => {
  try {
    const response = await apiClient.post('/ai/chat', {
      message: message
    });

    if (response.data.success) {
      let result;
      try {
        // 尝试解析为JSON
        result = JSON.parse(response.data.data);

        // 如果是任务格式，返回反馈信息
        if (result.is_task && result.suggested_coin) {
          return Promise.resolve({
            message: result.feedback || `建议奖励${result.suggested_coin}个金币喵~`,
            coin: result.suggested_coin
          });
        }

        // 普通消息格式（直接使用解析后的message）
        return Promise.resolve({
          message: result.message || '无法解析AI回复'
        });

      } catch (e) {
        // 如果解析失败，直接返回原始回复（作为普通消息处理）
        return Promise.resolve({
          message: response.data.data || '无法解析AI回复'
        });
      }
    } else {
      throw new Error('AI回复格式错误');
    }
  } catch (error) {
    console.error('AI交互出错:', error);
    return Promise.resolve({
      message: '抱歉，我暂时无法回答这个问题喵~'
    });
  }
}

export const createTaskWithAI = async (taskData) => {
  try {
    const response = await apiClient.post('/tasks', taskData)
    return response.data
  } catch (error) {
    console.error('创建任务失败:', error)
    return Promise.reject(error)
  }
}

export default {
  chatWithAI,
  createTaskWithAI
}
