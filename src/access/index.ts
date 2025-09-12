import { useUserStore } from '@/stores/user'
import router from '@/router'
import { message } from 'ant-design-vue'
import ACCESS_ENUM from './accessEnum'
import checkAccess from './checkAccess'

// 防止每次切换路由都从远程获取用户信息，定义了 isFirstGetLoginUser 变量，用于控制只会在刷新页面后请求后端一次。
let isFirstGetLoginUser = true

router.beforeEach(async (to, from, next) => {
  // 必须保证 pinia 初始化在这段代码执行前，所以需要将 useLoginUserStore() 函数放到 router.beforeEach 参数里。
  const userStore = useUserStore()
  let userInfo = userStore.userInfo
  // 当页面刷新时(首次加载时) 等后端返回用户信息后再继续下面的逻辑  怪不得我每次刷新页面右上角的登录用户变成登录按钮了呢
  if (isFirstGetLoginUser) {
    await userStore.getUserInfo()
    userInfo = userStore.userInfo
    isFirstGetLoginUser = false
  }

  const needAccess = (to.meta?.access as any) ?? ACCESS_ENUM.NOT_LOGIN

  // 如果页面需要用户登录才能访问
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    if (!userInfo || !userInfo.userRole || userInfo.userRole === ACCESS_ENUM.NOT_LOGIN) {
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    // 如果用户已登录，但要访问的页面权限不足，那么跳转到无权限页面
    if (!checkAccess(userInfo, needAccess)) {
      next('/noAuth')
      return
    }
  }

  next()

  // 当页面刷新时(首次加载时) 等后端返回用户信息后再校验  怪不得我每次刷新页面右上角的登录用户变成登录按钮了呢
  // if (isFirstGetLoginUser) {
  //   await userStore.getUserInfo()
  //   userInfo = userStore.userInfo
  //   isFirstGetLoginUser = false
  // }
  // if (to.fullPath.startsWith('/admin')) {
  //   if (!userInfo.id || userInfo?.userRole !== 'admin') {
  //     message.error('无权限')
  //     next(`/user/login?redirect=${to.fullPath}`)
  //     return
  //   }
  // }
  // next()
})
