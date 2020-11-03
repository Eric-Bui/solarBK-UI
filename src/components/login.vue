<template>
  <b-container fluid>
    <b-row>
    <b-col sm="3" id="left-login-content">
      <b-button @click="changeLogForm"><b-icon-people-circle></b-icon-people-circle></b-button>
      <b-img :src="require('../assets/images/logo.png')" alt="logo-login" id="logo"></b-img>
    <validation-observer ref="observer" v-slot="{ passes }">
    <b-form v-if="view" id="form-login" @submit.stop.prevent="passes(handleSubmit)">
      <div>
      <b-alert
      show
      dismissible
      fade
      variant="danger"
      v-model="showErrorAlert"
    >
      {{error}}
    </b-alert>
    </div>
    <validation-provider
      name="username"
      :rules="{required: true, min: 3, max: 50}"
      v-slot="validationContext">
      <label>{{$t('loginPage.username')}}</label>
      <b-form-input type="text" name="username" v-model="username" @keydown="nameKeydown($event)"
      :state="getValidationState(validationContext)"
      autofocus></b-form-input>
      <b-form-invalid-feedback id="input-1-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
    </validation-provider>
      <br />
      <validation-provider name="password" :rules="{ required: true, min: 3, max: 50}" v-slot="validationContext">
      <label>{{$t('loginPage.password')}}</label>
      <b-input-group>
          <b-form-input :type="passwordToggle" name="password" v-model="password" @keydown="nameKeydown($event)"
          :state="getValidationState(validationContext)"></b-form-input>
          <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
        <b-input-group-append>
          <b-btn variant="outline-secondary" @click="switchVisibility"><b-icon-eye-fill></b-icon-eye-fill></b-btn>
        </b-input-group-append>
      </b-input-group>
    </validation-provider>
      <br />
      <a id="changepass_Redi" href="/changepass"><i>{{$t('loginPage.changepassword')}}</i></a>
      <div v-if="!loaded">
        <SpinningGroup></SpinningGroup>
      </div>
      <b-button type="submit" v-if="loaded">{{$t('loginPage.login')}}</b-button>
    </b-form>
    </validation-observer>

    <div v-if="!view" style="text-align=center">
      <b-button @click="adminLogin">{{$t('loginPage.loginwith')}} SolarBK ID</b-button>
    </div>
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
      <div id="img-banner-parent">
        <div id="ngon-ngu-icon">
          <a @click="changeLang('vi')">
            <b-img :class="($route.params.lang == 'vi' ? 'lang-active' : 'lang-deactive')" 
            :src="require('../assets/images/icon-VI.png')"></b-img>
          </a>
          <a @click="changeLang('en')">
            <b-img :class="($route.params.lang == 'en' ? 'lang-active' : 'lang-deactive')"
            :src="require('../assets/images/icon-EN.png')"></b-img>
          </a>
          </div>
      <b-img :src="require('../assets/images/banner.png')" alt="img-banner" id="banner"></b-img>
      </div>
      <GmapMap
        :center="{lat:21.012950, lng:105.940346}"
        :zoom="4"
        map-type-id="terrain"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          :icon="image"
          :animation="test"
        />
      </GmapMap>

    </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SpinningGroup from '../components/spinning.vue'
import footerPages from '../components/footer.vue'
import {gmapApi} from 'vue2-google-maps'

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
  name: 'loginPage',
  data () {
    return {
      username: '',
      password: '',
      error: null,
      showErrorAlert: false,
      loaded: true,
      markers: [
      ],
      image: null,
      test: null,
      passwordToggle: 'password',
      view: true
    }
  },
  mounted () {
    this.image = require('../assets/images/icon-google-red-s.png')
  },
  components: {
    SpinningGroup,
    footerPages
  },
  computed: {
    google: gmapApi,
    client_id () {
      return this.$store.state.client_id
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
    adminLogin() {
    let adminURI = `${this.$store.state.host}/${this.$route.params.lang}/admin-redirect`,
      appClientID = this.$store.state.client_id,
      scope = this.$store.state.scope

      window.location = 
      `https://icms.solarbk.vn/oauth2/authorize/?redirect_uri=${adminURI}&scope=${scope}&response_type=code&client_id=${appClientID}`
    },
    changeLogForm() {
      this.view = this.view === true ? false : true
    },
    switchVisibility() {
      this.passwordToggle = this.passwordToggle === 'password' ? 'text' : 'password'
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    nameKeydown(e) {
      if (/[&\/\\#,+()$~%.'"!^:*?<>{}]/g.test(e.key)) {
        e.preventDefault();
      }
    },
    handleSubmit (e) {
      this.loaded = false

      //Filter special character
      let filUserName = this.username.replace(/[&\/\\#,+()$~%.'"!^:*?<>{}]/g, '');
      let filPassWord = this.password.replace(/[&\/\\#,+()$~%.'"!^:*?<>{}]/g, '');

      if (this.password.length > 0 && this.username !== 'admin') {
        this.$http
          .post(`${this.$store.state.apiURL}/login_auth`, {
            username: filUserName,
            password: filPassWord
          })
          .then(response => {
            if (response.data.kindAccount === 'parent') {
              localStorage.setItem('jwtParent', response.data.token)
              localStorage.removeItem('jwt')
              this.loaded = true
              this.$emit('loggedIn')
              if (this.$route.params.nextURL != null) {
                this.$router.push(this.$route.params.nextURL)
              } else {
                this.$router.push(`/${this.$route.params.lang}/parent/danh-sach-du-an`)
              }
            } else {
              localStorage.setItem('jwt', response.data.token)
              this.loaded = true
              if (localStorage.getItem('jwt') != null) {
                this.$emit('loggedIn')
                if (this.$route.params.nextURL != null) {
                  this.$router.push(this.$route.params.nextURL)
                } else {
                  let projectType = response.data.projectType
                  if (projectType === 'SWH') {
                    this.$router.push(`/${this.$route.params.lang}/swh/tong-quan-he-thong`)
                  } else if (projectType === 'PV') {
                    this.$router.push(`/${this.$route.params.lang}/pv/tong-quan-he-thong`)
                  }
                }
              }
            }
          })
          .catch((err) => {
            if (err.response === undefined) {
              console.log(err.response)
              this.error = 'Không thể kết nối tới Server'
              this.showErrorAlert = true
              this.loaded = true
            } else {
              console.log(err.response)
              let errorMsg = err.response.data.message
              this.error = errorMsg
              this.showErrorAlert = true
              this.loaded = true
            }
          })
      } 
    }
  }
}
</script>

<style scoped>
.lang-deactive {
  filter: grayscale(100%);
}

#footer-login {
  text-align: center;
  border-top: 1px solid #b3b3b3;
  margin: 15px 0;
  padding: 10px 0;
}

#changepass_Redi {
  float: right;
}

#footer-login img {
  width: 40%;
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

#logo {
  width: 100%;
}

#form-login button {
  margin: 10px 0;
}

.container-fluid, .row {
  height: 100%;
}

.col-sm-9 {
  height: 100%;
}

.vue-map-container {
  width: 100%;
  height: 570px;
}

#left-login-content {
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.input-group-append button {
  margin: 0 !important;
}

</style>
