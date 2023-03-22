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


