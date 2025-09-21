import { ref } from 'vue'
import { defineStore } from 'pinia'
import httpRequest from '@/service'
import { message } from 'ant-design-vue'

export const useTagCategoryStore = defineStore('tagCategory', () => {
  const tagList = ref([])
  const categoryList = ref([])
  async function getTagCategoryList() {
    try {
      const res: any = await httpRequest.get('picture/tag_category')
      categoryList.value = res.categoryList
      tagList.value = res.tagList
    } catch (error: any) {
      message.error(error)
    }
  }

  return { tagList, categoryList, getTagCategoryList }
})
