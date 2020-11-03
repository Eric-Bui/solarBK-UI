<template>
    <div>
        <h5>Danh sách dự án</h5>
        <b-pagination
        v-if="loaded"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="table-baocao"
        ></b-pagination>
        <b-table
        v-if="loaded"
        show-empty
        small
        striped
        hover
        bordered
        id="table-baocao"
        head-variant="dark"
        stacked="md"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        >
        
        <template v-slot:cell(DeviceStatus)="row">
            <p style="display:inline" v-for="status in row.item.DeviceStatus" :key="status.STT">
              {{status.Module}}-
              <b-icon v-if="status.Status === 0" icon="check-circle" variant="success"></b-icon>
              <b-icon v-if="status.Status === 1" 
              icon="exclamation-circle-fill" animation="fade" variant="warning"></b-icon>
              <b-icon v-if="status.Status === 2" 
              icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
            </p>
          </template>

          <template v-slot:cell(actions)="row">
            <b-button variant="info" size="sm" @click="info(row.item, $event.target)" class="mr-1">
              <b-icon-eye-fill></b-icon-eye-fill>
            </b-button>
            <!-- <b-button variant="success" size="sm" @click="editProject(row.item, $event.target)" class="mr-1">
              <b-icon-pencil></b-icon-pencil>
            </b-button> -->
          </template>
        </b-table>
        <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
        <template v-slot:modal-title>
            <code>Cảnh báo</code>
        </template>
        <div class="d-block text-center">
            <h6>Không thể truy cập người dùng</h6>
        </div>
        </b-modal>
    </div>
</template>

<script>
import SpinningGroup from '../spinning.vue'

export default {
    name: 'listProjectParent',
    data () {
        return {
            items: null,
            fields: [
                {
                key: "PersonID",
                label: "ID dự án",
                },
                { key: "ProjectName", label: "Tên" },
                { key: "Serial", label: "Số Seri" },
                {
                key: "TypeProject",
                label: "Loại đầu tư",
                },
                {
                key: "DeviceStatus",
                label: "Trạng thái thiết bị",
                },
                {
                key: "Capacity",
                label: "Công suất",
                },
                {
                key: "LastUpdate",
                label: "Thời gian cập nhật",
                },
                { key: "actions", label: "Actions" }
            ],
            currentPage: 1,
            perPage: 10,
            loaded: false
        }
    },
    mounted () {
        let parentToken = localStorage.getItem("jwtParent");
        this.$http.post(`${this.$store.state.apiURL}/parent-project-list`, {}, 
        { headers: { authorization: parentToken }}).then(response => {
            this.items = response.data.tableData
            this.loaded = true
        })
    },
    methods: {
        info(item, button) {
            let access_token = localStorage.getItem("jwtParent")
            this.$http
                .post(`${this.$store.state.apiURL}/login_auth`, {
                username: item.PersonID,
                password: access_token,
                parent: true
                })
                .then(response => {
                // console.log(response.data)
                sessionStorage.setItem("jwt", response.data.token)
                let projectType = response.data.projectType
                if (projectType === "SWH") {
                    let routeData = this.$router.resolve({
                      name: "overview-swh"
                    })
                    window.open(routeData.href, "_blank")
                } else if (projectType === "PV") {
                    let routeData = this.$router.resolve({
                      name: "overview-pv"
                    })
                    window.open(routeData.href, "_blank")
                }
                })
                .catch(err => {
                let status = err.response.status
                        if (status === 403 || status === 409) {
                            localStorage.removeItem("jwtParent")
                            sessionStorage.removeItem('jwt')
                            this.$router.push(`/${this.$route.params.lang}`)
                        } else {
                            this.$refs.bvmodalexample.show()
                        }
                })
            },
    },
    computed: {
      rows() {
        return this.items.length
      }
    }
}
</script>

<style scoped>
#table-baocao {
  text-align: center
}

#project-table {
  border-top: 1px solid #b3b3b3;
  padding-top: 10px
}
</style>