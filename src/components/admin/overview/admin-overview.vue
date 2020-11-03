<template>
    <b-container fluid>
        <b-overlay 
        :show="thongso_overlay"
        rounded="sm">
        <template v-slot:overlay>
            <spinning-group></spinning-group>
        </template>
    <b-form id="formLog" inline @submit="logSubmit">
        <h5 class="mr-sm-5"><b-icon-clipboard-data></b-icon-clipboard-data> {{$t('adminOverviewPage.logstation')}}</h5>
        <b-form-datepicker class="mb-3 mr-sm-3 mb-sm-0" v-model="value" :max="maxDate"></b-form-datepicker>
        <b-button class="mr-sm-5" variant="primary" type="submit">{{$t('adminOverviewPage.search')}}</b-button>
        <p class="mr-sm-5"><b>{{$t('adminOverviewPage.activities')}}:</b> {{rows_activity}}</p>
        <p class="mr-sm-5"><b>{{$t('adminOverviewPage.lostconnect')}}:</b> {{rows_error}}</p>
    </b-form>
    <b-container fluid>
    <b-row id="log-station-tables">
        <b-col sm="6">
            <p>{{$t('adminOverviewPage.activitieslog')}}</p>
            <b-pagination
            v-model="currentPage_activity"
            :total-rows="rows_activity"
            :per-page="perPage_activity"
            aria-controls="table-activity"
            ></b-pagination>
            <b-table
            id="table-activity"
            striped
            hover
            bordered
            small
            head-variant="dark"
            :fields="fields_activity"
            :items="items_activity"
            :per-page="perPage_activity"
            :current-page="currentPage_activity"
            @row-clicked="myRowClickHandler"
            ></b-table>
            <p>{{$t('table.totallabel')}}: {{rows_activity}} {{$t('table.row')}}</p>
        </b-col>
        <b-col sm="6">
            <p>{{$t('adminOverviewPage.errorlog')}}</p>
            <b-pagination
            v-model="currentPage_error"
            :total-rows="rows_error"
            :per-page="perPage_error"
            aria-controls="table-error"
            ></b-pagination>
            <b-table
            id="table-error"
            striped
            hover
            bordered
            small
            head-variant="dark"
            :fields="fields_error"
            :items="items_error"
            :per-page="perPage_error"
            :current-page="currentPage_error"
            ></b-table>
            <p>{{$t('table.totallabel')}}: {{rows_error}} {{$t('table.row')}}</p>
        </b-col>
    </b-row>
    </b-container>
    </b-overlay>
    <h5 class="mr-sm-5" style="display: inline-block">
        <b-icon-bar-chart-fill></b-icon-bar-chart-fill> {{$t('adminOverviewPage.systemstatus')}}</h5>
    <b-overlay 
        :show="systemStatusOverlay"
        rounded="sm">
    <template v-slot:overlay>
        <spinning-group></spinning-group>
    </template>
    <b-container fluid>
        <b-row id="banner-info">
            <b-col sm="3" id="banner-total-project">
                <b-avatar class="mr-3" icon="star-fill" variant="primary"></b-avatar>
                <span class="mr-auto">{{$t('adminOverviewPage.totalproject')}}</span>
                <h5 style="text-align:right">{{TotalProject}}</h5>
            </b-col>
            <b-col sm="3" id="banner-total-normal">
                <b-avatar class="mr-3" icon="check-circle" variant="success"></b-avatar>
                <span class="mr-auto">{{$t('adminOverviewPage.normalproject')}}</span>
                <h5 style="text-align:right">{{TotalProjectNormal}}</h5>
            </b-col>
            <b-col sm="3" id="banner-total-warning">
                <b-avatar class="mr-3" icon="dash-circle" variant="warning"></b-avatar>
                <span class="mr-auto">{{$t('adminOverviewPage.warningproject')}}</span>
                <h5 style="text-align:right">{{TotalProjectWarning}}</h5>
            </b-col>
            <b-col sm="3" id="banner-total-error">
                <b-avatar class="mr-3" icon="exclamation-circle-fill" variant="danger"></b-avatar>
                <span class="mr-auto">{{$t('adminOverviewPage.errorproject')}}</span>
                <h5 style="text-align:right">{{TotalProjectError}}</h5>
            </b-col>
        </b-row>
    </b-container>
    <b-pagination 
        :total-rows='totalItems'
        @change='paginateSystem'
        :per-page="numberItems"
        v-if="!systemStatusOverlay"
        v-model="currentPageSystem"
        :prev-text="'Prev'"
        :next-text="'Next'"
    >
    </b-pagination>
    
    <b-container fluid>
    <b-row>
        <b-col sm="4">
            <b-form-select v-model="selectedType" @change.native="selectProjectTypeChange" 
            :options="optionsSelectType"></b-form-select>
        </b-col>
        <b-col sm="4">
            <b-form-select v-model="selectedStatus" @change.native="selectProjectStatus" 
            :options="optionsSelectStatus"></b-form-select>
        </b-col>
        <b-col sm="4">
            <b-form-select v-model="selectedHidden" @change.native="selectHidden"
            :options="optionSelecteHidden">
            </b-form-select>
        </b-col>
    </b-row>
    <b-row>
        <b-col sm="1" class="status-monitoring" v-for="data in monitoringData" :key="data.PersonId">
            <div 
            v-b-popover.hover.top="'Click để xem'" :title="`Dự án: ${data.PersonId}`"
            :id="data.PersonId"
            v-if="data.Status === 0" class="normal-status" @click="handleSelectItem(data)">
                <b-icon icon="check-circle" variant="success"></b-icon>
            </div>
            <div
            v-b-popover.hover.top="'Click để xem'" :title="`Dự án: ${data.PersonId}`" 
            :id="data.PersonId"
            v-if="data.Status === 1" class="warning-class" @click="handleSelectItem(data)">
                <b-icon icon="exclamation-circle-fill" animation="fade" variant="warning"></b-icon>
            </div>
            <div 
            v-b-popover.hover.top="'Click để xem'" :title="`Dự án: ${data.PersonId}`" 
            :id="data.PersonId"
            v-if="data.Status === 2" class="error-class" @click="handleSelectItem(data)">
                <b-icon icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
            </div>
        </b-col>
    </b-row>
    </b-container>
    </b-overlay>
    <b-modal id="modal-lg" size="lg" ref="bvmodalupdate" hide-footer>
        <template v-slot:modal-title>
        {{$t('activitymodal.activitydetail')}} <b>{{LogSession}}</b>
        </template>
        <div class="d-block text-center">
        <b-container fluid>
            <h5>{{$t('activitymodal.loginfo')}}</h5>
            <b-row style="text-align:left" id="thongtin-log">
                <b-col sm="6">
                    <p><b>{{$t('activitymodal.actor')}}:</b> {{logFactor}}</p>
                </b-col>
                <b-col sm="6">
                    <p><b>{{$t('activitymodal.projectid')}}:</b> {{projectAction}}</p>
                    <p><b>{{$t('activitymodal.action')}}:</b> {{action}}</p>
                </b-col>
            </b-row>
            <h5>{{$t('activitymodal.inputinfo')}}</h5>
            <b-row style="text-align:left" id="thongtin-danhap">
                <b-col sm="6">
                    <p><b> {{$t('activitymodal.customername')}} (VI):</b> {{customerNameVI}}</p>
                    <p><b> {{$t('activitymodal.customername')}} (EN):</b> {{customerNameEN}}</p>
                    <p><b> {{$t('activitymodal.fullname')}} (VI):</b> {{fullNameVI}}</p>
                    <p><b> {{$t('activitymodal.fullname')}} (EN):</b> {{fullNameEN}}</p>
                    <p><b> {{$t('activitymodal.birthday')}} nhật:</b> {{birthdate}}</p>
                    <p><b> {{$t('activitymodal.phone')}}</b> {{phone}}</p>
                    <p><b> Email:</b> {{email}}</p>
                    <p><b> {{$t('activitymodal.address')}} (VI):</b> {{addressVI}}</p>
                    <p><b> {{$t('activitymodal.address')}} (EN):</b> {{addressEN}}</p>
                    <p><b> {{$t('activitymodal.country')}}:</b> {{countryName}}</p>
                    <p><b> {{$t('activitymodal.province')}}:</b> {{provinceName}}</p>
                    <p><b> {{$t('activitymodal.district')}}:</b> {{districtName}}</p>
                    <p><b> {{$t('activitymodal.ward')}}:</b> {{wardName}}</p>
                </b-col>
                <b-col sm="6">
                    <p><b> {{$t('activitymodal.fulladdress')}} (VI):</b> {{fullAddressVI}}</p>
                    <p><b> {{$t('activitymodal.fulladdress')}} (EN):</b> {{fullAddressEN}}</p>
                    <p><b> {{$t('mostused.capacity')}}:</b> {{capacity}}</p>
                    <p><b> {{$t('activitymodal.serial')}}:</b> {{serial}}</p>
                    <p><b> {{$t('activitymodal.module')}}:</b> {{Module}}</p>
                    <p><b> {{$t('activitymodal.numberofinv')}}:</b> {{numberDevice}}</p>
                    <p><b> {{$t('activitymodal.numberofmppt')}}:</b> {{numberMPPT}}</p>
                    <p><b> {{$t('activitymodal.latlong')}}:</b> {{latLong}}</p>
                    <p><b> {{$t('activitymodal.numberofmppt')}}:</b> {{communication}}</p>
                    <p><b> Sim:</b> {{sim}}</p>
                    <p><b> {{$t('activitymodal.activeday')}}:</b> {{dayBegin}}</p>
                    <p><b> {{$t('activitymodal.expireday')}}:</b> {{dayEnd}}</p>
                    <p><b> {{$t('activitymodal.insuranapply')}}:</b> {{applyWarranty}}</p>
                    <p><b> {{$t('activitymodal.insuranrate')}}:</b> {{warrantyPercent}}</p>
                    <p><b> {{$t('activitymodal.simulatorrate')}}:</b> {{simulationPercent}}</p>
                </b-col>
            </b-row>
        </b-container>
        </div>
    </b-modal>

    <b-modal id="modal-lg" size="lg" ref="bvmodalcreate" hide-footer>
        <template v-slot:modal-title >
            {{$t('activitymodal.activitydetail')}} <b>{{LogSession}}</b>
        </template>
        <div class="d-block text-center">
            <b-container fluid>
                <h5>{{$t('activitymodal.loginfo')}}</h5>
                <b-row style="text-align:left" id="thongtin-log">
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.actor')}}:</b> {{logFactor}}</p>
                    </b-col>
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.projectid')}}:</b> {{projectAction}}</p>
                        <p><b>{{$t('activitymodal.action')}}:</b> {{action}}</p>
                    </b-col>
                </b-row>
                <h5>{{$t('activitymodal.inputinfo')}}</h5>
                <b-row style="text-align:left" id="thongtin-danhap">
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.serial')}}:</b> {{serial}}</p>
                        <p><b>{{$t('activitymodal.module')}}: </b> {{Module}}</p>
                        <p><b>{{$t('mostused.capacity')}}: </b> {{capacity}}</p>
                        <p><b>{{$t('activitymodal.device')}}: </b> {{device}}</p>
                        <p><b>{{$t('activitymodal.system')}}: </b> {{system}}</p>
                        <p><b>{{$t('activitymodal.projecttype')}}: </b> {{kindProject}}</p>
                    </b-col>
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.numberofinv')}}: </b> {{numberDevice}}</p>
                        <p><b>{{$t('activitymodal.communication')}}: </b> {{communication}}</p>
                        <p><b>Sim: </b> {{sim}}</p>
                        <p><b>{{$t('activitymodal.activedate')}}: </b> {{dayBegin}}</p>
                        <p><b>{{$t('activitymodal.expiredate')}}: </b> {{dayEnd}}</p>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </b-modal>

    <b-modal id="modal-lg" size="lg" ref="bvmodalproject" hide-footer>
        <template v-slot:modal-title style="background-color:green">
            {{$t('mostused.project')}} <b>{{project.NameProject}}</b> 
            <b-button @click="accessProject"><b-icon-eye-fill></b-icon-eye-fill></b-button>
        </template>
        <div class="d-block text-center">
        <b-container fluid>
            <b-container fluid>
                <h5>{{$t('mostused.projectinfo')}}</h5>
                <b-row style="text-align:left" id="thongtin-log">
                    <b-col sm="6">
                        <p><b>{{$t('mostused.fullnameproject')}}:</b></p>
                        <p v-html="project.FullNameProject"></p>
                        <p><b>Email: </b> {{project.Email}}</p>
                    </b-col>
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.address')}}:</b> {{project.Address}}</p>
                        <p><b>{{$t('activitymodal.phone')}}:</b> {{project.Phone}}</p>
                    </b-col>
                </b-row>
            </b-container>
            <b-container fluid>
                <h5>{{$t('mostused.projectspecification')}}</h5>
                <b-row style="text-align:left" id="thongtin-danhap">
                    <b-col sm="6">
                        <p><b>{{$t('activitymodal.device')}}:</b> {{project.projectInfo.Device}}</p>
                        <p><b>{{$t('activitymodal.module')}}: </b> {{project.projectInfo.Capacity}}</p>
                        <p><b>{{$t('activitymodal.numberofinv')}}: </b> {{project.projectInfo.NumberDevice}}</p>
                        <p><b>{{$t('activitymodal.numberofmppt')}}: </b> {{project.projectInfo.NumberMPPT}}</p>
                        <p><b>{{$t('activitymodal.system')}}: </b> {{project.projectInfo.System}}</p>
                        <p><b>{{$t('activitymodal.investtype')}}: </b> {{project.projectInfo.TypeProject}}</p>
                    </b-col>
                    <b-col sm="6">
                        <p><b>{{$t('mostused.project')}}: </b> {{project.projectInfo.Project}}</p>
                        <p><b>{{$t('activitymodal.projecttype')}}: </b> {{project.projectInfo.KindProject}}</p>
                        <p><b>Sim: </b> {{project.projectInfo.Sim}}</p>
                        <p><b>{{$t('activitymodal.activedate')}}: </b> {{project.projectInfo.SimActive_DayBegin}}</p>
                        <p><b>{{$t('activitymodal.expiredate')}}: </b> {{project.projectInfo.SimActive_DayEnd}}</p>
                    </b-col>
                </b-row>
            </b-container>
            <b-container fluid>
                <h5>{{$t('activitymodal.modulestatus')}}</h5>
                <b-row id="thongtin-danhap">
                    <b-col sm="4" v-for="Module in project.moduleInfo" :key="Module.STT">
                        <p><b>{{Module.module}}</b></p>
                        <b-img v-if="Module.status === 0"
                        :src="getPicPath('status_1_On.png')"
                        alt="normal-icon"></b-img>
                        <b-img v-if="Module.status === 1"
                        :src="getPicPath('status_2_On.png')"
                        alt="warning-icon"
                        ></b-img>
                        <b-img v-if="Module.status === 2"
                        :src="getPicPath('status_3_On.png')"
                        alt="error-icon"></b-img>
                        <p><i>{{Module.lastUpdate}}</i></p>
                    </b-col>
                </b-row>
            </b-container>
        </b-container>
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
    </b-container>

