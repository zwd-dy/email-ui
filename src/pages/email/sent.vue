<template>
  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">

      <div class="q-pa-md">
        <div v-if="!isRead">
          <q-table
            class="email-list"
            title="已发送邮件"
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
                  <q-badge :color="formatSendStateColor(props.row.sendState)" :label="props.value" />
                </div>
              </q-td>
            </template>
            <template v-slot:top>

              <div class="q-col-gutter-sm">

                <div class="row">
                  <q-item-label style="margin-top: 1rem"><p style="font-size: 1.6em"><q-icon name="send"/>已发件</p></q-item-label>
                </div>
                <div class="row" v-if="selected.length > 0">
                  <q-btn color="red" :disable="loading" icon="delete" @click="delMail"/>
                </div>
              </div>
              <q-space/>

              <q-btn color="white" text-color="black" :disable="loading" icon="refresh" @click="getDataList"/>
              <q-select dense style="width: 12rem;margin-left: 1em" standout="bg-teal text-white" v-model="mail.bindId"
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
                  删除邮件
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
import { pageListEmail, delMail } from 'src/api/EmailApi'
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
          field: row =>  row.subject.length > 20 ? row.subject.substring(0,20)+"..." : row.subject,
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
      binds: []
    }
  },
  methods: {
    getDataList () {
      this.loading = true
      pageListEmail(Object.assign({
        pageNum: this.pagination.page,
        pageSize: this.pagination.rowsPerPage,
        type: 0,
        bindId: this.mail.bindId
      }, this.searchAddressBook)).then(res => {
        this.emailList = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
        this.selected.length = 0
      }).finally(a => {
        this.loading = false
      })
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
    delMail () {
      if (this.selected.length < 1) {
        return
      }
      this.$q.dialog({
        title: '提示',
        message: '确认删除选中的 ' + this.selected.length + ' 项邮箱吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        delMail(
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
    delOneMail(item) {
      let arr = []
      arr.push(item)
      this.$q.dialog({
        title: '提示',
        message: '删除邮件 【' + item.subject + '】 吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        delMail(
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
