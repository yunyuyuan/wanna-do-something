<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import router from '@/views/route'

export default {
  name: "index",
  router: router,
}
</script>

<style lang="scss">
body, html{
  font-size: 16px;
  width: 100%;
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
  outline: none;
  &[flex]{
    display: flex;
    align-items: center;
  }
}

#app{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>