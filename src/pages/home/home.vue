<template>

  <base-content>
    <div class="container q-pa-lg q-col-gutter-md">
      <h2>你好，{{ user.username }}</h2>
      <h3>欢迎使用多邮件收发系统</h3>
      <h4>点击右上角头像 - 邮箱绑定，即刻体验</h4>
    </div>
  </base-content>

</template>

<script>
import countTo from 'vue-count-to'
import BaseContent from '../../components/BaseContent/BaseContent'
export default {
  name: 'home',
  components: {
    BaseContent,
    countTo
  },
  data () {
    return {
      user:{},
    }
  },
  methods: {
  },
  created () {
    this.user = JSON.parse(sessionStorage.getItem('user'))
  }
}
</script>
<style lang="css" scoped>

</style>
