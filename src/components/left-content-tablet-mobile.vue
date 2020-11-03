<template>
  <div>
    <b-button v-b-toggle.sidebar-1><b-icon icon="list"></b-icon></b-button>
    <b-sidebar id="sidebar-1" shadow>
      <div class="px-2 py-2">
        <b-img v-if="userName === 'Tài khoản thử nghiệm'" :src="require('../assets/images/undp-logo.jpg')" alt="left-logo-image" id="logo-img"></b-img>
        <b-img v-else :src="require('../assets/images/logo.png')" alt="left-logo-image" id="logo-img"></b-img>
        <div class="project-name">
          <br><br><br>
            <div id="row_center">
            <b-avatar class="mr-3" button variant="dark" size="4em"></b-avatar>
            <span class="mr-auto" style="color:white"><b>{{userName}}</b></span>
            </div>
        </div>
        <leftContentSWH v-if="projectType == 'SWH'"/>
        <leftContentPV v-if="projectType=='PV'"/>

        <div class="thong-tin">
        <p v-if="projectType === 'SWH' && resolution">
          <strong>{{$t('leftbarPV.connectstatus')}}</strong>
          <br />{{$t('overviewPVpage.updateat')}}: {{CurrentDate}}
        </p>
        <div v-if="SoLanLap < 2 && projectType === 'SWH'  && resolution">
        <span> {{$t('leftbarPV.signal')}}: </span>
        <b-img :src="require('../assets/images/status_1_On.png')" alt="icon-status"></b-img>
        </div>
        <div v-if="2 <= SoLanLap && SoLanLap < 4 && projectType === 'SWH'  && resolution">
          <span> {{$t('leftbarPV.signal')}}: </span>
          <b-img :src="require('../assets/images/status_2_On.png')" alt="icon-status"></b-img>
        </div>
        <div v-if="SoLanLap >= 4 && projectType === 'SWH'  && resolution">
          <span> {{$t('leftbarPV.signal')}}: </span>
          <b-img :src="require('../assets/images/status_3_On.png')" alt="icon-status"></b-img>
        </div>
        </div>
        <div id="options" v-if="resolution">
        <b-button variant="primary" type="submit" @click="handleLogout">{{$t('adminHomePage.logout')}}</b-button>
        <b-dropdown right text="Options">
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
    </b-sidebar>
  </div>    
</template>

<script>
import leftContentSWH from './swh/left-content-swh.vue'
import leftContentPV from './pv-sofar/left-content-pv.vue'

function checkAdminToken () {
  let token,
      username,
      projectType
  if (localStorage.getItem('jwt') != null) {
    token = localStorage.getItem('jwt')
    username = localStorage.getItem('username')
    projectType = localStorage.getItem('projectType')
  } else {
    token = sessionStorage.getItem('jwt')
    username = sessionStorage.getItem('username')
    projectType = sessionStorage.getItem('projectType')
  }
  return {
    token: token,
    username: username,
    projectType: projectType
  }
}

export default {
    name: `toggleSideBar`,
    props: {
        msg: String
    },
    components: {
    leftContentSWH,
    leftContentPV
    },
    data () {
        return {
        userName: null,
        projectType: null,
        resolution: false,
        CurrentDate: null,
        SoLanLap: 0,
        }
    },
    mounted () {
        let username = checkAdminToken().username
        this.userName = username

        let projectType = checkAdminToken().projectType
        this.projectType = projectType

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
        let token = checkAdminToken().token
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
    },
    methods: {
    handleLogout () {
      let token = checkAdminToken().token
      this.$http.get(`${this.$store.state.apiURL}/logout`, { headers: { authorization: token } })
        .then(response => {
          // console.log(response)
          localStorage.removeItem('jwt')
          localStorage.removeItem('projectType')

          sessionStorage.removeItem('jwt')
          sessionStorage.removeItem('projectType')

          this.$router.push('/')
        }).catch(err => {
          if (err.response.status === 409) {
            localStorage.removeItem('jwt')
            localStorage.removeItem('projectType')

            sessionStorage.removeItem('jwt')
            sessionStorage.removeItem('projectType')

            this.$router.push('/')
          }
        })
    }
  }
}
</script>

<style scoped>
button {
    margin: 5px;
}

.left-content {
  text-align: center;
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 0 !important;
}

.thong-tin, #options {
  border-top: 1px solid #b3b3b3;
  padding: 10px 0;
}

.thong-tin img {
  width: 15%;
}

#logo-img {
  width: 100%;
}

h3 {
  margin: 40px 0 0;
}

#logo-user{
  padding-left: 0px;
}

.project-name {
  width: 100%;
  margin: 15px 0 0 0;
}

#name {
  padding: 0px;
  background-color: maroon;
  display: table-cell;
}

#name p {
  text-align: center !important;
  color: white;
  font-weight: bold;
  font-size: 13px;
  padding: 0;
  margin: 0;
}

#row_center {
  display: table; height: 50px; overflow: hidden;
  width: 100%;
  background-color: darkred;
}

#icon-swh {
  width: 50px;
  height: 50px;
}

</style>