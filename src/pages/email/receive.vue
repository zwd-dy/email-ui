<template>
  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">

      <div class="row q-col-gutter-xs">
        <div class="row-4">
          <q-input dense filled v-model="search.from" label="发件人"/>
        </div>
        <div class="col-4">
          <q-input dense filled v-model="search.subject" label="主题"/>
        </div>
        <div class="col" style="margin-top: 3px;margin-left: 1em">
          <q-btn dense icon="search" @click="getDataList"/>
        </div>
      </div>

      <div class="q-pa-md">
        <div v-if="!isRead">
          <q-table
            class="email-list"
            title="邮件列表"
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
            <template v-slot:body-cell-from="props">
              <q-td :props="props" style="max-width: 7rem">
                <div>
                  {{ props.value }}
                  <q-badge v-for="item in props.row.tagIds" :key="item"
                           :style="{'background-color':getTagColor(tagList,item)}"
                           :label="getTagName(tagList,item)"/>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-subject="props">
              <q-td :props="props" style="max-width: 7rem">

                <div>
                  <q-icon v-if="props.row.isStar == 1" name="grade" color="amber-4" size="1.2rem"/>
                  {{ props.value }}
                </div>
              </q-td>
            </template>

            <template v-slot:top>

              <div class="q-col-gutter-sm">

                <div class="row">
                  <q-item-label style="margin-top: 1rem">
                    <p style="font-size: 1.6em">
                      <q-icon name="markunread_mailbox"/>
                      收件列表
                    </p>
                  </q-item-label>

                </div>

                <div class="row q-col-gutter-sm">

                  <!--                  删除按钮-->
                  <div class="row" v-if="selected.length > 0">
                    <q-btn color="red" :disable="loading" icon="delete" @click="delMail"/>
                  </div>
                  <!--                  添加到标签按钮-->
                  <div class="row" v-if="selected.length > 0">
                    <q-btn-dropdown ref="dropdownTag" color="white" text-color="black" label="添加到标签...">
                      <q-card class="my-card">
                        <q-card-section>
                          <div class="text-h6">选择标签</div>

                        </q-card-section>
                        <q-separator/>
                        <q-card-actions vertical>
                          <q-tree class="col-12 col-sm-6"
                                  :nodes="$global.tagList"
                                  :ticked.sync="selectedTag"
                                  node-key="id"
                                  tick-strategy="strict"
                          ></q-tree>
                        </q-card-actions>
                        <q-separator/>
                        <q-card-actions vertical>
                          <q-btn flat @click="delToTag">清除标签</q-btn>
                        </q-card-actions>

                        <q-separator/>

                        <q-card-actions align="right">
                          <q-btn flat v-close-popup>取消</q-btn>
                          <q-btn flat color="primary" @click="addToTag">确认</q-btn>
                        </q-card-actions>

                      </q-card>

                    </q-btn-dropdown>
                  </div>

                  <!--                  更多-->
                  <div class="row" v-if="selected.length > 0">
                    <q-btn color="white" text-color="black" icon="more_horiz">
                      <q-menu>
                        <q-list>
                          <q-item clickable v-close-popup @click="addStar()">
                            <q-item-section>
                              <q-item-label>添加星标</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item clickable v-close-popup @click="delStar()">
                            <q-item-section>
                              <q-item-label>清除星标</q-item-label>
                            </q-item-section>
                          </q-item>

                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>

                </div>

              </div>
              <q-space/>

              <q-btn color="white" text-color="black" :disable="loading" icon="refresh" @click="getTagsList"/>
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

        <!--        邮件详情-->
        <div v-else>
          <q-card>
            <q-card-section style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);background: #d7e7f7">
              <!--              邮件操作按钮-->
              <q-btn icon="keyboard_return" @click="isRead=false" flat round dense/>
              <!--              删除-->
              <q-btn style="margin-left: 2rem" icon="delete" @click="delOneMail(currentEmail)" flat round dense>
                <q-tooltip :offset="[10, 10]">
                  删除邮件
                </q-tooltip>
              </q-btn>
              <!--              添加到联系人-->
              <q-btn icon="add_ic_call" @click="addToContact(currentEmail)" flat round dense>
                <q-tooltip :offset="[10, 10]">
                  添加到联系人
                </q-tooltip>
              </q-btn>
              <!--              星标按钮-->
              <q-btn v-if="currentEmail.isStar != 1" icon="star_border" @click="addStar(currentEmail)" flat round dense>
                <q-tooltip :offset="[10, 10]">
                  添加星标
                </q-tooltip>
              </q-btn>
              <q-btn v-else color="amber-5" icon="grade" @click="delStar(currentEmail)" flat round dense>
                <q-tooltip :offset="[10, 10]">
                  清除星标
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
                <p style="margin-left: 2rem">收件人：{{ getBindEmail(currentEmail.bindId) }}</p>
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
import { pageListEmail, delMail, addToTag, delToTag, addStar, delStar } from 'src/api/EmailApi'
import moment from 'moment'
import BaseContent from 'components/BaseContent/BaseContent.vue'
import { bindList } from 'src/api/BindApi'
import { addContact } from 'src/api/ContactsApi'
import { tagList } from 'src/api/TagApi'

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
      selectedTag: [],
      tagList: [],
      searchTagId: null,
      currentEmail: {},
      search: {
        from: '',
        subject: ''
      },
      mail: {
        bindId: null
      },
      columns: [
        {
          name: 'from',
          required: true,
          label: '发件人',
          align: 'left',
          field: row => row.formName + '(' + row.from + ')',
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
          field: row => this.getBindEmail(row.bindId),
        }
        , {
          name: 'receiveTime',
          align: 'center',
          label: '收件时间',
          field: row => this.formatTime(row.receiveTime),
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
        type: 1,
        bindId: this.mail.bindId,
        tagIds: this.searchTagId,
      }, this.search)).then(res => {
        this.emailList = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
      }).finally(a => {
        this.loading = false
      })
    },
    // 添加到标签
    addToTag () {
      addToTag({
        mailList: this.selected,
        tagIds: this.selectedTag
      }).then(res => {
        if (res.data.type == 'success') {
          this.$success('添加到标签成功')
          this.selectedTag.length = 0
          this.getTagsList()
          this.$refs.dropdownTag.hide()
        } else {
          this.$error(res)
        }
      })
    },
    // 从标签中删除
    delToTag () {
      delToTag(this.selected).then(res => {
        if (res.data.type == 'success') {
          this.$success('操作成功')
          this.getDataList()
          this.$refs.dropdownTag.hide()
        } else {
          this.$error(res)
        }
      })
    },
    // 根据id获取标签名
    getTagName (list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i].label
        } else if (list[i].children && list[i].children.length > 0) {
          let res = this.getTagName(list[i].children, id)
          if (res) {
            return res
          }
        }
      }
    },
    // 根据id获取标签颜色
    getTagColor (list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i].color
        } else if (list[i].children && list[i].children.length > 0) {
          let res = this.getTagColor(list[i].children, id)
          if (res) {
            return res
          }
        }
      }
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
        message: '为 【' + item.from + '】 输入备注',
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
    // 为邮件添加星标
    addStar (item) {
      let value
      let arr = []
      if (item) {
        arr.push(item)
        value = arr
      } else {
        value = this.selected
        console.log(value)
      }
      addStar(value).then(res => {
        if (res.data.type == 'success') {
          this.$success('操作成功')
          this.getDataList()
          if (item) item.isStar = 1
        } else {
          this.$error(res)
        }
      })
    },
    // 为邮件清除星标
    delStar (item) {
      let value
      let arr = []
      if (item) {
        arr.push(item)
        value = arr
      } else {
        value = this.selected
      }
      delStar(value).then(res => {
        if (res.data.type == 'success') {
          this.$success('操作成功')
          this.getDataList()
          if (item) item.isStar = 0
        } else {
          this.$error(res)
        }
      })
    },
    getTagsList () {
      this.loading = true
      tagList().then(res => {
        if (res.data.type === 'success') {
          this.tagList = res.data.data.data
          this.getDataList()
        }
      })
    },
  },

  created () {
    moment.locale('zh-cn')
    let tagId = this.$route.hash.slice(1)
    if (tagId) {
      this.searchTagId = tagId
    }
    // this.tagList = this.$global.tagList
    this.getTagsList()
    this.getBindList()

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
