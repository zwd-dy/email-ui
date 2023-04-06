<template>
  <q-card style="max-width: 50rem">
    <q-card-section class="row items-center">
      <div class="text-h6">邮箱绑定管理</div>
      <q-space/>
      <q-btn icon="close" flat round dense v-close-popup/>
    </q-card-section>
    <q-btn flat color="primary" size="md" label="+ 绑定" @click="bindBtn"/>

    <q-card-section class="content">
      <q-splitter
        v-model="splitterModel"
        style="height: 250px"
      >

        <template v-slot:before>
          <q-tabs
            v-model="tab"
            outside-arrows
            vertical
            no-caps
            class="text-teal"
          >

            <q-tab v-for="item in binds" :key="item.id" :name="item.id" :label="item.emailUser"/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >

            <q-tab-panel v-for="(item,i) in binds" :key="item.id" :name="item.id">

              <q-form
                ref="form"
              >
                <q-input filled v-model="binds[i].emailUser"
                         :rules="[ val => /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val) || '邮箱格式有误！' ]"
                         label="邮箱账号"/>
                <q-input filled v-model="binds[i].emailAuth" :rules="[ val => val && val.length > 0 || '请输入授权码']"
                         label="授权码"/>

                <div style="float: right">
                  <q-btn flat rounded color="black" label="取消" v-close-popup/>
                  <q-btn @click="unBindBtn(binds[i])" unelevated color="red" label="解绑" class="q-ml-sm"/>
                  <q-btn @click="pullMailBtn(binds[i])" unelevated color="blue-6" label="同步邮件" class="q-ml-sm"/>
                  <q-btn @click="updateBindBtn(binds[i])" unelevated color="primary" label="保存更改" class="q-ml-sm"/>
                </div>
              </q-form>

            </q-tab-panel>

          </q-tab-panels>

        </template>

      </q-splitter>
    </q-card-section>

    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />

    <q-dialog no-backdrop-dismiss v-model="dialog.bindDialog">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">绑定邮箱</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section class="my-content">
          <q-form
            ref="form"
            class="q-gutter-md"
          >

            <q-select v-model="addBind.platformId" :options="this.platForms" label="邮箱平台"
                      option-value="id"
                      option-label="name"
                      emit-value
                      map-options
                      :rules="[ val => val && val.length > 0 || '请选择邮箱平台']"
            >
              <template v-slot:prepend>
                <q-icon name="insert_link"/>
              </template>
            </q-select>

            <q-input dense v-model="addBind.emailUser" label="邮箱账号"
                     :rules="[ val => /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val) || '邮箱格式有误！' ]"
            >
              <template v-slot:prepend>
                <q-icon name="email"/>
              </template>
            </q-input>

            <q-input dense v-model="addBind.emailAuth" label="授权码"
                     :rules="[ val => val && val.length > 0 || '请输入授权码']">
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
            </q-input>

            <div style="float: right">
              <q-btn flat rounded color="black" label="取消" v-close-popup/>
              <q-btn @click="addBindBtn" unelevated rounded color="primary" label="确定" class="q-ml-sm"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
import { bindList, addBind, deleteBind, updateBind, pullMail } from 'src/api/BindApi'
import { platformList } from 'src/api/PlatformApi'
import { addContact, addGroup, batchDelContact } from 'src/api/ContactsApi'

export default {
  name: 'EmailBind',
  data () {
    return {
      tab: '',
      loading: false,
      splitterModel: 20,
      binds: [],
      platForms: [],
      dialog: {
        bindDialog: false
      },
      addBind: {
        emailUser: '',
        emailAuth: '',
        platformId: ''
      }
    }
  },
  methods: {
    getBindList () {
      this.loading = true
      bindList().then(res => {
        if (res.data.type === 'success') {
          this.binds = res.data.data
          if (this.binds.length > 0) {
            this.tab = this.binds[0].id
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getPlatformList () {
      platformList().then(res => {
        if (res.data.type === 'success') {
          this.platForms = res.data.data
        }
      })
    },
    bindBtn () {
      this.dialog.bindDialog = true
    },
    addBindBtn () {
      this.$refs.form.validate().then(success => {
        if (success) {
          addBind(this.addBind).then(res => {
            if (res.data.type === 'success') {
              this.$success('绑定成功')
              this.dialog.bindDialog = false
              this.getBindList()
            } else {
              this.$error(res)
            }
          })
        }
      })
    },
    // 解绑
    unBindBtn (bind) {
      this.$q.dialog({
        title: '提示',
        message: '解绑邮箱 ' + bind.emailUser + ' 吗？（解绑后系统帮你存储的邮件将全部删除，请慎重操作）',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        deleteBind(
          bind.id
        ).then(res => {
          if (res.data.type === 'success') {
            this.$success('解绑成功')
            this.getBindList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    updateBindBtn (bind) {
      updateBind(bind).then(res => {
        if (res.data.type === 'success') {
          this.$success('保存成功')
          this.getBindList()
        } else {
          this.$error(res)
        }
      })
    },
    // 同步邮件
    pullMailBtn(bind){
      this.$q.dialog({
        title: '提示',
        message: '同步邮箱账号 ' + bind.emailUser + ' 吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'black'
        }
      }).onOk(() => {
        pullMail(bind.id).then(res=>{
          if(res.data.type!='success'){
            this.$error(res)
          }
        })
      })

    }
  },
  created () {
    this.getBindList()
    this.getPlatformList()
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
