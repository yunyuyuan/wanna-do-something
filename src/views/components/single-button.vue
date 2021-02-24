<template>
  <div class="single-button" :style="calcStyle">
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  name: "single-button",
  props: {
    text: {
      type: String,
    },
    color: {
      type: String,
      default: 'white'
    },
    bg: {
      type: String,
      default: '#1d78ff'
    },
    size: {
      type: Number,
      default: 0.8
    }
  },
  computed: {
    calcStyle (){
      return {
        color: this.color,
        background: this.bg,
        fontSize: this.size+'rem'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.single-button{
  border-radius: .15rem;
  padding: .25rem .8rem;
  cursor: pointer;
  box-shadow: 0 0 .3rem rgba(0, 0, 0, .3);
}
</style>