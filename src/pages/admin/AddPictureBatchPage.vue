<template>
  <div id="add-picture-batch-page">
    <h2>批量创建图片</h2>

    <a-form :model="formData" layout="vertical" @finish="onSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
      </a-form-item>
      <a-form-item label="抓取数量" name="count">
        <a-input-number v-model:value="formData.count" :min="1" :max="30" placeholder="请输入数量"
          style="min-width: 100%;" />
      </a-form-item>

      <a-form-item label="图片名称前缀" name="namePrefix">
        <a-input v-model:value="formData.namePrefix" placeholder="请输入图片名称前缀，系统会根据前缀自动补充序号生成图片名称" />
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100%;" type="primary" html-type="submit" :loading="loading">执行任务</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import httpRequest from '@/service';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import router from '@/router';

interface FormState {
  searchText?: string,
  count: number,
  namePrefix?: string
}

const formData = reactive<FormState>({
  count: 10
});

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true

  try {
    const res = await httpRequest.post('/picture/upload/batch', { ...formData })
    if (res) {
      message.success(`批量上传成功，共${res}条`)
      router.push({
        path: '/',
      })
    }

  } catch (error: any) {
    message.error('批量上传失败，' + error.message)

  } finally {
    loading.value = false
  }
}

</script>
<style scoped>
#add-picture-batch-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
