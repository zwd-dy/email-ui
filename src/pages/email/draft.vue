<template>
  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">

      <div class="q-pa-md">
          <q-table
            class="email-list"
            title="草稿箱"
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
            <template v-slot:top>

              <div class="q-col-gutter-sm">

                <div class="row">
                  <q-item-label style="margin-top: 1rem"><p style="font-size: 1.6em"><q-icon name="drafts"/>草稿箱</p></q-item-label>
                </div>
                <div class="row" v-if="selected.length > 0">
                  <q-btn color="red" :disable="loading" icon="delete" @click="delMail"/>
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
      </div>

    <q-dialog v-model="isRead">
      <send-mail v-if="isRead" :refresh="getDataList" :close-dialog="closeSendMailDialog" :mail-data="currentEmail"/>
    </q-dialog>

  </base-content>
</template>

<script>
import { pageListEmail, delMail } from 'src/api/EmailApi'
import moment from 'moment'
import BaseContent from 'components/BaseContent/BaseContent.vue'
import { bindList } from 'src/api/BindApi'
import { addContact } from 'src/api/ContactsApi'
import sendMail from 'components/common/SendMail.vue'
import SendMail from 'components/common/SendMail.vue'

export default {
  components: {
    SendMail,
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
    closeSendMailDialog(){
      this.isRead = false
    },
    getDataList () {
      this.loading = true
      pageListEmail(Object.assign({
        pageNum: this.pagination.page,
        pageSize: this.pagination.rowsPerPage,
        type: 2,
        bindId: this.mail.bindId
      }, this.searchAddressBook)).then(res => {
        this.emailList = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
      }).finally(a => {
        this.loading = false
      })
    },
    formatRecipients (arr) {
      let str = ''
      if(arr) {
        for (let i = 0; i < arr.length; i++) {
          str += ',' + arr[i]
        }
      }
      return str.slice(1)
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
        sameDay: '[今天] HH:MM',
        nextDay: '[明天] HH:MM',
        nextWeek: 'dddd',
        lastDay: '[昨天] HH:MM',
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
            this.selected.length = 0
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 删除单个邮件
    delOneMail (item) {
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
    // 将邮件发件人添加到联系人
    addToContact (item) {
      this.$q.dialog({
        title: '添加到联系人',
        message: '为 【'+item.from+"】 输入备注",
        prompt: {
          model: '',
          isValid: val => val.length > 1, // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        addContact({
          name: data,
          emailAddress: item.from,
        }).then(res => {
          if (res.data.type === 'success') {
            this.$success('添加成功')
          } else {
            this.$error(res)
          }
        })
      })
    },
    test () {

    }
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
