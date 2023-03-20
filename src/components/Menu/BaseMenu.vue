<template>

  <q-scroll-area :visible="false" class="fit" :thumb-style="thumbStyleOfMenu">
    <div style="margin-left:0.5em;margin-top: 1rem">
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

export default {
  name: 'base-menu',
  components: {
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
      }
    }
  }
}
</script>
