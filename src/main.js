import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import HbUI from './components/hb-ui'
Vue.use(HbUI)
import msg from './components/Msg'
Vue.use(msg)

import RequestPlugin from "./plugin/RequestPlugin";
Vue.use(RequestPlugin)

import permission from './directives/permission';

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)

const noLoginPath = ['/login', '/forgetPassword']
router.beforeEach((to, from, next) => {
  if (store.state.token || noLoginPath.includes(to.path)) {
    next();
  } else {
    next('/login');
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
