import HomeView from '../pages/HomeView.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import NoAuthPage from '@/pages/noAuth/NoAuthPage.vue'
import ACCESS_ENUM from '@/access/accessEnum'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin/userManage',
    name: 'userManage',
    component: UserManagePage,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
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
  {
    path: '/noAuth',
    name: 'noAuth',
    component: NoAuthPage,
  },
]

export default routes
