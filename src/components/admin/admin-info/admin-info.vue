<template>
<div>
    <b-table
          id="table-baocao"
          striped
          hover
          small
          bordered
          head-variant="dark"
          :fields="fields_permission"
          :items="items_permission"
    ></b-table>
    <b-list-group>
        <b-list-group-item class="d-flex align-items-center">
            <b-icon-gift-fill class="mr-1"></b-icon-gift-fill>
            <span class="mr-3">
              <b>{{$t('activitymodal.birthday')}}:</b>
            </span>
            <span class="mr-auto">{{dob}}</span>
          </b-list-group-item>
          <b-list-group-item class="d-flex align-items-center">
            <b-icon-envelope-fill class="mr-1"></b-icon-envelope-fill>
            <span class="mr-3">
              <b>Email:</b>
            </span>
            <span class="mr-auto">{{email}}</span>
          </b-list-group-item>
          <b-list-group-item class="d-flex align-items-center">
            <b-icon-building class="mr-1"></b-icon-building>
            <span class="mr-3">
              <b>{{$t('activitymodal.department')}}:</b>
            </span>
            <span class="mr-auto">{{department}}</span>
          </b-list-group-item>
          <b-list-group-item class="d-flex align-items-center">
            <b-icon-briefcase-fill class="mr-1"></b-icon-briefcase-fill>
            <span class="mr-3">
              <b>{{$t('activitymodal.job')}}:</b>
            </span>
            <span class="mr-auto">{{job}}</span>
          </b-list-group-item>
          <b-list-group-item class="d-flex align-items-center">
            <b-icon-phone class="mr-1"></b-icon-phone>
            <span class="mr-3">
              <b>{{$t('activitymodal.phone')}}:</b>
            </span>
            <span class="mr-auto">{{phone}}</span>
          </b-list-group-item>
    </b-list-group>

    <b-modal style="color:red" id="bv-model-error-page" ref="modalerrorloadpage" hide-footer>
            <template v-slot:modal-title>
                <code>{{$t('errormodal.errortitle')}}</code>
            </template>
            <div class="d-block text-center">
                <p>{{$t('errormodal.errorcontent')}}!</p>
            </div>
        </b-modal>
</div>
</template>

<script>
export default {
    name: 'adminInfo',
    data () {
        return {
            id: null,
            username: null,
            avatar: null,
            fullname: null,
            dob: null,
            email: null,
            department: null,
            job: null,
            phone: null,
            fields_permission: null,
            items_permission: null
        }
    },
    mounted () {
        let access_token = localStorage.getItem("accessTokAdmin");
        let id_admin = localStorage.getItem("id_admin");
        let username_admin = localStorage.getItem("username_admin");

        this.$http
        .post(
        `${this.$store.state.apiURL}/admin-info`,
        {
          id: id_admin,
          username: username_admin
        },
        { headers: { authorization: access_token } })
        .then(response => {
            localStorage.setItem("accessTokAdmin", response.data.token);
            let userInfo = response.data.user_info;
            this.id = userInfo.id;
            this.username = userInfo.username;
            this.avatar = userInfo.avatar_url;
            this.fullname = userInfo.fullname;
            this.dob = userInfo.dob;
            this.email = userInfo.email + "@solarbk.vn";
            this.department = userInfo.department.ref;
            this.job = userInfo.job_title_en;
            this.phone = userInfo.mobile_phone;

            this.fields_permission = [
            { key: "name_permision", label: "Permission" },
            { key: "descript_permision", label: "Apply" },
            { key: "PersonID", label: "Person Apply" },
            { key: "licensed", label: "Licensed Active" }
            ];

            this.items_permission = response.data.admin_permission;
        }).catch(err => {
          let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
      });
    }

}
</script>

<style scoped>

</style>