import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function pageListContact (param) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/pageList',
    method: 'get',
    responseType: 'json',
    params: param
  })
}

export function listAddressGroup () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/group/list',
    method: 'get',
    responseType: 'json',
  })
}

export function addContact (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/addContact',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function batchDelContact (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/batchDelete',
    method: 'delete',
    responseType: 'json',
    data: obj
  })
}

export function batchAddToGroup (obj,groupId) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/batchAddToGroup/'+groupId,
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function addGroup (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'contacts/addGroup',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}
