<template>
  <div id="home-page">
    <div class="search-bar">
      <a-input-search v-model:value="queryParams.searchText" :pagination="pagination" :loading="loading"
        enter-button="搜索" placeholder="从海量图片中搜索" @search="handleSearch" />
    </div>
    <div class="category">
      <a-tabs v-model:activeKey="selectedCategory" @change="handleSearch">
        <!-- 为了可以实现 取消选中的分类  可以新增一个 “全部” 分类 -->
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
      </a-tabs>
    </div>
    <div class="tabs">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag v-for="(tag, index) in tagList" :key="tag" v-model:checked="selectedTagList[index]"
          @change="handleSearch">
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <div class="picture-list">
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :data-source="pictureList">
        <template #renderItem="{ item }">
          <a-list-item>
            <PictureCard :picture="item" />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script setup lang="ts">
// TODO 上滑加载更多
import { computed, onMounted, reactive, ref } from 'vue';

import PictureCard from '@/components/PictureCard.vue';
import httpRequest from '@/service';
import { message } from 'ant-design-vue';

import { useTagCategoryStore } from '@/stores/tagCategory';

const tagCategoryStore = useTagCategoryStore()

const selectedCategory = ref('all')
const categoryList = ref([])
const tagList = ref([])
const selectedTagList = ref([])

const pictureList = ref([])

const queryParams = reactive({
  current: 1,
  pageSize: 12,
  searchText: '',
  sortField: "createTime",
  sortOrder: "descend",
})
const total = ref(0)
const pagination = computed(() => {
  return {
    current: queryParams.current,
    pageSize: queryParams.pageSize,
    total: total.value,
    // 	页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
    // TODO并没有添加改变页码的逻辑  也就是说 只请求了第一页 可以添加上划加载更多功能
    onChange: (pageNum: any, pageSize: any) => {
      queryParams.current = pageNum
      queryParams.pageSize = pageSize
      getPictureList()
    }

  }
})
const loading = ref(false)

const getPictureList = async () => {
  loading.value = true
  const params = {
    ...queryParams,
    category: '',
    tags: []
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }

  selectedTagList.value.forEach((item, index) => {
    if (item) {
      params.tags.push(tagList.value[index])
    }
  })

  try {
    const res: any = await httpRequest.post('/picture/list/page/vo', params)
    console.log(res);
    pictureList.value = res.records
    total.value = res.total
  } catch (error: any) {
    message.error(error)
  } finally {
    loading.value = false
  }

}

// TODO 切换页面 分类标签获取失败

// const getTagCategoryOptions = async () => {
//   try {
//     const res: any = await httpRequest.get('picture/tag_category')
//     categoryList.value = res.categoryList
//     tagList.value = res.tagList
//   } catch (error: any) {
//     message.error(error)
//   }
// }

const handleSearch = () => {
  queryParams.current = 1
  getPictureList()
}



onMounted(() => {
  // getTagCategoryOptions()
  tagList.value = tagCategoryStore.tagList
  categoryList.value = tagCategoryStore.categoryList
  getPictureList()
})
</script>

<style scoped>
#home-page .search-bar {
  width: 80%;
  margin: 0 auto 8px;
}

:deep(.ant-list-item) {
  padding: 0;
}

.tabs {
  margin-bottom: 16px;
}
</style>
