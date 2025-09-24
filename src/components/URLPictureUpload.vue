<template>
  <div id="url-picture-upload">
    <a-input-group compact style="padding: 0 24px 16px;">
      <a-input v-model:value="fileURL" style="width: calc(100% - 100px)" />
      <a-button type="primary" :loading="loading" @click="onUnpload">提交</a-button>
    </a-input-group>
    <a-image v-if="picture?.url" :src="picture?.url" />
  </div>
</template>
<script setup lang="ts">
import httpRequest from '@/service';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

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
interface Props {
  picture?: PictureVO,
  onSuccess?: (newPicture: any) => void
}
const props = defineProps<Props>()

const fileURL = ref('')
const loading = ref(false)

const onUnpload = async () => {
  loading.value = true
  try {
    const params: any = { fileUrl: fileURL.value }
    if (props.picture?.id) {
      params.id = props.picture.id
    }
    const res = await httpRequest.post('/picture/upload/url', params)
    if (res) {

      message.success('上传成功')
      // 可选链操作符?.表示如果onSuccess存在才去调用它
      props.onSuccess?.(res)
    }

  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.ant-image {
  width: 100%;
  height: 100%;
  min-width: 152px;
  min-height: 152px;
}

.ant-image img {
  width: 100%;
  max-height: 480px;
  /* cover - 保持宽高比，剪裁图片填充整个容器 */
  object-fit: cover;
}
</style>
