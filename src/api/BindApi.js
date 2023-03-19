import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function bindList () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'user/platform/bind/list',
    method: 'get',
    responseType: 'json',
  })
}

export function addBind (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'user/platform/bind',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function updateBind (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'user/platform/update',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function deleteBind (id) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'user/platform/remove/' + id,
    method: 'delete',
    responseType: 'json',
  })
}
