import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    //Current host
    host: process.env.HOST || `http://localhost:8080`, //Current host

    //APIs Route
    apiURL: process.env.APIURL || `http://localhost:5000/swhapi`, // SWH APIs
    pvSofarApi: process.env.PVSOFA || `http://localhost:5000/pvsofarapi`, // PV sofar APIs
    pvSofarApi_old: process.env.PVSOFAR_FORMER || `https://ssoc.solarbk.vn/api/pvsofar`, // PV sofar APIs (former)

    //Oauth2
    oauth2URL: process.env.OAUTH2_URL || `https://icms.solarbk.vn/oauth2`,

    //solarbk id
    client_id: process.env.CLIENT_ID || 2,
    client_token: process.env.CLIENT_TOKEN || `LolMPgWFZcmVq0edNmeiCBghVqETp2XdwYMXiUnJ40dMgLKit76o857SOBmOjnKt`,
    scope: process.env.SCOPE || `read_profile`,
    grant_type: process.env.GRANT_TYPE || `authorization_code`,

    //let module
    module: null,

    // date time select summary
    fromDate_detail: null,
    toDate_detail: null,
    fromDate: null,
    toDate: null,
    fromMonth: null,
    toMonth: null,
    fromYear: null,
    toYear: null,

  },
  mutations: {
    addRangeDetail (state, range) {
      state.fromDate_detail = range.fromDate_detail,
      state.toDate_detail = range.toDate_detail
    },
    addRangeDate (state, range) {
      state.fromDate = range.fromDate,
      state.toDate = range.toDate
    },
    addRangeMonth (state, range) {
      state.fromMonth = range.fromMonth,
      state.toMonth = range.toMonth
    },
    addRangeYear (state, range) {
      state.fromYear = range.fromYear,
      state.toYear = range.toYear
    },
    loadModule (state, moduleLoad) {
      state.module = moduleLoad.Serial
    }
  },
  // getters: {
  //   getTest: (state, getters) => {
  //     return state.fromMonth
  //   }
  // }
})
