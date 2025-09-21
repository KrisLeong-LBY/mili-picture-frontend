<template>
  <div id="picture-upload">
    <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
      :before-upload="beforeUpload" :customRequest="onUpload">
      <img v-if="picture?.url" :src="picture?.url" :alt="picture?.name" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import httpRequest from '@/service';
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


const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const onUpload = async ({ file }: any) => {
  console.log(file);
  const formData = new FormData();
  formData.append('file', file);
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await httpRequest.post('/picture/upload', formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (res) {

      message.success('上传成功')
      // 可选链操作符?.表示如果onSuccess才去调用它
      props.onSuccess?.(res)
    }
    loading.value = false
  } catch (error: any) {
    message.error(error.message)
    loading.value = false

  }
};
const beforeUpload = (file: any) => {
  // 图片必须是jpg或png格式且不能超过2MB
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('不支持改格式的图片，推荐使用jpg或png');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('不支持上传超过2MB大小的图片');
  }
  return isJpgOrPng && isLt2M;
};
</script>
<style scoped>
#picture-upload {
  margin-bottom: 16px;
}

#picture-upload :deep(.avatar-uploader .ant-upload) {
  width: 100%;
  height: 100%;
  min-width: 152px;
  min-height: 152px;
}

.avatar-uploader img {
  width: 100%;
  max-height: 480px;
  /* cover - 保持宽高比，剪裁图片填充整个容器 */
  object-fit: cover;
}

.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
