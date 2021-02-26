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
import {AccessToken} from "@/utils/constants";
import {useStore} from "vuex";
import {_update_state} from "@/store";
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
      _update_state(store, '_update_state', {key,val})
    }
    return {update_state}
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
    background: #f8f8f8;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, .2);
    >div{
      width: 95%;
      margin: 0 2.5%;
    }
  }
}
</style>