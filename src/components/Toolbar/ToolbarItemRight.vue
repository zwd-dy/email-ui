<template>
  <div class="q-gutter-sm row items-center no-wrap q-electron-drag--exception">


    <!--    <q-btn round dense flat icon="message" v-if="$q.screen.gt.sm">-->
    <!--      <q-tooltip>消息</q-tooltip>-->
    <!--    </q-btn>-->
    <!--    <q-btn round dense flat icon="notifications">-->
    <!--      <q-badge color="red" text-color="" floating>-->
    <!--        2-->
    <!--      </q-badge>-->
    <!--      <q-tooltip>通知</q-tooltip>-->
    <!--    </q-btn>-->
    <q-btn round flat>
      <q-menu>
        <q-card flat bordered class="my-card" style="width: 20rem">
          <q-card-section>
            <div class="row q-col-gutter-xs">

              <div class="col-4">
                <q-avatar size="72px">
                  <img :src="this.$PUBLIC_PATH + 'data/avatar.jpg'">
                </q-avatar>
              </div>

              <div class="col" style="margin-top: 1.2em">
                <q-item-label>个人信息</q-item-label>
                <q-item-label caption>
                  {{ this.getUsername() }}
                </q-item-label>
              </div>
            </div>

          </q-card-section>

          <q-list bordered>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="account_circle"/>
              </q-item-section>
              <q-item-section>个人信息</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="attach_email"/>
              </q-item-section>
              <q-item-section @click="dialog.bind = true">邮箱绑定</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="logout">
              <q-item-section avatar>
                <q-icon name="logout"/>
              </q-item-section>
              <q-item-section>退出登录</q-item-section>
            </q-item>
          </q-list>


        </q-card>

      </q-menu>
      <!--      头像-->
      <q-avatar size="26px">
        <img :src="this.$PUBLIC_PATH + 'data/avatar.jpg'">
      </q-avatar>
      <q-tooltip>账号</q-tooltip>
    </q-btn>
    <div class="electron-only">
      <q-btn dense flat icon="minimize" @click="minimize"/>
      <q-btn dense flat :icon="isMaximize?'crop_square':'flip_to_front'" @click="maximize"/>
      <q-btn dense flat icon="close" @click="closeApp"/>
    </div>


    <q-dialog no-backdrop-dismiss v-model="dialog.bind">
          <email-bind
            v-if="dialog.bind"
          ></email-bind>
    </q-dialog>
  </div>




</template>

<script>
import EmailBind from 'components/common/EmailBind.vue'

export default {
  name: 'ToolbarItemRight',
  components: { EmailBind },
  data () {
    return {
      search: '',
      mobileData: false,
      bluetooth: true,
      isMaximize: true,
      dialog: {
        bind: false
      }
    }
  },
  methods: {
    getUsername () {
      return sessionStorage.getItem('username')
    },
    fullScreen () {
      if (this.$q.fullscreen.isActive) {
        // 退出全屏模式：
        this.$q.fullscreen.exit()
          .then(() => { // v1.5.0+
            // success!
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => { // v1.5.0+
            // oh, no!!!
          })
      } else {
        // 请求全屏模式：
        this.$q.fullscreen.request()
          .then(() => { // v1.5.0+
            // success!
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => { // v1.5.0+
            // oh, no!!!
          })
      }
    },

    logout () {
      this.$store.commit('LOGOUT')
      this.$router.push('/')
      window.sessionStorage.clear()
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.getCurrentWindow().setSize(500, 490)
        this.$q.electron.remote.getCurrentWindow().center()
      }
    },

    // electron
    minimize () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },

    maximize () {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()
        if (win.isMaximized()) {
          win.unmaximize()
          this.isMaximize = !this.isMaximize
        } else {
          win.maximize()
          this.isMaximize = !this.isMaximize
        }
      }
    },

    closeApp () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    }
  }
}
</script>
