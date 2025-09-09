import HttpRequest from './request'
import { BASE_URL, TIME_OUT } from './config'

const httpRequest = new HttpRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  withCredentials: true,
  showLoading: true,
  cancelDuplicateRequest: true,
  retryCount: 0,
  retryDelay: 1000,
})

export default httpRequest
