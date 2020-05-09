<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <login></login>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header.vue'
import Tab from 'components/tab/tab.vue'
import Player from 'components/player/player.vue'
import Login from 'components/login/login.vue'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player,
    Login
  }
}
</script>

<style>
</style>
