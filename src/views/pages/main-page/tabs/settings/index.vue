<template>
  <div class="settings">
    <b class="status-line" :text="loginStatusText" :data-login="loginStatus" flex></b>
    <div v-if="loginStatus==='none'" :class="loginStatus" flex>
      <label>
        <span>选择Git平台:</span>
        <select v-model="platform">
          <option v-for="item in allPlatforms" :value="item">{{ item }}</option>
        </select>
      </label>
      <a @click="listenToken" target="_blank" :href="oauthUrl[platform]">
        <single-button text="登录"/>
      </a>
    </div>
    <div v-else-if="loginStatus==='expired'" :class="loginStatus">
      <p>你的登录身份已过期，请<strong>重新登录</strong></p>
    </div>
    <div v-else-if="loginStatus==='logined'" :class="loginStatus">
      <div class="avatar" flex>
        <a target="_blank" :href="userInfo.url" :class="avatarStatus" flex>
          <icon-svg v-if="avatarStatus!=='suc'" :name="avatarStatus==='loading'?'loading':'default-avatar'"/>
          <img v-if="userInfo.avatar" :src="userInfo.avatar" @load="avatarStatus='suc'" @err="avatarStatus='err'" alt="avatar"/>
        </a>
        <single-button @click="logout" type="danger">退出</single-button>
      </div>
      <div class="info" flex>
        <a target="_blank" :href="userInfo.url">{{userInfo.name||'Unknown'}}</a>
        <p><span>登录平台:</span><icon-svg :name="tokenInfo.platform"/></p>
        <p><span>token:</span><b>{{tokenInfo.access_token}}</b></p>
        <p><span>过期时间:</span><b>{{expire_at}}</b></p>
      </div>
    </div>
    <div class="setting">
      <h3>基础设置</h3>
      <div class="setting-item">
        <b>主题外观</b>
      </div>
      <div class="setting-item">
        <b>字体缩放</b>
      </div>
    </div>
  </div>
</template>

<script>
import {getUserInfo, oauthUrl} from "@/utils/git";
import siteConfig from '@/site-config'
import {useStore} from "vuex";
import {computed} from "@vue/reactivity";
import IconSvg from "@/icons/IconSvg";
import dayjs from 'dayjs'
import SingleButton from "@/views/components/single-button";
import {_update_state} from "@/store";
import {AccessToken} from '@/utils/constants'

export default {
  name: "settings",
  components: {SingleButton, IconSvg},
  data (){
    return {
      allPlatforms: siteConfig.platforms,
      platform: siteConfig.platforms[0],
      oauthUrl: oauthUrl,
      oldToken: null,

      avatarStatus: 'err'
    }
  },
  computed: {
    loginStatusText (){
      switch (this.loginStatus){
        case "none":
          return "未登录"
        case "expired":
          return "已过期"
        case "logined":
          return "已登录"
      }
    },
    expire_at (){
      const exp = this.tokenInfo.expire_data;
      if (!exp) return ''
      else if (exp < 0) return '无期限'
      else return dayjs(exp).format('yyyy年MM月DD日')
    }
  },
  setup() {
    const store = useStore()
    const tokenInfo = computed(()=>store.state.tokenInfo)
    const userInfo = computed(()=>store.state.userInfo)
    const loginStatus = computed(()=>store.state.loginStatus)

    const update_state  = (key,val)=>{
      _update_state(store, '_update_state', {key,val})
    }
    return { tokenInfo, userInfo, loginStatus, update_state }
  },
  methods: {
    listenToken (){
      if (this.tokenInfo) {
        this.oldToken = this.tokenInfo.access_token;
      }
      window.addEventListener("storage", this.listenStorageHandle);
    },
    listenStorageHandle (){
      try {
        const tokenInfo = JSON.parse(localStorage.getItem(AccessToken))
        const newToken = tokenInfo.access_token;
        if (newToken !== this.oldToken) {
          window.removeEventListener("storage", this.listenStorageHandle);
          const {platform, access_token} = tokenInfo;
          getUserInfo({platform, token: access_token})
          .then(res => {
            this.update_state('tokenInfo', tokenInfo)
            this.update_state('userInfo', res)
            this.update_state('loginStatus', 'logined');
            this.avatarStatus = 'loading'
          }).catch(err=>{

          })
        }
      }catch (e){
        console.error(e)
      }
    },
    logout (){
      localStorage.removeItem(AccessToken)
      this.update_state('tokenInfo', {})
      this.update_state('userInfo', {})
      this.update_state('loginStatus', 'none');
    }
  },
}
</script>

<style scoped lang="scss">
.settings{
  flex-direction: column;
  >.status-line{
    width: 100%;
    height: 2rem;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
    &:before{
      content: '';
      position: absolute;
      z-index: 1;
      background: #b4b4b4;
      width: 90%;
      height: 1px;
    }
    &:after{
      content: attr(text);
      position: absolute;
      left: calc(5% + .5rem);
      z-index: 2;
      font-size: .8rem;
      background: #f8f8f8;
      padding: .2rem .5rem;
    }
    &[data-login=none]{
      color: gray;
    }
    &[data-login=expired]{
      color: #ff7700;
    }
    &[data-login=logined]{
      color: #00c779;
    }
  }
  >.none{
    >label{
      >span{
        font-size: .8rem;
      }
      >select{

      }
    }
    >a{
      text-decoration: none;
      margin-left: 1rem;
    }
  }
  >.expired{

  }
  >.logined{
    display: flex;
    margin-top: .5rem;
    >.avatar{
      flex-direction: column;
      justify-content: space-between;
      margin: 0 1rem 0 .4rem;
      >a {
        overflow: hidden;
        border-radius: 50%;
        width: 4.5rem;
        height: 4.5rem;
        position: relative;
        transition: all .15s ease-out;
        box-shadow: 0 0 .6rem rgba(0, 0, 0, .4);

        &.suc:hover {
          transform: scale(1.08);
        }

        > * {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    }
    >.info{
      flex-direction: column;
      flex-grow: 1;
      >a{
        text-decoration: none;
        color: #395bff;
        font-size: 1rem;
        &:hover{
          text-decoration: underline;
          color: #002bff;
        }
      }
      >p{
        width: 100%;
        margin: .3rem 0;
        >svg{
          width: 1.2rem;
          height: 1.2rem;
        }
        >span{
          font-size: .78rem;
          color: #2d2d2d;
          width: 4rem;
          display: inline-block;
        }
        >b{
          font-size: .8rem;
        }
      }
    }
  }
}
</style>