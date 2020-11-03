<template>
  <b-container fluid>
    <div class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
      <h5>{{$t('redirectPage.redirecting')}}...</h5>
    </div>
  </b-container>
</template>
<script>
import qs from 'querystring'

export default {
  name: "adminRedirect",
  mounted() {
    let optionAxios = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    let requestBodyPost = {
      client_id: this.$store.state.client_id,
      client_token: this.$store.state.client_token,
      auth_token: this.$router.currentRoute.query.auth_token,
      grant_type: this.$store.state.grant_type
    }
    this.$http
      .post(
        `${this.$store.state.oauth2URL}/token`, qs.stringify(requestBodyPost), optionAxios
      )
      .then(response => {
        if (response.data.error != undefined) {
            this.$router.push(`/${this.$route.params.lang}`)
        } else {
            this.$http.post(`${this.$store.state.apiURL}/admin-auth`, {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token
            }).then(res => {
                let {id, username, access_token} = res.data
                localStorage.setItem('accessTokAdmin', access_token)
                localStorage.setItem('id_admin', id)
                localStorage.setItem('username_admin', username)
                this.$router.push(`/${this.$route.params.lang}/admin/trang-chu`)
            }).catch(err => {
                console.log(err)
                this.$router.push(`/${this.$route.params.lang}`)
            })
        }
      })
      .catch(err => {
        console.log(err)
        this.$router.push(`/${this.$route.params.lang}`)
      });
  }
};
</script>
<style scoped>
.text-center {
  margin-top: 30px;
}
</style>