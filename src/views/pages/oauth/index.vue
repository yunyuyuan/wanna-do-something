<template>
  <div class="oauth">
    <svg-icon :name="icon"/>
    <strong v-html="state"></strong>
  </div>
</template>

<script>
import {getToken} from "@/utils/git";
import {ConstantStorageKey} from "@/utils/constants";

export default {
  name: "index",
  data (){
    return {
      state: '处理中...',
      icon: 'loading'
    }
  },
  created() {
    const platform = this.$route.params.platform;
    const code = this.$route.query.code;
    let access_token, expire_data, refresh_token;
    getToken({code, platform}).then(data=>{
      try {
        switch (platform) {
          case "gitee":
            access_token = data.access_token;
            expire_data = data.created_at + data.expires_in;
            refresh_token = data.refresh_token;
            break
          case "github":
            access_token = data.replace(/^access_token=([^&]*).*$/, '$1');
            expire_data = -1;
            refresh_token = 0;
            break
        }
        if (access_token){
          // 本地存储
          localStorage.setItem(ConstantStorageKey.AccessToken, JSON.stringify({
            access_token, expire_data, refresh_token, platform
          }));
          this.icon = 'success';
          this.state = '获取成功！正在跳转...<br/>若本页未自动关闭，请手动关闭';
          window.close();
        } else{
          this.icon = 'error';
          this.state = '获取失败!';
        }
      }catch (err){
        this.icon = 'error';
        this.state = '获取失败 '+err;
      }
    }).catch(err=>{
      this.icon = 'error';
      this.state = '获取失败 '+err;
    })
  }
}
</script>

<style scoped lang="scss">
.oauth{
  >svg{
    width: 3rem;
    height: 3rem;
  }
  >strong{

  }
}
</style>