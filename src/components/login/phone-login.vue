<template>
  <div class="phoneLogin" v-show="visible">
    <header>
      <i class="extend-fanhui" @click="back"></i>
      <span>{{headerText[step]}}</span>
    </header>
    <div v-if="step === 0" class="phonePage">
      <div class="desc">未注册手机号登录后将自动创建账号</div>
      <div class="input">
        <span class="prefix">+86</span>
        <input type="text" placeholder="请输入手机号" v-model="phoneNumber" ref="phoneInput" autofocus="autofocus">
        <span class="del" v-show="phoneFlag" @click="phoneDel">&#10006;</span>
      </div>
      <div class="next" @click="next">下一步</div>
    </div>
    <div v-if="step === 1" class="verificationPage">
      <div class="container">
        <div class="desc">验证码已发送至</div>
        <div class="number">
          <span class="left">+86 {{ phoneNumber | handlePhone }}</span>
          <span class="time" @click="handleTime">{{timeText}}</span>
        </div>
      </div>
      <div class="captcha">
        <input ref="captcha" v-model="captcha" type="number" autofocus="autofocus" @input="codeInputType">
        <div>
          <span>{{captchaArr[0]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[0] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[1]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[1] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[2]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[2] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[3]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[3] !== ''"></i>
          </transition>
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="loginPage">
      <div class="input">
        <input type="password" placeholder="请输入密码" v-model="passwordNumber"  ref="passwordInput" autofocus>
        <span class="del" v-show="passwordFlag" @click="passwordDel">&#10006;</span>
      </div>
      <div class="loginButton" @click="login">登录</div>
    </div>
    <div v-if="step === 3" class="passwordPage"></div>
  </div>
</template>

<script>
import {getCheckPhone, loginCellPhone, sentCaptcha, verifyCaptcha} from 'api/axios'
import {mapMutations} from 'vuex'
import {saveUser} from 'common/js/cache'

export default {
  name: 'phone-login',
  data() {
    return {
      visible: false,
      phoneFlag: false,
      passwordFlag: false,
      phoneNumber: '',
      passwordNumber: '',
      headerText: ['手机号登录', '手机号注册', '手机号登录', '设置密码'],
      time: 60,
      captcha: '',
      captchaArr: ['', '', '', ''],
      step: 0 // 当前的步骤 - 1
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    phoneDel() {
      this.phoneNumber = ''
      this.$refs.phoneInput.focus()
    },
    passwordDel() {
      this.passwordNumber = ''
      this.$refs.passwordInput.focus()
    },
    next() {
      if (!this.checkNum()) {
        this.showToastType('请输入正确的手机号', 'warn', 800)
        this.phoneDel()
      } else {
        this.showToastType('正在验证账户信息', 'loading', 100)
        // 验证手机号是否已注册
        this.checkPhoneIsRegister().then(res => {
          if (res.exist === 1) {
            // 显示登录页面
            this.step = 2
            // 获取焦点
            setTimeout(() => {
              this.$refs.passwordInput.focus()
            }, 20)
          } else {
            // 显示验证码页面
            this.step = 1
            // 发送验证码
            this.sentData()
            // 获取焦点
            setTimeout(() => {
              this.$refs.captcha.focus()
            }, 20)
          }
        })
      }
    },
    checkPhoneIsRegister() {
      return getCheckPhone({
        phone: this.phoneNumber
      })
    },
    countDown() {
      this.timer = setInterval(() => {
        this.time = this.time - 1
      }, 1000)
    },
    showToastType(txt, type, time) {
      const toast = this.$createToast({
        time: time,
        txt: txt,
        type: type
      })
      toast.show()
    },
    checkNum() {
      return /^1[3456789]\d{9}$/.test(this.phoneNumber)
    },
    codeInputType() {
      let len = this.captcha.length
      if (len > 4) return
      this.captchaArr[len - 1] = this.captcha[len - 1]
      if (len === 4) {
        // 验证（验证码）是否正确
        this.verifyData()
      }
    },
    handleTime() {
      if (this.time !== 0) return
      this.time = 60
      this.sentData()
    },
    login() {
      loginCellPhone({
        phone: this.phoneNumber,
        password: this.passwordNumber
      }).then(res => {
        if (res.code === 200) {
          this.hide()
          this.showToastType('登录成功', 'correct', 800)
          let tempObj = res.profile
          tempObj['isShow'] = false
          this.setUser(tempObj)
          saveUser(tempObj)
        } else {
          this.passwordDel()
          this.showToastType('密码错误', 'warn', 800)
        }
      })
    },
    back() {
      if (this.step === 0) {
        this.hide()
      } else {
        this.step = 0
      }
    },
    sentData() {
      sentCaptcha({
        phone: this.phoneNumber
      }).then(res => {
        if (res.code === 200) {
          // 开启倒计时
          this.time = 60
          this.countDown()
        }
      })
    },
    verifyData() {
      verifyCaptcha({
        phone: this.phoneNumber,
        captcha: this.captcha
      }).then(res => {
        if (!res) {
          this.showToastType(`${this.$errorMessage}，请重新输入`, 'warn', 800)
          this.captcha = null
          this.captchaArr = ['', '', '', '']
        }
      })
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  },
  computed: {
    timeText() {
      if (this.time === 0) {
        clearInterval(this.timer)
        return '重新获取'
      }
      return `${this.time}s`
    }
  },
  filters: {
    handlePhone(num) {
      return num.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
    }
  },
  watch: {
    phoneNumber(newVal) {
      newVal ? this.phoneFlag = true : this.phoneFlag = false
    },
    passwordNumber(newVal) {
      newVal ? this.passwordFlag = true : this.passwordFlag = false
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.phoneLogin
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
  z-index 220
  .input
    display flex
    justify-content space-between
    height 30px
    line-height 30px
    font-size $font-size-large
    border-bottom 1px solid $color-text-s
    input
      margin-left 10px
      flex 1
      outline none
      &::-webkit-input-placeholder
        color $color-text-m
      &::-moz-placeholder
        color $color-text-m
      &::-ms-input-placeholder
        color $color-text-m
    .prefix, .del
      flex 0 34px
      display flex
      justify-content center
  .next, .loginButton
    margin-top 40px
    height 40px
    line-height 40px
    border-radius 20px
    text-align center
    background-color $color-text
    color $color-background
    font-size $font-size-medium
  header
    padding 0 10px
    height 50px
    line-height 50px
    background-color $color-text
    color $color-background
    font-size $font-size-medium-x
    i
      margin-right 10p
  .phonePage
    margin 0 15px
    .desc
      margin 30px 0 40px 0
      font-size $font-size-small
  .verificationPage
    .container
      margin 50px 15px 0
      .desc
        font-size $font-size-medium-x
      .number
        margin-top 15px
        display flex
        justify-content space-between
        height 30px
        align-content center
        font-size $font-size-medium
        color $color-text-m
    .captcha
      margin 40px auto 0
      position relative
      display flex
      justify-content space-between
      width 70%
      input
        position absolute
        z-index 1
        opacity 0
        font-size 35px
      div
        position relative
        span
          display block
          width 40px
          height 38px
          font-size $font-size-large-x
          text-align center
          line-height 38px
          border-bottom 2px solid $color-text-s
        i
          width 100%
          height 2PX
          position absolute
          left 0
          bottom 0
          background #212121
        .trans-enter-active
          animation trans .15s
        .trans-leave-active
          animation trans .15s reverse
        @keyframes trans {
          0% { width: 0%; }
          100% { width: 100%; }
        }
  .loginPage
    margin 50px 10px 0
</style>
