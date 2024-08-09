import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoService } from '@/api/user'
// 用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = (res) => (token.value = res) // 设置 token
    const removeToken = () => (token.value = '')

    //用户的基本信息（id,用户名，昵称，邮箱，头像）
    const userInfo = ref({})
    const setUserInfo = (e) => (userInfo.value = e)
    const getUserInfo = async () => {
      const res = await getUserInfoService() //获取数据
      userInfo.value = res.data.data
    }
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true // 持久化
  }
)
