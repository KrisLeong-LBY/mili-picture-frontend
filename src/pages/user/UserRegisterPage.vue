<template>
  <div id="userRegisterPage">
    <h2 class="title">米粒云图库 - 用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formData" name="userRegister" class="userRegisterForm" @finish="onSubmit">
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
      <a-form-item name="checkPassword"
        :rules="[{ required: true, message: '请再次输入密码!' }, { validator, message: '密码输入不一致' }]">
        <a-input-password v-model:value="formData.checkPassword" placeholder="请再次输入密码">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <div class="tips">
        已有账号
        <router-link to="/user/login" style="text-decoration: underline;">
          去登录
        </router-link>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="registerButton">
          注册
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
import { useRouter } from 'vue-router';

const router = useRouter()

interface FormData {
  userAccount: string,
  userPassword: string,
  checkPassword: string
}
const formData = reactive<FormData>({
  userAccount: "",
  userPassword: "",
  checkPassword: ""
});

const userStore = useUserStore()
const onSubmit = async () => {
  try {
    const res: any = await httpRequest.post('/user/register', formData)

    if (res) {
      message.success('注册成功')
      router.replace('/user/login')
    }
  } catch (error: any) {//TODO统一定义error接口
    // 登录和注册成功的时候还是catch了为什么  我猜测是Axios封装的错误码与后端不一致导致的
    message.error('注册失败，' + error.message)

  }

};

const validator = async () => {
  if (formData.userPassword !== formData.checkPassword) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};


</script>
<style scoped>
#userRegisterPage {
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

.registerButton {
  width: 100%;
}
</style>
