<template>
    <div>
        <b-container fluid>
            <b-row id='table-hide'>
                <p>Danh sách dự án đã ẩn</p><br>
                <b-pagination
                v-model="currentPage_hidden"
                :total-rows="rows_hidden"
                :per-page="perPage_hidden"
                aria-controls="table-hidden"
                ></b-pagination>
                <b-table
                id="table-hidden"
                style="text-align: center"
                striped
                hover
                bordered
                small
                head-variant="dark"
                :fields="fields_hidden"
                :items="items_hidden"
                :per-page="perPage_hidden"
                :current-page="currentPage_hidden"
                >
                    <template v-slot:cell(checkBtn)="row">
                        <b-checkbox v-model="selectedRestore" :value="row.item.PersonID"></b-checkbox>
                    </template>
                </b-table>
                <p>Tổng cộng: {{rows_hidden}} dòng</p>
            </b-row>

            <b-row id="button-facing">
                <div id="button-change">
                    <b-button variant="danger" @click="addHideProject">
                        <b-icon-caret-up-fill></b-icon-caret-up-fill>
                    </b-button>
                    <b-button variant="success" @click="restoreHideProject">
                        <b-icon-caret-down-fill></b-icon-caret-down-fill>
                    </b-button>
                </div>
            </b-row>

            <b-row id="table-unhide">
                <div>
                    <b-button v-b-toggle.option-filter-unhide class="m-1">Tùy chọn lọc</b-button>
                    <b-collapse id="option-filter-unhide">
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
                                v-model="sortBy"
                                id="sortBySelect"
                                :options="sortOptions"
                                class="w-75"
                                >
                                <template v-slot:first>
                                    <option :value="null">-- none --</option>
                                </template>
                                </b-form-select>
                                <b-form-select 
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
                                v-model="filter"
                                type="search"
                                id="filterInput"
                                placeholder="Type to Search"
                                ></b-form-input>
                                <b-input-group-append>
                                <b-button :disabled="!filter" @click="clearSortTable">
                                    Clear
                                </b-button>
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
                            <b-form-checkbox-group v-model="filterOn" class="mt-1">
                                <b-form-checkbox value="PersonID">ID dự án</b-form-checkbox>
                                <b-form-checkbox value="ProjectName">Tên dự án</b-form-checkbox>
                                <b-form-checkbox value="Serial">Số Seri</b-form-checkbox>
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
                            <b-form-select v-model="perPage_unhide" 
                            id="perPageSelect" size="sm" :options="pageOptions"></b-form-select>
                            </b-form-group>
                        </b-col>

                        <b-col sm="7" md="6" class="my-1">
                            <b-pagination
                            v-model="currentPage_unhide"
                            v-if="!thongso_overlay"
                            :total-rows="rows_unhide"
                            :per-page="perPage_unhide"
                            align="fill"
                            size="sm"
                            class="my-0"
                            ></b-pagination>
                        </b-col>
                        </b-row>
                    </b-container>
                    </b-collapse>
                </div>
                <b-table
                id="table-unhide"
                style="text-align: center"
                striped
                hover
                bordered
                small
                head-variant="dark"
                :fields="fields_unhide"
                :items="items_unhide"
                :per-page="perPage_unhide"
                :current-page="currentPage_unhide"
                >
                    <template v-slot:cell(checkBtn)="row">
                        <b-checkbox v-model="selectedAddHidden" :value="row.item.PersonID"></b-checkbox>
                    </template>
                </b-table>
                <p>Tổng cộng: {{rows_unhide}} dòng</p>
            </b-row>
        </b-container>

        <b-modal id="bv-invalid-add-hide" size="md" ref="bvmodalinvalid" hide-footer>
            <template v-slot:modal-title>
                <code>Dự án để thêm trống</code>
            </template>
            <div class="d-block text-center">
                <p>{{invalid_message}}</p>
            </div>
        </b-modal>

        <b-modal style="color:red" id="bv-model-error-page" ref="modalerrorloadpage" hide-footer>
            <template v-slot:modal-title>
                <code>Tác vụ thất bại</code>
            </template>
            <div class="d-block text-center">
                <p>Có lỗi xảy ra!</p>
            </div>
        </b-modal>

        <b-modal style="color:green" id="bv-model-success" ref="bvmodalsuccess" hide-footer>
            <template v-slot:modal-title>
                <code>Thông báo</code>
            </template>
            <div class="d-block text-center">
                <p>Cập nhật dữ liệu thành công</p>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: "adminSetting",
    data () {
        return {
            fields_hidden: null,
            items_hidden: null,
            perPage_hidden: null,
            currentPage_hidden: null,

            selectedAddHidden: [],
            selectedRestore: [],

            fields_unhide: [],
            items_unhide: [],
            perPage_unhide: null,
            currentPage_unhide: null,

            invalid_message: null,

            pageOptions: [10, 15],
            filter: null,
            filterOn: [],
            sortDirection: null,
            sortDesc: null,
            sortBy: '',
            thongso_overlay: true
        }
    },
    mounted() {
        let access_token = localStorage.getItem("accessTokAdmin")
        let id_admin = localStorage.getItem("id_admin")
        let username_admin = localStorage.getItem("username_admin")
        this.$http.get(`${this.$store.state.apiURL}/admin-hidden-project`, {
            headers: { authorization: access_token }
        }).then(res => {
            let hideProject = res.data.hideProject
            let unhideProject = res.data.unhideProject

            this.perPage_hidden = 15
            this.currentPage_hidden = 1

            this.perPage_unhide = 15
            this.currentPage_unhide = 1

            this.fields_hidden = hideProject.label
            this.items_hidden = hideProject.data

            this.fields_unhide = unhideProject.label
            this.items_unhide = unhideProject.data

            this.thongso_overlay = false
        })
    },
    computed: {
        rows_hidden () {
            if (this.items_hidden === undefined || this.items_hidden === null) {
                return 0
            } else {
                return this.items_hidden.length
            }
        },
        rows_unhide () {
            if (this.items_unhide === undefined || this.items_unhide === null) {
                return 0
            } else {
                return this.items_unhide.length
            }
        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage_unhide = 1
        },

        sortOptions() {
            return this.fields_unhide
                .filter(f => f.sortable)
                .map(f => {
            return { text: f.label, value: f.key }
            })
        }
    },
    methods: {
        clearSortTable: function() {
            this.filter = ''
        },

        addHideProject() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")

            if (this.selectedAddHidden.length > 0) {
                this.$http.post(`${this.$store.state.apiURL}/admin-add-hidden-project`, {
                    PersonIDArray: this.selectedAddHidden
                }, { headers: { authorization: access_token }}).then(res => {
                    this.$refs.bvmodalsuccess.show()
                    this.editProjectInfoProcess = false
                    setTimeout(function(){
                        window.location.reload()
                    }, 3 * 1000);
                }).catch(err => {
                    this.$refs.modalerrorloadpage.show()
                })
            } else {
                this.invalid_message = 'Chọn ít nhất 1 dự án để thêm vào danh sách ẩn!';
                this.$refs.bvmodalinvalid.show()
            }
        },
        restoreHideProject() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")

            if (this.selectedRestore.length > 0) {
                this.$http.post(`${this.$store.state.apiURL}/admin-restore-hidden-project`, {
                    PersonIDArray: this.selectedRestore 
                }, { headers: { authorization: access_token }}).then(res => {
                    this.$refs.bvmodalsuccess.show()
                    this.editProjectInfoProcess = false
                    setTimeout(function(){
                        window.location.reload()
                    }, 3 * 1000);
                })
            } else {
                this.invalid_message = 'Chọn ít nhất 1 dự án để khôi phục '
            }
        }
    }
}
</script>

<style scoped>
#table-hide {
    border-bottom: 1px solid #d6d6d6;
    margin-top: 10px;
}

#table-unhide {
    border-top: 1px solid #d6d6d6;
    margin-bottom: 10px;
}

#button-facing {
    text-align: center;
    margin: 10px 0;
}
</style>