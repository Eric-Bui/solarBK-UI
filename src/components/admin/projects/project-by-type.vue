<template>
<div>
      <b-overlay 
        :show="thongso_overlay"
        rounded="sm">
        <template v-slot:overlay>
            <spinning-group></spinning-group>
        </template>
  <b-container fluid>
      <h5 v-if="projectComp === 'SGT'" style="padding-top:10px">{{$t('projecttype.projectof')}} SolarGATES</h5>
      <h5 v-if="projectComp === 'BK'" style="padding-top:10px">{{$t('projecttype.projectof')}} BKH</h5>
      <h5 v-if="projectComp === 'ES'" style="padding-top:10px">{{$t('projecttype.projectof')}} ESCO</h5>
    <b-row>
      <b-col sm="3">
        <p>{{$t('projecttype.filterdata')}}</p>
      </b-col>
      <b-col sm="3">
        <b-form-group :label="$t('activitymodal.projecttype')">
          <b-form-radio v-model="selectedProjectType" 
          name="all_ProjectType" 
          value="all_ProjectType"
          @change="selectProjectTypeChange">{{$t('projecttype.all')}}</b-form-radio>
          <b-form-radio v-model="selectedProjectType" name="swh" value="swh" 
          @change="selectProjectTypeChange">{{$t('projecttype.swh')}}</b-form-radio>
          <b-form-radio v-model="selectedProjectType" name="pv" value="pv"
          @change="selectProjectTypeChange">{{$t('projecttype.pv')}}</b-form-radio>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group :label="$t('searchResult.investtype')">
          <b-form-radio v-model="selectedInvestType" 
          name="all_InvestType" value="all_InvestType"
          @change="selectInvestTypeChange">{{$t('projecttype.all')}}</b-form-radio>
          <div v-if="projectComp === 'BK'">
            <b-form-radio v-model="selectedInvestType" 
            name="direct" value="DIRECT"
            @change="selectInvestTypeChange">{{$t('projecttype.investdirect')}}</b-form-radio>
            <b-form-radio v-model="selectedInvestType" 
            name="esco" value="ESCO"
            @change="selectInvestTypeChange">ESCO</b-form-radio>
          </div>
          <div v-else>
            <b-form-radio v-model="selectedInvestType" name="direct" value="DIRECT" disabled>{{$t('projecttype.investdirect')}}</b-form-radio>
            <b-form-radio v-model="selectedInvestType" name="esco" value="ESCO" disabled>ESCO</b-form-radio>
          </div>
        </b-form-group>
      </b-col>
      <b-col sm="3">
            <b-form-group
                id="checkbox-group"
                name="checkboxBtn"
                :label="$t('projecttype.devicestatus')"
              >
              <b-form-checkbox
              @change="selectedDeviceStatusChange"
              v-model="selectedDeviceStatus"
              v-for="item in selectDeviceStatus"
              :key="item.key" 
              :value="item.key">{{item.text}}</b-form-checkbox>
            </b-form-group>
      </b-col>
    </b-row>
  </b-container>
  <b-container fluid>
    <b-row id="project-table">
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select
                  @change="tableSortBy"
                  v-model="sortBy"
                  id="sortBySelect"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template v-slot:first>
                    <option :value="null">-- none --</option>
                  </template>
                </b-form-select>
                <b-form-select @change="tableSortDesc" 
                v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Initial sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="initialSortSelect"
              class="mb-0"
            >
              <b-form-select
                v-model="sortDirection"
                @change="tableSortDirection"
                id="initialSortSelect"
                size="sm"
                :options="['asc', 'desc', 'last']"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  @update="textFilterUpdate"
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="clearSortTable">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter On"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              description="Leave all unchecked to filter on all data"
              class="mb-0"
            >
              <b-form-checkbox-group @change="tablefilterOnChange" v-model="filterOn" class="mt-1">
                <b-form-checkbox value="PersonID">{{$t('activitymodal.projectid')}}</b-form-checkbox>
                <b-form-checkbox value="ProjectName">{{$t('searchResult.projectname')}}</b-form-checkbox>
                <b-form-checkbox value="Serial">{{$t('activitymodal.serial')}}</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>

          <b-col sm="5" md="6" class="my-1">
            <b-form-group
              label="Per page"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              <b-form-select v-model="perPage" @change="perPageChange" 
              id="perPageSelect" size="sm" :options="pageOptions"></b-form-select>
            </b-form-group>
          </b-col>

          <b-col sm="7" md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              v-if="!thongso_overlay"
              :total-rows="totalRows"
              :per-page="perPage"
              @change="paginationChange"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
  </b-container>
  <b-container fluid>
        <b-table
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
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
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
            <b-button variant="success" size="sm" @click="editProject(row.item, $event.target)" class="mr-1">
              <b-icon-pencil></b-icon-pencil>
            </b-button>
          </template>
        </b-table>
        <i style="float:right">Total Record: {{totalRows}}</i>
  </b-container>
      </b-overlay>
        <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
        <template v-slot:modal-title>
            <code>{{$t('warningmodal.warningtitle')}}</code>
        </template>
        <div class="d-block text-center">
            <h6>{{$t('warningmodal.warningcontent')}}</h6>
        </div>
        </b-modal>

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
import SpinningGroup from '../../spinning.vue'

