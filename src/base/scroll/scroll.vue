<template>
  <div ref="wrapper" class="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  props: {
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    }, // 默认纵向滚动
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) { // listenScroll 是否监听滚动
        const _this = this
        this.scroll.on('scroll', pos => {
          _this.$emit('scroll', pos)
        })
      }
    },
    // 代理scroll的方法
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data(newVal) {
      setTimeout(() => {
        this.refresh()
        this.scrollToElement(this.$refs.wrapper.children[0].children[0], 0) // 每次切换列表都能回到最顶部
      }, this.refreshDelay)
    }
  } // 监听data，如果发生改变就手动刷新scroll
}
</script>

<style lang="stylus" scoped>
.wrapper
  height: 100%
  overflow: hidden
</style>
