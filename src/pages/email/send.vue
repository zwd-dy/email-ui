<template>

  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">
      <div class="row q-col-gutter-md">

        <div class="col-8 q-col-gutter-y-md">
          <div class="row">
            <q-select
              v-model="mail.recipient"
              use-input
              use-chips
              multiple
              input-debounce="0"
              @new-value="createValue"
              style="width: 100%"
              label="收件人"
            />
          </div>

          <div class="row">
            <q-input v-model="mail.subject" label="主题" style="width: 100%"/>
          </div>

          <div class="row">
            <div style="border: 1px solid #ccc;">

              <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
            </div>
          </div>
        </div>

        <div class="col-3" style="margin: 0 auto;margin-top: 4em">
          <q-list dense bordered padding class="rounded-borders">
            <q-item clickable v-ripple>
              <q-item-section>
                Item
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                Item
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                Item
              </q-item-section>
            </q-item>
          </q-list>
        </div>


        <div class="row">
          <div class="row-lg q-gutter-sm">
            <q-select filled v-model="mail.from" :options="platForm" dense="true" label="选择发件邮箱" stack-label/>
            <q-btn icon="send" color="primary" label="发送"/>
            <q-btn icon="timer" color="white" text-color="black" label="定时发送"/>
            <q-btn icon="drafts" color="white" text-color="black" label="存草稿"/>
          </div>
        </div>
      </div>
    </div>


  </base-content>

</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import BaseContent from '../../components/BaseContent/BaseContent'

export default {
  name: 'send',
  components: {
    Editor,
    Toolbar,
    BaseContent
  },
  data () {
    return {
      mail: {
        recipient: null,
        subject: null,
        from: null
      },
      platForm: [],
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
    }
  },
  methods: {
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      console.log('key', this.editor.getAllMenuKeys())
      this.toolbarConfig = {
        excludeKeys: [
          'insertVideo',
          'uploadVideo',
          'group-video',
          'fullScreen',
          'numberedList',
        ]
      }
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
        this.mail.recipient = modelValue
        console.log(this.data)
      }
    },

  },
  mounted () {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>请输入内容</p>'
    }, 1500)
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 富文本组件销毁时，及时销毁编辑器
  }
}
</script>

<style>

div.card {
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
}

div.header {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 40px;
}

div.container {
  padding: 10px;
}

</style>
