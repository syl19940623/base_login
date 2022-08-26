import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    personalInfo: {},
    personalExtendInfo: {},
    account: '',
    lockScreen: false,
    roleBtns: []
  },
  mutations: {
    saveToken(state, data) {
      state.token = data
    },
    savePersonalInfo(state, res) {
      state.personalInfo = res.data
      state.personalExtendInfo = res.extendData
    },
    saveAccount(state, data) {
      state.account = data
    },
    updateLockScreen(state, bool) {
      state.lockScreen = bool
    },
    saveRoleBtns(state, data) {
      state.roleBtns = data
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
