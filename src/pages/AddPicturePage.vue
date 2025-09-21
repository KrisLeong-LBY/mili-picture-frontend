<template>
  <div id="add-picture-page">
    <h2>{{ !route.query.id ? "创建图片" : "编辑图片" }}</h2>
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <!-- 图片上传成功后再显示图片表单 -->
    <a-form v-if="picture" :model="pictureForm" layout="vertical" @finish="onSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea :rows="4" v-model:value="pictureForm.introduction" />

      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-select v-model:value="pictureForm.category" :options="categoryOptions" show-search
          :filter-option="filterOption">
          <template #suffixIcon></template>
        </a-select>
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select v-model:value="pictureForm.tags" :options="tagOptions" mode="tags"></a-select>
      </a-form-item>

      <a-form-item>
        <a-button style="width: 100%;" type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue';
import httpRequest from '@/service';
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';

import { useTagCategoryStore } from '@/stores/tagCategory';
import { usePictureStore } from '@/stores/picture';

const route = useRoute()
const tagCategoryStore = useTagCategoryStore()
const pictureStore = usePictureStore()

// TODO把接口抽离出去
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

interface FormState {
  name: string,
  introduction: string,
  category: string,
  tags: string[]
}

const picture = ref<PictureVO>()

const pictureForm = reactive<FormState>({
  name: '',
  introduction: '',
  category: '',
  tags: []
});
const categoryOptions = ref<any>([])
const tagOptions = ref<any>([])

// const getTagCategoryOptions = async () => {
//   try {

//     const res: any = await httpRequest.get('picture/tag_category')
//     console.log(res, 'add');
//     categoryOptions.value = res.categoryList.map((value: any) => {
//       return { value }
//     })
//     tagOptions.value = res.tagList.map((value: any) => {
//       return { value }
//     })
//   } catch (error: any) {
//     message.error(error)
//   }
// }

const onSubmit = async () => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }
  try {
    const res = await httpRequest.post('/picture/edit', { id: pictureId, ...pictureForm })
    if (res) {
      message.success('上传成功')
      router.push({
        path: `/picture/${pictureId}`,
      })
    }

  } catch (error) {
    message.error('图片上传失败，' + error)

  }
}
const filterOption = (inputValue: string, option: any) => {
  console.log(inputValue, option);

  // 当输入搜索条件时 会根据选项个数循环调用这个函数将每一项跟这个搜索条件比对
  // 接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
  return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};

const onSuccess = (newPicture: PictureVO) => {
  picture.value = newPicture
  // 图片上传完之后 可以把图片信息填充到表单中
  pictureForm.name = newPicture.name
}



onMounted(() => {
  // getTagCategoryOptions()
  tagOptions.value = tagCategoryStore.tagList.map((value: any) => {
    return { value }
  })
  categoryOptions.value = tagCategoryStore.categoryList.map((value: any) => {
    return { value }
  })
  if (route.query.id) {
    const pictureInfo: any = pictureStore.picture
    picture.value = pictureInfo
    pictureForm.name = pictureInfo?.name as string
    pictureForm.introduction = pictureInfo?.introduction as string
    pictureForm.category = pictureInfo?.category as string
    pictureForm.tags = JSON.parse(pictureInfo?.tags ?? '[]')
    pictureStore.clearPicture()
  }


})
</script>
<style scoped>
#add-picture-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
