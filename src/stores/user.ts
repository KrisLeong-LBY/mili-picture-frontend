import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import httpRequest from '@/service'

export const useUserStore = defineStore('user', () => {
  // TODO根据后端返回的数据定义接口
  const userInfo = ref<any>({
    userName: '未登录',
  })
  async function getUserInfo() {
    try {
      const res: any = await httpRequest.get('/user/get/login')
      if (res) {
        setUserInfo(res)
      }
    } catch (error) {
      // TODO加报错样式
      console.log(error)
    }
  }
  function setUserInfo(newValue: any) {
    userInfo.value = newValue
  }

  return { userInfo, getUserInfo, setUserInfo }
})
