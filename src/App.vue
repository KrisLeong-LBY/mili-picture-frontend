<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { onMounted } from 'vue';
import httpRequest from './service';
onMounted(async () => {
  try {
    const res = await httpRequest.get('/health')
    console.log(res, 'sucdess');

  } catch (error) {
    // console.log(error, 'error');
  }
})
</script>

<template>
  <BasicLayout />
</template>

<style scoped></style>
