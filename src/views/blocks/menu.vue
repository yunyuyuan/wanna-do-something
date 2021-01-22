<template>
  <nav>
    <div class="tabs" :style="{background: bgColor}" flex>
      <router-link v-for="item in tabs" :title="item.name" :to="item.url" :exact-active-class="'active'" flex>
        <icon-svg :name="item.icon"/>
      </router-link>
      <svg :style="{top: `${calcWavePos}`}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 119 26">
        <path :fill="bgColor" d="M120.8,26C98.1,26,86.4,0,60.4,0C35.9,0,21.1,26,0.5,26H120.8z"></path>
      </svg>
    </div>
  </nav>
</template>

<script>
import IconSvg from "@/icons/IconSvg";
export default {
  name: "the-menu",
  components: {IconSvg},
  data (){
    return {
      activeTab: '首页',
      tabs: [
        {
          name: '首页',
          icon: 'fight',
          url: '/'
        },
        {
          name: '日历表',
          icon: 'tab-want',
          url: '/want-do'
        },
        {
          name: '打卡表',
          icon: 'tab-need',
          url: '/need-do'
        },
        {
          name: '正在做',
          icon: 'tab-doing',
          url: '/doing'
        },
        {
          name: '设置项',
          icon: 'tab-settings',
          url: '/settings'
        }
      ],
      bgColor: '#2f3542'
    }
  },
  created() {
  },
  computed: {
    tabNow (){
      return this.$route.path
    },
    calcWavePos (){
      const index = this.tabs.findIndex(e=>e.url===this.tabNow);
      if (index > -1){
        return index
      }
    }
  }
}
</script>

<style scoped lang="scss">
nav{
  position: absolute;
  >.tabs{
    flex-direction: column;
    position: relative;
    >a{
      width: 4rem;
      height: 4rem;
      justify-content: center;
      position: relative;
      &:before, >svg{
        transition: all .2s linear;
      }
      >svg{
        width: 1.6rem;
        height: 1.6rem;
        fill: white;
        z-index: 2;
      }
      &:before{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        background: white;
        border-radius: 50%;
        z-index: 0;
      }
      &.active{
        >svg {
          width: 2rem;
          height: 2rem;
          fill: black;
        }
        &:before{
          width: 80%;
          height: 80%;
        }
      }
    }
    >svg{
      position: absolute;
      top: 0;
      right: 0;
      width: 4rem;
      transform: translateX(calc(100% - 1px)) rotate(90deg);
      transform-origin: left bottom;
    }
  }
}
</style>