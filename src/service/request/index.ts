import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
  InternalAxiosRequestConfig,
} from 'axios'

interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean //控制是否显示加载状态
  cancelDuplicateRequest: boolean //是否取消重复请求
  retryCount?: number //请求重试次数
  retryDelay?: number //请求重试间隔 毫秒
  // 自定义请求key
  requestKey?: string
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 请求项
interface PendingRequest {
  url: string
  cancel: Canceler
  config: RequestConfig
}

// 请求缓存
interface RequestCache {
  [key: string]: AxiosResponse<ResponseData>
}

class HttpRequest {
  instance: AxiosInstance
  pendingRequests: PendingRequest[] = []
  loadingCount: number = 0
  requestCache: RequestCache = {}
  constructor(config: RequestConfig) {
    this.instance = axios.create(config)
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.handleRequestInterceptors(config as RequestConfig)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>): any => {
        return this.handleResponseInterceptors(response)
      },
      (error: AxiosError) => {
        return this.handleError(error)
      },
    )
  }
  private handleRequestInterceptors(config: RequestConfig) {
    // 处理取消重复请求
    if (config?.cancelDuplicateRequest) {
      this.removePendingRequest(config)
      this.addPendingRequest(config)
    }
    // 处理loading
    if (config?.showLoading) {
      this.showLoading()
    }
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }
  private handleResponseInterceptors(response: AxiosResponse<ResponseData>) {
    const config = response.config as RequestConfig
    // 请求完成后移除pending
    this.removePendingRequest(config)

    if (config?.showLoading) {
      this.hideLoading()
    }
    const { data } = response

    if (data.code !== 0) {
      return Promise.reject(data)
    }
    return data
  }
  private addPendingRequest(config: RequestConfig) {
    const key = this.generateRequestKey(config)
    // 创建CancelToken并存储cancel函数
    config.cancelToken = new axios.CancelToken((cancel) => {
      this.pendingRequests.push({
        url: key,
        cancel,
        config,
      })
    })
  }
  // 移除Pending请求
  private removePendingRequest(config: RequestConfig) {
    const key = this.generateRequestKey(config)
    const index = this.pendingRequests.findIndex((item) => item.url === key)
    if (index !== -1) {
      this.pendingRequests[index].cancel()
      this.pendingRequests.splice(index, 1)
    }
  }
  private generateRequestKey(config: RequestConfig) {
    const { method, url, params, data, requestKey } = config
    return requestKey || [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }
  private showLoading() {
    if (this.loadingCount === 0) {
      // 可调用UI添加加载样式
      console.log('show loading')
    }
    this.loadingCount++
  }
  private hideLoading() {
    this.loadingCount--
    if (this.loadingCount === 0) {
      console.log('hide loading')
    }
  }

  // 错误处理
  private async handleError(error: AxiosError) {
    const config = error.config as RequestConfig

    config && this.removePendingRequest(config)

    if (config?.showLoading) {
      this.hideLoading()
    }
    if (!error.response) {
      console.error('网络连接异常，请检查网络!')
      return Promise.reject(error)
    }
    // 处理网络错误

    // 处理HTTP状态码

    const { status } = error.response
    let message = ''
    switch (status) {
      case 400:
        message = '请求错误(400)'
        break
      case 401:
        message = '未授权，请重新登录(401)'
        // 这里可以跳转到登录页
        break
      case 403:
        message = '拒绝访问(403)'
        break
      case 404:
        message = '请求出错(404)'
        break
      case 408:
        message = '请求超时(408)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      case 501:
        message = '服务未实现(501)'
        break
      case 502:
        message = '网络错误(502)'
        break
      case 503:
        message = '服务不可用(503)'
        break
      case 504:
        message = '网络超时(504)'
        break
      case 505:
        message = 'HTTP版本不受支持(505)'
        break
      default:
        message = `连接出错(${status})!`
    }

    // 请求重试逻辑
    if (config?.retryCount && config?.retryCount > 0) {
      config.retryCount--
      const delay = config?.retryDelay || 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
      return this.instance(config)
    }

    // 如果是取消的请求，不处理
    if (axios.isCancel(error)) {
      console.log('请求被取消:', error.message)
      return Promise.reject(error)
    }

    // 这里可以调用UI框架的提示方法
    console.error(message)

    return Promise.reject(error)
  }

  // 通用请求
  request(config: any) {
    return new Promise(async (resolve, reject) => {
      const cacheKey = this.generateRequestKey(config)
      if (config.method?.toUpperCase() === 'GET' && this.requestCache[cacheKey]) {
        resolve(this.requestCache[cacheKey].data.data)
        return
      }
      try {
        const response = await this.instance.request(config)
        if (config.method?.toUpperCase() === 'GET') this.requestCache[cacheKey] = response

        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }

  get(url: string, params?: any, config?: RequestConfig) {
    return this.request({
      url,
      params,
      method: 'GET',
      ...config,
    })
  }

  post(url: string, data?: any, config?: RequestConfig) {
    return this.request({
      url,
      data,
      method: 'POST',
      ...config,
    })
  }
  put(url: string, data?: any, config?: RequestConfig) {
    return this.request({
      url,
      data,
      method: 'PUT',
      ...config,
    })
  }

  delete(url: string, params?: any, config?: RequestConfig) {
    return this.request({
      url,
      params,
      method: 'DELETE',
      ...config,
    })
  }

  // 取消所有Pending请求
  cancelAllRequest() {
    this.pendingRequests.forEach((item) => item.cancel())
    this.pendingRequests = []
  }

  // 取消指定Pending请求
  cancelRequest(config: RequestConfig) {
    const key = this.generateRequestKey(config)
    const index = this.pendingRequests.findIndex((item) => item.url === key)
    if (index !== -1) {
      this.pendingRequests[index].cancel()
      this.pendingRequests.splice(index, 1)
    }
  }

  // 清除请求缓存
  clearCache() {
    this.requestCache = {}
  }

  // 清除指定请求缓存
  clearCacheByKey(config: RequestConfig) {
    const key = this.generateRequestKey(config)
    delete this.requestCache[key]
  }
}

export default HttpRequest
