<template>

  <div class="flex justify-center items-center q-electron-drag" style="height: 100%">
    <div class="row base-card-shadow electron-hide" style="width: 60vw;min-width: 300px">
      <!--      <div class="col-6 flex justify-center items-center " v-show="$q.screen.gt.sm">-->
      <!--        <q-skeleton type="text" height="70%" width="50%" v-if="!isLottieF"/>-->
      <!--        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>-->
      <!--      </div>-->
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>
      <div class="col flex justify-center items-center">
        <q-card v-if="type == 0" square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">邮件收发系统</h3>
            <!-- 用户名 -->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 登录按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="logon"
            >登 录 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <!--              <q-btn flat label="忘记密码"/>-->
              <q-btn outline label="我要注册" @click="type = 1"/>
            </div>
          </q-card-section>
        </q-card>

        <!--        注册-->
        <q-card v-if="type == 1" square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">注册账号</h3>
            <q-form ref="registerForm">
              <!-- 用户名 -->
              <q-input class="logon-input"
                       clearable
                       filled
                       bottom-slots
                       v-model="register.sysUser.username"
                       label="用户名"
                       :rules="[ val => val && val.length > 2 || '用户名不能少于2个字符']"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle"/>
                </template>
              </q-input>
              <!-- 密码 -->
              <q-input class="logon-input"
                       filled
                       bottom-slots
                       v-model="register.password"
                       label="密码"
                       :type="isPwd ? 'password' : 'text'" hint=""
                       :rules="[ val => val && val.length >= 8 || '密码至少8位']"
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <!-- 确认密码 -->
              <q-input class="logon-input"
                       filled
                       bottom-slots
                       v-model="register.confirmPassword"
                       label="确认密码"
                       :type="isPwd ? 'password' : 'text'" hint=""
                       :rules="[ val => val && val == register.password || '密码不一致']"
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input class="logon-input"
                       ref="inputMail"
                       clearable
                       filled
                       bottom-slots
                       v-model="register.sysUser.email"
                       label="邮箱验证"
                       :rules="[ val => /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val) || '邮箱格式有误！' ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email"/>
                </template>
                <template v-slot:after>
                  <q-btn color="primary" :disable="!timeTrue" @click="getValidCode"
                         :label="timeTrue?'发送验证码':time+'后重试'"></q-btn>
                </template>
              </q-input>
              <q-input class="logon-input"
                       clearable
                       filled
                       bottom-slots
                       v-model="register.code"
                       label="验证码"
                       :rules="[ val => val && val.length > 0 || '请输入验证码']"
              >
                <template v-slot:prepend>
                  <q-icon name="code"/>
                </template>
              </q-input>


              <!-- 注册按钮 -->
              <q-btn
                :loading="loading"
                class="logon-btn bg-logon-card-input"
                text-color="white"
                unelevated
                label=""
                style="font-size: large;"
                @click="registerUser"
              >注 册
              </q-btn>
              <div class="row justify-between" style="margin-bottom: 20px;">
                <!--              <q-btn flat label="忘记密码"/>-->
                <q-btn outline label="已有账号，切换登录" @click="type = 0"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- electron 登录 -->
    <div class="row electron-only q-electron-drag"
         style="width: 100vw;min-width: 300px;background: rgba(255,255,255,0);">

      <div class="col flex justify-center items-center" v-show="$q.screen.gt.sm">
        <q-skeleton type="text" height="100%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>

      <div class="col flex justify-center items-center">

        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">email</h3>
            <!-- 用户名 -->
            <q-input class="logon-input q-electron-drag--exception"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input q-electron-drag--exception"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 登录按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="logon"
            >登 录 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn flat label="忘记密码"/>
              <q-btn outline label="我要注册"/>
            </div>
            <p class="text-grey" align="left">账号2 ：test &nbsp;&nbsp;&nbsp;&nbsp;密码均为空</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- electron end -->
  </div>

</template>

<script>
import LottieWebCimo from '../../components/LottieWebCimo/LottieWebCimo'
import { getValidCode, login, register } from '../../api/UserApi'
import { tagList } from 'src/api/TagApi'
import time from 'echarts/src/scale/Time'

