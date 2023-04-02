<template>
  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">

      <div class="q-pa-md">
        <div v-if="!isRead">
          <q-table
            class="email-list"
            title="定时发送"
            :data="emailList"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="id"
            :loading="loading"
            selection="multiple"
            @request="onRequest"
            :selected.sync="selected"
            color="blue-8"
            @row-click="readEmail"
          >
            <template v-slot:body-cell-sendState="props">
              <q-td :props="props">
                <div>
                  <q-badge :color="formatSendStateColor(props.row.sendState)" :label="props.value"/>
                </div>
              </q-td>
            </template>
            <template v-slot:top>

              <div class="q-col-gutter-sm">

                <div class="row">
                  <q-item-label style="margin-top: 1rem">
                    <p style="font-size: 1.6em">
                      <q-icon name="schedule"/>
                      定时发送
                    </p>
                  </q-item-label>
                </div>

                <div class="row q-col-gutter-sm">

                  <div class="row" v-if="selected.length == 1">
                    <q-btn color="green" :disable="loading" icon="schedule">
                      <q-tooltip :offset="[10, 10]">
                        更改发送时间
                      </q-tooltip>
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-card class="my-card">
                          <q-card-section>
                            <div class="text-h6">定时发送</div>
                            <div class="text-subtitle2">中国标准时间</div>
                            <div class="text-subtitle1">发送时间：<a
                              style="color: #2f80ed;font-weight: bold;font-size: 20px"> {{ sendTime }}</a></div>
                          </q-card-section>

                          <q-separator/>

                          <q-card-actions vertical>
                            <div class="row items-start">
                              <q-date square flat v-model="sendTime" :options="optionsFn" mask="YYYY-MM-DD HH:mm"/>
                              <q-time square flat v-model="sendTime" mask="YYYY-MM-DD HH:mm"/>
                            </div>
                          </q-card-actions>

                          <q-separator/>

                          <q-card-actions align="right">
                            <q-btn flat v-close-popup>取消</q-btn>
                            <q-btn flat color="primary" @click="updateCron">确认</q-btn>
                          </q-card-actions>

                        </q-card>
                      </q-popup-proxy>
                    </q-btn>
                  </div>

                  <div class="row" v-if="selected.length > 0">
                    <q-btn color="red" :disable="loading" icon="delete" @click="delMail"/>
                  </div>
                </div>


              </div>
              <q-space/>

              <q-select dense style="width: 12rem;" standout="bg-teal text-white" v-model="mail.bindId"
                        :options="binds"
                        label="选择邮箱..."
                        option-value="id"
                        option-label="emailUser"
                        emit-value
                        map-options
                        @input="getDataList"
              />

            </template>
            <!--            <template v-slot:top-right>-->

            <!--            </template>-->

          </q-table>
        </div>
        <div v-else>
          <q-card>
            <q-card-section style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);background: #d7e7f7">
              <!--              邮件操作按钮-->
              <q-btn icon="keyboard_return" @click="isRead=false" flat round dense/>
              <q-btn style="margin-left: 2rem" icon="delete" @click="delOneMail(currentEmail)" flat round dense>
                <q-tooltip :offset="[10, 10]">
                  删除定时邮件
                </q-tooltip>
              </q-btn>
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
                <p style="margin-left: 2rem">收件人：{{ formatRecipients(currentEmail.recipients) }}</p>
              </q-card-section>

              <q-card-section style="margin-top: 2rem">
                <p v-html="currentEmail.content"></p>
              </q-card-section>

            </q-scroll-area>
          </q-card>
        </div>

      </div>

    </div>

  </base-content>
</template>

<script>
import { pageListEmail, delMail, delScheduleMail, updateSchedule } from 'src/api/EmailApi'
import moment from 'moment'
import BaseContent from 'components/BaseContent/BaseContent.vue'
import { bindList } from 'src/api/BindApi'

