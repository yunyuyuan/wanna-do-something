import {createStore} from 'vuex'

export default createStore({
  state: {
    // 包含access_token,expire_at,refresh_token等
    tokenInfo: {},
    // none || logined || expired
    loginStatus: 'none'
  },
  mutations: {
    _update_state(state, {key, val}){
      state[key] = val
    }
  }
})