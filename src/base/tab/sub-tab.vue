<template>
  <div class="tab">
    <cube-tab-bar v-model="selectedLabel"
                  :showSlider=true
                  ref="tabBar"
                  @click="changePage"
                  :data="tabs">
      <cube-tab v-for="item in tabs" :label="item.label" :key="item.label" ref="tab">
        <!-- 默认插槽 -->
        {{item.label}}
        <!-- name为icon的插槽 -->
        <span class="size">{{item.data.size}}</span>
      </cube-tab>
    </cube-tab-bar>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'sub-tab',
  props: {
    tabs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      index: 0,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      }
    }
  },
  methods: {
    changePage (current) {
      this.selectedLabel = current
      let currentIndex = 0
      this.tabs.forEach((item, index) => {
        if (item.label === current) {
          currentIndex = index
        }
      })
      this.setTabIndex(currentIndex)
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabBar.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabBar.setSliderTransform(deltaX)
    },
    ...mapMutations({
      setTabIndex: 'SET_TABINDEX'
    })
  },
  computed: {
    selectedLabel: {
      get() {
        return this.tabs[this.tabIndex].label
      },
      set(newVal) {
        this.setTabIndex(this.tabs.findIndex(item => item.label === newVal))
      }
    },
    ...mapGetters([ // 使用对象展开运算符将 getter 混入 computed 对象中
      'tabIndex'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  >>> .cube-tab-bar {
    margin 0 36px
  }
  >>> .cube-tab {
    height 30px
    line-height 30px
    color $color-text-l
    &.cube-tab_active{
      color $color-text
    }
  }
  >>> .cube-tab-bar-slider{
    background-color $color-theme
  }
  .size{
    font-size $font-size-small
  }
}
</style>
