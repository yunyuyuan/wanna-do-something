import {createStore} from 'vuex'

export default createStore({
  state: {
    tokenInfo: {
      access_token: '',
      expire_at: '',
      refresh_token: '',
      platform: '',
    },
    userInfo: {
      login: '',
      avatar: '',
      name: '',
      url: '',
    },
    // none || logined || expired
    loginStatus: 'none',
    secret: "123"
  },
  mutations: {
    _update_state(state, {key, val}){
      state[key] = val
    }
  },
  getters: {
    logined (status){
      return status.loginStatus === 'logined'
    }
  }
})