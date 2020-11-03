<template>
  <div>
    <b-alert
          show
          dismissible
          fade
          variant="warning"
          v-model="showErrorAlert"
          id="errorAlert"
        >{{error}}</b-alert>
    <b-tabs content-class="mt-3" justified>
      <template v-slot:tabs-end>
        <b-nav-item id="line-items" v-for="(item, index) in modulo" :key="item.Module">
          <router-link :to="{ name: `module`, query: {data: item.Serial} }" :key="item.Serial" exact>
            <p>{{item.Module || `Hệ ${index + 1}`}}</p>
          </router-link>
        </b-nav-item>
        <b-nav-item id="line-items" v-if="moduleLength > 1 && tongHopTag === true">
          <router-link :to="{ name: `module`, query: {data: 'tong-hop'} }" exact>
            <p>{{$t('datepick.synthetic')}}</p>
          </router-link>
        </b-nav-item>
      </template>
    </b-tabs>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
<script>

function checkAdminToken () {
  let token,
      projectModule,
      device
  if (localStorage.getItem('jwt') != null) {
    token = localStorage.getItem('jwt')
    device = localStorage.getItem('Device')
    projectModule = localStorage.getItem('projectModule')
  } else {
    token = sessionStorage.getItem('jwt')
    device = sessionStorage.getItem('Device')
    projectModule = sessionStorage.getItem('projectModule')
  }
  return {
    token: token,
    projectModule: projectModule,
    device: device
  }
}

export default {
  name: `summaryComponentPV`,
  props: {
    msg: String
  },
  data () {
    return {
      modulo: null,
      moduleLength: 0,
      error: null,
      showErrorAlert: false,
      tongHopTag: null
    }
  },
  mounted () {
    let token = checkAdminToken().token
    let projectModule = checkAdminToken().projectModule

    if (checkAdminToken().device === 'SmartBuilding1') {
      this.tongHopTag = false
    } else {
      this.tongHopTag = true
    }

    if (projectModule != null) {
      let proMo = JSON.parse(projectModule)
      this.modulo = proMo
      this.moduleLength = proMo.length
    } else {
      this.$http.get(`${this.$store.state.pvSofarApi}/module-info`, {
        headers: { authorization: token }
      }).then(response => {
        let module = response.data.data
        this.modulo = module
        this.moduleLength = module.length
      }).catch(err => {
        if (err.response === undefined) {
            this.error = `Can't connect server`
            this.showErrorAlert = true
          } else {
            let errMsg = `Can't load module tag, please refresh the page`
            this.error = errMsg
            this.showErrorAlert = true
          }
      })
    }
  },
  methods: {
  }
}
</script>

<style scoped>
p {
  color: black;
}

.active p {
  height: 30px;
  font-size: 15px;
  font-weight: bold;
  padding: 5px 0;
  background-color: #c92222;
  color: white;
}

.nav-link {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border: 1px solid #b3b3b3;
  background-color: #f2f2f2;
}

a:hover p {
  color: black;
  background-color: #ff5252;
}

a:hover {
  text-decoration: none;
}

#line-items {
  background-color: white;
  border-bottom: 0;
}
</style>
