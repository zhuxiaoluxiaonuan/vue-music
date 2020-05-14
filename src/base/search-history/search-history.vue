<template>
  <div class="search-history">
    <ul>
      <li v-for="(item, index) in searches" :key="index" @click="selectItem(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'search-history',
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selectItem', item)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.search-history ul
  display flex
  flex-wrap wrap
  li
    margin 0 10px 10px 0
    padding 10px
    text-align center
    font-size $font-size-small
    background-color #f5f5f5
    color $color-text
    border-radius 20px
</style>
