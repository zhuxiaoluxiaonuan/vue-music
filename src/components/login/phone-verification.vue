<template>
  <div class="phoneVerification" v-show="visible">
    <header>
      <i class="extend-fanhui"></i>
      <span>手机号验证</span>
    </header>
    <div class="container">
      <div class="desc">验证码已发送至</div>
      <div class="number">
        <span class="left">+86 {{ inputText | handlePhone }}</span>
        <span class="time">{{timeText}}</span>
      </div>
    </div>
    <div class="verification">
      <input type="text" v-model="inputText1">
      <input type="text" v-model="inputText2">
      <input type="text" v-model="inputText3">
      <input type="text" v-model="inputText4">
    </div>
  </div>
</template>

<script>
export default {
  name: 'phone-verification',
  props: {
    inputText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      inputText1: '',
      inputText2: '',
      inputText3: '',
      inputText4: '',
      time: 60
    }
  },
  mounted() {
    setInterval(() => {
      this.time = this.time - 1
    }, 1000)
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    del() {
      this.inputText = ''
      this.$refs.input.focus()
    },
    next() {
      if (!this.checkNum()) {
        this.showToastType()
        this.del()
      } else {
        console.log('ok')
      }
    },
    showToastType() {
      const toast = this.$createToast({
        time: 800,
        txt: '请输入正确手机号',
        type: 'warn'
      })
      toast.show()
    },
    checkNum() {
      if (!(/^1[3456789]\d{9}$/.test(this.inputText))) {
        return false
      }
      return true
    }
  },
  computed: {
    timeText() {
      return this.time === 0 ? '重新获取' : `${this.time}s`
    }
  },
  filters: {
    handlePhone(num) {
      return num.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.phoneVerification
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
  header
    padding 0 10px
    height 50px
    line-height 50px
    background-color $color-text
    color $color-background
    font-size $font-size-medium-x
    i
      margin-right 10px
  .container
    margin 50px 15px
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
  .verification
    display flex
    justify-content space-around
    input
      height 30px
      line-height 30px
      outline none
      font-weight 700
      border-bottom 1px solid $color-text-s
</style>
