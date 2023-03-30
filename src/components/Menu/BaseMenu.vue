<template>

  <q-scroll-area :visible="false" class="fit" :thumb-style="thumbStyleOfMenu">
    <div style="margin-left:0.5em;margin-top: 1.3rem">
      <q-btn @click="dialog.send = true" style="background: #c2e7ff" rounded icon="drive_file_rename_outline" size="md"
             label="写邮件"/>
    </div>
    <div style="margin-top: 1rem">
      <!-- 动态菜单 -->

      <q-list>
        <base-menu-item
          :my-router="menuList"
          :init-level="0"
          :bg-color="bgColor"
          :duration="300"
          :bg-color-level="1"/>
      </q-list>

      <!-- 底部说明 -->
      <bottom-link/>
      <q-separator/>
      <div style="margin-top: 1em;margin-left: 2em">
        <div style="font-size: 17px">标签
          <q-btn @click="addTag" style="margin-bottom:0.3em;" size="13px" round flat icon="add"/>
        </div>
      </div>
      <q-list style="margin-top: 1em">
        <base-tag-item
          :tag-data="tagList"
          :init-level="0"
          @changeTag="changeTag"
          @addChildrenTag="addChildrenTag"
          @delTag="delTag"
          @updateTag="updateTag"
        />
      </q-list>


    </div>

    <q-dialog no-backdrop-dismiss v-model="dialog.send">
      <send-mail></send-mail>
    </q-dialog>

  </q-scroll-area>
</template>

<script>
import { thumbStyleOfMenu } from '../BaseContent/ThumbStyle'
import BaseMenuItem from './BaseMenuItem'
import BottomLink from './BottomLink'
import SendMail from 'components/common/SendMail.vue'
import receive from 'pages/email/receive.vue'
import { tagList, addTag, delTag, updateTag } from 'src/api/TagApi'
import BaseTagItem from 'components/Menu/BaseTagItem.vue'
import { batchDelContact } from 'src/api/ContactsApi'

export default {
  name: 'base-menu',
  components: {
    BaseTagItem,
    SendMail,
    BaseMenuItem,
    BottomLink
  },
  data () {
    return {
      menuList: this.$store.getters.getRoutes[0].children,
      bgColor: 'bg-white',
      thumbStyleOfMenu,
      dialog: {
        send: false
      },

      tagList: [],
      selected: '',
    }
  },
  methods: {
    // 标签被选择
    changeTag (item) {
      console.log(item.label)
      // 路由到收件箱
      this.$router.push({
        path: '/receive',
        hash: item.id
        // query: { tagId: item.id }
        // query: { tagId: item.id }
      }).then(e => {
        console.log(e)
        // this.$refs.receive.test(this.selected)
        // this.$refs.receive.getDataList()
      })

    },
    addTag () {
      this.$q.dialog({
        title: '添加标签',
        message: '请输入标签名，不可重复',
        prompt: {
          model: '',
          isValid: val => val.length > 1,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        addTag({
          parentId: '0',
          label: data
        }).then(res => {
          if (res.data.type === 'success') {
            this.$success('添加成功')
            this.getTagsList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 添加子标签
    addChildrenTag (parentId, label) {
      this.$q.dialog({
        title: '为标签【' + label + '】添加子标签',
        message: '请输入标签名，不可重复',
        prompt: {
          model: '',
          isValid: val => val.length > 1,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        addTag({
          parentId: parentId,
          label: data
        }).then(res => {
          if (res.data.type === 'success') {
            this.$success('添加成功')
            this.getTagsList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 删除标签
    delTag (item) {
      this.$q.dialog({
        title: '提示',
        message: '确认删除【 ' + item.label + '】标签吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        delTag(item.id).then(res => {
          if (res.data.type == 'success') {
            this.$success('删除成功')
            this.getTagsList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    // 更改标签
    updateTag (item) {
      this.$q.dialog({
        title: '重命名',
        message: '请输入名字',
        prompt: {
          model: item.label,
          isValid: val => val.length > 1, // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        item.label = data
        updateTag(item).then(res => {
          if(res.data.type == 'success'){
            this.$success("重命名成功")
            this.getTagsList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    getTagsList () {
      tagList().then(res => {
        if (res.data.type === 'success') {
          this.tagList = res.data.data.data
        }
      })
    },

  },
  created () {
    this.getTagsList()
  }
}
</script>

<style lang="sass">
.my-tree::selection
  background-color: #FF6A95
</style>