export default {
  name: 'logon',
  components: { LottieWebCimo },
  data () {
    return {
      isPwd: true,
      username: '',
      password: '',
      register: {
        sysUser: {
          username: '',
          email: '',
        },
        username: '',
        password: '',
        confirmPassword:'',
        code: '',
      },
      password2: '',
      timeTrue: true,
      time: 0,
      defaultOptions: {
        path: 'https://assets9.lottiefiles.com/packages/lf20_vo0a1yca.json',
        loop: true
      },
      loading: false,
      percentage: 0,
      isLottieF: false,
      type: 0 //  0.登录  1.注册
    }
  },
  methods: {
    registerUser () {
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          this.register.password = this.$getRsaCode(this.register.password)
          this.register.confirmPassword = this.$getRsaCode(this.register.confirmPassword)
          register(this.register).then(res => {
            if (res.data.type == 'success') {
              this.$success('注册成功，请登录')
              this.type = 0
            } else {
              this.$error(res)
            }
          })
        }
      })

    },
    getValidCode () {
      if (this.register.sysUser.email==null) {
        this.$error('请输入邮箱')
        return
      }
      getValidCode(this.register.username, this.register.sysUser.email).then(res => {
        if (res.data.type == 'success') {
          this.$success('验证码已发送至邮箱')
          this.acquire()
        } else {
          this.$error(res)
        }
      })

    },
    acquire () {
      this.timeTrue = false
      this.time = 60
      var setTimeoutS = setInterval(() => {
        this.time--
        if (this.time <= 0) {
          clearInterval(setTimeoutS)
          this.timeTrue = true
        }
      }, 1000)
    },
    logon () {
      this.loading = !this.loading
      login({
        username: this.username,
        password: this.$getRsaCode(this.password)
      }).then(res => {
        if (res.data.type === 'success') {
          console.log('token', res.data.data.token)
          sessionStorage.setItem('access_token', res.data.data.token)
          sessionStorage.setItem('user_role', 'user')
          sessionStorage.setItem('user', JSON.stringify(res.data.data.user.user))
          // sessionStorage.setItem('username', this.username)
          const lt = setTimeout(() => {
            this.$router.push('/').then(e => {
              this.$q.notify({
                icon: 'insert_emoticon',
                message: this.username + '，欢迎回来',
                color: 'green',
                position: 'top',
                timeout: 1500
              })
              clearTimeout(lt)
              this.loading = !this.loading
              // 如果是 electron 则改变窗口大小
              if (process.env.MODE === 'electron') {
                this.$q.electron.remote.getCurrentWindow().setSize(1023, 768)
                this.$q.electron.remote.getCurrentWindow().center()
              }
            })
          }, Math.random() * 3000)
        } else {
          this.$q.notify({
            icon: 'announcement',
            message: '（' + res.data.code + '）' + res.data.message,
            color: 'red',
            position: 'top',
            timeout: 1500
          })
        }
      }).finally(e => {
        this.loading = !this.loading
      })
      // if (this.username === 'admin' || this.username === 'test') {
      //   sessionStorage.setItem('access_token', 972784674)
      //   sessionStorage.setItem('user_role', this.username)
      //   const lt = setTimeout(() => {
      //     this.$router.push('/').then(e => {
      //       this.$q.notify({
      //         icon: 'insert_emoticon',
      //         message: 'hi，cimo 欢迎回来',
      //         color: 'green',
      //         position: 'top',
      //         timeout: 1500
      //       })
      //       clearTimeout(lt)
      //       this.loading = !this.loading
      //       // 如果是 electron 则改变窗口大小
      //       if (process.env.MODE === 'electron') {
      //         this.$q.electron.remote.getCurrentWindow().setSize(1023, 768)
      //         this.$q.electron.remote.getCurrentWindow().center()
      //       }
      //     })
      //   }, Math.random() * 3000)
      // } else {
      //   this.loading = !this.loading
      //   this.$q.notify({
      //     icon: 'announcement',
      //     message: '账号错误',
      //     color: 'red',
      //     position: 'top',
      //     timeout: 1500
      //   })
      // }
    },
    handleFinish (e) {
      this.isLottieF = e
    },

  }
}
</script>

<style scoped>
.logon-btn {
  font-size: large;
  margin-top: 0px;
  margin-bottom: 20px;
  width: 100%;
}

.bg-logon-card-input {
  background: linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
  transition: all 0.3s ease-in-out;
  background-size: 200% auto;
}

.bg-logon-card-input:hover {
  background-position: right center;
  box-shadow: 0 12px 20px -11px #5b86e5;
}
</style>
