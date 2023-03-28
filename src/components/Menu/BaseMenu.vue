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
      <q-separator />
      <q-tree
        class="my-tree"
        :nodes="simple"
        node-key="label"
        selected-color="primary"
        :selected.sync="selected"
        default-expand-all
        no-connectors
        @update:selected="test"
      >
        <template v-slot:default-header="props">
          <div>{{ props.node.label }}</div>
        </template>
      </q-tree>

    </div>

    <q-dialog no-backdrop-dismiss v-model="dialog.send">
      <send-mail></send-mail>
    </q-dialog>

    <receive-mail hidden="hidden" ref="receive"/>
  </q-scroll-area>
</template>

<script>
import { thumbStyleOfMenu } from '../BaseContent/ThumbStyle'
import BaseMenuItem from './BaseMenuItem'
import BottomLink from './BottomLink'
import SendMail from 'components/common/SendMail.vue'
import receive from 'pages/email/receive.vue'
import ReceiveMail from 'pages/email/receive.vue'
export default {
  name: 'base-menu',
  components: {
    ReceiveMail,
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
      simple: [
        {
          label: 'Relax Hotel',
          children: [
            {
              label: 'Food',
              icon: 'restaurant_menu'
            },
            {
              label: 'Room service',
              icon: 'room_service'
            },
            {
              label: 'Room view',
              icon: 'photo'
            }
          ]
        }
      ],
      selected:'Food',
    }
  },
  methods:{
    test(){
      this.$router.push({path:'/receive',query: { tagId:'231' }}).then(e => {
        // this.$refs.receive.test(this.selected)
        // this.$refs.receive.getDataList()
      })
    }
  }
}
</script>

<style lang="sass">
.my-tree::selection
    background-color: #FF6A95
</style>
