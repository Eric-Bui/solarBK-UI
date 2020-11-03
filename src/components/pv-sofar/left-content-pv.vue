<template>
  <div>
    <li class="overview" @mouseover="mouseOverTQ" @mouseout="mouseOutTQ">
      <router-link :to="{name: `overview-pv`}">
        <b-img :src="getPicPath(iconTongquan)" alt="icon-tong-quan"></b-img>
        <span>{{$t('leftbarPV.systemoverview')}}</span>
      </router-link>
    </li>
    <li class="static-report" @mouseover="mouseOverRP" @mouseout="mouseOutRP">
      <router-link :to="{ name: `module`, query: {data: Serial} }" v-on:click.native="test"
      :class="{ 'active': isActive }">
        <b-img :src="getPicPath(iconThongke)" alt="icon-thong-ke"></b-img>
        <span>{{$t('leftbarPV.staticreport')}}</span>
      </router-link>
    </li>

    <li v-if="warranty === true" class="static-report" @mouseover="mouseOverWT" @mouseout="mouseOutWT">
      <router-link :to="{name: `warranty-pv`}">
        <b-img :src="getPicPath(iconBaohanh)" alt="icon-bao-hanh"></b-img>
        <span>{{$t('leftbarPV.warranty')}}</span>
      </router-link>
    </li>

    <li v-if="maintenance === true" class="static-report" @mouseover="mouseOverMT" @mouseout="mouseOutMT">
      <router-link :to="{name: `maintenance-pv`}">
        <b-img :src="getPicPath(iconBaotri)" alt="icon-bao-tri"></b-img>
        <span>{{$t('leftbarPV.maintain')}}</span>
      </router-link>
    </li>


    <div id="options" v-if="!resolution">
        <b-button variant="primary" type="submit" @click="handleLogout">{{$t('adminHomePage.logout')}}</b-button>
        <b-dropdown right :text="$t('leftbarPV.option')">
          <b-dropdown-item>
            <a href="#">{{$t('leftbarPV.homepage')}}</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">{{$t('mostused.project')}}</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">{{$t('leftbarPV.recruitment')}}</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">{{$t('leftbarPV.contact')}}</a>
          </b-dropdown-item>
        </b-dropdown>
      </div>
  </div>
</template>

<script>

function checkAdminToken() {
  let serialLocalStore,
      token
  if (localStorage.getItem('jwt') != null) {
    serialLocalStore = localStorage.getItem('projectModule')
    token = localStorage.getItem('jwt')
  } else {
    serialLocalStore = sessionStorage.getItem('projectModule')
    token = sessionStorage.getItem('jwt')
  }
  return {
    serialLocalStore: serialLocalStore,
    token: token
  }
}

export default {
  name: 'leftContentPV',
  props: {
    msg: String
  },
  data () {
    return {
      Serial: null,
      iconTongquan: 'icon-pvsystem.png',
      iconThongke: 'icon-Thongsokhac.png',
      iconBaohanh: 'icon-Guarantee.png',
      iconBaotri: 'icon-Preservation.png',
      resolution: false,
      warranty: null,
      maintenance: null
    }
  },
  mounted () {
    if (window.innerWidth > 2500 && window.innerWidth < 4040) {
          this.resolution = false
        } else if (window.innerWidth > 1400 && window.innerWidth <= 2500 ) {
          this.resolution = false
        } else if (window.innerWidth > 1020 && window.innerWidth <= 1400) {
          this.resolution = false
        } else if (window.innerWidth > 750 && window.innerWidth <= 1020) {
          this.resolution = true
        } else if (window.innerWidth > 420 && window.innerWidth <= 750) {
          this.resolution = true
        } else if (window.innerWidth > 350 && window.innerWidth <= 420) {
          this.resolution = true
        } else if (window.innerWidth > 310 && window.innerWidth <= 350) {
          this.resolution = true
        }
    
    this.$http.get(`${this.$store.state.pvSofarApi}/person-insurance`, {
          headers: { authorization: checkAdminToken().token }
    }).then(response => {
      this.warranty = response.data.Warranty
      this.maintenance = response.data.Maintenance
    })
  },
  methods: {
    getPicPath (picName) {
      let picPath = require(`../../assets/images/${picName}`)
      return picPath
    },
    test () {
      let serialFromStore = this.$store.state.module
      let serialLocalStore = checkAdminToken().serialLocalStore

      if (serialFromStore === null && serialLocalStore !== null) {
        let proMo = JSON.parse(serialLocalStore)
        this.Serial = proMo[0].Serial
        this.$router.push({ name: `module`, query: {data: proMo[0].Serial} })
      } else {
        this.Serial = this.$store.state.module 
        this.$router.push({ name: `module`, query: {data: this.$store.state.module} })
      }
    },

    mouseOverTQ () {
      this.iconTongquan = 'icon-pvsystem-select.png'
    },
    mouseOutTQ () {
      this.iconTongquan = 'icon-pvsystem.png'
    },

    mouseOverRP () {
      this.iconThongke = 'icon-Thongsokhac_selected.png'
    },
    mouseOutRP () {
      this.iconThongke = 'icon-Thongsokhac.png'
    },

    mouseOverWT () {
      this.iconBaohanh = 'icon-Guarantee-select.png'
    },

    mouseOutWT () {
      this.iconBaohanh = 'icon-Guarantee.png'
    },

    mouseOverMT () {
      this.iconBaotri = 'icon-Preservation-select.png'
    },

    mouseOutMT () {
      this.iconBaotri = 'icon-Preservation.png'
    },

    handleLogout () {
      let token = checkAdminToken().token
      this.$http.get(`${this.$store.state.apiURL}/logout`, { headers: { authorization: token } })
        .then(response => {
          localStorage.removeItem('jwt')
          localStorage.removeItem('checkViewProduction')
          localStorage.removeItem('checkViewPower')

          sessionStorage.removeItem('jwt')
          sessionStorage.removeItem('checkViewProduction')
          sessionStorage.removeItem('checkViewPower')

          this.$router.push(`/${this.$route.params.lang}`)
        }).catch(err => {
          if (err.response.status === 409) {
            localStorage.removeItem('jwt')
            localStorage.removeItem('checkViewProduction')
            localStorage.removeItem('checkViewPower')

            sessionStorage.removeItem('jwt')
            sessionStorage.removeItem('checkViewProduction')
            sessionStorage.removeItem('checkViewPower')

            this.$router.push(`/${this.$route.params.lang}`)
          }
        })
    }
  },
  computed: {
    isActive () {
      return this.$route.name === 'statitic' ||
      this.$route.name === 'report' ||
      this.$route.name === 'otherparams'
    }
  }
}
</script>

<style scoped>
.active {
  display: inline-block;
  background-color: #c92222;
  width: 100%;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.active img {
  padding: 10px 5px;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.overview,
.status,
.static-report {
  margin: 0;
  text-align: left;
  padding-left: 5%;
}
.overview a,
.status a,
.static-report a {
  font-size: 15px;
}

.overview span,
.status span,
.static-report span {
  padding-left: 2%;
}

li {
  padding: 5px 0;
}

li span {
  font-size: 13px;
  padding-right: 5px;
  font-weight: bold;
  color: black;
  text-decoration: none;
}

li:hover {
  text-decoration: none;
  background-color: #ff5252;
}

#options {
  margin-top: 15px;
  border-top: 1px solid #b3b3b3;
  padding-top: 10px;
}

</style>
