/**
 * main boot file
 */
// import _router from '../router/permission'
import '../components/ECharts/EChartsConfig'
import '../components/Markdown/Markdown'
import '../quasar.manage.config'
import '../axios/FetchData'
import JSEncrypt from 'jsencrypt';
import { handleBaiduStatistics } from 'src/utils/CloneUtils'
import Vue from 'vue'

Vue.prototype.$getRsaCode = function(str){ // 注册方法
  let pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQem04yswDtFgXBdbuiJmb5lA5w4AAR2c3EqJ+vipO60nrLEaJMx2VAMtlb8Kw8ZIPvdpAW3g+5r/Jf3Lpm/Pldb+dpZFSED4s6E3VzYxkYhSc+qzC8DXVO66xPXgdAQIx7KRcOfxMytXFT7bHyA+rQ56it+/C+GKZ9QJCAoCTLwIDAQAB`;// ES6 模板字符串 引用 rsa 公钥
  let encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubKey); // 设置 加密公钥
  let  data = encryptStr.encrypt(str.toString());  // 进行加密
  return data;
}

Vue.prototype.$success = function (message){
  this.$q.notify({
    icon: 'insert_emoticon',
    message: message,
    color: 'green',
    position: 'top',
    timeout: 1500
  })
}

Vue.prototype.$error = function (res){
  this.$q.notify({
    icon: 'announcement',
    message: '（' + res.data.code + '）' + res.data.message,
    color: 'red',
    position: 'top',
    timeout: 1500
  })
}


// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app, router, Vue, publicPath }) => {
  handleBaiduStatistics()
}
