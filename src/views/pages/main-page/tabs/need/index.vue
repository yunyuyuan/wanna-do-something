<template>
  <div class="need">
    <unlogin v-if="!logined"/>
    <template v-else>
      <div class="head">
        <div class="date">
          <span class="before"></span>
          <time></time>
          <span class="after"></span>
        </div>
        <div class="operate">
          <single-button @click="editing=!editing">{{ editing?'完成':'' }}编辑</single-button>
          <single-button v-if="altered" type="primary" @click="submitAlter">提交修改</single-button>
          <single-button v-if="altered" type="warn" @click="newData=originData.slice()">重做</single-button>
        </div>
      </div>
      <div class="body">
        <ul>
          <need-card v-for="item in newData" :data="item" :editing="editing"
                     @change-finished="item.finished=$event" @change-type="item.type=$event"
                     @change-content="item.content=$event"
                     @delete="newData.splice(newData.findIndex(v=>v===item), 1)"/>
        </ul>
        <single-button type="primary" @click="addNeed">新建</single-button>
      </div>
    </template>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "@vue/reactivity";
import Unlogin from "@/views/blocks/unlogin";
import {getFileWithCreate, makeFile, updateFile} from "@/utils/git";
import dayjs from "dayjs";
import {DataFolder} from "@/utils/constants";
import {githubContentToString} from "@/utils/utils";
import SingleButton from "@/views/components/single-button";
import PopDialog from "@/views/components/pop-dialog";
import Card from "@/views/pages/main-page/tabs/need/card";

export default {
  name: "need",
  components: {NeedCard: Card, PopDialog, SingleButton, Unlogin},
  data (){
    return {
      originData: [],
      newData: [],
      fileSha: '',

      editing: false,
      altered: false,
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
    },
    newData :{
      deep: true,
      handler (){
        if (this.originData.length !== this.newData.length) return this.altered=true;
        for (let idx=0;idx<this.newData.length;idx++){
          for (const key of Object.keys(this.newData[idx])){
            if (this.newData[idx][key] !== this.originData[idx][key]) return this.altered=true;
          }
        }
        return this.altered=false;
      }
    }
  },
  computed: {
    path (){
      return `${DataFolder}/need-do${dayjs().format('/YYYY/MM/DD')}.json`
    }
  },
  created() {
  },
  methods: {
    getNeeds (){
      const {access_token, platform} = this.tokenInfo;
      const defaultData = "[]";
      getFileWithCreate({
        owner: this.userInfo.login,
        platform,
        token: access_token,
        path: this.path,
        content: defaultData,
        secret: this.secret
      }).then(res=>{
        this.fileSha = res.data.sha;
        const content = githubContentToString(res.data.content, this.secret);
        let jsonData = defaultData;
        try{
          jsonData = content;
        }catch (e){
          return
        }
        this.originData = JSON.parse(jsonData);
        this.newData = JSON.parse(jsonData);
      }).catch(err=>{

      })
    },
    addNeed (){
      this.newData.push({
        content: '',
        type: '普通',
        finished: false
      });
    },
    submitAlter (){
      const {access_token, platform} = this.tokenInfo;
      updateFile({
        owner: this.userInfo.login,
        platform,
        token: access_token,
        path: this.path,
        content: JSON.stringify(this.newData),
        secret: this.secret,
        sha: this.fileSha,
      }).then(res=>{
        console.log(res)
      }).catch(err=>{})
    }
  }
}
</script>

<style scoped lang="scss">
.need{

}
</style>