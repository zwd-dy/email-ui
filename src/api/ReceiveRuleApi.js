import _axios from '../axios/AxiosConfig'
import Vue from 'vue'


export function pageListRule (param) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/pageList',
    method: 'get',
    responseType: 'json',
    params: param
  })
}

export function addReceiveRule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/add',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}


export function updateReceiveRule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/update',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function delReceiveRule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/delete',
    method: 'delete',
    responseType: 'json',
    data: obj
  })
}

export function openReceiveRule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/open',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function closeReceiveRule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'rule/close',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}
