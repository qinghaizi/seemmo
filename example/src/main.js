import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import tools from './common/tools' // 所有工具的合集

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.tools = tools

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
