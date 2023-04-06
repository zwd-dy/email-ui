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

export function scheduleMail (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/schedule',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function saveMailDraft (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/save',
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

export function delScheduleMail (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/schedule/delete',
    method: 'delete',
    responseType: 'json',
    data: obj
  })
}

export function updateSchedule (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/schedule/update',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function addToTag (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/addToTag',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function delToTag (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/delToTag',
    method: 'delete',
    responseType: 'json',
    data: obj
  })
}

export function addStar (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/addStar',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

export function delStar (obj) {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'email/delStar',
    method: 'post',
    responseType: 'json',
    data: obj
  })
}

