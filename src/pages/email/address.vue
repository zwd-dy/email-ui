<template>

  <base-content>

    <div class="container q-pa-lg q-col-gutter-md">

      <div class="row q-col-gutter-md">

        <div class="col-2 q-col-gutter-y-md">

          <div class="q-pa-md q-col-gutter-y-xs" style="max-width: 350px">
            <div class="row">
              <q-btn flat color="primary" size="md" label="+ 新建组" @click="addGroupBtn"/>
            </div>

            <div class="col">
              <q-card>
              <q-list dense bordered padding class="rounded-borders">

                <q-item
                  @click="onGroupClick(null)"
                  :active="groupId=='' || groupId == null"
                  clickable
                  v-ripple
                  active-class="group-link">
                  <q-item-section>
                    全部
                  </q-item-section>
                </q-item>

                <q-item
                  v-for="item in groupList"
                  @click="onGroupClick(item.id)"
                  :active="groupId == item.id"
                  :key="item.id"
                  active-class="group-link"
                  clickable
                  v-ripple>
                  <q-item-section>
                    {{ item.name }}
                  </q-item-section>
                </q-item>

              </q-list>
              </q-card>
            </div>

          </div>

        </div>

        <div class="col-10 q-col-gutter-y-md">
          <div class="q-pa-md">
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
              color="blue-7"
            >
              <template v-slot:body-cell-group="props">
                <q-td :props="props">
                  <q-badge v-if="props.value != undefined" color="primary" :label="props.value"/>
                </q-td>
              </template>
              <template v-slot:top>

                <div class="row q-col-gutter-sm">

                  <div class="row">
                    <q-btn color="primary" :disable="loading" icon="add" @click="dialog.addContact = true"/>
                  </div>
                  <div class="row">
                    <q-btn color="white" text-color="black" :disable="loading" icon="refresh" @click="getDataList"/>
                  </div>

                  <div class="row" v-if="selected.length > 0">
                    <q-btn color="red" :disable="loading" icon="delete" @click="delContactBtn"/>
                  </div>

                  <div class="row" v-if="selected.length > 0">
                    <q-btn-dropdown color="white" text-color="black" label="添加到分组...">
                      <q-list dense bordered padding class="rounded-borders">
                        <q-item v-for="item in groupList" :key="item.id" clickable v-close-popup
                                @click="addToGroup(item.id)">
                          <q-item-section>
                            <q-item-label>{{ item.name }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>


                </div>
                <q-space/>

                <q-input dense standout="bg-teal text-white" v-model="searchAddressBook.name" input-class="text-left"
                         placeholder="搜索"
                         debounce="1000"
                         @input="search"
                         class="q-ml-md">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </template>
            </q-table>
          </div>
        </div>

      </div>

    </div>

    <!--    模态窗口-->
    <!--    添加联系人窗口-->
    <q-dialog no-backdrop-dismiss v-model="dialog.addContact">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">添加联系人</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section class="my-content">
          <q-form
            ref="form"
            class="q-gutter-md"
          >
            <q-input dense filled v-model="addressBook.name" :rules="[ val => val && val.length > 0 || '请输入名字']"
                     label="名字"/>
            <q-input dense filled v-model="addressBook.emailAddress"
                     :rules="[ val => /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val) || '邮箱格式有误！' ]"
                     label="邮箱"/>

            <div style="float: right">
              <q-btn flat rounded color="black" label="取消" v-close-popup/>
              <q-btn @click="addContactBtn" unelevated rounded color="primary" label="确定" class="q-ml-sm"/>
            </div>
          </q-form>
        </q-card-section>


      </q-card>
    </q-dialog>

  </base-content>

</template>

<script>
import BaseContent from 'components/BaseContent/BaseContent.vue'
import {
  pageListContact,
  listAddressGroup,
  addContact,
  batchDelContact,
  batchAddToGroup,
  addGroup
} from 'src/api/ContactsApi'

export default {
  name: 'addressBook',
  components: { BaseContent },
  data () {
    return {
      groupId: null,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
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
        },
        {
          name: 'group',
          align: 'center',
          label: '分组',
          field: row => this.getGroupName(row.groupId),
        }
      ],
      loading: false,
      selected: [],
      addressBooks: [],
      groupList: [],
      searchAddressBook: {
        name: null
      },
      dialog: {
        addContact: false,
      },
      addressBook: {
        name: '',
        emailAddress: ''
      }
    }
  },
  methods: {
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
    getGroupList () {
      listAddressGroup().then(res => {
        this.groupList = res.data.data
      })
    },
    // 按名字搜索
    search() {
      this.getDataList()
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
    onGroupClick (groupId) {
      this.groupId = groupId
      this.getDataList()
      this.selected = []
    },

    addContactBtn () {
      // 数据验证
      this.$refs.form.validate().then(success => {
        if (success) {
          addContact({
            name: this.addressBook.name,
            emailAddress: this.addressBook.emailAddress,
            groupId: this.groupId
          }).then(res => {
            if (res.data.type === 'success') {
              this.$success('添加成功')
              this.$refs.form.reset()
              this.dialog.addContact = false
              this.getDataList()
            } else {
              this.$error(res)
            }
          })
        }
      })
    },

    delContactBtn () {
      if (this.selected.length < 1) {
        return
      }
      this.$q.dialog({
        title: '提示',
        message: '确认删除选中的 ' + this.selected.length + ' 项联系人吗？',
        cancel: true,
        persistent: true,
        ok: {
          flat: true,
          textColor: 'red'
        }
      }).onOk(() => {
        batchDelContact(
          this.selected
        ).then(res => {
          if (res.data.type === 'success') {
            this.$success('删除成功')
            this.getDataList()
          } else {
            this.$error(res)
          }
        })
      })
    },
    addToGroup (groupId) {
      batchAddToGroup(
        this.selected, groupId
      ).then(res => {
        if (res.data.type === 'success') {
          this.$success('操作成功')
          this.getDataList()
        } else {
          this.$error(res)
        }
      })
    },
    getGroupName (groupId) {
      for (let i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].id === groupId) {
          return this.groupList[i].name
        }
      }
    },

    addGroupBtn () {
      this.$q.dialog({
        title: '输入',
        message: '请输入分组名...',
        prompt: {
          model: '',
          type: 'text',
          isValid: val => val.length > 0
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        addGroup({
          name: data
        }).then(res => {
          if (res.data.type === 'success') {
            this.$success('添加成功')
            this.getGroupList()
          } else {
            this.$error(res)
          }
        })
      })
    }
  },
  created () {
    this.getGroupList()
    this.getDataList()
  },

}
</script>

<style lang="sass">
.group-link
  color: #1976d2
  background: #e6f1fc

.table-class
  td:nth-child(2)
    background-color: #c1f4cd !important

.my-content
  width: 30rem
  padding: 0.5rem
  box-sizing: border-box
  overflow: hidden

</style>
