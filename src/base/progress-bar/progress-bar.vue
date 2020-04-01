<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
              @touchstart.prevent="progressTouchStart"
              @touchmove.prevent="progressTouchMove"
              @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent('end') // 最后一次改变
    },
    progressClick(e) {
      // 点击进度条，跳转音乐
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent('end')
    },
    _triggerPercent(str) {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      if (str === 'end') {
        this.$emit('percentChangeEnd', percent)
      } else {
        this.$emit('percentChange', percent)
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newVal * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 14px
    height: 1px
    background $color-text-l
    .progress
      position: absolute
      height: 100%
      background: $color-text
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -14px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
