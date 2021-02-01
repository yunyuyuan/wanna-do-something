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
    position: absolute;
    width: calc(100% - 5.5rem);
    height: 100%;
    margin: 0 0 0 5.5rem;
    background: #f4f4f4;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, .2);
  }
}
</style>