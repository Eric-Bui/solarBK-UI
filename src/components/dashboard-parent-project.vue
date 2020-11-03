<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col sm="3" id="left-login-content">
                    <!-- <b-button @click="showModalHidden"><b-icon-gear-fill></b-icon-gear-fill></b-button> -->
                    <b-img :src="require('../assets/images/logo.png')" alt="logo-login" id="logo"></b-img>
                    <b-nav vertical class="w-100">
                    <b-nav-item id="user-banner">
                        <b-avatar class="mr-3" button :src="avatar" variant="success" size="4em"></b-avatar>
                        <span class="mr-auto">{{fullname}}</span>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link :to="{name: 'listProjectParent'}">
                        <b-avatar variant="success" icon="house-door-fill"></b-avatar>
                        <span>DANH SÁCH DỰ ÁN</span>
                        </router-link>
                    </b-nav-item>
                    </b-nav>
                    <b-button variant="info" id="btn-logout" @click="logOutParent">Đăng xuất</b-button>
                    <div id="footer-login">
                    <p>Copyright &#169; 2019 SolarBK, All rights reserved</p>
                    <p>Mọi thông tin, bài viết, hình ảnh trên website này thuộc bản quyền của SolarBK.</p>
                    <p>Thông tin liên hệ: 47 Lê Văn Thịnh, khu phố 5, P. Bình Trưng Đông, Q. 2, TP. HCM, Việt Nam. Hotline: (+84.‎28) 7300 6759 - 1900 636 759</p>
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

                </b-overlay>
                <router-view :key="routeKey"></router-view>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import SpinningGroup from './spinning.vue'

export default {
    name: 'dashboardParent',
    data () {
        return {
            avatar: null,
            fullname: null,
            routeKey: 0,
            routeKey_content: 10,
            CurrentRoute: null,
            show: false,
            thongso_overlay: false
        }
    },
    components: {
      SpinningGroup
    },
    mounted () {
        let parentToken = localStorage.getItem("jwtParent");
        this.$http.post(`${this.$store.state.apiURL}/parent-account-info`, {}, 
        { headers: { authorization: parentToken }}).then(response => {
            // console.log(response.data)
            this.fullname = response.data.userName
        }).catch(err => {
            localStorage.removeItem("jwtParent")
            sessionStorage.removeItem('jwt')
            this.$router.push(`/${this.$route.params.lang}`);
        })

        this.CurrentRoute = this.$router.currentRoute
        if (this.CurrentRoute.name === 'adminInfo' || 
            this.CurrentRoute.name === 'editProject') {
            setInterval(() => {
            if (this.CurrentRoute.name === 'adminInfo' ||
                this.CurrentRoute.name === 'editProject') {
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
                this.CurrentRoute.name === 'editProject') {
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
        logOutParent() {
            let parentToken = localStorage.getItem("jwtParent");
            this.$http.get(`${this.$store.state.apiURL}/parent-log-out`, { headers: { authorization: parentToken } })
            .then(response => {
                // console.log(response)
                localStorage.removeItem('jwtParent')
                sessionStorage.removeItem('jwt')
                sessionStorage.removeItem('projectType')
                this.$router.push(`/${this.$route.params.lang}`)
                }).catch(err => {
                if (err.response.status === 409) {
                    localStorage.removeItem('jwtParent')
                    sessionStorage.removeItem('jwt')
                    sessionStorage.removeItem('projectType')
                    this.$router.push(`/${this.$route.params.lang}`)
                }
            })
        },
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