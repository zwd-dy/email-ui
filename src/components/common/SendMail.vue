<template>
  <q-card style="max-width: 60rem">
    <q-bar>
      <q-item-label>新邮件</q-item-label>

      <q-space/>

      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="send-content">
      <q-form
        ref="form"
        class="q-gutter-md"
      >
        <q-select
          dense
          hide-dropdown-icon
          v-model="mail.recipient"
          use-input
          use-chips
          multiple
          input-debounce="0"
          @new-value="createValue"
          label="收件人"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="dialog.contactsList = true;getDataList();getGroupList()"/>
          </template>
        </q-select>

        <q-input dense v-model="mail.subject" label="主题"/>

        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />

      </q-form>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row-lg q-gutter-sm">
        <q-select dense style="max-width: 12rem;" standout="bg-teal text-white" v-model="mail.from" :options="binds"
                  label="选择发件邮箱..."
                  option-value="id"
                  option-label="emailUser"
                  emit-value
                  map-options
        />
        <q-btn icon="send" color="primary" label="发送"/>
        <q-btn icon="timer" color="white" text-color="black" label="定时发送"/>
        <q-btn icon="drafts" color="white" text-color="black" label="存草稿"/>
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

export default {
  name: 'SendMail',
  components: {
    Editor,
    Toolbar
  },
  data () {
    return {
      mail: {
        recipient: null,
        subject: null,
        from: null,
      },
      dialog: {
        contactsList: false
      },
      editor: null,
      html: '<p>hello</p>',
      editorConfig: { placeholder: '请输入内容...' },
      toolbarConfig: {},
      mode: 'default', // or 'simple'
      addressBooks: [],
      groupList: [],
      binds:[],
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
    }
  },
  methods: {
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
        this.mail.recipient = modelValue
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
          'color'
        ]
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
    getBinds(){
      bindList().then(res=>{
        if(res.data.type === 'success'){
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
      // this.mail.recipient = str
      if (val.length > 0) {
        const modelValue = [].slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            modelValue.push(v)
          })
        this.mail.recipient = modelValue
      }

    }
  },
  created () {
    this.getBinds()
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
