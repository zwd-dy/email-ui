<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <q-card style="max-width: 60rem">

    <q-bar>
      <q-item-label>新邮件</q-item-label>

      <q-space/>

      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="send-content">
      <q-scroll-area style="height: 40em; max-width: 48rem;">
        <q-form
          ref="form"
          class="q-gutter-md"
        >
          <q-select
            dense
            hide-dropdown-icon
            v-model="mail.recipients"
            use-input
            use-chips
            multiple
            input-debounce="0"
            @new-value="createValue"
            label="收件人"
            :rules="[ val => val && val.length > 0 || '请输入收件人邮箱，多个用小写;隔开，回车确认']"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="dialog.contactsList = true;getDataList();getGroupList()"/>
            </template>
          </q-select>

          <q-input dense v-model="mail.subject" label="主题" :rules="[ val => val && val.length > 0 || '请输入主题']"/>

          <q-uploader
            ref="uploader"
            :url="uploadPath"
            label="附件上传"
            color="grey-6"
            multiple
            bordered
            :headers="uploader.headers"
            field-name="file"
            @uploaded="uploadedFun"
            @removed="removeFun"
            style="width: 30em;"
          />

          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="mail.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />

        </q-form>
      </q-scroll-area>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row-lg q-gutter-sm">
        <q-select dense style="max-width: 12rem;" standout="bg-teal text-white" v-model="mail.bindId" :options="binds"
                  label="选择发件邮箱..."
                  option-value="id"
                  option-label="emailUser"
                  emit-value
                  map-options
                  :rules="[ val => val && val.length > 0 || '请选择发件邮箱']"
        />
        <q-btn @click="sendMailBtn" icon="send" color="primary" label="发送"/>
        <q-btn icon="timer" color="white" text-color="black" label="定时发送">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6">定时发送</div>
                <div class="text-subtitle2">中国标准时间</div>
                <div class="text-subtitle1">发送时间：<a style="color: #2f80ed;font-weight: bold;font-size: 20px"> {{ sendTime }}</a></div>
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
                <q-btn flat color="primary" @click="schedulerSendMail">确认</q-btn>
              </q-card-actions>

            </q-card>
          </q-popup-proxy>
        </q-btn>
        <q-btn @click="saveDraft" icon="drafts" color="white" text-color="black" label="存草稿"/>
      </div>
    </q-card-section>


    <!--    选择联系人模态窗口-->
    <q-dialog v-model="dialog.contactsList">
      <q-card style="max-width: 40rem;">
        <q-card-section class="row items-center">
          <div class="text-h6">选择联系人</div>

          <q-space/>
          <q-input dense standout="bg-teal text-white" v-model="searchAddressBook.name" input-class="text-left"
                   placeholder="搜索"
                   @input="getDataList"
                   debounce="1000"
                   class="q-ml-md">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-select dense style="max-width: 12rem;" standout="bg-teal text-white" v-model="groupId" :options="groupList"
                    label="选择分组..."
                    option-value="id"
                    option-label="name"
                    emit-value
                    map-options
                    @input="getDataList"
          />
        </q-card-section>

        <q-card-section class="contact-content">

          <q-table
            class="table-class"
            title="通讯录"
            :data="addressBooks"
            :columns="columns"
            row-key="id"
            :pagination.sync="pagination"
            @request="onRequest"
            selection="multiple"
            :loading="loading"
            :selected.sync="selected"
          >
          </q-table>

        </q-card-section>

        <q-card-section v-if="selected.length > 0">
          <q-btn @click="selectContacts" color="primary" label="插入"/>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-card>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { listAddressGroup, pageListContact } from 'src/api/ContactsApi'
import { bindList } from 'src/api/BindApi'
import Vue from 'vue'
import { saveMailDraft, scheduleMail, sendMailApi } from 'src/api/EmailApi'
import moment from 'moment'

