import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function tagList () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'tag/list',
    method: 'get',
    responseType: 'json',
  })
}

export function addTag (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'tag/add',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function delTag (tagId) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'tag/delete/'+tagId,
    method: 'delete',
    responseType: 'json',
  })
}

export function updateTag (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'tag/update',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}
