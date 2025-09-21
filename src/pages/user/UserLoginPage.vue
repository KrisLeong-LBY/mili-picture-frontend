<template>
  <div id="userLoginPage">
    <h2 class="title">米粒云图库 - 用户登录</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formData" name="userLogin" class="userLoginForm" @finish="onSubmit">
      <!-- TODO添加表单验证规则 -->
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号!' }]">
        <a-input v-model:value="formData.userAccount" placeholder="请输入账号">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password v-model:value="formData.userPassword" placeholder="请输入密码">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <div class="tips">
        没有账号?
        <router-link to="/user/register" style="text-decoration: underline;">
          去注册
        </router-link>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="loginButton">
          登录
        </a-button>

      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import httpRequest from '@/service';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()

interface FormData {
  userAccount: string,
  userPassword: string
}
const formData = reactive<FormData>({
  userAccount: "",
  userPassword: ""
});

const userStore = useUserStore()
const onSubmit = async () => {
  try {
    const res: any = await httpRequest.post('/user/login', formData)
    if (res) {
      await userStore.getUserInfo()
      message.success('登录成功')
      const redirect: any = route.query?.redirect ?? '/'
      router.replace(redirect)
    }
  } catch (error: any) {//TODO统一定义error接口
    message.error('登录失败，' + error.message)

  }

};


</script>
<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  margin-bottom: 16px;
  text-align: center;
  color: #000;
}

.desc {
  margin-bottom: 16px;
  text-align: center;
  color: #bbb;
}

.tips {
  margin-bottom: 16px;
  text-align: right;
  font-size: 12px;
}

.loginButton {
  width: 100%;
}
</style>
