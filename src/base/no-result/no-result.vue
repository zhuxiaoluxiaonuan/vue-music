<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'no-result',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
@import "~common/stylus/mixin"
.no-result
  text-align center
  .no-result-icon
    width 32px
    height 32px
    margin 0 auto
    bg-image('./no-result')
    background-size 32px 32px
  .no-result-text
    margin-top 20px
    font-size $font-size-small-s
    color $color-text-d
</style>
