<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box"
           type="text"
           autofocus="autofocus"
           v-model="query"
           ref="box"
           @input="input"
           :placeholder="text">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
export default {
  name: 'search-box',
  props: {
    defaultSearch: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: '',
      text: this.placeholder
    }
  },
  created() {
    // this.$watch('query', (newVal) => {
    //   this.$emit('query', newVal)
    // })
  },
  methods: {
    clear() {
      this.query = ''
      this.$refs.box.focus()
    },
    setQuery(query) {
      this.query = query
      this.$refs.box.blur()
    },
    input() {
      this.$emit('input', this.query)
    }
  },
  watch: {
    defaultSearch(newVal) {
      this.text = newVal.showKeyword
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.search-box
  margin 10px 0
  padding 0 10px
  display flex
  justify-content space-between
  align-items center
  height 35px
  background-color #f5f5f5
  border-radius 17.5px
  .box
    margin-left 8px
    flex 1
    background-color transparent
    outline none
    font-size $font-size-medium
    &::-webkit-input-placeholder
      color $color-text-m
    &::-moz-placeholder
      color $color-text-m
    &::-ms-input-placeholder
      color $color-text-m
  i
    flex 0 16px
    color $color-text-ll
  .icon-search
    font-size $font-size-large-x
</style>
