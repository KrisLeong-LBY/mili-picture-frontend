<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useTagCategoryStore } from './stores/tagCategory';
import { onMounted } from 'vue';

const tagCategoryStore = useTagCategoryStore()

onMounted(async () => {
  await tagCategoryStore.getTagCategoryList()
})

</script>

<template>
  <BasicLayout />
</template>

<style scoped></style>
