<template>
  <q-card style="max-width: 50rem">
    <q-card-section class="row items-center">
      <div class="text-h6">收信规则</div>
      <q-space/>
      <q-btn icon="close" flat round dense v-close-popup/>
    </q-card-section>

    <div class="row" style="margin-left: 1em">
      <q-btn color="primary" :disable="loading" icon="add" @click="dialog.updateRule = true;isAdd = true;initAdd()"/>
    </div>

    <q-card-section class="content">
      <q-table
        class="email-list"
        title="规则列表"
        :data="ruleList"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        selection="multiple"
        @request="onRequest"
        :selected.sync="selected"
        color="blue-8"
        @row-click="updateRule"
      >
        <template v-slot:top>
          <div class="q-col-gutter-sm">

            <div class="row">
              <q-item-label style="margin-top: 1rem">
                <p style="font-size: 1.6em">
                  <q-icon name="rule"/>
                  规则列表
                </p>
              </q-item-label>
            </div>

            <div class="row q-col-gutter-sm">
              <!--                  删除按钮-->
              <div class="row" v-if="selected.length > 0">
                <q-btn color="red" :disable="loading" icon="delete" @click="delRule"/>
              </div>
              <!--              开启-->
              <div class="row" v-if="selected.length > 0">
                <q-btn color="primary" :disable="loading" @click="openRule">开启规则</q-btn>
              </div>
              <!--              关闭-->
              <div class="row" v-if="selected.length > 0">
                <q-btn color="white" text-color="black" :disable="loading" @click="closeRule">关闭规则</q-btn>
              </div>
            </div>

          </div>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="dialog.updateRule">
      <q-card style="max-width: 50rem">
        <q-card-section class="row items-center">
          <div class="text-h6">编辑规则</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-separator/>
        <q-card-section class="content">
          <q-form ref="form">
            <q-scroll-area style="height: 20rem">
              <div class="q-gutter-md" style="max-width: 300px">
                <q-input dense filled v-model="currentRule.describe" label="输入规则描述"/>
              </div>
              <div style="margin-top: 1em" class="col q-col-gutter-xs">

                <q-btn dense color="primary" @click="currentRule.conditions.push({})">+ 添加条件</q-btn>

                <div v-for="(item,index) in currentRule.conditions" :key="item.id" class="row q-col-gutter-xs">
                  <div class="col-1" style="margin-left: 2.5rem">
                    <q-btn @click="currentRule.conditions.splice(index,1)" round flat dense icon="remove"/>
                  </div>
                  <div class="col-2">
                    <q-select dense filled v-model="item.field" :options="fieldOptions" option-value="id"
                              option-label="desc" emit-value
                              map-options label="选择字段"/>
                  </div>
                  <div class="col-2">
                    <q-select dense filled v-model="item.judgeLogic" :options="logicOptions" option-value="id"
                              option-label="desc" emit-value
                              map-options label="选择条件"/>
                  </div>
                  <div class="col-6">
                    <q-input dense filled v-model="item.value" label="输入值"/>
                  </div>
                </div>
              </div>
            </q-scroll-area>
            <q-separator/>
            <q-card-section class="row items-center">
              <div class="text-h6">满足以上所有条件</div>
            </q-card-section>
            <q-card-section class="content">

              <q-btn dense color="primary" @click="currentRule.executes.push({})">+ 添加操作</q-btn>

              <div v-for="(item,index) in currentRule.executes" :key="item.id" class="row q-pa-xs q-col-gutter-xs">
                <div class="col-1" style="margin-left: 2.5rem">
                  <q-btn @click="currentRule.executes.splice(index,1)" round flat dense icon="remove"/>
                </div>
                <div class="col-3">
                  <q-select dense filled v-model="item.type" :options="executeOptions" option-value="id"
                            option-label="desc" emit-value
                            @input="executeInput(item)"
                            map-options label="选择操作"/>

                </div>
                <div class="col-3">
                  <q-btn-dropdown v-if="item.type == 'addTag'" ref="dropdownTag" color="white" text-color="black"
                                  :label="selectedTag.length<=0 ? '请选择标签' :'已选'+ selectedTag.length+'个标签'">
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

                    </q-card>

                  </q-btn-dropdown>
                  <div v-else-if="item.type == 'autoReply'">
                    <q-select dense style="max-width: 12rem;" standout="bg-teal text-white" v-model="replyParam.bindId"
                              :options="binds"
                              label="选择发件邮箱..."
                              option-value="id"
                              option-label="emailUser"
                              emit-value
                              map-options
                    />
                    <q-input
                      style="margin-top: 1px"
                      v-model="replyParam.content"
                      filled
                      type="textarea"
                      label="回复内容"
                    />

                  </div>

                </div>
              </div>
              <q-separator/>
              <q-card-actions align="right">
                <q-btn flat rounded color="black" label="取消" v-close-popup/>
                <q-btn v-if="!isAdd" @click="update" unelevated color="primary" label="保存更改" class="q-ml-sm"/>
                <q-btn v-else @click="add" unelevated color="primary" label="添加" class="q-ml-sm"/>
              </q-card-actions>

            </q-card-section>

          </q-form>
        </q-card-section>
      </q-card>

    </q-dialog>

  </q-card>
</template>

<script>
import { pageListEmail } from 'src/api/EmailApi'
import {
  addReceiveRule, closeReceiveRule,
  delReceiveRule,
  openReceiveRule,
  pageListRule,
  updateReceiveRule
} from 'src/api/ReceiveRuleApi'
import { bindList } from 'src/api/BindApi'

