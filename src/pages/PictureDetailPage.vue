<template>
  <div id="picture-detail-page">
    <a-row :gutter="[16, 16]">
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览" hoverable>
          <a-image :src="pictureURL" class="picture-preview" />

        </a-card>
      </a-col>
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片详情" :bordered="false">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <!-- <a-space>
                <a-avatar :src="">

                </a-avatar>
              </a-space> -->
              <a-space>
                <a-avatar :size="24" :src="pictureInfo?.user.userAvatar" />
                <div>{{ pictureInfo?.user.userName ?? '-' }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">{{ pictureInfo?.name ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="简介">{{ pictureInfo?.introduction ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="分类">{{ pictureInfo?.category ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag :bordered="false" color="processing" v-for="tag in pictureInfo?.tags" :key="tag">{{ tag }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">{{ pictureInfo?.picFormat ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽度">{{ pictureInfo?.picWidth ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="高度">{{ pictureInfo?.picHeight ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽高比">{{ pictureInfo?.picScale ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ pictureSizeFormat(pictureInfo?.picSize ?? 0) ?? '-' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-space>
            <a-button type="primary" @click="onDownload">
              立即下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button v-if="hasPermission" type="primary" ghost @click="onEdit">
              编辑
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
            <a-button v-if="hasPermission" type="primary" danger ghost @click="onDelete">
              删除
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">

import httpRequest from '@/service';
import { message } from 'ant-design-vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import pictureSizeFormat from '@/utils/pictureSizeFormat';
import downloadPicture from '@/utils/downloadPicture';
import { usePictureStore } from '@/stores/picture';


interface UserVO {
  id: number;
  userAccount: string;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: string;
  vipExpireTime: Date;
  vipCode: string;
  vipNumber: number;
  createTime: Date;
}
interface PictureVO {
  id: number;
  url: string;
  thumbnailUrl: string;
  name: string;
  introduction: string;
  tags: string[];
  category: string;
  picSize: number;
  picWidth: number;
  picHeight: number;
  picScale: number;
  picFormat: string;
  picColor: string;
  userId: number;
  spaceId: number;
  createTime: Date;
  editTime: Date;
  updateTime: Date;
  user: UserVO;
}


const pictureStore = usePictureStore()
const userStore = useUserStore()
const hasPermission = computed(() => {
  if (!userStore.userInfo.id) {
    // 未登录用户无法编辑或删除
    return false
  }
  // 只有管理员和图片创作者有权限操作
  return userStore.userInfo.id === pictureInfo.value?.user.id || userStore.userInfo.userRole === 'admin'
})

const route = useRoute()
const id = route.params.id
const pictureInfo = ref<PictureVO>()

const pictureURL = computed(() => {
  return pictureInfo.value?.url ?? 'https://www.antdv.com/#error'
})

const getPictureById = async () => {

  try {
    //  // 添加时间戳防止缓存  否则编辑图片之后回来不会发送该请求 图片信息全都没有   原因是封装Axios的时候 为了减少向服务器发送请求 发送get请求时使用了缓存机制
    const res: any = await httpRequest.get('/picture/get/vo', { id, _t: Date.now() })
    console.log(res);

    if (typeof res?.tags === 'string') {
      res.tags = JSON.parse(res.tags)
    }
    console.log(res);


    pictureInfo.value = res

  } catch (error) {
    message.error('图片加载失败，' + error)
  }
}

const onDownload = () => {
  downloadPicture(pictureInfo.value?.url)
}

const onEdit = async () => {
  pictureStore.setPicture(pictureInfo.value)
  router.push({
    path: `/add-picture`,
    query: {
      id
    }
  })
}

// TODO删除有问题
const onDelete = async () => {
  if (!id) {
    return
  }

  try {
    await httpRequest.post('/picture/delete', { id })
    message.success('删除成功')
  } catch (error: any) {
    message.error('删除失败，' + error.message)
  }

}

onMounted(async () => {
  await getPictureById()
})

</script>
<style scoped>
#picture-detail-page :deep(.ant-image) {
  width: 100%;
}

#picture-detail-page :deep(img) {
  width: 100%;
  max-height: 480px;
  /* cover - 保持宽高比，剪裁图片填充整个容器 */
  object-fit: cover;
}
</style>
