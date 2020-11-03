<template>
  <div id="dashboard">
    <b-container fluid>
      <b-row>
        <leftContent />
        <div class="content" :class="resolution">
          <rightContent :key="routeKey_content"/>
          <router-view :key="routeKey"></router-view>
          <footerPages />
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import leftContent from "./components/left-content.vue";
import rightContent from './right-content.vue'
import footerPages from './footer.vue'
import leftContent from './left-content.vue'

export default {
  name: 'dashBoard',
  components: {
    leftContent,
    rightContent,
    footerPages
  },
  data () {
    return {
      routeKey: 0,
      routeKey_content: 10,
      CurrentRoute: null
    }
  },
  mounted () {
    this.CurrentRoute = this.$router.currentRoute
    if (this.CurrentRoute.name === 'module' 
    || this.CurrentRoute.name === 'statitic'
    || this.CurrentRoute.name === 'report'
    || this.CurrentRoute.name === 'otherparams') {
      setInterval(() => {
      if (this.CurrentRoute.name === 'module' 
        || this.CurrentRoute.name === 'statitic'
        || this.CurrentRoute.name === 'report'
        || this.CurrentRoute.name === 'otherparams') {
          this.routeKey_content += 1
          this.routeKey = this.routeKey
      } else {
          this.routeKey_content += 1
          this.routeKey += 1
      }
    }, 300 * 1000)
    } else {
    setInterval(() => {
      if (this.CurrentRoute.name === 'module' 
        || this.CurrentRoute.name === 'statitic'
        || this.CurrentRoute.name === 'report'
        || this.CurrentRoute.name === 'otherparams') {
          this.routeKey_content += 1
          this.routeKey = this.routeKey
      } else {
          this.routeKey_content += 1
          this.routeKey += 1
      }
    }, 300 * 1000)
    }
  },
  methods: {
  },
  watch: {
    $route(to, from) {
      this.CurrentRoute = this.$router.currentRoute
    }
  },
  computed: {
    resolution() {
        if (window.innerWidth > 2500 && window.innerWidth < 4040) {
          return `col-sm-10`
        } else if (window.innerWidth > 1400 && window.innerWidth <= 2500 ) {
          return `col-sm-10`
        } else if (window.innerWidth > 1020 && window.innerWidth <= 1400) {
          return `col-sm-10`
        } else if (window.innerWidth > 750 && window.innerWidth <= 1020) {
          return `col-sm-12`
        } else if (window.innerWidth > 420 && window.innerWidth <= 750) {
          return `col-sm-12`
        } else if (window.innerWidth > 350 && window.innerWidth <= 420) {
          return `col-sm-12`
        } else if (window.innerWidth > 310 && window.innerWidth <= 350) {
          return `col-sm-12`
        }
    }
  }
}
</script>

<style>
#dashboard {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
