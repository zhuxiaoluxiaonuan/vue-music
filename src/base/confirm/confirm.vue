<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="visible" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确认'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.confirm
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 998
  background-color $color-text-l
  &.confirm-fade-enter-active
    animation confirm-fade .3s
    .confirm-content
      animation confirm-zoom .3s
  .confirm-wrapper
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 999
    .confirm-content
      width 320px
      border-radius 8px
      background-color $color-background
      .text
        padding 30px 15px
        line-height 22px
        text-align center
        font-size $font-size-medium
        color $color-text-ll
      .operate
        display flex
        align-items center
        text-align center
        font-size $font-size-small
        .operate-btn
          flex 1
          line-height 22px
          padding 10px 0
          border-top 1px solid #f5f5f5
          color $color-text-ll
          &.left
            color $color-text-d
            border-right 1px solid #f5f5f5
  @keyframes confirm-fade
    0%
      opacity 0
    100%
      opacity 1
  @keyframes confirm-zoom
    0%
      transform scale(0.8)
    100%
      transform scale(1)
</style>
