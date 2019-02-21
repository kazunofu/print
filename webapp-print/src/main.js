// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import store from './store'

// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  created() {
    let day = 0
      if (location.search) {
      const a = location.search.match(/d=(.*?)(&|$)/);
      if (a) {
        const d = decodeURIComponent(a[1]);
        if (0 <= d && d <= 7) {
          day = d;
        }
      }
    }
    this.$store.dispatch('syncDbOthers')
    this.$store.dispatch('startSyncAuth')
    this.$store.dispatch('updatePeriod', day + 'd')
    /*
    this.$store.dispatch('syncDbMemos');
    */
  }
})