export default {
    name: 'projectByType',
    props: {
        projectType: String
    },
    components: {
      SpinningGroup
    },
    data () {
        return {
            projectComp: null,
            items: null,
            fields: [
                {
                key: "PersonID",
                label: "ID dự án",
                sortable: true,
                sortDirection: "desc"
                },
                { key: "ProjectName", label: "Tên", sortable: true },
                { key: "Serial", label: "Số Seri", sortable: true},
                {
                key: "TypeProject",
                label: "Loại đầu tư",
                sortable: true
                },
                {
                key: "DeviceStatus",
                label: "Trạng thái thiết bị",
                sortable: true
                },
                {
                key: "Capacity",
                label: "Công suất",
                sortable: true
                },
                {
                key: "LastUpdate",
                label: "Thời gian cập nhật",
                sortable: true
                },
                { key: "actions", label: "Actions" }
            ],
            totalRows: null,
            currentPage: null,
            perPage: null,
            pageOptions: [10, 15],
            sortBy: "",
            sortDesc: null,
            sortDirection: null,
            filter: null,
            filterOn: [],
            selectedDeviceStatus: null,
            selectedProjectType: null,
            selectedInvestType: null,
            selectDeviceStatus: [
              {key: 0, text: 'Hoạt động tốt'},
              {key: 1, text: 'Cảnh báo'},
              {key: 2, text: 'Bị lỗi'}
            ],
            thongso_overlay: true
            }
    },
    mounted () {
    this.projectComp = this.$props.projectType
    let access_token = localStorage.getItem("accessTokAdmin")
    let id_admin = localStorage.getItem("id_admin")
    let username_admin = localStorage.getItem("username_admin")

    let selectedProjectTypeSession = sessionStorage.getItem('projectByTypeProjectType')
    let selectedInvestTypeSession = sessionStorage.getItem('projectByTypeInvestType')
    let selectedDeviceStatusSession = sessionStorage.getItem('projectByTypeDeviceStatus')
    let tableFilterText = sessionStorage.getItem('tableFilterText')
    let tableSortBy = sessionStorage.getItem('tableSortBy')
    let tableSortDesc = sessionStorage.getItem('tableSortDesc')
    let tableSortDirection = sessionStorage.getItem('tableSortDirection')
    let tablefilterOn = sessionStorage.getItem('tablefilterOn')

    this.filterOn = (tablefilterOn === null) ? [] : tablefilterOn
    this.sortDirection = (tableSortDirection === null) ? "asc" : tableSortDirection
    this.sortDesc = (tableSortDesc === null) ? false : tableSortDesc
    this.sortBy = (tableSortBy === null) ? '' : tableSortBy
    this.filter = (tableFilterText === null) ? '' : tableFilterText 
    this.selectedProjectType = (selectedProjectTypeSession === null) ? 'all_ProjectType' 
      : selectedProjectTypeSession
    this.selectedInvestType = (selectedInvestTypeSession === null) ? 'all_InvestType' 
      : selectedInvestTypeSession
    this.selectedDeviceStatus = (selectedDeviceStatusSession === null) ? [0, 1, 2] 
      : JSON.parse(selectedDeviceStatusSession)

    let perPageSession = sessionStorage.getItem('projectByTypeTablePerPage')
    let currentPageSession = sessionStorage.getItem('projectByTypeTableCurrentPage')

    this.perPage = (perPageSession === null) ? 10 : perPageSession
    this.currentPage = (currentPageSession === null) ? 1 : currentPageSession

    this.$http
      .post(
        `${this.$store.state.apiURL}/project-by-type`,
        {
          id: id_admin,
          username: username_admin,
          projectType: this.$props.projectType,
          selectedProjectType: this.selectedProjectType,
          selectedInvestType: this.selectedInvestType,
          selectedDeviceStatus: this.selectedDeviceStatus,
          currentPage: this.currentPage,
          perPage: this.perPage
        },
        { headers: { authorization: access_token } }
      ).then(response => {
        let dataRes = response.data
        this.items = dataRes.tableData
        this.totalRows = dataRes.tableData.length
        sessionStorage.setItem('projectByTypeTablePerPage', dataRes.pagination.perPage)
        sessionStorage.setItem('projectByTypeTableCurrentPage', dataRes.pagination.currentPage)
        sessionStorage.setItem('projectByTypeProjectType', this.selectedProjectType)
        sessionStorage.setItem('projectByTypeInvestType', this.selectedInvestType)
        sessionStorage.setItem('projectByTypeDeviceStatus', JSON.stringify(this.selectedDeviceStatus))

        this.thongso_overlay = false
      })
      .catch(err => {
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
      })
    },
    computed: {
        sortOptions() {
        return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
        }
    },
    methods: {
      async selectInvestTypeChange() {
        await this.$nextTick()
        this.thongso_overlay = true
        let access_token = localStorage.getItem("accessTokAdmin")
        let id_admin = localStorage.getItem("id_admin")
        let username_admin = localStorage.getItem("username_admin")
        sessionStorage.setItem('projectByTypeInvestType', this.selectedInvestType)
        this.$http
        .post(
          `${this.$store.state.apiURL}/project-by-type`,
          {
            id: id_admin,
            username: username_admin,
            projectType: this.$props.projectType,
            selectedProjectType: this.selectedProjectType,
            selectedInvestType: this.selectedInvestType,
            selectedDeviceStatus: this.selectedDeviceStatus
          },
          { headers: { authorization: access_token } }
        ).then(response => {
          let dataRes = response.data
          this.items = dataRes.tableData
          this.totalRows = dataRes.tableData.length
          this.thongso_overlay = false
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
        })
      },

      async selectProjectTypeChange () {
        await this.$nextTick()
        this.thongso_overlay = true
        let access_token = localStorage.getItem("accessTokAdmin")
        let id_admin = localStorage.getItem("id_admin")
        let username_admin = localStorage.getItem("username_admin")
        sessionStorage.setItem('projectByTypeProjectType', this.selectedProjectType)
        this.$http
        .post(
          `${this.$store.state.apiURL}/project-by-type`,
          {
            id: id_admin,
            username: username_admin,
            projectType: this.$props.projectType,
            selectedProjectType: this.selectedProjectType,
            selectedInvestType: this.selectedInvestType,
            selectedDeviceStatus: this.selectedDeviceStatus
          },
          { headers: { authorization: access_token } }
        ).then(response => {
          let dataRes = response.data
          this.items = dataRes.tableData
          this.totalRows = dataRes.tableData.length
          this.thongso_overlay = false
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
        })
      },

      async selectedDeviceStatusChange () {
        await this.$nextTick()
        this.thongso_overlay = true
        let access_token = localStorage.getItem("accessTokAdmin")
        let id_admin = localStorage.getItem("id_admin")
        let username_admin = localStorage.getItem("username_admin")
        sessionStorage.setItem('projectByTypeDeviceStatus', JSON.stringify(this.selectedDeviceStatus))
        this.$http
        .post(
          `${this.$store.state.apiURL}/project-by-type`,
          {
            id: id_admin,
            username: username_admin,
            projectType: this.$props.projectType,
            selectedProjectType: this.selectedProjectType,
            selectedInvestType: this.selectedInvestType,
            selectedDeviceStatus: this.selectedDeviceStatus
          },
          { headers: { authorization: access_token } }
        ).then(response => {
          let dataRes = response.data
          this.items = dataRes.tableData
          this.totalRows = dataRes.tableData.length
          this.thongso_overlay = false
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
        })
      },
      editProject(item, button) {
          let routeData = this.$router.resolve({name: 'editProject', query: {data: item.PersonID}})
          window.open(routeData.href, '_blank')
      },

      info(item, button) {
      let access_token = localStorage.getItem("accessTokAdmin")
      this.$http
        .post(`${this.$store.state.apiURL}/login_auth`, {
          username: item.PersonID,
          password: access_token,
          admin: true
        })
        .then(response => {
          sessionStorage.setItem("jwt", response.data.token)
          let projectType = response.data.projectType
          if (projectType === "SWH") {
            let routeData = this.$router.resolve({
              path: `/${this.$route.params.lang}/swh/tong-quan-he-thong`
            })
            window.open(routeData.href, "_blank")
          } else if (projectType === "PV") {
            let routeData = this.$router.resolve({
              path: `/${this.$route.params.lang}}/pv/tong-quan-he-thong`
            })
            window.open(routeData.href, "_blank")
          }
        })
        .catch(err => {
          let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalexample.show()
                }
        })
      },
      resetInfoModal() {
        this.infoModal.title = ""
        this.infoModal.content = ""
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      paginationChange: function(page) {
        sessionStorage.setItem('projectByTypeTableCurrentPage', page)
      },
      perPageChange: function() {
        sessionStorage.setItem('projectByTypeTablePerPage', this.perPage)
      },
      textFilterUpdate: function() {
        sessionStorage.setItem('tableFilterText', this.filter)
      },
      tableSortBy: function() {
        sessionStorage.setItem('tableSortBy', this.sortBy)
      },
      tableSortDesc: function() {
        sessionStorage.setItem('tableSortDesc', this.sortDesc)
      },
      tableSortDirection: function() {
        sessionStorage.setItem('tableSortDirection', this.sortDirection)
      },
      tablefilterOnChange: function() {
        // alert(this.filterOn)
        sessionStorage.setItem('tablefilterOn', this.filterOn);
      },
      clearSortTable: function() {
        this.filter = ''
        sessionStorage.removeItem('tableFilterText')
      },
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