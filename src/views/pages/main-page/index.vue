<template>
  <div class="main">
    <Menu/>
    <div class="contain">
      <div class="inner">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "@/views/blocks/menu";
import {AccessToken} from "@/utils/constants";
import {useStore} from "vuex";
import {getUserInfo} from "@/utils/git";

export default {
  name: "the-main",
  components: {Menu},
  data (){
    return {
    }
  },
  setup (){
    const store = useStore();
    const update_state  = (key,val)=>{
      store.commit('_update_state', {key, val});
    }
    return {update_state}
  },
  provide: {
    update_state (a, b){
      this._update_state(a, b)
    }
  },
  created() {
    // 检查是否已经登录
    const tokenInfo = JSON.parse(localStorage.getItem(AccessToken)||'{}');
    if (tokenInfo.expire_data){
      if (tokenInfo.expire_data<0 || (new Date().getTime())<tokenInfo.expire_data*1000){
        // 登录成功
        const {platform, access_token} = tokenInfo;
        getUserInfo({platform, token: access_token})
        .then(res => {
          this.update_state('tokenInfo', tokenInfo)
          this.update_state('userInfo', res)
          this.update_state('loginStatus', 'logined');
        }).catch(err=>{

        })
      }else{
        // 已经过期
        localStorage.removeItem(AccessToken);
        this.update_state('loginStatus', 'expired');
      }
    }
  },
}
</script>

<style scoped lang="scss">
.main{
  width: 100%;
  height: 100%;
  position: relative;
  background: #bdbdbd;
  >.contain{
    position: absolute;
    width: calc(100% - 5.5rem);
    height: 100%;
    margin: 0 0 0 5.5rem;
    background: #f5f5f5;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, .2);
    overflow-y: auto;
    >.inner{
      width: calc(96% - 1.6rem);
      min-height: calc(100% - 3.6rem);
      margin: 1rem 2%;
      padding: .8rem;
      background: white;
      border-radius: .4rem;
      >div {
      }
    }
  }
}
</style>