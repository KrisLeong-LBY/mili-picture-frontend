import HomePage from '../pages/HomePage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import NoAuthPage from '@/pages/noAuth/NoAuthPage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import AddPictureBatchPage from '@/pages/admin/AddPictureBatchPage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'

import ACCESS_ENUM from '@/access/accessEnum'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/admin/user-manage',
    name: 'userManage',
    component: UserManagePage,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/admin/picture-manage',
    name: 'pictureManage',
    component: PictureManagePage,
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
    path: '/no-auth',
    name: 'noAuth',
    component: NoAuthPage,
  },
  {
    path: '/add-picture',
    name: 'addPicture',
    component: AddPicturePage,
  },
  {
    path: '/add-picture/batch',
    name: 'addPictureBatch',
    component: AddPictureBatchPage,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/picture/:id',
    name: 'pictureDetail',
    component: PictureDetailPage,
  },
]

export default routes
