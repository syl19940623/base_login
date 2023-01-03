import axios from "axios";
import store from '../store';
import { Message } from 'element-ui';

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  parent: '#app',
  showSpinner: false
});

// 错误code码，跳转至登录
const errorCodeArr = [4010001, 4010002]

const instance = axios.create({
  // 接口地址根路径
  baseURL: '/api',
  timeout: 60000
})

//请求前拦截
instance.interceptors.request.use(config => {
  if (process.env.VUE_APP_BASE_URL) {
    console.log(process.env)
  }
  NProgress.start()
  const saveAuthorization = store.state.token
  if (saveAuthorization) {
    config.headers.common['authorization'] = saveAuthorization
  }
  return config;
}, err => {
  
})

//请求后拦截
import Bus from '../utils/eventBus.js';
let msgBool = true
instance.interceptors.response.use(res => {
  NProgress.done()
  const responseHeaderToken = res.headers.refresh_token
  if (responseHeaderToken) {
    store.commit('saveToken', responseHeaderToken)
  }
  if (res.data) {
    let code = res.data.code;
    if (msgBool && errorCodeArr.includes(code)) {
      msgBool = false
      Message({
        message: res.data.msg,
        type: 'error',
        duration: 1500,
        onClose: () => {
          msgBool = true
          Bus.$emit('tokenFail', 'Token失效');
          top.location.href = 'login'
        }
      });
    }
  }
  return res.data;
}, error => {

})

export function get(url, params, headers) {
  let config = {}
  if (params) {
    config.params = params;
  }
  if (headers) {
    config.headers = headers;
  }
  return instance.get(url, config)
}

export function post(url, data, headers) {
  let config = {}
  if (headers) {
    config.headers = headers;
  }
  return instance.post(url, data, config)
}
