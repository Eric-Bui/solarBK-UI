<template>
  <div>
    <li class="overview" @mouseover="mouseOverTQ" @mouseout="mouseOutTQ">
      <router-link :to="{name: 'overview-swh'}">
        <b-img :src="getPicPath(iconTongquan)" alt="icon-tong-quan"></b-img>
        <span>TỔNG QUAN HỆ THỐNG</span>
      </router-link>
    </li>
    <li class="status" @mouseover="mouseOverHT" @mouseout="mouseOutHT">
      <router-link :to="{name: 'status-swh'}">
        <b-img :src="getPicPath(iconHethong)" alt="icon-trang-thai"></b-img>
        <span>TRẠNG THÁI HỆ THỐNG</span>
      </router-link>
    </li>
    <li class="static-report" @mouseover="mouseOverTK" @mouseout="mouseOutTK">
      <router-link :to="{name: 'summarychart'}" :class="{ 'active': isActive }">
        <b-img :src="getPicPath(iconThongKe)" alt="icon-thong-ke" id="icon-thongke"></b-img>
        <span>THỐNG KÊ & BÁO CÁO</span>
      </router-link>
    </li>
  </div>
</template>

<script>
export default {
  name: 'leftContentSWH',
  props: {
    msg: String
  },
  data () {
    return {
      iconThongKe: 'icon-Thongsokhac.png',
      iconHethong: 'icon-Tongnangluong.png',
      iconTongquan: 'icon-Nuoclanhvao.png'
    }
  },
  methods: {
    getPicPath (picName) {
      let picPath = require(`../../assets/images/${picName}`)
      return picPath
    },
    mouseOverTK () {
      this.iconThongKe = 'icon-Thongsokhac_selected.png'
    },
    mouseOutTK () {
      this.iconThongKe = 'icon-Thongsokhac.png'
    },

    mouseOverHT () {
      this.iconHethong = 'icon-Tongnangluong_selected.png'
    },
    mouseOutHT () {
      this.iconHethong = 'icon-Tongnangluong.png'
    },

    mouseOverTQ () {
      this.iconTongquan = 'icon-Nuoclanhvao_selected.png'
    },
    mouseOutTQ () {
      this.iconTongquan = 'icon-Nuoclanhvao.png'
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
  height: 70px;
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
}
.overview a,
.status a,
.static-report a {
  font-size: 15px;
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

</style>
