<template>

  <div>
    <template v-for="(item,index) in tagData">

      <template>
        <!--没有孩子-->
        <q-item dense
                clickable
                v-ripple
                :key="index"
                :active="currentLabel == item.label"
                active-class="baseTagItemActive"
                :inset-level="initLevel"
                @click="select(item)"
        >

          <q-item-section top side>
            <div>
              <q-btn v-if="item.children.length>0" dense flat round size="10px" @click="expand(item)"
                     :icon="item.expand ? 'expand_more':'chevron_right'"/>
              <q-btn v-else style="visibility:hidden" dense flat round size="10px" icon=""/>
              <q-icon name="label" :style="{'color':item.color ? item.color : '#1976d2'}"/>
            </div>


          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>

          <q-item-section top side>
            <q-btn dense flat round size="12px" icon="more_vert">
              <q-menu>
                <q-list>
                  <q-item dense clickable v-close-popup @click="addChildrenTag(item.id,item.label)">
                    <q-item-section>
                      <q-item-label>添加标签</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item dense clickable v-close-popup @click="delTag(item)">
                    <q-item-section>
                      <q-item-label>删除标签</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item dense clickable v-close-popup @click="updateTag(item)">
                    <q-item-section>
                      <q-item-label>重命名</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item dense clickable>
                    <q-item-section>
                      <q-item-label>选择颜色</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right"/>
                    </q-item-section>
                    <q-menu anchor="top end" self="top start">
                      <q-card>
                        <q-color v-model="color" class="my-picker"/>
                        <q-separator/>
                        <q-card-actions align="right">
                          <q-btn flat color="primary" @click="updateTagColor(item,color)">确认</q-btn>
                        </q-card-actions>
                      </q-card>

                    </q-menu>
                  </q-item>


                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>

        </q-item>

        <!--        有children-->
        <base-tag-item v-if="item.children && item.expand"
                       :tag-data="item.children"
                       :init-level="initLevel + 0.2"
                       @changeTag="changeTag"
                       ref="childrenTags"
                       :current="currentLabel"
                       @addChildrenTag="addChildrenTag"
                       @delTag="delTag"
                       @updateTag="updateTag"
                       @updateTagColor="updateTagColor"
        />
      </template>

    </template>
  </div>

</template>

<script>
import { addTag } from 'src/api/TagApi'

export default {
  name: 'BaseTagItem',
  props: ['tagData', 'initLevel', 'current'],
  watch: {
    current () {
      this.currentLabel = this.current
    }
  },
  data () {
    return {
      currentLabel: '',
      color: null
    }
  },
  methods: {
    addChildrenTag (parentId, label) {
      this.$emit('addChildrenTag', parentId, label)
    },
    delTag (id) {
      this.$emit('delTag', id)
    },
    updateTag (item) {
      this.$emit('updateTag', item)
    },
    updateTagColor (item, color) {
      this.$emit('updateTagColor', item, color)
    },
    changeTag (item) {
      this.currentLabel = item.label
      this.$emit('changeTag', item)
    },
    select (item) {
      this.currentLabel = item.label
      this.$emit('changeTag', item)
    },
    expand (item) {
      for (let i = 0; i < this.tagData.length; i++) {
        if (this.tagData[i].id == item.id) {
          this.tagData[i].expand = !this.tagData[i].expand
          this.$forceUpdate()
        }
      }
    },
    getExpand (id) {
      for (let i = 0; i < this.tagData.length; i++) {
        console.log('get-id', this.tagData)
        if (this.tagData[i].id == id) {
          console.log('expand', this.tagData[i].expand)
          return this.tagData[i].expand
        }
      }
    }
  },
  components: {},
}
</script>

<style lang="sass">

/* item 被激活时的样式 */
.baseTagItemActive
  color: #4b5c6c !important
  background: #e1e3e1
  transition: all .618s

  &:after
    content: ''
    position: absolute
    width: 3px
    height: 100%
    top: -0.5px
    right: 0

</style>
