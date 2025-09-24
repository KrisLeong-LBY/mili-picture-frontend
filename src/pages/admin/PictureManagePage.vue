<template>
  <div id="picture-manage-page">
    <a-flex justify="space-between" style="margin-bottom: 12px;">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add-picture" target="_blank">
          <template #icon>
            <CloudUploadOutlined />
          </template>
          创建图片</a-button>
        <a-button type="primary" href="/add-picture/batch" target="_blank" ghost>
          <template #icon>
            <ImportOutlined />
          </template>
          批量创建图片</a-button>
      </a-space>
    </a-flex>
    <div class="searchBar">
      <a-form layout="inline" :model="queryParams" @finish="onSearch">
        <a-form-item label="关键词">
          <a-input v-model:value="queryParams.searchText" placeholder="输入账号">

          </a-input>
        </a-form-item>
        <a-form-item label="分类" name="category">
          <a-select v-model:value="queryParams.category" :options="categoryOptions" style="min-width: 180px"
            allow-clear>
            <template #suffixIcon></template>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select v-model:value="queryParams.tags" :options="tagOptions" mode="tags"
            style="min-width: 180px"></a-select>
        </a-form-item>
        <a-form-item label="审核状态" name="reviewStatus">
          <a-select v-model:value="queryParams.reviewStatus" :options="PIC_REVIEW_STATUS_OPTIONS"
            style="min-width: 180px" allow-clear>
            <template #suffixIcon></template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="pictureList" :pagination="pagination" @change="onTableChange"
      :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'pictureInfo'">
          <a-descriptions :column="1">
            <a-descriptions-item label="格式">{{ record?.picFormat ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽度">{{ record?.picWidth ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="高度">{{ record?.picHeight ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽高比">{{ record?.picScale ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ pictureSizeFormat(record?.picSize ?? 0) ?? '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </template>
        <template v-else-if="column.dataIndex === 'category'">
          <span>
            <a-tag color="#2db7f5">
              {{ record.category }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'tags'">
          <span>
            <a-tag v-for="tag in JSON.parse(record.tags ?? '[]')" :key="tag"
              :color="colors[Math.floor(Math.random() * colors.length)]" :bordered="false">
              {{ tag }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'reviewMessage'">
          <a-descriptions :column="1">
            <a-descriptions-item label="审核状态">
              <a-tag
                :color="record?.reviewStatus === 0 ? 'geekblue' : record?.reviewStatus === 1 ? 'green' : 'volcano'">
                {{ PIC_REVIEW_STATUS_MAP[record?.reviewStatus] }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="审核信息">{{ record?.reviewMessage ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="审核人">{{ record?.reviewerId ?? '-' }}</a-descriptions-item>
          </a-descriptions>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dateFormat(record.createTime) }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dateFormat(record.editTime) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <span>
            <a-button class="review-pass-btn" v-if="record?.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS" type="link"
              size="small" style="color:green" @click="onReview(record.id, PIC_REVIEW_STATUS_ENUM.PASS)">通过</a-button>
            <a-button class="review-reject-btn" v-if="record?.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link" size="small" @click="onReview(record.id, PIC_REVIEW_STATUS_ENUM.REJECT)">拒绝</a-button>
            <a-button type="link" size="small" @click="onEdit(record.id, record)">编辑</a-button>
            <a-button danger type="link" size="small" @click="onDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import httpRequest from '@/service';
import { computed, onMounted, reactive, ref } from 'vue';
import dateFormat from '@/utils/dateFormat'
import { message } from 'ant-design-vue';
import pictureSizeFormat from '@/utils/pictureSizeFormat';
import { useTagCategoryStore } from '@/stores/tagCategory';
import { usePictureStore } from '@/stores/picture';
import router from '@/router';
import { CloudUploadOutlined, ImportOutlined } from '@ant-design/icons-vue'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP, PIC_REVIEW_STATUS_OPTIONS } from '@/constants/picture';


const tagCategoryStore = useTagCategoryStore()
const pictureStore = usePictureStore()

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    width: 160
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'pictureInfo',
    width: 160
  },
  {
    title: '用户id',
    dataIndex: 'userId',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    width: 260
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'editTime',
  },

  {
    title: '操作',
    key: 'action',
  },
];

const pictureList = ref([]);
const total = ref(0)
const colors = ['processing', 'success', 'error', 'warning', 'green', 'cyan', 'purple', 'magenta', 'red', 'orange', 'volcano', 'gold', 'lime', 'blue', 'geekblue']


const queryParams = reactive({
  current: 1,  //当前页码
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
  searchText: '',
  category: '',
  tags: [],
  reviewStatus: ''
})

const tagOptions = ref<any>([])
const categoryOptions = ref<any>([])


const pagination = computed(() => {
  return {
    current: queryParams.current,
    pageSize: queryParams.pageSize,
    total: total.value, //指定这个属性 页数才会根据指定的total总数显示
    showSizeChanger: true,
    showTotal: () => `共 ${total.value} 条`

  }
})



const onSearch = () => {
  queryParams.current = 1
  getPictureList()
}
const onEdit = (id: string, picture: any) => {
  pictureStore.setPicture(picture)
  router.push({
    path: `/add-picture`,
    query: {
      id
    }
  })
}
const onDelete = async (id: string) => {
  if (!id) return
  try {
    const res = await httpRequest.post('/picture/delete', { id })
    if (res) {
      message.success('删除成功')
      getPictureList()
    }

  } catch (error: any) {
    message.error('删除失败，' + error.message)
  }
}
const onReview = async (pictureId: number, reviewStatus: number) => {
  const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作审核通过' : '管理员操作审核拒绝'
  try {
    await httpRequest.post('/picture/review', { id: pictureId, reviewStatus, reviewMessage })
    message.success('审核操作成功')
    getPictureList()
  } catch (error: any) {
    message.error('审核操作失败，' + error.message)
  }
}

const getPictureList = async () => {
  try {
    const res: any = await httpRequest.post('/picture/list/page', {
      ...queryParams,
    })
    pictureList.value = res.records
    total.value = Number(res.total)
  } catch (error) {
    console.log(error);

  }

}

const onTableChange = (page: any) => {
  queryParams.current = page.current
  queryParams.pageSize = page.pageSize
  getPictureList()
}

onMounted(() => {
  getPictureList()
  tagOptions.value = tagCategoryStore.tagList.map((value: any) => {
    return { value }
  })
  categoryOptions.value = tagCategoryStore.categoryList.map((value: any) => {
    return { value }
  })
})
</script>
<style scoped>
.searchBar {
  margin-bottom: 20px;
}

.review-pass-btn :deep(span) {
  color: #389e0d;
}

.review-reject-btn :deep(span) {
  color: #faad14;
}
</style>
