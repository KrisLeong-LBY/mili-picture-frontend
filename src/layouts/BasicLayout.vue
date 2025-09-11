<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">版权信息</a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';


</script>
<style scoped>
#basicLayout .header {
  padding-inline: 20px;
  background: #fff;
  margin-bottom: 16px;
}

#basicLayout .content {
  background: #fff;
  padding: 20px;
}
</style>
