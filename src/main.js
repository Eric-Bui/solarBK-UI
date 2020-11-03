import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router'
import Axios from 'axios'
import * as VueGoogleMaps from 'vue2-google-maps'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
// import { i18n } from './plugins/i18n'
import VueSSE from 'vue-sse'

import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels'
import { BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from 'vee-validate'

import vi from "vee-validate/dist/locale/vi.json"
import * as rules from 'vee-validate/dist/rules'

import Vuex from 'vuex'

import {store} from './store.js'
import i18n from './i18n'

//Install rules and local lang
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

localize("vi", vi)

Vue.prototype.$http = Axios

Vue.config.productionTip = false

Vue.use(Vuex)

Vue.use(BootstrapVueIcons)

Vue.use(datePicker)

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDFs0Yl3iDYkkof3xVEWrJlNmG3M6cd678',
    libraries: 'places'
  }
})

Vue.use(VueSSE);

Vue.use(store)

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);


/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,

  // i18n,
  components: { App, ChartJsPluginDataLabels },

  i18n,
  template: '<App/>'
})
