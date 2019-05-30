import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const state = {
  loginStatus: false
}

const mutations = {
  checkLoginMethod (context, flag) { // flag就是参数
    context.loginStatus = flag
  }
}

const actions = {
  checkLoginMethods ({commit, state}, flag) { // 这个对象第一个是vuex自带的commit方法
    commit('checkLoginMethod', flag)
  }
}

const getters = {
  getLoginMessage (context) {
    return context.loginStatus
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
