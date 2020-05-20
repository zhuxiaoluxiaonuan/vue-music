<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Cloud Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: 'm-header',
  methods: {
    goToLogin() {
      // 显示登录页面
      this.setUser({isShow: true})
    },
    ...mapMutations({
      'setUser': 'SET_USER'
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .m-header
    position: relative
    width: 100%
    height: 49px
    text-align: center
    color: $color-theme
    font-size: 0
    border-bottom: 1px solid $color-text-s
    .icon, .text
      display: inline-block
      vertical-align: top
    .icon
      margin-top: 10px
      margin-right: 10px
      width: 32px
      height: 32px
      bg-image('logo')
      background-size: 32px 32px
    .text
      height: 50px
      line-height: 50px
      font-size: $font-size-medium-x
    .mine
      position: absolute
      top: 0
      left: 0
    .icon-mine
      display: block
      padding: 16px
      font-size: 16px
      color: $color-theme
</style>
