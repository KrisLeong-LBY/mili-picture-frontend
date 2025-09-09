<template>
  <div id="globalHeader">
    <a-row>
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.jpg" alt="logo" />
            <div class="title">米粒云图库</div>
          </div>
        </RouterLink>

      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="onClickMenu" />

      </a-col>
      <a-col flex="100px">
        <div class="user-login-status">
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { MenuProps } from 'ant-design-vue';
import router from '@/router';
const current = ref<string[]>(['/']);
const items = ref<MenuProps['items']>([
  {
    key: '/',
    label: '主页',
    title: '主页',
  },
  {
    key: '/personal',
    label: '个人空间',
    title: '个人空间',
  },
  {
    key: '/team',
    label: '团队协作',
    title: '团队协作',
  },
]);

const onClickMenu = ({ key }: { key: string }) => {
  router.push(key)
}
// 当刷新页面时 菜单不显示高亮
// 点击菜单时，Ant Design 组件已经通过 v-model 绑定 current 变量实现了高亮。
// 刷新页面时，路由并没有与current关联，current仍为页面初加载时的默认值，需要修改 current 变量的值为当前路由，从而实现高亮同步。
router.afterEach((to) => {
  current.value = [to.path]
})
</script>
<style>
.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
  margin-right: 12px;
  border-radius: 50%;
}

.title {
  color: transparent;
  font-size: 18px;
}
</style>
