<template>
  <q-dialog
    v-model="newMailDialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card v-if="currentEmail">
      <q-card-section style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);background: #d7e7f7">
        <!--              邮件操作按钮-->
        <q-btn style="float: right" icon="close" @click="newMailDialog = false;currentEmail=null" flat round dense/>
        <q-space/>
      </q-card-section>
      <q-scroll-area style="height: 50rem">

        <q-card-section style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);background: #fcfcfc">
          <p style="margin-left: 2rem;font-size: 2em;font-weight: bold">{{ currentEmail.subject }}</p>
          <p style="margin-left: 2rem">发件人：<b>{{ currentEmail.formName }}</b> {{
              '  <' + currentEmail.from + '>'
            }}</p>
          <p style="margin-left: 2rem">时间：{{ formatDetailTime(currentEmail.receiveTime) }}</p>
          <!--                <p style="margin-left: 2rem">收件人：{{ currentEmail.recipients[0] }}</p>-->
          <p style="margin-left: 2rem">收件人：{{ getBindEmail(currentEmail.bindId) }}</p>
        </q-card-section>

        <q-card-section style="margin-top: 2rem">
          <p v-html="currentEmail.content"></p>
        </q-card-section>

      </q-scroll-area>
    </q-card>

  </q-dialog>

</template>

<script>
import SocketService from 'src/utils/websocket'
import moment from 'moment/moment'

const instance = SocketService.Instance
let notif = undefined
instance.connect(JSON.parse(sessionStorage.getItem('user')).id)

export default {
  name: 'MailListener',
  data () {
    return {
      newMailDialog: false,
      pullDialog: false,
      pullMail: {
        total: 0,
        currentNum: 0,
        currentSubject: '',
      },
      currentEmail: null,
      binds: [],
    }
  },
  methods: {
    // 新邮件提醒
    newDate (data) {
      let res = JSON.parse(data)
      let type = res.type
      //新邮件提醒
      if (type == 1) {
        let mail = res.data
        this.$q.notify({
          progress: true,
          message: '[新邮件提醒] ' + mail.subject,
          color: 'grey-4',
          textColor: 'dark',
          icon: 'email',
          caption: mail.content.replace(/<[^<>]+>/g, '').substring(0, 170) + '...',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          position: 'bottom-right',
          actions: [
            {
              label: '查看',
              color: 'dark',
              handler: () => {
                this.newMailDialog = true
                this.currentEmail = mail
              }
            },
            {
              label: '关闭',
              color: 'dark',
              handler: () => { /* ... */
              }
            }
          ]
        })
      }
      // 邮件同步准备
      if (type == 4) {
        notif = this.$q.notify({
          group: false,
          timeout: 0,
          spinner: true,
          message: '正在准备同步邮件...',
          caption: '0%'
        })
      }
      // 邮件同步准备完毕，获取总量
      if (type == 5) {
        this.pullMail.total = res.data
        notif({
          caption: `${(this.pullMail.currentNum/this.pullMail.total*100).toFixed(0)}%`
        })
      }
      // 邮件同步中
      if (type == 2) {
        this.pullMail.currentSubject = res.data.subject
        this.pullMail.currentNum++
        notif({
          caption: `${(this.pullMail.currentNum/this.pullMail.total*100).toFixed(0)}%`,
          message: '(' + `${this.pullMail.currentNum}` + '/' + `${this.pullMail.total}` + ') \n 正在拉取邮件【' + `${this.pullMail.currentSubject.substring(0, 8) + '...'}%` + '】'
        })
      }
      // 邮件同步完成
      if (type == 3) {
        this.pullMail.currentNum=0
        this.pullMail.currentSubject=''
        this.pullMail.total=0
        notif({
          icon: 'done',
          spinner: false,
          message: '邮件同步完成,请到收件箱中刷新查看',
          timeout: 2500
        })
      }
    },
    formatDetailTime (m) {
      return moment(m).format('lll') + ' (' + moment(m).format('dddd') + ')'
    },
    // 获取绑定邮箱账号
    getBindEmail (id) {
      for (let i = 0; i < this.binds.length; i++) {
        if (this.binds[i].id == id) {
          return this.binds[i].emailUser
        }
      }
    },
  },
  created () {
    instance.registerCallBack(this.newDate)
  }
}
</script>

<style scoped>

</style>