</template>

<script>
function getToday() {
    let newDate = new Date();
    let day = ('0' + newDate.getDate()).slice(-2),
        month = ('0' + (newDate.getMonth() + 1)).slice(-2),
        year = newDate.getFullYear();

    return `${year}-${month}-${day}`;
}

import SpinningGroup from '../../spinning.vue'

export default {
    name: 'adminOverview',
    components: {
        SpinningGroup
    },
    data () {
        return {
            activeHover: false,
            selectedStatus: null,
            selectedHidden: 'all',
            optionsSelectStatus: [
                {value: 'all', text: 'Tất cả trạng thái'},
                {value: 0, text: 'Bình thường'},
                {value: 1, text: 'Cảnh báo'},
                {value: 2, text: 'Lỗi'}
            ],
            optionSelecteHidden: [
                {value: 'all', text: 'Tất cả các dự án'},
                {value: 0, text: 'Dự án hoạt động'},
                {value: 1, text: 'Dự án không hoạt động'}
            ],

            selectedType: null,
            optionsSelectType: null,

            project: {
                projectInfo: {},
                moduleInfo: {}
            },
            statusClass: null,
            thongso_overlay: true,
            loaded: false,
            fieldsActivity: null,
            itemsActivity: null,
            perPage_activity: 5,
            currentPage_activity: 1,
            perPage_error: 5,
            currentPage_error: 1,
            items_activity: null,
            fields_activity: null,
            items_error: null,
            fields_error: null,
            value: null,
            maxDate: null,
            LogSession: null,
            recentTime: null,

            //info chung
            logFactor: null,
            projectAction: null,
            action: null,

            //update modal
            customerNameVI: null,
            customerNameEN: null,
            fullNameVI: null,
            fullNameEN: null,
            birthdate: null,
            phone: null,
            email: null,
            addressVI: null,
            addressEN: null,
            countryName: null,
            provinceName: null,
            districtName: null,
            wardName: null,
            fullAddressVI: null,
            fullAddressEN: null,
            capacity: null,
            serial: null,
            Module: null,
            numberDevice: null,
            numberMPPT: null,
            latLong: null,
            communication: null,
            sim: null,
            dayBegin: null,
            dayEnd: null,
            applyWarranty: null,
            warrantyPercent: null,
            simulationPercent: null,

            //create modal
            device: null,
            system: null,
            kindProject: null,

            monitoringData: null,

            currentPageSystem: null,
            totalPageSystem: null,
            numberItems: null,
            totalItems: null,

            systemStatusOverlay: true,

            TotalProject: null,
            TotalProjectNormal: null,
            TotalProjectWarning: null,
            TotalProjectError: null
        }
    },
    mounted () {
        this.currentPageSystem = sessionStorage.getItem('pageNumberDashboardMornitoring')
        this.selectedType = (sessionStorage.getItem('selectProjectType') == 'null') ? 'all'
        : sessionStorage.getItem('selectProjectType')
        this.selectedStatus = (sessionStorage.getItem('selectProjectStatus') == 'null') ? 'all' 
        : sessionStorage.getItem('selectProjectStatus')

        let access_token = localStorage.getItem("accessTokAdmin");
        let id_admin = localStorage.getItem("id_admin");
        let username_admin = localStorage.getItem("username_admin");

        this.$http.post(`${this.$store.state.apiURL}/status-total`, {
            numberItems: 108,
            currentPage: (this.currentPageSystem === null) ? 1 : this.currentPageSystem,
            id: id_admin,
            selectedType: (this.selectedType === null) ? 'all' : this.selectedType,
            selectedStatus: (this.selectedStatus === null) ? 'all' : this.selectedStatus,
            username: username_admin
        }, { headers: { authorization: access_token }}).then(response => {
            let dataRes = response.data
            this.TotalProject = dataRes.TotalProject
            this.TotalProjectNormal = dataRes.TotalProjectNormal
            this.TotalProjectWarning = dataRes.TotalProjectWarning
            this.TotalProjectError = dataRes.TotalProjectError

            this.monitoringData = dataRes.StatusPageData.data
            this.totalItems = dataRes.StatusPageData.total
            this.totalPageSystem = dataRes.StatusPageData.total_pages
            this.currentPageSystem = dataRes.StatusPageData.page
            this.numberItems = dataRes.StatusPageData.per_page
            this.systemStatusOverlay = false

            sessionStorage.setItem('pageNumberDashboardMornitoring', dataRes.StatusPageData.page)
            sessionStorage.setItem('selectProjectType', this.selectedType)
            sessionStorage.setItem('selectProjectStatus', this.selectedStatus)
        }).catch(err => {
        // console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
        });

        this.$http.post(`${this.$store.state.apiURL}/project-type`, {
            id: id_admin,
            username: username_admin
        },
        { headers: { authorization: access_token }}).then(response => {
            this.optionsSelectType = response.data;
        }).catch(err => {
        //   console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
        });

        this.recentTime = getToday();
        this.$http.post(`${this.$store.state.apiURL}/admin-log-station`, 
        { 
            time: getToday(),
            id: id_admin,
            username: username_admin
        },
        { headers: { authorization: access_token },
        }).then(response => {
            let activities = response.data.activities
            let errors = response.data.errors
            this.items_activity = activities.data
            this.fields_activity = activities.label
            this.items_error = errors.data
            this.fields_error = errors.label

            this.value = getToday()
            this.maxDate = getToday()

            this.thongso_overlay = false
        }).catch(err => {
        //   console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
        });
    },
    computed: {
        rows_activity () {
            if (this.items_activity === undefined || this.items_activity === null) {
                return 0
            } else {
                return this.items_activity.length
            }
        },
        rows_error () {
            if (this.items_error === undefined || this.items_activity === null) {
                return 0
            } else {
                return this.items_error.length
            }
        }
    },
    methods: {
        selectHidden: function () {

        },

        selectProjectStatus: function (evt) {
            this.systemStatusOverlay = true
            let val = evt.target.value
            this.selectedStatus = val
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.$http.post(`${this.$store.state.apiURL}/status-total`, {
            numberItems: 108,
            currentPage: 1,
            id: id_admin,
            selectedType: (this.selectedType === null) ? 'all' : this.selectedType,
            selectedStatus: val,
            username: username_admin
            }, { headers: { authorization: access_token },
            }).then(response => {
                let dataRes = response.data
                this.TotalProject = dataRes.TotalProject
                this.TotalProjectNormal = dataRes.TotalProjectNormal
                this.TotalProjectWarning = dataRes.TotalProjectWarning
                this.TotalProjectError = dataRes.TotalProjectError

                this.monitoringData = dataRes.StatusPageData.data
                this.totalItems = dataRes.StatusPageData.total
                this.totalPageSystem = dataRes.StatusPageData.total_pages
                this.currentPageSystem = dataRes.StatusPageData.page
                this.numberItems = dataRes.StatusPageData.per_page
                this.systemStatusOverlay = false

                sessionStorage.setItem('pageNumberDashboardMornitoring', dataRes.StatusPageData.page)
                sessionStorage.setItem('selectProjectType', this.selectedType)
                sessionStorage.setItem('selectProjectStatus', this.selectedStatus)
            }).catch(err => {
            // console.log(err.response);
            let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
            });
        },

        selectProjectTypeChange: function (evt) {
            this.systemStatusOverlay = true
            let access_token = localStorage.getItem("accessTokAdmin");
            let id_admin = localStorage.getItem("id_admin");
            let username_admin = localStorage.getItem("username_admin");
            let val = evt.target.value
            this.selectedType = val

            this.$http.post(`${this.$store.state.apiURL}/status-total`, {
                numberItems: 108,
                currentPage: 1,
                id: id_admin,
                selectedType: val,
                selectedStatus: (this.selectedStatus === null) ? 'all' : this.selectedStatus,
                username: username_admin
                }, { headers: { authorization: access_token },
                }).then(response => {
                    let dataRes = response.data
                    this.TotalProject = dataRes.TotalProject
                    this.TotalProjectNormal = dataRes.TotalProjectNormal
                    this.TotalProjectWarning = dataRes.TotalProjectWarning
                    this.TotalProjectError = dataRes.TotalProjectError

                    this.monitoringData = dataRes.StatusPageData.data
                    this.totalItems = dataRes.StatusPageData.total
                    this.totalPageSystem = dataRes.StatusPageData.total_pages
                    this.currentPageSystem = dataRes.StatusPageData.page
                    this.numberItems = dataRes.StatusPageData.per_page
                    this.systemStatusOverlay = false

                    sessionStorage.setItem('pageNumberDashboardMornitoring', dataRes.StatusPageData.page)
                    sessionStorage.setItem('selectProjectType', this.selectedType)
                    sessionStorage.setItem('selectProjectStatus', this.selectedStatus)
                }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
                });
        },

        paginateSystem: function (page) {
            this.systemStatusOverlay = true
            let access_token = localStorage.getItem("accessTokAdmin");
            let id_admin = localStorage.getItem("id_admin");
            let username_admin = localStorage.getItem("username_admin");

            this.$http.post(`${this.$store.state.apiURL}/status-total`, {
            numberItems: 108,
            currentPage: page,
            selectedType: (this.selectedType === null) ? 'all' : this.selectedType,
            selectedStatus: (this.selectedStatus === null) ? 'all' : this.selectedStatus,
            id: id_admin,
            username: username_admin
            }, { headers: { authorization: access_token },
            }).then(response => {
                let dataRes = response.data
                this.TotalProject = dataRes.TotalProject
                this.TotalProjectNormal = dataRes.TotalProjectNormal
                this.TotalProjectWarning = dataRes.TotalProjectWarning
                this.TotalProjectError = dataRes.TotalProjectError

                this.monitoringData = dataRes.StatusPageData.data
                this.totalItems = dataRes.StatusPageData.total
                this.totalPageSystem = dataRes.StatusPageData.total_pages
                this.currentPageSystem = dataRes.StatusPageData.page
                this.numberItems = dataRes.StatusPageData.per_page
                this.systemStatusOverlay = false

                sessionStorage.setItem('pageNumberDashboardMornitoring', dataRes.StatusPageData.page)
                sessionStorage.setItem('selectProjectType', this.selectedType)
                sessionStorage.setItem('selectProjectStatus', this.selectedStatus)
            }).catch(err => {
            // console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
            });
        },
        getPicPath: picName => {
            let picPath = require(`../../../assets/images/${picName}`)
            return picPath
        },
        handleSelectItem(data){
            let access_token = localStorage.getItem("accessTokAdmin");
            let el = document.getElementById(data.PersonId)
            el.classList.toggle('flashing')
            this.systemStatusOverlay = true
            this.$http.get(`${this.$store.state.apiURL}/project-detail`, {
                headers: { authorization: access_token },
                params: {
                    PersonID: data.PersonId
                }
            }).then(response => {
                this.project = response.data
                this.systemStatusOverlay = false
                this.$refs.bvmodalproject.show()
            }).catch(err => {
            // console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
            });
        },
        logSubmit(evt) {
            evt.preventDefault()
            let access_token = localStorage.getItem("accessTokAdmin");
            this.thongso_overlay = true
            this.$http.post(`${this.$store.state.apiURL}/admin-log-station`, {
                time: this.value
            }, {headers: { authorization: access_token }}).then(response => {
            let activities = response.data.activities
            let errors = response.data.errors
            this.items_activity = activities.data
            this.fields_activity = activities.label
            this.items_error = errors.data
            this.fields_error = errors.label

            this.thongso_overlay = false
            }).catch(err => {
            // console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
            });
        },
        myRowClickHandler(record, index) {
            let access_token = localStorage.getItem("accessTokAdmin");
            this.LogSession = record.LogSession
            this.thongso_overlay = true
            this.$http.post(`${this.$store.state.apiURL}/admin-log-detail`, {
                logSession: record.LogSession
            }, {headers: { authorization: access_token }}).then(response => {
                let dataRes = response.data
                if (dataRes.typeAction === 'Update') {
                    let updateData = response.data.ActionData
                    if (updateData !== undefined) {
                        this.logFactor = updateData.PersonID
                        this.projectAction = updateData.CurrentProject
                        this.action = updateData.Action

                        this.customerNameVI = updateData.C_CustomerNameVI
                        this.customerNameEN = updateData.C_CustomerNameEN
                        this.fullNameVI = updateData.C_FullNameVI
                        this.fullNameEN = updateData.C_FullNameEN
                        this.birthdate = updateData.C_Birthdate
                        this.phone = updateData.C_Phone
                        this.email = updateData.C_Email
                        this.addressVI = updateData.C_AddressVI
                        this.addressEN = updateData.C_AddressEN
                        this.countryName = updateData.CountryName
                        this.provinceName = updateData.ProvinceName
                        this.districtName = updateData.DistrictName
                        this.wardName = updateData.WardName
                        this.fullAddressVI = updateData.C_FullAddressVI
                        this.fullAddressEN = updateData.C_FullAddressEN
                        this.capacity = updateData.C_Capacity
                        this.serial = updateData.C_Serial
                        this.Module = updateData.C_Module
                        this.numberDevice = updateData.C_SLInverter
                        this.numberMPPT = updateData.C_SLMPPT
                        this.latLong = updateData.C_LatLog
                        this.communication = updateData.C_Communication
                        this.sim = updateData.C_Sim
                        this.dayBegin = updateData.C_DayBegin
                        this.dayEnd = updateData.C_DayEnd
                        this.applyWarranty = updateData.C_ApDungBaoHiem
                        this.warrantyPercent = updateData.C_TyLeBaoHiem
                        this.simulationPercent = updateData.C_MoPhong
                    } else {
                        this.logFactor = null
                        this.projectAction = null
                        this.action = null

                        this.customerNameVI = null
                        this.customerNameEN = null
                        this.fullNameVI = null
                        this.fullNameEN = null
                        this.birthdate = null
                        this.phone = null
                        this.email = null
                        this.addressVI = null
                        this.addressEN = null
                        this.countryName = null
                        this.provinceName = null
                        this.districtName = null
                        this.wardName = null
                        this.fullAddressVI = null
                        this.fullAddressEN = null
                        this.capacity = null
                        this.serial = null
                        this.Module = null
                        this.numberDevice = null
                        this.numberMPPT = null
                        this.latLong = null
                        this.communication = null
                        this.sim = null
                        this.dayBegin = null
                        this.dayEnd = null
                        this.applyWarranty = null
                        this.warrantyPercent = null
                        this.simulationPercent = null
                    }
                    this.$refs.bvmodalupdate.show()
                    this.thongso_overlay = false
                } else if (dataRes.typeAction === 'Create') {
                    let createData = response.data.ActionData
                    if (createData !== undefined) {
                        this.logFactor = createData.Manager
                        this.projectAction = createData.CurrentProject
                        this.action = createData.Action

                        this.serial = createData.Serial
                        this.Module = createData.Module
                        this.capacity = createData.Capacity
                        this.device = createData.Device
                        this.system = createData.System
                        this.kindProject = createData.KindProject
                        this.numberDevice = createData.NumberDevice
                        this.communication = createData.Communication
                        this.sim = createData.Sim
                        this.dayBegin = createData.SimActive_DayBegin
                        this.dayEnd = createData.SimActive_DayEnd
                    } else {
                        this.logFactor = null
                        this.projectAction = null
                        this.action = null

                        this.serial = null
                        this.Module = null
                        this.capacity = null
                        this.device = null
                        this.system = null
                        this.kindProject = null
                        this.numberDevice = null
                        this.communication = null
                        this.sim = null
                        this.dayBegin = null
                        this.dayEnd = null
                    }
                    this.$refs.bvmodalcreate.show()
                    this.thongso_overlay = false
                }
            }).catch(err => {
            // console.log(err.response);
        let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
            });
        },
        accessProject() {
            let access_token = localStorage.getItem("accessTokAdmin")
            this.$http
                .post(`${this.$store.state.apiURL}/login_auth`, {
                username: this.project.PersonID,
                password: access_token,
                admin: true
                })
                .then(response => {
                sessionStorage.setItem("jwt", response.data.token);
                let projectType = response.data.projectType;
                if (projectType === "SWH") {
                    let routeData = this.$router.resolve({
                    name: 'overview-swh'
                    });
                    window.open(routeData.href, "_blank");
                } else if (projectType === "PV") {
                    let routeData = this.$router.resolve({
                    name: "overview-pv"
                    });
                    window.open(routeData.href, "_blank");
                }
                }).catch(err => {
                    let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push(`/${this.$route.params.lang}`)
                } else {
                    this.$refs.modalerrorloadpage.show()
                }
                })
        }
    }
}
</script>

