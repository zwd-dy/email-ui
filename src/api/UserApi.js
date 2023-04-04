import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function getUserRouter () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'data/asyncRouterDemo',
    method: 'get',
    responseType: 'text'
  })
}

export function login (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'auth/login',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function logout () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'auth/logout',
    method: 'delete',
    responseType: 'json',
  })
}

export function getValidCode (username,email) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'auth/getValidCode?username='+username+'&email='+email,
    method: 'get',
    responseType: 'text'
  })
}

export function register (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'auth/register',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}
