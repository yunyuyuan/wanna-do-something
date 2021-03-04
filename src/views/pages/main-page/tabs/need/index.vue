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
        <div class="operate" flex>
          <single-button :disabled="!altered" :size=".8" type="primary" @click="submitAlter">提交</single-button>
          <single-button :disabled="!altered" :size=".8" type="warn" @click="newData=originData.slice()">重做</single-button>
        </div>
      </div>
      <div class="body">
        <ul>
          <need-card v-for="(item,idx) in newData" :data="item"
                     @change-finished="item.finished=$event"
                     @change-type="item.type=$event"
                     @change-content="item.content=$event"
                     @toggle-editing="toggleEditing(item, $event)"
                     @delete="newData.splice(idx, 1)"/>
          <li class="add" @click="addNeed">+</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, reactive} from "@vue/reactivity";
import Unlogin from "@/views/blocks/unlogin";
import {getFileWithCreate, updateFile} from "@/utils/git";
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
  },
  computed: {
    path (){
      return `${DataFolder}/need-do${dayjs().format('/YYYY/MM/DD')}.json`
    },
    altered (){
      if (this.originData.length !== this.newData.length) return true;
      for (let idx=0;idx<this.originData.length;idx++){
        for (const key of Object.keys(this.originData[idx])){
          if (this.newData[idx][key] !== this.originData[idx][key]) return true;
        }
      }
      return false;
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
        this.originData = reactive(JSON.parse(jsonData));
        this.newData = reactive(JSON.parse(jsonData).map(v=>{
          v.editing = false;
          return v
        }));
      }).catch(err=>{

      })
    },
    addNeed (){
      this.newData.push({
        content: '点击右边图标编辑此内容',
        type: '普通',
        finished: false
      });
    },
    toggleEditing (item, e){
      item.editing = e
      if (e) {
        this.newData.filter(v=>v!==item).forEach(v=>v.editing=false)
      }
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
      }).catch(err=>{})
    }
  }
}
</script>

<style scoped lang="scss">
.need{
  >.head{
    >.date{

    }
    >.operate{
      justify-content: flex-end;
      ::v-deep .single-button{

      }
    }
  }
  >.body{
    >ul{
      margin: .8rem 0;
      padding: 1rem 0 1.8rem 0;
      border-bottom: 1px solid;
      border-top: 1px solid;
      list-style: none;
      border-color: #c6c6c6;
      >li.add{
        margin-top: 3rem;
        border-radius: .3rem;
        background: #eafeff;
        border: 1px dashed #787878;
        font-size: 2rem;
        text-align: center;
        padding: .5rem;
        cursor: pointer;
        transition: all .15s linear;
        font-weight: bold;
        &:hover{
          color: #7e00ff;
          border-color: #7ecbff;
          background: #d5fdff;
        }
      }
    }
  }
}
</style>