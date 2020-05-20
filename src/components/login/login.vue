<template>
  <div v-show="user.isShow" class="login">
    <div class="top">
      <div class="theme">
        <div class="icon"></div>
        <span>Cloud Music</span>
      </div>
      <div class="sub-theme">
        <span>让</span>
        <span>生</span>
        <span>活</span>
        <span>充</span>
        <span>满</span>
        <span>音</span>
        <span>乐</span>
      </div>
    </div>
    <div class="bottom">
      <div class="button">
        <div class="login-button" @click="phoneLogin">手机号登录</div>
        <div class="tourist-button" @click="touristLogin">立即体验</div>
      </div>
      <div class="other-login">
        <div class="other-item"></div>
        <div class="other-item"></div>
        <div class="other-item"></div>
        <div class="other-item"></div>
      </div>
      <div class="agreement">
        <cube-checkbox v-model="checked" shape="square" :hollow-style="true">
          同意《用户许可协议》《Cloud Music隐私政策》
        </cube-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'login',
  data() {
    return {
      checked: false
    }
  },
  methods: {
    phoneLogin() {
      if (!this.isChecked()) return
      this.checked = false // 将下方复选框置为false
      this.phoneLoginComp = this.phoneLoginComp || this.$createPhoneLogin()
      this.phoneLoginComp.show()
    },
    touristLogin() {
      if (!this.isChecked()) return
      this.checked = false // 将下方复选框置为false
      this.setUser({
        isShow: false
      })
    },
    isChecked() {
      if (!this.checked) {
        this.showToastType()
        return false
      }
      return true
    },
    showToastType() {
      const toast = this.$createToast({
        time: 800,
        txt: '请先勾选页面下方的协议',
        type: 'warn'
      })
      toast.show()
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
@import "~common/stylus/mixin"
.login
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-text
  z-index 200
  .top
    position absolute
    top 80px
    left 50%
    margin-left -110px
    width 220px
    color $color-background
    .theme
      display flex
      align-items center
      .icon
        margin-right 5px
        width 56px
        height 56px
        bg-image('login')
        background-size 56px 56px
      span
        font-size 28px
    .sub-theme
      display flex
      justify-content space-around
      font-size $font-size-small
      color $color-background-ll
  .bottom
    position absolute
    bottom 10px
    left 0
    right 0
    margin 0 auto
    width 80%
    .button
      .login-button, .tourist-button
        height 40px
        line-height 40px
        border-radius 20px
        font-size $font-size-medium
        text-align center
      .login-button
        margin-bottom 10px
        background-color $color-background
        color $color-text
      .tourist-button
        border 1px solid $color-background-l
        color $color-background
    .other-login
      margin-top 30px
      display flex
      justify-content space-around
      .other-item
        flex 0 32px
        height 32px
        &:nth-child(1)
          bg-image('weixin')
          background-size 32px 32px
        &:nth-child(2)
          bg-image('qq')
          background-size 32px 32px
        &:nth-child(3)
          bg-image('weibo')
          background-size 32px 32px
        &:nth-child(4)
          bg-image('wangyi')
          background-size 32px 32px
    .agreement
      margin-top 10px
      font-size $font-size-small-s
      >>> .cube-checkbox
        padding 0
        .cube-checkbox-wrap
          display flex
          justify-content space-around
          .cube-checkbox-ui:before
            color $color-background-l
      >>> .cube-checkbox-hollow.cube-checkbox_checked .cube-checkbox-ui i
        color $color-background-l
</style>