<style>
.flashing {
  animation: flash .5s;
}

@keyframes flash {
  0% {
    background-color: none;
  }
  50% {
    background-color: green;
  }
  100% {
    background-color: none;
  }
}

#banner-info {
    margin: 10px 0;
}

#banner-total-project {
    border: 1px solid white;
    border-radius: 15px;
    padding: 10px;
    background-color: #40bcff;
    color: white;
}

#banner-total-normal {
    border: 1px solid white;
    border-radius: 15px;
    padding: 10px;
    background-color: #1cff55;
    color: white;
}

#banner-total-warning {
    border: 1px solid white;
    border-radius: 15px;
    padding: 10px;
    background-color:#dee600;
    color: white;
}

#banner-total-error {
    border: 1px solid white;
    border-radius: 15px;
    padding: 10px;
    background-color: #ff4f4f;
    color: white;
}

table {
    text-align: center;
}

#log-station-tables {
    padding: 5px 0;
    border-bottom: 1px solid #b3b3b3;
    margin-bottom: 10px;
}

#thongtin-log {
    padding: 10px 0;
    border-bottom: 1px solid #b3b3b3;
    margin: 10px 0;
}

#formLog {
    margin: 10px 0;
    padding: 10px 0;
    border-bottom: 1px solid #b3b3b3;
}

.normal-status {
    background-color: green;
    border:white solid 1px;
    color: white;
    text-align: center;
    padding: 20px 0;
}

.warning-class {
    background-color: orange;
    border:white solid 1px;
    color: white;
    text-align: center;
    padding: 20px 0;
}

.error-class {
    background-color: red;
    border:white solid 1px;
    color: white;
    text-align: center;
    padding: 20px 0;
}

.status-monitoring {
    padding: 0 !important;
}

</style>