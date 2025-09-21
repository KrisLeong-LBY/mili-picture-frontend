import { ref } from 'vue'
import { defineStore } from 'pinia'

interface UserVO {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: string
  vipExpireTime: Date
  vipCode: string
  vipNumber: number
  createTime: Date
}
interface PictureVO {
  id: number
  url: string
  thumbnailUrl: string
  name: string
  introduction: string
  tags: string[]
  category: string
  picSize: number
  picWidth: number
  picHeight: number
  picScale: number
  picFormat: string
  picColor: string
  userId: number
  spaceId: number
  createTime: Date
  editTime: Date
  updateTime: Date
  user: UserVO
}
export const usePictureStore = defineStore('picture', () => {
  const picture = ref<PictureVO>()

  function setPicture(newValue: any) {
    picture.value = newValue
  }

  function clearPicture() {
    picture.value = {} as PictureVO
  }

  return { picture, clearPicture, setPicture }
})
