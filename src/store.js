import {createStore} from 'vuex'

export default createStore({
  state: {
    tokenInfo: {}
  },
  mutations: {
    _update_state(state, {key, val}){
      state[key] = val
    }
  }
})