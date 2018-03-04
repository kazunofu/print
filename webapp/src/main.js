// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'; // This already imports 'onsenui'

import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueOnsen);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  created() {
    this.$store.dispatch('startSyncAuth');
    this.$store.dispatch('syncDbOthers');
    /*
    this.$store.dispatch('syncDbMemos');
    */
  }
})