export default {
  name: 'SendMail',
  props: {
    mailData: null,
    closeDialog: Function,
    refresh: Function
  },
  components: {
    Editor,
    Toolbar
  },
  data () {
    return {
      uploadPath: Vue.prototype.$baseURL + 'file/upload',
      mail: {
        recipients: null,
        subject: null,
        from: null,
        content: '<p>hello</p>',
        fileId: [],
      },
      uploadImgs: [],
      dialog: {
        contactsList: false
      },
      editor: null,
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {},
      },
      toolbarConfig: {},
      mode: 'default', // or 'simple'
      addressBooks: [],
      groupList: [],
      binds: [],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0,
      },
      groupId: null,
      columns: [
        {
          name: 'name',
          required: true,
          label: '名字',
          align: 'left',
          field: 'name'
        },
        {
          name: 'emailAddress',
          align: 'center',
          label: '邮箱',
          field: 'emailAddress',
        }
      ],
      selected: [],
      loading: false,
      searchAddressBook: {
        name: null
      },
      uploader: {
        headers: [{
          name: 'Authorization',
          value: sessionStorage.getItem('access_token')
        }]
      },
      sendTime: moment().format('YYYY-MM-DD HH:mm'),
    }
  },
  methods: {
    dateToUnix (date) {
      // date ("2023-04-05 13:14")
      return moment(date).format('x')
    },
    optionsFn (date) {
      return date >= moment().format('YYYY/MM/DD')
    },
    createValue (val, done) {
      if (val.length > 0) {
        const modelValue = [].slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            modelValue.push(v)
          })

        done(null)
        this.mail.recipients = modelValue
      }
    },

    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      this.toolbarConfig = {
        excludeKeys: [
          'insertVideo',
          'uploadVideo',
          'group-video',
          'fullScreen',
          'numberedList',
          'divider',
          'undo',
          'redo',
          'codeBlock',
          'todo',
          'lineHeight',
          'fontSize',
          'bulletedList',
          'insertTable',
          'bgColor',
          'insertLink',
          'color',
          'editImage'
        ],

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

    // 获取联系人列表
    getDataList () {
      this.loading = true
      pageListContact(Object.assign({
        pageNum: this.pagination.page,
        pageSize: this.pagination.rowsPerPage,
        groupId: this.groupId,
      }, this.searchAddressBook)).then(res => {
        this.addressBooks = res.data.data.pageData
        this.pagination.rowsNumber = res.data.data.totalNum
      }).finally(a => {
        this.loading = false
      })
    },

    // 获取分组列表
    getGroupList () {
      listAddressGroup().then(res => {
        this.groupList = res.data.data
        this.groupList.unshift({
          id: '',
          name: '全部'
        })
      })
    },

    // 获取绑定邮箱
    getBinds () {
      bindList().then(res => {
        if (res.data.type === 'success') {
          this.binds = res.data.data
        }
      })
    },

    selectContacts () {
      this.dialog.contactsList = false
      var val = ''
      this.selected.forEach(item => {
        val += ';' + item.emailAddress
      })

      if (val.length > 0) {
        const modelValue = [].slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            modelValue.push(v)
          })
        this.mail.recipients = modelValue
      }

    },
    uploadedFun (field) {
      var res = JSON.parse(field.xhr.response)
      console.log(res)
      if (res.type === 'success') {
        this.mail.fileId.push(res.data.id)
        console.log(this.$refs.uploader.uploadedFiles)
      } else {
        this.$error(res)
      }

    },
    removeFun (file) {
      var newFileId = []
      file.forEach(f => {
        var res = JSON.parse(f.xhr.response)
        console.log('file', res)
        for (let i = 0; i < this.mail.fileId.length; i++) {
          if (this.mail.fileId[i] != res.data.id) {
            newFileId.push(this.mail.fileId[i])
          }
        }
      })
      console.log(newFileId)
      this.mail.fileId = newFileId
    },

    // 发送邮件
    sendMailBtn () {
      this.sendMail()
    },
    // 定时发送邮件
    schedulerSendMail () {
      let now = Math.round(new Date())
      let send = this.dateToUnix(this.sendTime)
      if (send < now) {
        this.$errorStr('不能选择过去的时间！')
        return
      }

      this.mail.sendTime = send
      scheduleMail(this.mail).then(res => {
        if (res.data.type == 'success') {
          this.$success('已安排 ' + moment(Number(send)).calendar() + ' 发送该邮件')
          this.closeDialog()
          this.refresh()
        } else {
          this.$error(res)
        }
      })

    },
    // 构建发邮件请求
    sendMail () {
      sendMailApi(this.mail).then(res => {
        if (res.data.type == 'success') {
          this.$success('已加入发信队列')
          this.closeDialog()
          this.refresh()
        } else {
          this.$error(res)
        }
      })
    },
    saveDraft () {
      saveMailDraft(this.mail).then(res => {
        if (res.data.type == 'success') {
          this.$success('已保存草稿，请到草稿箱查看')
          this.closeDialog()
        } else {
          this.$error(res)
        }
      })
    }

  },
  created () {
    moment.locale('zh-cn')
    // 草稿打开
    if (this.mailData) {
      this.mail = this.mailData
    }
    let that = this
    this.getBinds()
    this.editorConfig.hoverbarKeys = {
      'image': {
        // 清空 image 元素的 hoverbar
        menuKeys: ['imageWidth30', 'imageWidth50', 'imageWidth100', 'deleteImage'],
      }
    }
    this.editorConfig.MENU_CONF['uploadImage'] = {
      server: Vue.prototype.$baseURL + 'file/upload',
      fieldName: 'file',

      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 3 * 1024 * 1024, // 3M

      headers: {
        Authorization: sessionStorage.getItem('access_token'),
      },

      customInsert (res, insertFn) {
        //TODO
        // var domain = location.href         // 正式环境
        var domain = 'http://localhost:8081/static' // 开发环境q
        var url = domain + res.data.relativePath

        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(url, res.data.id)
      },

      // 上传成功
      onSuccess (file, res) {
        var imgId = res.data.id
        // that.mail.imgFileId.push(imgId)
        // console.log("img",that.mail.imgFileId)
      },
      // 单个文件上传失败
      onFailed (file, res) {
        this.$error(res)
      },

    }
  }
}
</script>

<style lang="sass">

.send-content
  width: 48rem
  padding: 1rem
  box-sizing: border-box
  overflow: hidden

.contact-content
  width: 40rem
  padding: 0.5rem
  box-sizing: border-box
  overflow: hidden

</style>
