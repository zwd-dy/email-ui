import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function platformList () {
  return _axios({
    url: Vue.prototype.$PUBLIC_PATH + 'user/platform/listPlatform',
    method: 'get',
    responseType: 'json',
  })
}
