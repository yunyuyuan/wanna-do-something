<template>
  <div class="main">
    <Menu/>
    <div class="contain">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Menu from "@/views/blocks/menu";

export default {
  name: "the-main",
  components: {Menu}
}
</script>

<style scoped lang="scss">
.main{
  width: 100%;
  height: 100%;
  position: relative;
  >.contain{

  }
}
</style>