export default {
  name: 'ReceiveRule',
  data () {
    return {
      loading: false,
      selected: [],
      ruleList: [],
      tagList: [],
      selectedTag: [],
      binds: [],
      currentRule: {},
      isDelete: false,
      replyParam: {
        content: '',
        bindId: ''
      },
      dialog: {
        updateRule: false
      },
      isAdd: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      columns: [
        {
          name: 'describe',
          required: true,
          label: '描述',
          align: 'left',
          field: 'describe',
        },
        {
          name: 'condition',
          align: 'left',
          label: '条件量',
          field: row => row.conditions.length + ' 条',
        }
        ,
        {
          name: 'executes',
          align: 'left',
          label: '执行操作',
          field: row => row.executes.length + ' 条',
        }
      ],
      fieldOptions: [
        {
          id: 'subject',
          desc: '主题'
        },
        {
          id: 'from',
          desc: '发件人'
        },
        {
          id: 'recipients',
          desc: '收件人'
        },
        {
          id: 'content',
          desc: '邮件内容'
        }
      ],
      logicOptions: [
        {
          id: 0,
          desc: '包含'
        },
        {
          id: 1,
          desc: '不包含'
        }],
      executeOptions: [
        {
          id: 'addTag',
          desc: '添加到标签'
        },
        {
          id: 'AddStar',
          desc: '标注星标'
        },
        {
          id: 'autoReply',
          desc: '自动回复'
        }
      ]
    }
  },
  methods: {
    // 删除规则
    delRule () {
      delReceiveRule(this.selected).then(res => {
        if (res.data.type == 'success') {
          this.$success('删除成功')
          this.getDataList()
        } else {
          this.$error(res)
        }
      })
    },
    // 开启规则
    openRule(){
      openReceiveRule(this.selected).then(res => {
        if (res.data.type == 'success') {
          this.$success('开启成功')
          this.getDataList()
        } else {
          this.$error(res)
        }
      })
    },
    // 关闭规则
    closeRule(){
      closeReceiveRule(this.selected).then(res => {
        if (res.data.type == 'success') {
          this.$success('关闭成功')
          this.getDataList()
        } else {
          this.$error(res)
        }
      })
    },
    initAdd () {
      this.currentRule = {
        executes: [],
        conditions: []
      }
    },
    executeInput (item) {
      let count = 0
      for (let i = 0; i < this.currentRule.executes.length; i++) {
        if (this.currentRule.executes[i].type == item.type) {
          count++
        }
      }
      if (count > 1) {
        this.$errorStr('不可选择重复操作')
        item.type = ''
        return
      }
      if (item.type == 'addTag') {
        this.selectedTag = item.param.split(',')
      }
      if (item.type == 'autoReply') {
        if (item.param) {
          this.replyParam.content = item.param.content
          this.replyParam.bindId = item.param.bindId
        }
      }
    },
    foreachSelectedTag () {
      let str = ''
      for (let i = 0; i < this.selectedTag.length; i++) {
        str += this.selectedTag[i]
      }
      return str
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
    getDataList () {
      this.loading = true
      pageListRule(Object.assign({
        pageNum: this.pagination.page,
        pageSize: this.pagination.rowsPerPage,
      })).then(res => {
        this.ruleList = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
      }).finally(a => {
        this.loading = false
      })
    },
    updateRule (evt, row) {
      this.isAdd = false
      this.currentRule = row
      for (let i = 0; i < this.currentRule.executes.length; i++) {
        if (this.currentRule.executes[i].type == 'addTag') {
          this.selectedTag = this.currentRule.executes[i].param.split(',')
        }
        if (this.currentRule.executes[i].type == 'autoReply') {
          this.replyParam = this.currentRule.executes[i].param
        }
      }
      this.dialog.updateRule = true
    },
    // 获取绑定邮箱
    getBinds () {
      bindList().then(res => {
        if (res.data.type === 'success') {
          this.binds = res.data.data
        }
      })
    },
    // 更新规则
    update () {
      if (!this.currentRule.describe) {
        this.$errorStr('请输入描述！')
        return
      }
      for (let i = 0; i < this.currentRule.executes.length; i++) {
        let execute = this.currentRule.executes[i]
        if (execute.type == 'addTag') {
          execute.param = this.selectedTag.join(',')
        } else if (execute.type == 'autoReply') {
          execute.param = {
            content: this.replyParam.content,
            bindId: this.replyParam.bindId
          }
        }
      }
      console.log(this.currentRule)
      updateReceiveRule(this.currentRule).then(res => {
        if (res.data.type == 'success') {
          this.$success('更改成功')
          this.getDataList()
          this.dialog.updateRule = false

        } else {
          this.$error(res)
        }
      })
    },
    add () {
      if (!this.currentRule.describe) {
        this.$errorStr('请输入描述！')
        return
      }
      for (let i = 0; i < this.currentRule.executes.length; i++) {
        let execute = this.currentRule.executes[i]
        if (execute.type == 'addTag') {
          execute.param = this.selectedTag.join(',')
        } else if (execute.type == 'autoReply') {
          execute.param = {
            content: this.replyParam.content,
            bindId: this.replyParam.bindId
          }
        }
      }
      console.log(this.currentRule)
      addReceiveRule(this.currentRule).then(res => {
        if (res.data.type == 'success') {
          this.$success('添加成功')
          this.getDataList()
          this.dialog.updateRule = false
          this.isAdd = false
        } else {
          this.$error(res)
        }
      })
    }
  },
  created () {
    this.getDataList()
    this.getBinds()
  }
}
</script>

<style lang="sass">

.content
  width: 50rem
  padding: 0.5rem
  box-sizing: border-box
  overflow: hidden

.my-content
  width: 30rem
  padding: 0.5rem
  box-sizing: border-box
  overflow: hidden

</style>
