import ACCESS_ENUM from './accessEnum'
import { useUserStore } from '@/stores/user'

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */

export default function checkAccess(loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) {
  const userAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN

  if (needAccess === ACCESS_ENUM.USER) {
    if (userAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }

  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (userAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }
  return true
}
