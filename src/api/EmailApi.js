import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function sendMailApi (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/send',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function pageListEmail (param) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/pageList',
    method: 'get',
    responseType: 'json',
    params: param
  })
}

export function delMail (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/delete',
    method: 'delete',
    responseType: 'json',
    data: obj
  })
}
