<template>
  <div class="main">
    <Menu/>
    <div class="contain">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Menu from "@/views/blocks/menu";
import {ConstantStorageKey} from "@/utils/constants";
import {useStore} from "vuex";

export default {
  name: "the-main",
  components: {Menu},
  data (){
    return {
    }
  },
  setup (){
    const store = useStore();

    const update_token_info  = (tokenInfo)=>{
      store.commit('_update_state', {key: 'tokenInfo', val: tokenInfo})
    }
    const update_login_status  = (status)=>{
      store.commit('_update_state', {key: 'loginStatus', val: status})
    }
    return {update_token_info, update_login_status}
  },
  created() {
    // 检查是否已经登录
    const tokenInfo = JSON.parse(localStorage.getItem(ConstantStorageKey.AccessToken)||'{}');
    if (tokenInfo.expire_data){
      if (tokenInfo.expire_data<0 || (new Date().getTime())<tokenInfo.expire_data*1000){
        // 登录成功
        this.update_token_info(tokenInfo);
        this.update_login_status('logined');
      }else{
        // 已经过期
        localStorage.removeItem(ConstantStorageKey.AccessToken);
        this.update_login_status('expired');
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
    background: #f8f8f8;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, .2);
    >div{
      width: 95%;
      margin: 0 2.5%;
    }
  }
}
</style>