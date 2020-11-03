<template>
<div id="admin-dashboard">
  <b-container fluid>
    <b-row>
      <b-col sm="3" id="left-login-content">
        <b-img :src="require('../assets/images/logo.png')" alt="logo-login" id="logo"></b-img>
        <b-nav vertical class="w-100">
          <b-nav-item id="user-banner">
            <b-avatar class="mr-3" button :src="avatar" variant="success" size="4em"></b-avatar>
            <span class="mr-auto">{{fullname}}</span>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="`/${langTo}/admin/trang-chu`">
              <b-avatar variant="success" icon="house-door-fill"></b-avatar>
              <span>{{$t('adminHomePage.dashboard')}}</span>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="`/${langTo}/admin/thong-tin-admin`">
              <b-avatar variant="success" icon="person-fill"></b-avatar>
              <span>{{$t('adminHomePage.admininfo')}}</span>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="`/${langTo}/admin/tuy-chon`">
              <b-avatar variant="success" icon="tools"></b-avatar>
              <span>{{$t('leftbarPV.setting')}}</span>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="`/${langTo}/admin/logger`">
              <b-avatar variant="success" icon="lightning-fill"></b-avatar>
              <span>Logger</span>
            </router-link>
          </b-nav-item>
        </b-nav>
        <b-navbar toggleable id="project-tag">
          <b-navbar-brand href="#">
              <b-avatar variant="success" icon="briefcase-fill"></b-avatar>
              <span>{{$t('adminHomePage.project')}}</span>
          </b-navbar-brand>
          <b-navbar-toggle target="navbar-toggle-collapse">
            <template v-slot:default="{ expanded }">
              <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
              <b-icon v-else icon="chevron-bar-down"></b-icon>
            </template>
          </b-navbar-toggle>

          <b-collapse id="navbar-toggle-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item v-for="item in projectType" :key="item.text">
                <router-link :to="{ name: `projectType`, query: {data: item.dataType} }" :key="item.dataType" exact>
                <b-avatar variant="primary" :text="item.dataType"></b-avatar>
                <span>{{item.text}}</span>
                </router-link>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
        <b-button variant="info" id="btn-logout" @click="logOutAdmin">{{$t('adminHomePage.logout')}}</b-button>
        <div id="footer-login">
          <p v-html="$t('loginPage.copyright')"></p>
          <p>{{$t('loginPage.copyrightcontent')}}.</p>
          <p>{{$t('loginPage.contactinfo')}} (+84.‎28) 7300 6759 - 1900 636 759</p>
          <b-img
            :src="require('../assets/images/GoSolarBK.png')"
            alt="go-solarbk-scan"
            id="solarbk-scan"
          ></b-img>
        </div>
      </b-col>
      <b-col sm="9">
        <b-overlay 
        :show="thongso_overlay"
        rounded="sm">
        <template v-slot:overlay>
            <spinning-group></spinning-group>
        </template>
        <div class="search-bar">
          <b-input-group class="mr-3">
            <b-form-input style="width:50%" 
            v-model="searchInput" @keydown.enter="searchProject"></b-form-input>
            <b-input-group-append>
              <b-button @click="searchProject" 
              variant="info"><b-icon-search></b-icon-search></b-button>
              <b-button variant="normal" @click="clearSearch">{{$t('adminHomePage.clear')}}</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="search-result" v-if="searchData !== null">
          <b-container fluid>
            <b-row>
            <b-col sm="5">
              <b-row>
                <b-col sm="6">
                <p><b>{{$t('searchResult.projectname')}}: </b>{{searchData.ProjectName}}</p>
                <p><b>ID: </b>{{searchData.PersonID}}</p>
                </b-col>
                <b-col sm="6">
                <p><b>{{$t('mostused.capacity')}}: </b>{{searchData.Capacity}} <i>kWh</i></p>
                <p><b>{{$t('searchResult.investtype')}}: </b>{{searchData.TypeProject}}</p>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="5">
              <b-row>
              <b-col sm="6">
              <ul>
                <li v-for="status in searchData.ModuleStatus" :key="status.STT">
                  <p style="display:inline">{{status.Module}}</p> -
                  <b-icon v-if="status.Status === 0" icon="check-circle" variant="success"></b-icon>
                  <b-icon v-if="status.Status === 1" 
                  icon="exclamation-circle-fill" animation="fade" variant="warning"></b-icon>
                  <b-icon v-if="status.Status === 2" 
                  icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
                </li>
              </ul>
              </b-col>
              <b-col sm="6">
                <ul>
                  <li v-for="serial in searchData.Serial" :key="serial">
                    <p>{{serial}}</p>
                  </li>
                </ul>
              </b-col>
              </b-row>
            </b-col>
            <b-col sm="2">
              <b-button variant="info" @click="accessProject">{{$t('searchResult.viewproject')}}</b-button>
              <b-button variant="success" style="margin-top:10px" @click="editProject">{{$t('searchResult.editproject')}}</b-button>
            </b-col>
            </b-row>
          </b-container>
        </div>
        </b-overlay>
        <router-view :key="routeKey"></router-view>
      </b-col>
    </b-row>
  </b-container>
      <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
        <template v-slot:modal-title>
            <code>{{$t('warningmodal.warningtitle')}}</code>
        </template>
        <div class="d-block text-center">
            <h6>{{$t('warningmodal.warningcontent')}}</h6>
        </div>
        </b-modal>

        <b-modal style="color:red" id="bv-model-error-page" ref="modalerrorloadpage" hide-footer>
            <template v-slot:modal-title>
                <code>{{$t('errormodal.errortitle')}}</code>
            </template>
            <div class="d-block text-center">
                <p>{{$t('errormodal.errorcontent')}} !</p>
            </div>
        </b-modal>
  </div>
