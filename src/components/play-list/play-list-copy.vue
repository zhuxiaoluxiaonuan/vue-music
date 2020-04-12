<template>
  <transition name="slide">
    <div class="play-list-copy"  v-show="visible">
      <play-list></play-list>
    </div>
  </transition>
</template>

<script>
import PlayList from 'components/play-list/play-list'

export default {
  name: 'play-list-copy',
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
    }
  },
  components: {
    PlayList
  }
}
</script>

<style scoped lang="stylus"></style>