export default {
  components: {
    BaseContent,
    pageListEmail
  },
  name: 'receive-mail',
  data () {
    return {
      isRead: false,
      loading: false,
      selected: [],
      emailList: [],
      currentEmail: {},
      mail: {
        bindId: null
      },
      columns: [
        {
          name: 'from',
          required: true,
          label: '发件人',
          align: 'left',
          field: 'from',
        },
        {
          name: 'subject',
          align: 'left',
          label: '主题',
          field: 'subject',
        }
        ,
        {
          name: 'bindId',
          align: 'left',
          label: '收件邮箱',
          field: row => this.formatRecipients(row.recipients),
        }
        ,
        {
          name: 'sendState',
          align: 'left',
          label: '发件状态',
          field: row => this.formatSendState(row.sendState),
        }
        , {
          name: 'receiveTime',
          align: 'center',
          label: '发件时间',
          field: row => this.formatTime(row.sendTime),
        }
      ],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      binds: [],
      sendTime: moment().format('YYYY-MM-DD HH:mm'),
    }
  },
  methods: {
    getDataList () {
      this.loading = true
      pageListEmail(Object.assign({
        pageNum: this.pagination.page,
        pageSize: this.pagination.rowsPerPage,
        type: 3,
        bindId: this.mail.bindId
      }, this.searchAddressBook)).then(res => {
        this.emailList = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
        this.selected.length = 0
      }).finally(a => {
        this.loading = false
      })
    },
    dateToUnix (date) {
      // date ("2023-04-05 13:14")
      return moment(date).format('x')
    },
    optionsFn (date) {
      return date >= moment().format('YYYY/MM/DD')
    },
    onRequest (props) {
      const {
        page,
        rowsPerPage,
        rowsNumber
      } = props.pagination
      // console.log(`获取page： ${page}  ${rowsPerPage}`)
      this.pagination.page = page
      if (rowsPerPage === 0) {
        // rowsPerPage 为0，表示一页显示全部数据
        this.pagination.rowsPerPage = rowsNumber
      } else {
        this.pagination.rowsPerPage = rowsPerPage
      }
      this.getDataList()
    },

    // 获取绑定邮箱账号
    getBindEmail (id) {
      for (let i = 0; i < this.binds.length; i++) {
        if (this.binds[i].id == id) {
          return this.binds[i].emailUser
        }
      }
    },
    formatTime (m) {
      return moment(m).calendar(null, {
        sameDay: '[今天] HH:mm',
        nextDay: '[明天] HH:mm',
        nextWeek: 'dddd',
        lastDay: '[昨天] HH:mm',
        lastWeek: '[上个] dddd',
        sameElse: 'DD/MM/YYYY'
      })
    },
    formatDetailTime (m) {
      return moment(m).format('lll') + ' (' + moment(m).format('dddd') + ')'
    },
    readEmail (evt, row) {
      this.currentEmail = row
      this.isRead = true
    },
    getBindList () {
      bindList().then(res => {
        if (res.data.type === 'success') {
          this.binds = res.data.data
          this.binds.unshift({
            id: null,
            emailUser: '所有'
          })
        }
      })
    },
    // 删除定时邮件
    delMail () {
      if (this.selected.length < 1) {
        return
      }
      this.$q.dialog({
        title: '提示',
        message: '确认删除选中的 ' + this.selected.length + ' 项定时邮件吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        delScheduleMail(
          this.selected
        ).then(res => {
          if (res.data.type === 'success') {
            this.$success('删除成功')
            this.getDataList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 删除单个定时邮件
    delOneMail (item) {
      let arr = []
      arr.push(item)
      this.$q.dialog({
        title: '提示',
        message: '删除定时邮件 【' + item.subject + '】 吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        delScheduleMail(
          arr
        ).then(res => {
          if (res.data.type === 'success') {
            this.$success('删除成功')
            this.getDataList()
            this.isRead = false
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 更改定时时间
    updateCron () {
      let now = Math.round(new Date())
      let send = this.dateToUnix(this.sendTime)
      if (send < now) {
        this.$errorStr('不能选择过去的时间！')
        return
      }

      if (this.selected.length > 0) {
        // 获取实例
        let mail = this.selected[0]
        mail.sendTime = send
        updateSchedule(mail).then(res => {
          if (res.data.type === 'success') {
            this.$success('已安排 ' + moment(Number(send)).calendar() + ' 发送该邮件')
            this.getDataList()
          } else {
            this.$error(res)
          }
        })
      }
    },
    formatRecipients (arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += ',' + arr[i]
      }

      return str.slice(1)
    },
    formatSendState (state) {
      console.log(state)
      if (state == 0) {
        return '已投递到对方邮箱'
      } else if (state == 1) {
        return '正在发送'
      } else if (state == 2) {
        return '发送失败'
      }
    },
    formatSendStateColor (state) {
      console.log(state)
      if (state == 0) {
        return 'green'
      } else if (state == 1) {
        return 'cyan'
      } else if (state == 2) {
        return 'red'
      }
    },

  },
  created () {
    moment.locale('zh-cn')
    this.getDataList()
    this.getBindList()
    console.log('params', this.$route.hash)
  }
}
</script>

<style lang="sass">

.email-list

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: rgba(100, 181, 246, 0.2)

  * tr:hover
    cursor: pointer
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.4)
    margin-top: 90px
    background-color: #fcfcff
    transition: all 0.2s

  tbody
    td:after
      background: rgba(100, 181, 246, 0.2)


.email-body
  //width: 50rem
  height: 50rem
  padding: 0.5rem
  box-sizing: border-box
  overflow: hidden

</style>