</template>

<script>
import SpinningGroup from './spinning.vue'

export default {
  name: "adminDashboard",
  data() {
    return {
      avatar: null,
      fullname: null,
      routeKey: 0,
      routeKey_content: 10,
      CurrentRoute: null,
      show: false,
      searchInput: '',
      projectType: [
        { dataType: 'SGT', text: 'SolarGATES'},
        { dataType: 'BK', text: 'BKH' },
        { dataType: 'ES', text: 'ESCO' }
      ],
      searchData: null,
      thongso_overlay: false,
      langTo: null
    };
  },
  components: {
      SpinningGroup
  },
  mounted() {
    this.langTo = this.$route.params.lang
    let access_token = localStorage.getItem("accessTokAdmin");
    let id_admin = localStorage.getItem("id_admin");
    let username_admin = localStorage.getItem("username_admin");
    this.$http.post(
          `${this.$store.state.apiURL}/admin-info`,
          {
            id: id_admin,
            username: username_admin
          },
          { headers: { authorization: access_token } })
          .then(response => {
            localStorage.setItem("accessTokAdmin", response.data.token);
            let userInfo = response.data.user_info;
            this.avatar = userInfo.avatar_url;
            this.fullname = userInfo.fullname;
          }).catch(err => {
            localStorage.removeItem("accessTokAdmin")
            sessionStorage.removeItem('jwt')
            this.$router.push(`/${this.$route.params.lang}`);
          });

    this.CurrentRoute = this.$router.currentRoute
      if (this.CurrentRoute.name === 'adminInfo' || 
          this.CurrentRoute.name === 'editProject' ||
          this.CurrentRoute.name === 'adminSetting' ||
          this.CurrentRoute.name === 'adminLogger') {
        setInterval(() => {
        if (this.CurrentRoute.name === 'adminInfo' ||
            this.CurrentRoute.name === 'editProject' ||
            this.CurrentRoute.name === 'adminSetting' ||
            this.CurrentRoute.name === 'adminLogger') {
            this.routeKey_content += 1
            this.routeKey = this.routeKey
        } else {
            this.routeKey_content += 1
            this.routeKey += 1
        }
      }, 180 * 1000)
      } else {
      setInterval(() => {
        if (this.CurrentRoute.name === 'adminInfo' ||
            this.CurrentRoute.name === 'editProject' ||
            this.CurrentRoute.name === 'adminSetting' ||
            this.CurrentRoute.name === 'adminLogger') {
            this.routeKey_content += 1
            this.routeKey = this.routeKey
        } else {
            this.routeKey_content += 1
            this.routeKey += 1
        }
      }, 180 * 1000)
      }
  },
  watch: {
    $route(to, from) {
      this.CurrentRoute = this.$router.currentRoute
    }
  },
  methods: {
    logOutAdmin() {
      let access_token = localStorage.getItem("accessTokAdmin")
      this.$http
        .post(
          `${this.$store.state.apiURL}/logout-admin`,
          {
            id: this.id,
            username: this.username
          },
          { headers: { authorization: access_token } }
        )
        .then(response => {
          localStorage.removeItem("accessTokAdmin")
          sessionStorage.removeItem('jwt')
          this.$router.push(`/${this.$route.params.lang}`);
        })
        .catch(err => {
          localStorage.removeItem("accessTokAdmin")
          sessionStorage.removeItem('jwt')
          this.$router.push(`/${this.$route.params.lang}`);
        });
    },
    searchProject() {
      this.thongso_overlay = true
      let access_token = localStorage.getItem("accessTokAdmin");
      let id_admin = localStorage.getItem("id_admin");
      let username_admin = localStorage.getItem("username_admin");
      if (this.searchInput === '') {
        alert('Vui lòng nhập thông tin tìm kiếm')
        this.thongso_overlay = false
      } else {
      this.$http.post(
        `${this.$store.state.apiURL}/admin-search`,
        {
          id: id_admin,
          username: username_admin,
          inputSearch: this.searchInput
        },
        { headers: { authorization: access_token } })
        .then(response => {
          this.searchData = response.data
          this.thongso_overlay = false
        }).catch(err => {
          let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                    this.thongso_overlay = false
                } else {
                    this.$refs.modalerrorloadpage.show()
                    this.thongso_overlay = false
                }
        })
      }
    },
    clearSearch() {
      this.searchInput = ''
      this.searchData = null
    },
    editProject() {
          let routeData = this.$router.resolve({name: 'editProject', query: {data: this.searchData.PersonID}})
          window.open(routeData.href, '_blank')
    },

    accessProject() {
      let access_token = localStorage.getItem("accessTokAdmin")
      this.$http
        .post(`${this.$store.state.apiURL}/login_auth`, {
          username: this.searchData.PersonID,
          password: access_token,
          admin: true
        })
        .then(response => {
          sessionStorage.setItem("jwt", response.data.token)
          let projectType = response.data.projectType
          if (projectType === "SWH") {
            let routeData = this.$router.resolve({
              name: `overview-swh`
            })
            window.open(routeData.href, "_blank")
          } else if (projectType === "PV") {
            let routeData = this.$router.resolve({
              name: `overview-pv`
            })
            window.open(routeData.href, "_blank")
          }
        })
        .catch(err => {
          let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.bvmodalexample.show()
                }
        })
    }
  }
};
</script>

<style scoped>
.search-bar {
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

.search-result {
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

#project-tag {
  border-top: 1px solid #b3b3b3;
  border-bottom: 1px solid #b3b3b3;
}

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

#admin-dashboard {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#left-login-content {
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#left-login-content img {
  width: 100%;
  border-bottom: 1px solid #b3b3b3;
}

#footer-login {
  text-align: center;
  border-top: 1px solid #b3b3b3;
  margin: 15px 0;
  padding: 10px 0;
}

#footer-login img {
  width: 40%;
}

#btn-logout {
  margin-top: 10px;
}
</style>