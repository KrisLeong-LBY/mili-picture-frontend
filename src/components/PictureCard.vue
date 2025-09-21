<template>
  <div id="picture-card" @click="goPictureDetail(picture.id)">
    <a-card hoverable>
      <template #cover>
        <img style="height: 180px; object-fit: cover" :alt="picture.name" :src="picture.url" />
      </template>
      <a-card-meta :title="picture.name">
        <template #description>
          <a-flex>
            <a-tag color="#2db7f5">{{ picture.category || '默认' }}</a-tag>
            <a-tag v-for="tag in picture.tags" :key="tag" :bordered="false"
              :color="colors[Math.floor(Math.random() * colors.length)]">{{ tag }}</a-tag>
          </a-flex>
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

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
}
interface Props {
  picture: PictureVO
}

const props = defineProps<Props>()

const colors = ['processing', 'success', 'error', 'warning', 'green', 'cyan', 'purple', 'magenta', 'red', 'orange', 'volcano', 'gold', 'lime', 'blue', 'geekblue']

function goPictureDetail(id: any) {
  router.push(`/picture/${id}`)
}
</script>
<style></style>
