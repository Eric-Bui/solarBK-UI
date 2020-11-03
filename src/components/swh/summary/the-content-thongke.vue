<template>
  <div>
    <b-tabs content-class="mt-3" justified>
        <template v-slot:tabs-end>
          <b-nav-item id="line-items">
            <router-link to="xem-bieu-do"><p>Xem biểu đồ</p></router-link>
          </b-nav-item>
          <b-nav-item id="line-items">
            <router-link to="du-lieu-he-thong"><p>Dữ liệu hệ thống</p></router-link>
          </b-nav-item>
          <b-nav-item id="line-items">
            <router-link to="bao-cao"><p>Báo cáo</p></router-link>
          </b-nav-item>
          <b-nav-item id="line-items">
            <router-link to="thong-so-khac"><p>Thông số khác</p></router-link>
          </b-nav-item>
    </template>
    </b-tabs>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: `summaryComponent`,
  props: {
    msg: String
  },
  components: {
  }
}
</script>

<style scoped>
p {
  color: black;
}

.active p{
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
