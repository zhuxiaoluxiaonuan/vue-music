<template>
  <div class="tab">
    <cube-tab-bar v-model="selectedLabel"
                  :showSlider=true
                  ref="tabBar"
                  :data="tabs">
      <cube-tab v-for="item in tabs" :label="item.label" :key="item.label" ref="tab">
        <!-- 默认插槽 -->
        {{item.label}}
        <!-- name为icon的插槽 -->
        <span class="size" v-show="item.data.size">{{item.data.size}}</span>
      </cube-tab>
    </cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        ref="slide"
        :loop=false
        :initial-index="index"
        :auto-play=false
        :show-dots=false
        :options="slideOptions"
        @scroll="scroll"
        @change="changePage"
      >
        <cube-slide-item v-for="(item, index) in tabs" :key="index" ref="slideItem">
          <component :is="item.component" :data="item.data" ref="component"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'tab',
  props: {
    tabs: {
      type: Array,
      default () {
        return []
      }
    },
    minHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      }
    }
  },
  mounted() {
    this.changePage(this.index)
  },
  methods: {
    changePage (current) {
      this.selectedLabel = this.tabs[current].label
      // 调用子组件的fetch方法
      let component = this.$refs.component[current]
      let cHeight = component.$el.clientHeight
      component.fetch && component.fetch().then(() => {
        // 设置每个tab的高度
        this.$refs.component.forEach((item, index) => {
          if (index !== current) {
            let pHeight = item.$el.clientHeight
            let height = pHeight < cHeight ? pHeight : cHeight
            item.$el.style.height = height + 'px'
          }
        })
        component.$el.style.height = 'auto'
      })
      // 将最新的index值保存到state中
      this.setTabIndex(current)
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
        return this.tabs[this.index].label
      },
      set(newVal) {
        this.setTabIndex(this.tabs.findIndex(item => item.label === newVal))
      }
    },
    ...mapGetters({ // 使用对象展开运算符将 getter 混入 computed 对象中
      index: 'tabIndex'
    })
  },
  watch: {
    minHeight(newVal) {
      // 设置tab的最小高度，以便显示loading组件
      this.$refs.slideItem.forEach(item => {
        item.$el.childNodes[0].style.minHeight = newVal - 50 + 'px'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.tab {
  display flex
  flex-direction column
  height 100%
  >>> .cube-tab-bar {
    margin 0 36px
  }
  >>> .cube-tab {
    height 30px
    line-height 30px
    color $color-text-d
    &.cube-tab_active{
      color $color-text
    }
  }
  >>> .cube-tab-bar-slider{
    background-color $color-theme
  }
  >>> .cube-slide-group{
    white-space: initial
  }
  .slide-wrapper {
    flex: 1;
    overflow: hidden;
    height: 100%
  }
  .size{
    font-size $font-size-small
  }
}
</style>
