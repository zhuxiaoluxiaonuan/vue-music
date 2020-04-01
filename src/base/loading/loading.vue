<template>
  <div class="loading">
    <div class="img"></div>
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在加载'
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .loading
    position: absolute
    top: 50%
    left 50%
    transform translate(-50%, -50%)
    text-align: center
    .img
      width 48px
      height 24px
      background url("./loading.gif") center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
