<template>
  <div class="settings">
    <select v-model="platform">
      <option v-for="item in allPlatforms" :value="item">{{ item }}</option>
    </select>
    <a @click="listenToken" target="_blank" :href="oauthUrl[platform]">登录</a>
    <b>{{tokenInfo}}</b>
  </div>
</template>

<script>
import {getUserInfo, oauthUrl} from "@/utils/git";
import {ConstantStorageKey} from "@/utils/constants";
import siteConfig from '@/site-config'
import {mapMutations, mapState, useStore} from "vuex";
import {computed} from "@vue/reactivity";

export default {
  name: "settings",
  data (){
    return {
      allPlatforms: siteConfig.platforms,
      platform: siteConfig.platforms[0],
      oauthUrl: oauthUrl,

      oldToken: null,
    }
  },
  setup() {
    const store = useStore();
    const tokenInfo = computed(()=>store.state.tokenInfo)

    const update_token_info  = (tokenInfo)=>{
      store.commit('_update_state', {key: 'tokenInfo', val: tokenInfo})
    }
    return { tokenInfo, update_token_info }
  },
  watch: {
    tokenInfo (){
      const {platform, access_token} = this.tokenInfo;
      getUserInfo({platform, token: access_token}).then(res=>{
        console.log(res)
      })
    }
  },
  methods: {
    ...mapMutations(['_update_state']),
    listenToken (){
      if (this.tokenInfo) {
        this.oldToken = this.tokenInfo.access_token;
      }
      window.addEventListener("storage", this.listenStorageHandle);
    },
    listenStorageHandle (){
      try {
        const tokenInfo = JSON.parse(localStorage.getItem(ConstantStorageKey.AccessToken))
        const newToken = tokenInfo.access_token;
        if (newToken !== this.oldToken) {
          window.removeEventListener("storage", this.listenStorageHandle);
          this.update_token_info(tokenInfo)
        }
      }catch (e){
        console.error(e)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.settings{

}
</style>