<template>
  <b-col sm="2" class="left-content">
    <b-img v-if="userName === 'Green One UN House'" :src="require('../assets/images/undp-logo.jpg')" alt="left-logo-image" id="logo-img"></b-img>
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
  </b-col>
</template>

<script>
import leftContentSWH from './swh/left-content-swh.vue'
import leftContentPV from './pv-sofar/left-content-pv.vue'

function checkAdminToken () {
  let username,
      projectType
  if (localStorage.getItem('jwt') != null) {
    username = localStorage.getItem('username')
    projectType = localStorage.getItem('projectType')
  } else {
    username = sessionStorage.getItem('username')
    projectType = sessionStorage.getItem('projectType')
  }
  return {
    username: username,
    projectType: projectType
  }
}

export default {
  name: 'leftContent',
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
      projectType: null
    }
  },
  mounted () {
    let username = checkAdminToken().username
    this.userName = username

    let projectType = checkAdminToken().projectType
    this.projectType = projectType
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left-content {
  text-align: center;
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 0 !important;
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
  text-align: right !important;
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
