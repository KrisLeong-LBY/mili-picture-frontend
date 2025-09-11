import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin/userManage',
      name: 'userManage',
      component: UserManagePage,
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: UserRegisterPage,
    },
  ],
})

export default router
