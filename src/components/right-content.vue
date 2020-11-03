<template>
  <div>
    <div id="img-banner-parent">
      <div id="ngon-ngu-icon">
        <a @click.prevent="changeLang('vi')">
            <b-img :class="($route.params.lang == 'vi' ? 'lang-active' : 'lang-deactive')" 
            :src="require('../assets/images/icon-VI.png')"></b-img>
          </a>
          <a @click.prevent="changeLang('en')">
            <b-img :class="($route.params.lang == 'en' ? 'lang-active' : 'lang-deactive')"
            :src="require('../assets/images/icon-EN.png')"></b-img>
          </a>
        </div>
    <b-img :src="require('../assets/images/banner.png')" alt="img-banner" id="banner"></b-img>
    </div>
    <b-row id="trang-thai-ket-noi">
      <b-col sm="1" id="toggleSidebar">
        <toggle-side-bar v-if="resolution"/>
      </b-col>
      <b-col sm="4" id="trang-thai" v-if="!resolution">
        <p v-if="projectType === 'SWH'">
          <strong>TRẠNG THÁI KẾT NỐI</strong>
          <br />Thời gian cập nhật: {{CurrentDate}}
        </p>
      </b-col>
      <b-col sm="3" id="trang-thai-icon" v-if="!resolution">
      <div v-if="SoLanLap < 2 && projectType === 'SWH'">
        <b-img :src="require('../assets/images/status_1_On.png')" alt="icon-status"></b-img>
      </div>
      <div v-if="2 <= SoLanLap && SoLanLap < 4 && projectType === 'SWH'">
        <b-img :src="require('../assets/images/status_2_On.png')" alt="icon-status"></b-img>
      </div>
      <div v-if="SoLanLap >= 4 && projectType === 'SWH'">
        <b-img :src="require('../assets/images/status_3_On.png')" alt="icon-status"></b-img>
      </div>
      </b-col>
      <b-col sm="4" id="options" v-if="!resolution">
        <b-button v-if="projectType === 'SWH'" variant="primary" type="submit" @click="handleLogout">ĐĂNG XUẤT</b-button>
        <b-dropdown v-if="projectType === 'SWH'" right text="Options">
          <b-dropdown-item>
            <a href="#">Trang chủ</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">Dự án</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">Tuyển dụng</a>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>
            <a href="#">Liên hệ</a>
          </b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import toggleSideBar from './left-content-tablet-mobile.vue'

function checkAdminToken () {
  let serialLocalStore,
      token,
      projectType
  if (localStorage.getItem('jwt') != null) {
    serialLocalStore = localStorage.getItem('projectModule')
    token = localStorage.getItem('jwt')
    projectType = localStorage.getItem('projectType')
  } else {
    serialLocalStore = sessionStorage.getItem('projectModule')
    token = sessionStorage.getItem('jwt')
    projectType = sessionStorage.getItem('projectType')
  }
  return {
    serialLocalStore: serialLocalStore,
    token: token,
    projectType: projectType
  }
}

export default {
  name: 'rightContent',
  components: {
    toggleSideBar
  },
  props: {
    msg: String
  },
  data () {
    return {
      CurrentDate: null,
      SoLanLap: 0,
      projectType: null,
      resolution: false
    }
  },
  watch: { 
      $route(to, from) { 
      if(to !== from) { 
        location.reload();
      }
    }
  },
  methods: {
    changeLang(lang) {
      if (lang != this.$i18n.locale) {
        let Serial
        let serialFromStore = this.$store.state.module
        let serialLocalStore = checkAdminToken().serialLocalStore
        if (serialFromStore === null && serialLocalStore !== null) {
          let proMo = JSON.parse(serialLocalStore)
          Serial = proMo[0].Serial
        } else {
          Serial = this.$store.state.module 
        }

        this.$i18n.locale = lang
        let pushConfig = {
          name: this.$route.name,
          params: {lang: lang}
        }

        if (this.$route.name == 'module') {
          pushConfig.query = {data: Serial}
        }
        localStorage.setItem('clientLang', lang)
        this.$router.push(pushConfig)
      }
    },
    handleLogout () {
      let token = checkAdminToken().token
      this.$http.get(`${this.$store.state.apiURL}/logout`, { headers: { authorization: token } })
        .then(response => {
          // console.log(response)
          localStorage.removeItem('jwt')
          sessionStorage.removeItem('jwt')
          this.$router.push('/')
        }).catch(err => {
          if (err.response.status === 409) {
            localStorage.removeItem('jwt')
            sessionStorage.removeItem('jwt')
            this.$router.push('/')
          }
        })
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
    let projectType = checkAdminToken().projectType
    let token = checkAdminToken().token
    this.projectType = projectType
    if (projectType === 'SWH') {
      this.$http.post(`${this.$store.state.apiURL}/signaltime`, {},
        { headers: { 'authorization': token } })
        .then(response => {
          console.log(response)
          this.CurrentDate = response.data.data.CurrentDate
          this.SoLanLap = response.data.data.SoLanLap
        })
        .catch(err => {
          console.log(err.response)
        })
    } 
  }
}
</script>

<style scoped>
.lang-deactive {
  filter: grayscale(100%);
}

#trang-thai-ket-noi {
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#trang-thai {
  padding: 0 20px;
  border-right: 1px solid #b3b3b3;
}

#trang-thai p{
  font-size: 13px;
  margin: 10px 0 0 0;
}

#trang-thai-icon {
  border-right: 1px solid #b3b3b3;
}

#trang-thai-icon img {
  width: 20%;
  vertical-align: middle;
  margin: 5px 0;
}

#ngon-ngu-icon {
  position: absolute;
  z-index: 999;
  width: 100%;
  text-align: right;
  padding: 5px;
}

#ngon-ngu-icon img {
  height: 30px;
  width: 40px;
  border-radius: 10px;
}

#options {
  text-align: right;
  margin: 10px 0;
}

#img-banner-parent {
  position: relative;
  top: 0;
  left: 0;
}

#banner {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
}

</style>
