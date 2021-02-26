<template>
  <div class="need">
    <unlogin v-if="!logined"/>
    <template v-else>
      <div>

      </div>
    </template>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "@vue/reactivity";
import Unlogin from "@/views/blocks/unlogin";
import {getFile, makeFile} from "@/utils/git";
import dayjs from "dayjs";
import {DataFolder} from "@/utils/constants";
import {decryptData, encryptData, githubContentToString} from "@/utils/utils";

export default {
  name: "need",
  components: {Unlogin},
  data (){
    return {
      /*
        {1: [{name: "读书", color: "#fff", type: "normal|important|maybe"}]}
       */
      data: {}
    }
  },
  setup (){
    const store = useStore();

    const tokenInfo = computed(()=>store.state.tokenInfo);
    const userInfo = computed(()=>store.state.userInfo);
    const secret = computed(()=>store.state.secret);
    const logined = computed(()=>store.getters['logined']);
    return {tokenInfo, userInfo, secret, logined}
  },
  watch: {
    logined :{
      immediate: true,
      handler () {
        if (this.logined) {
          //自动刷新
          this.getNeeds()
        }
      }
    }
  },
  created() {
  },
  methods: {
    getNeeds (){
      const {access_token, platform} = this.tokenInfo;
      const owner = this.userInfo.login;
      const token = access_token;
      const path = `${DataFolder}/need-do${dayjs().format('/YYYY/MM')}.json`;
      getFile({
        owner,
        platform,
        token,
        path
      }).then(res=>{
        const content = githubContentToString(res.data.content, this.secret)
        let jsonData = {}
        try{
          jsonData = JSON.parse(content)
        }catch (e){
          return
        }
        this.data = jsonData;
      }).catch(err=>{
        if (err.response.status === 404){
          //创建文件
          makeFile({
            owner,
            platform,
            token,
            path,
            content: "{}",
            secret: this.secret
          }).then(res=>{
          }).catch(err=>{
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.need{

}
</style>