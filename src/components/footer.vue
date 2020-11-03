<template>
  <b-row class="footer">
    <b-col sm="10" id="footer-text">
      <p v-html="$t('loginPage.copyright')"></p>
          <p>{{$t('loginPage.copyrightcontent')}}.</p>
          <p>{{$t('loginPage.contactinfo')}} (+84.‎28) 7300 6759 - 1900 636 759</p>
    </b-col>
    <b-col sm="2" id="mobile-app-scan">
      <b-img
        :src="require('../assets/images/GoSolarBK.png')"
        alt="go-solarbk-scan"
        id="solarbk-scan"
      ></b-img>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: `footerPages`,
  props: {
    msg: String
  }
}
</script>

<style scoped>
#footer-text {
  text-align: center;
  font-size: 12px;
}
#mobile-app-scan img {
  width: 60%;
}
.footer {
  border-top: #b3b3b3 1px solid;
  padding-top: 20px;
  margin-top: 20px;
}
</style>
