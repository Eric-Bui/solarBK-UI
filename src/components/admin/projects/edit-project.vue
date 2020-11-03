<template>
<div>
      <b-overlay 
        :show="thongso_overlay"
        rounded="sm">
        <template v-slot:overlay>
            <spinning-group></spinning-group>
        </template>
    <b-container fluid>
        <b-row>
            <b-button style="display: inline" variant="success" @click="info">Xem dự án</b-button>
            <b-button style="display: inline" @click="editDeleteProject" variant="danger">Xóa dự án</b-button>
        </b-row>
        <b-row>
            <!-- <router-link to='/thong-tin-du-an' exact>
                <a>Thông tin</a>
            </router-link>
            <router-link to="/hinh-anh-du-an" exact>
                <a>Hình ảnh</a>
            </router-link>
            <router-link to="/bao-hiem-du-an" exact>
                <a>Bảo hiểm</a>
            </router-link>
            <router-link to="/lich-su-du-an" exact>
                <a>Lịch sử</a>
            </router-link> -->
        </b-row>
        <b-row class="module-information">
            <h5>Hệ</h5>
            <b-overlay 
                    :show="deleteModuleProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
            <b-button @click="addModule" variant="success" style="margin: 0 0 5px 5px">
                <b-icon-plus-circle></b-icon-plus-circle>
            </b-button>
            <b-table :items="itemsSerials" :fields="fieldsSerials" small>
            <template v-slot:cell(action)="row">
            <b-button variant="success" size="sm" class="mr-1" @click="editModule(row.item, $event.target)">
              <b-icon-pencil></b-icon-pencil>
            </b-button>
            <b-button variant="danger" size="sm" class="mr-1" @click="deleteModule(row.item, $event.target)">
              <b-icon-x></b-icon-x>
            </b-button>
            </template>
            </b-table>
            </b-overlay>
        </b-row>
        <b-row class="project-information">
            <b-col sm="6">
                <div v-if="divInfoView">
                    <h5>THÔNG TIN DỰ ÁN</h5>
                    <label for="customer-name">Tên khách hàng</label>
                    <b-form-input id="customer-name" size="sm" v-model="customerNameInput" disabled>
                    </b-form-input>
                    <label for="system-name">Hệ thống</label>
                    <b-form-input id="system-name" size="sm" v-model="systemNameInput" disabled>
                    </b-form-input>
                    <label for="address-full">Địa chỉ</label>
                    <b-form-input id="address-full" size="sm" v-model="addressInput" disabled>
                    </b-form-input>
                    <b-form-row>
                        <b-col sm="3">
                            <label for="nation">Quốc gia</label>
                            <b-form-select id="nation" v-model="selectedNation" 
                            :options="addressDetail.optionsNation" disabled></b-form-select>
                        </b-col>
                        <b-col sm="3">
                            <label for="province">Tỉnh - Thành Phố</label>
                            <b-form-select id="province" v-model="selectedProvince"
                            :options="addressDetail.optionsProvince" disabled></b-form-select>
                        </b-col>
                        <b-col sm="3">
                            <label for="city">Quận - Huyện</label>
                            <b-form-select id="city" v-model="selectedCity" 
                            :options="addressDetail.optionsCity" disabled></b-form-select>
                        </b-col>
                        <b-col sm="3">
                            <label for="ward">Phường - Xã</label>
                            <b-form-select id="ward" v-model="selectedWard"
                            :options="addressDetail.optionsWard" disabled></b-form-select>
                        </b-col>
                    </b-form-row>
                    <label for="total-capacity">Tổng công suất</label>
                    <b-form-input id="total-capacity" type="number" size="sm" v-model="capacityInput" disabled>
                    </b-form-input>
                    <label for="date-install">Ngày lắp đặt</label>
                    <b-form-datepicker id="date-install" 
                    v-model="installDateInput"
                    size="sm" disabled></b-form-datepicker>
                    <label for="birthdate">Ngày sinh</label>
                    <b-form-datepicker id="birthdate"
                    v-model="birthDateInput"
                    size="sm" disabled></b-form-datepicker>
                    <label for="telephone">Số điện thoại</label>
                    <b-form-input id="telephone" size="sm" v-model="telephoneInput" disabled></b-form-input>
                    <label for="email">Email</label>
                    <b-form-input id="email" size="sm" disabled v-model="emailInput"></b-form-input>
                    <b-button variant="info" @click="updateReadyView">Cập nhật</b-button>
                </div>
                <div v-if="!divInfoView">
                    <b-overlay 
                    :show="editProjectInfoProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
                    <h5>THÔNG TIN DỰ ÁN</h5>
                    <validation-observer ref="observer" v-slot="{ passes }">
                        <b-form id="form-login" @submit.stop.prevent="passes(updateProjectInfo)">
                            <validation-provider
                            name="customer_name"
                            :rules="{
                                required: true, 
                                min: 3, 
                                max: 100,
                                regex: regex
                            }"
                            v-slot="validationContext">
                            <label for="customer-name">Tên khách hàng</label>
                            <b-form-input id="customer-name" 
                            size="sm" v-model="customerNameInput"
                            :state="getValidationState(validationContext)">
                            </b-form-input>
                            <b-form-invalid-feedback id="input-1-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                            name="system_name"
                            :rules="{
                                required: true, 
                                min: 3, 
                                max: 100,
                                regex: regex
                            }"
                            v-slot="validationContext">
                            <label for="system-name">Hệ thống</label>
                            <b-form-input id="system-name" 
                            size="sm" v-model="systemNameInput"
                            :state="getValidationState(validationContext)">
                            </b-form-input>
                            <b-form-invalid-feedback id="input-2-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                            name="address"
                            :rules="{
                                required: true, 
                                min: 3, 
                                max: 200,
                                regex: regex
                            }"
                            v-slot="validationContext">
                            <label for="address">Địa chỉ</label>
                            <b-form-input id="address" 
                            size="sm" v-model="addressInput"
                            :state="getValidationState(validationContext)">
                            </b-form-input>
                            <b-form-invalid-feedback id="input-3-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <b-form-row>
                                <b-col sm="3">
                                    <validation-provider
                                    name="nation"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                                    <label for="nation">Quốc gia</label>
                                    <b-form-select id="nation" v-model="selectedNation"
                                    @change="selecteBox('nation', 'selectedNation')"
                                    :options="addressDetail.optionsNation"
                                    :state="getValidationState(validationContext)"></b-form-select>
                                    <b-form-invalid-feedback id="input-4-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                                <b-col sm="3">
                                    <validation-provider
                                    name="province"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                                    <label for="province">Tỉnh - Thành Phố</label>
                                    <b-form-select id="province" v-model="selectedProvince"
                                    @change="selecteBox('province', 'selectedProvince')"
                                    :options="provinceOptions"
                                    :state="getValidationState(validationContext)"></b-form-select>
                                    <b-form-invalid-feedback id="input-5-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                                <b-col sm="3">
                                    <validation-provider
                                    name="city"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                                    <label for="city">Quận - Huyện</label>
                                    <b-form-select id="city" v-model="selectedCity"
                                    @change="selecteBox('district', 'selectedCity')"
                                    :options="cityOptions"
                                    :state="getValidationState(validationContext)"></b-form-select>
                                    <b-form-invalid-feedback id="input-6-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                                <b-col sm="3">
                                    <validation-provider
                                    name="ward"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                                    <label for="ward">Phường - Xã</label>
                                    <b-form-select id="ward" v-model="selectedWard"
                                    :options="wardOptions"
                                    :state="getValidationState(validationContext)"></b-form-select>
                                    <b-form-invalid-feedback id="input-7-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                            </b-form-row>
                            <validation-provider
                                    name="total-capacity"
                                    :rules="{
                                        required: true, 
                                        min: 1, 
                                        max: 50,
                                        regex: regex
                                    }"
                                    v-slot="validationContext">
                            <label for="total-capacity">Tổng công suất</label>
                            <b-form-input id="total-capacity" step="any"
                            size="sm" v-model="capacityInput" type="number"
                            :state="getValidationState(validationContext)">
                            </b-form-input>
                            <b-form-invalid-feedback id="input-8-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="date-install"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                            <label for="date-install">Ngày lắp đặt</label>
                            <b-form-datepicker id="date-install" 
                            v-model="installDateInput"
                            :state="getValidationState(validationContext)"
                            size="sm"></b-form-datepicker>
                            <b-form-invalid-feedback id="input-9-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="birthdate"
                                    :rules="{required: false}"
                                    v-slot="validationContext">
                            <label for="birthdate">Ngày sinh</label>
                            <b-form-datepicker id="birthdate"
                            v-model="birthDateInput"
                            :state="getValidationState(validationContext)"
                            size="sm"></b-form-datepicker>
                            <b-form-invalid-feedback id="input-10-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                            
                            <validation-provider
                                    name="telephone"
                                    :rules="{
                                        required: false,
                                        regex: regex
                                    }"
                                    v-slot="validationContext">
                            <label for="telephone">Số điện thoại</label>
                            <b-form-input id="telephone" size="sm" v-model="telephoneInput"
                            :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-11-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="email"
                                    :rules="{
                                        required: false,
                                        regex: regex
                                    }"
                                    v-slot="validationContext">
                            <label for="email">Email</label>
                            <b-form-input id="email" size="sm" v-model="emailInput"
                            :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-12-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <b-button variant="success" type="submit">Lưu</b-button>
                            <b-button variant="normal" @click="cancelEditView">Hủy</b-button>
                        </b-form>
                    </validation-observer>
                    </b-overlay>
                </div>
            </b-col>
            <b-col sm="6">
                <h5>THÔNG TIN TÀI KHOẢN</h5>
                <div v-if="changePassView">
                <b-form-group>
                    <b-form-row>
                        <b-col sm="6">
                            <label for="username">Tài khoản</label>
                            <b-form-input id="username" size="sm" v-model="usernameInput" disabled></b-form-input>
                        </b-col>
                        <b-col sm="6">
                            <label for="password">Mật khẩu</label>
                            <b-form-input id="password" size="sm" type="password" 
                            v-model="passwordInput" disabled></b-form-input>
                        </b-col>
                    </b-form-row>
                    <b-button variant="info" @click="viewPassWordChange(false)">Đổi mật khẩu</b-button>
                </b-form-group>
                </div>
                <div v-if="!changePassView">
                    <b-overlay 
                    :show="changePasswordProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
                    <validation-observer ref="observer" v-slot="{ passes }">
                    <b-form id="form-login" @submit.stop.prevent="passes(changePassword)">
                        <b-form-row>
                            <b-col sm="6">
                                <validation-provider
                                name="oldpasswordinput"
                                :rules="{
                                    required: true, 
                                    min: 3, 
                                    max: 100}"
                                v-slot="validationContext">
                                <label for="oldpasswordinput">Mật khẩu cũ</label>
                                <b-form-input id="oldpasswordinput" size="sm" v-model="oldpassword"
                                :state="getValidationState(validationContext)"></b-form-input>
                                <b-form-invalid-feedback id="input-1-live-feedback">
                                {{ validationContext.errors[0] }}
                                </b-form-invalid-feedback>
                                </validation-provider>
                            </b-col>
                            <b-col sm="6">
                                <validation-provider
                                name="latitude"
                                :rules="{
                                    required: true, 
                                    min: 3, 
                                    max: 100
                                }"
                                v-slot="validationContext">
                                <label for="newpasswordinput">Mật khẩu mới</label>
                                <b-form-input id="newpasswordinput" size="sm" v-model="newpassword"
                                :state="getValidationState(validationContext)"></b-form-input>
                                <b-form-invalid-feedback id="input-2-live-feedback">
                                {{ validationContext.errors[0] }}
                                </b-form-invalid-feedback>
                                </validation-provider>
                            </b-col>
                            <b-button variant="success" type="submit">Lưu</b-button>
                            <b-button variant="normal" @click="viewPassWordChange(true)">Hủy</b-button>
                        </b-form-row>
                    </b-form>
                    </validation-observer>
                    </b-overlay>
                </div>

                <h5>BẢN ĐỒ</h5>
                <div v-if="changeLatLong">
                <b-form-group>
                    <b-form-row>
                        <b-col sm="6">
                            <label for="latitude">Latitude</label>
                            <b-form-input id="latitude" v-model="latitudeInput" size="sm" disabled></b-form-input>
                        </b-col>
                        <b-col sm="6">
                            <label for="longtitude">Longtitude</label>
                            <b-form-input id="longtitude" v-model="longtitudeInput" size="sm" disabled></b-form-input>
                        </b-col>
                    </b-form-row>
                    <b-button variant="info" @click="changeLatLongView(false)">Cập nhật</b-button>
                </b-form-group>
                </div>
                
                <div v-if="!changeLatLong">
                    <b-overlay 
                    :show="changeLatLongProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
                    <validation-observer ref="observer" v-slot="{ passes }">
                    <b-form id="form-login" @submit.stop.prevent="passes(changeLatLongEdit)">
                    <b-form-row>
                        <b-col sm="6">
                            <validation-provider
                            name="latitude"
                            :rules="{
                                required: true, 
                                min: 3, 
                                max: 100,
                                regex:/^([0-9_@. ])*$/
                            }"
                            v-slot="validationContext">
                            <label for="latitude">Latitude</label>
                            <b-form-input id="latitude" v-model="latitudeInput" size="sm"
                            :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-1-live-feedback">
                            {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                        </b-col>
                        <b-col sm="6">
                            <validation-provider
                            name="longtitude"
                            :rules="{required: true, min: 3, max: 100, regex:/^([0-9_@. ])*$/}"
                            v-slot="validationContext">
                            <label for="longtitude">Longtitude</label>
                            <b-form-input id="longtitude" v-model="longtitudeInput" size="sm"
                            :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-2-live-feedback">
                            {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                        </b-col>
                        <b-button style="float:right" variant="success" type="submit">Lưu</b-button>
                        <b-button style="float:right" variant="normal" @click="changeLatLongView(true)">Hủy</b-button>
                    </b-form-row>
                    </b-form>
                    </validation-observer>
                    </b-overlay>
                </div>
                <div>
                <GmapMap v-if="mapLoaded"
                    :center="{lat: latMap, lng: longMap}"
                    :zoom="10"
                    map-type-id="terrain">
                    <GmapMarker
                    :position="{lat: latMap, lng: longMap}"
                    :clickable="true"
                    :draggable="false"
                    @click="center={lat: latMap, lng: longMap}"
                    />
                </GmapMap>
                </div>
            </b-col>
        </b-row>
    </b-container>
      </b-overlay>
        <b-modal style="color:green" id="bv-model-success" ref="bvmodalsuccess" hide-footer>
            <template v-slot:modal-title>
                <code>Thông báo</code>
            </template>
            <div class="d-block text-center">
                <p>Cập nhật dữ liệu thành công</p>
            </div>
        </b-modal>
        <b-modal style="color:red" id="bv-model-error" ref="bvmodalerror" hide-footer>
            <template v-slot:modal-title>
                <code>Thông báo</code>
            </template>
            <div class="d-block text-center">
                <p>Cập nhật dữ liệu thất bại. Vui lòng kiểm tra và thử lại</p>
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

        <b-modal id="bv-modal-select-module" no-close-on-backdrop ref="bvmodalselectemodule" hide-footer>
            <template v-slot:modal-title>
                <code>Thêm hệ</code>
            </template>
            <div class="d-block text-center">
                <b-container fluid>
                    <b-overlay 
                    :show="addModuleProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
                    <validation-observer ref="observer" v-slot="{ passes }">
                    <b-form id="form-login" @submit.stop.prevent="passes(addNewModule)">
                        <validation-provider
                            name="selectmoduletype"
                            :rules="{required: true}"
                            v-slot="validationContext">
                        <label for="selectmoduletype">Chọn loại hệ</label>
                        <b-select id="selectmoduletype" v-model="moduleSelect" 
                        :state="getValidationState(validationContext)"
                        @change="selectModuleChange">
                            <b-select-option :value="null">Chọn hệ</b-select-option>
                            <b-select-option value="pv">Hệ cấp nguồn</b-select-option>
                            <b-select-option value="swh">Hệ máy nước nóng</b-select-option>
                        </b-select>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                        </validation-provider>

                        <div v-if="moduleSelect === 'pv'">
                            <validation-provider
                            name="addmodulename"
                            :rules="{required: false, regex: regex}"
                            v-slot="validationContext">
                            <label for="addmodulename">Tên hệ</label>
                            <b-input id="addmodulename" type="text" v-model="addModuleName"
                            :state="getValidationState(validationContext)"></b-input>
                            <b-form-invalid-feedback id="input-11-live-feedback">
                            {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                            name="addmoduleserial"
                            :rules="{required: true, min: 3, max: 100}"
                            v-slot="validationContext">
                            <label for="addmoduleserial">Số Seri</label>
                            <b-input id="addmoduleserial" type="text" v-model="addModuleSerial"
                            :state="getValidationState(validationContext)"></b-input>
                            <b-form-invalid-feedback id="input-2-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                            name="addkindmodule"
                            :rules="{required: true, min: 3, max: 50, regex: regex}"
                            v-slot="validationContext">
                            <label for="addkindmodule">Loại Inverter</label>
                            <b-input id="addkindmodule" type="text" v-model="addModuleKindModule"
                            :state="getValidationState(validationContext)"></b-input>
                            <b-form-invalid-feedback id="input-3-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                            
                            <validation-provider
                            name="addmoduleinvest"
                            :rules="{required: true}"
                            v-slot="validationContext">
                            <label id="addmoduleinvest">Loại đầu tư</label>
                            <b-select id="addmoduleinvest" v-model="addModuleInvest"
                            :state="getValidationState(validationContext)">
                                <b-select-option value="DIRECT">Trực tiếp</b-select-option>
                                <b-select-option value="ESCO">ESCO</b-select-option>
                            </b-select>
                            <b-form-invalid-feedback id="input-4-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <b-form-row>
                                <b-col sm="6">
                                    <validation-provider
                                    name="addmodulecapacity"
                                    :rules="{required: true, min: 1, max: 50, regex: regex}"
                                    v-slot="validationContext">
                                    <label for="addmodulecapacity">Công suất</label>
                                    <b-input id="addmodulecapacity" v-model="addModuleCapacity" type="number"
                                    step="any"
                                    :state="getValidationState(validationContext)"></b-input>
                                    <b-form-invalid-feedback id="input-5-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                                <b-col sm="6">
                                    <validation-provider
                                    name="addmodulenumberdevice"
                                    :rules="{required: true, regex: regex}"
                                    v-slot="validationContext">
                                    <label for="addmodulenumberdevice">Số lượng thiết bị</label>
                                    <b-input id="addmodulenumberdevice" type="number"
                                    v-model="addModuleNumberDevice"
                                    :state="getValidationState(validationContext)"></b-input>
                                    <b-form-invalid-feedback id="input-6-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                    </validation-provider>
                                </b-col>
                            </b-form-row>
                            <validation-provider
                                    name="addmodulemppt"
                                    :rules="{required: true, regex: regex}"
                                    v-slot="validationContext">
                            <label for="addmodulemppt">Số lượng MPPT</label>
                            <b-input type="number" id="addmodulemppt" v-model="addModuleMppt"
                            :state="getValidationState(validationContext)"></b-input>
                            <b-form-invalid-feedback id="input-7-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="addmodulecommunication"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                            <label for="addmodulecommunication">Chuẩn giao tiếp</label>
                            <b-select id="addmodulecommunication"
                            v-model="addModuleCommunication" :state="getValidationState(validationContext)">
                                <b-select-option :value="null">Chọn chuẩn giao tiếp</b-select-option>
                                <b-select-option value="Ethernet">Ethernet</b-select-option>
                                <b-select-option value="Wifi">Wifi</b-select-option>
                                <b-select-option value="Sim">Sim</b-select-option>
                                <b-select-option value="other">Khác</b-select-option>
                            </b-select>
                            <b-form-invalid-feedback id="input-8-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="addmoduleinstalldate"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                            <label for="addmoduleinstalldate">Ngày lắp đặt</label>
                            <b-datepicker id="addmoduleinstalldate" :state="getValidationState(validationContext)"
                            v-model="addModuleInstallDate"></b-datepicker>
                            <b-form-invalid-feedback id="input-9-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                            </validation-provider>

                            <div v-if="addModuleCommunication === 'Sim'">
                                <validation-provider
                                    name="addmodulesim"
                                    :rules="{required: false, regex: /^([0-9_@. ])*$/}"
                                    v-slot="validationContext">
                            <label for="addmodulesim">Sim</label>
                            <b-input type="number" id="addmodulesim" v-model="addModuleSim"
                            :state="getValidationState(validationContext)"></b-input>
                                <b-form-invalid-feedback id="input-10-live-feedback">
                                        {{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                </validation-provider>
                            <b-form-row>
                                <b-col sm="6">
                                    <label for="addmodulebegindate">Ngày kích hoạt</label>
                                    <b-datepicker id="addmodulebegindate" v-model="addModuleBeginDate">
                                    </b-datepicker>
                                </b-col>
                                <b-col sm="6">
                                    <label for="addmoduleenddate">Ngày hết hạn</label>
                                    <b-datepicker id="addmoduleenddate" v-model="addModuleEndDate"></b-datepicker>
                                </b-col>
                            </b-form-row>
                            </div>
                            <b-button class="mt-3" block 
                        variant="success" id="saveeditmodule" type="submit">Lưu</b-button>
                        </div>
                        <div v-if="moduleSelect === 'swh'">
                            <h5>Đang cập nhật</h5>
                            <b-button class="mt-3" block 
                        variant="success" id="saveeditmodule" type="submit">Lưu</b-button>
                        </div>
                    </b-form>
                    </validation-observer>
                    </b-overlay>
                </b-container>
            </div>
        </b-modal>

       <b-modal id="bv-modal-example" no-close-on-backdrop ref="bvmodaleEditModule" hide-footer>
        <template v-slot:modal-title>
            <code>Chỉnh sửa hệ</code>
        </template>
        <div class="d-block text-center">
            <b-container fluid>
                <b-overlay 
                    :show="editModuleProcess"
                    rounded="sm">
                    <template v-slot:overlay>
                        <spinning-group></spinning-group>
                    </template>
                <validation-observer ref="observer" v-slot="{ passes }">
                    <b-form id="form-login" @submit.stop.prevent="passes(saveEditModule)">
                    <b-row>
                        <b-col sm="6">
                            <validation-provider
                                    name="systemedit"
                                    :rules="{required: true, min: 3, max: 200, regex: regex}"
                                    v-slot="validationContext">
                            <label for="systemedit">Hệ thống</label>
                            <b-form-input type="text" id="systemedit" v-model="systemEdit" 
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-4-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="moduleedit"
                                    :rules="{required: false, regex: regex}"
                                    v-slot="validationContext">
                            <label for="moduleedit">Tên hệ</label>
                            <b-form-input type="text" id="moduleedit" v-model="moduleNameEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-4-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="serialedit"
                                    :rules="{required: true, min: 3, max: 100}"
                                    v-slot="validationContext">
                            <label for="serialedit">Số Seri</label>
                            <b-form-input type="text" id="serialedit" v-model="serialEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-5-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="capacityedit"
                                    :rules="{required: true, min: 1, max: 50, regex: regex}"
                                    v-slot="validationContext">
                            <label for="capacityedit">Công suất</label>
                            <b-form-input type="number" id="capacityedit" v-model="capacityEdit" step="any"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-6-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="kindprojectedit"
                                    :rules="{required: true, min: 3, max: 50, regex: regex}"
                                    v-slot="validationContext">
                            <label for="kindprojectedit">Loại thiết bị</label>
                            <b-form-input type="text" id="kindprojectedit" v-model="kindProjectEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-6-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                        </b-col>
                        <b-col sm="6">
                            <validation-provider
                                    name="numberdeviceedit"
                                    :rules="{required: true, regex: regex}"
                                    v-slot="validationContext">
                            <label for="numberdeviceedit">Số lượng thiết bị</label>
                            <b-form-input type="number" id="numberdeviceedit" v-model="numberDeviceEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-1-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="numbermpptedit"
                                    :rules="{required: true, regex: regex}"
                                    v-slot="validationContext">
                            <label for="numbermpptedit">Số lượng MPPT</label>
                            <b-form-input type="number" id="numbermpptedit" v-model="numberMpptEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-2-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <validation-provider
                                    name="communicationedit"
                                    :rules="{required: true}"
                                    v-slot="validationContext">
                            <label for="communicationedit">Giao tiếp</label>
                            <b-select id="communicationedit"
                            v-model="communicationEdit" :state="getValidationState(validationContext)">
                                <b-select-option :value="null">Chọn chuẩn giao tiếp</b-select-option>
                                <b-select-option value="Ethernet">Ethernet</b-select-option>
                                <b-select-option value="Wifi">Wifi</b-select-option>
                                <b-select-option value="Sim">Sim</b-select-option>
                                <b-select-option value="other">Khác</b-select-option>
                            </b-select>
                            <b-form-invalid-feedback id="input-3-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>
                            
                            <validation-provider
                                    name="simedit"
                                    :rules="{required: false, regex: /^([0-9_@. ])*$/}"
                                    v-slot="validationContext">
                            <label for="simedit">Sim</label>
                            <b-form-input type="text" id="simedit" v-model="simEdit"
                            size="sm" :state="getValidationState(validationContext)"></b-form-input>
                            <b-form-invalid-feedback id="input-3-live-feedback">
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                            </validation-provider>

                            <label for="begindateedit">Ngày kích hoạt</label>
                            <b-form-datepicker id="begindateedit" 
                            v-model="daybeginEdit"
                            size="sm"></b-form-datepicker>
                            <label for="enddateedit">Ngày hết hạn</label>
                            <b-form-datepicker id="enddateedit"
                            v-model="dayendEdit"
                            size="sm"></b-form-datepicker>
                        </b-col>
                    </b-row>
                    <b-button class="mt-3" block 
                    variant="success" id="saveeditmodule" type="submit">Lưu</b-button>
                    </b-form>
                </validation-observer>
                </b-overlay>
            </b-container>
        </div>
        </b-modal>
        <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
        <template v-slot:modal-title>
            <code>Cảnh báo</code>
        </template>
        <div class="d-block text-center">
            <h6>Không thể truy cập người dùng</h6>
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
</div>
</template>
<script>
import SpinningGroup from '../../spinning.vue'
import {gmapApi} from 'vue2-google-maps'

export default {
    name: 'projectEdit',
    props: {
        personID: String
    },
    components: {
      SpinningGroup
    },
    data () {
        return {
            editProjectInfoProcess: false,
            changePasswordProcess: false,
            changeLatLongProcess: false,
            editModuleProcess: false,
            addModuleProcess: false,
            deleteModuleProcess: false,

            provinceOptions: null,
            wardOptions: null,
            cityOptions: null,

            moduleSelect: null,
            addModuleName: null,
            addModuleSerial: null,
            addModuleCapacity: null,
            addModuleNumberDevice: null,
            addModuleCommunication: null,
            addModuleInstallDate: null,
            addModuleKindModule: null,
            addModuleSim: null,
            addModuleBeginDate: null,
            addModuleEndDate: null,
            addModuleMppt: null,
            addModuleInvest: null,

            systemEdit: null,
            moduleNameEdit: null,
            serialEdit: null,
            capacityEdit: null,
            kindProjectEdit: null,
            numberDeviceEdit: null,
            communicationEdit: null,
            simEdit: null,
            daybeginEdit: null,
            dayendEdit: null,
            numberMpptEdit: null,

            newpassword: null,
            oldpassword: null,

            selectedNation: null,
            selectedProvince: null,
            selectedCity: null,
            selectedWard: null,
            itemsSerials: [],
            fieldsSerials: [
                {key: 'System', label: ''},
                {key: 'Module', label: 'Hệ'},
                {key: 'Serial', label: 'Số Seri'},
                {key: 'Capacity', label: 'Công suất'},
                {key: 'KindProject', label: 'Inverter'},
                {key: 'NumberDevice', label: 'Số lượng thiết bị'},
                {key: 'NumberMPPT', label: 'MPPT'},
                {key: 'Communication', label: 'Giao tiếp'},
                {key: 'Sim', label: 'Sim'},
                {key: 'SimActive_DayBegin', label: 'Ngày kích hoạt'},
                {key: 'SimActive_DayEnd', label: 'Ngày hết hạn'},
                {key: 'action', label: ''}
            ],
            editModuleData: {},
            customerNameInput: null,
            birthDateInput: null,
            capacityInput: null,
            emailInput: null,
            addressInput: null,
            installDateInput: null,
            systemNameInput: null,
            telephoneInput: null,
            usernameInput: null,
            passwordInput: null,

            latitudeInput: null,
            longtitudeInput: null,

            latMap: null,
            longMap: null,

            addressDetail: {},
            divInfoView: true,
            changePassView: true,
            changeLatLong: true,
            thongso_overlay: true,
            mapLoaded: false,

            serialToWhere: null,
            regex: /^([a-z0-9A-Z_ÀÁÂÃÈÉẾÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéếêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ_@;:., ])*$/,
            // regex_abc: /^([a-zA-Z0-9_-@;: ])*$/,
        }
    },
    mounted () {
        let access_token = localStorage.getItem("accessTokAdmin")
        let id_admin = localStorage.getItem("id_admin")
        let username_admin = localStorage.getItem("username_admin")

        this.$http.post(`${this.$store.state.apiURL}/admin-view-edit-project`, {
            id: id_admin,
            username: username_admin,
            PersonID: this.$props.personID,
            actionType: 'View'
        }, 
        { headers: { authorization: access_token } }
        ).then(response => {
            // console.log(response.data)
            let dataRes = response.data
            this.itemsSerials = dataRes.itemsSerials
            this.addressDetail = dataRes.addressDetail
            let addressDetail = dataRes.addressDetail
            let projectInfo = dataRes.projectInfo

            this.provinceOptions = addressDetail.optionsProvince
            this.cityOptions = addressDetail.optionsCity
            this.wardOptions = addressDetail.optionsWard

            this.selectedNation = dataRes.projectAddress.CountryID
            this.selectedProvince = dataRes.projectAddress.ProvinceID
            this.selectedCity = dataRes.projectAddress.DistrictID
            this.selectedWard = dataRes.projectAddress.WardID

            this.birthDateInput = projectInfo.birthDate
            this.capacityInput = projectInfo.capacity
            this.customerNameInput = projectInfo.customerName
            this.emailInput = projectInfo.email
            this.addressInput = dataRes.projectAddress.streetName
            this.installDateInput = projectInfo.installDate
            this.systemNameInput = projectInfo.systemName
            this.telephoneInput = projectInfo.telephone

            this.usernameInput = projectInfo.PersonID
            this.passwordInput = projectInfo.Password

            this.latitudeInput = dataRes.Latitude
            this.longtitudeInput = dataRes.Longtitude

            this.latMap = parseFloat(dataRes.Latitude)
            this.longMap = parseFloat(dataRes.Longtitude)

            this.mapLoaded = true
            this.thongso_overlay = false
        }).catch(err => {
            //handle errors
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
    methods: {
        async selecteBox (typeSelect, selectParam) {
            await this.$nextTick()
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            
            this.$http.post(`${this.$store.state.apiURL}/admin-get-select-box`, {
                id: id_admin,
                PersonID: this.$props.personID,
                username: username_admin,
                type: typeSelect,
                id: this[selectParam]
            }, { headers: { authorization: access_token } }).then(response => {
                // console.log(response.data)
                let dataRes = response.data
                if (dataRes.type === 'nation') {
                    this.provinceOptions = dataRes.data
                } else if (dataRes.type === 'province') {
                    this.cityOptions = dataRes.data
                } else if (dataRes.type === 'district') {
                    this.wardOptions = dataRes.data
                }
            }).catch(err => {

            })
        },

        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },
        addModule() {
            this.$refs.bvmodalselectemodule.show()
        },

        async selectModuleChange() {
            await this.$nextTick()
        },

        updateProjectInfo() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.editProjectInfoProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-project-info`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Edit',
                username: username_admin,
                customerName: this.customerNameInput,
                systemName: this.systemNameInput,
                address: this.addressInput,
                nation: this.selectedNation,
                province: this.selectedProvince,
                city: this.selectedCity,
                ward: this.selectedWard,
                capacity: this.capacityInput,
                installDate: this.installDateInput,
                birthdate: this.birthDateInput,
                telephone: this.telephoneInput,
                email: this.emailInput

            }, { headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                this.editProjectInfoProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                //handle errors
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.editProjectInfoProcess = false
            })
        },

        updateReadyView() {
            this.divInfoView = false
        },

        cancelEditView () {
            this.divInfoView = true
        },
        deleteModule(item, button) {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.deleteModuleProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-delete-module`, {
                PersonID: this.$props.personID,
                Serial: item.Serial
            }, { headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                this.deleteModuleProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.deleteModuleProcess = false
            })
        },

        editModule (item, button) {
            this.systemEdit = item.System
            this.moduleNameEdit = item.Module
            this.serialEdit = item.Serial
            this.capacityEdit = item.Capacity
            this.kindProjectEdit = item.KindProject
            this.numberDeviceEdit = item.NumberDevice
            this.communicationEdit = item.Communication
            this.simEdit = item.Sim
            this.daybeginEdit = item.SimActive_DayBegin
            this.dayendEdit = item.SimActive_DayEnd
            this.numberMpptEdit = item.NumberMPPT
            
            this.serialToWhere = item.Serial

            this.$refs.bvmodaleEditModule.show()
        },

        viewPassWordChange(status) {
            this.changePassView = status
        },
        changeLatLongView(status) {
            this.changeLatLong = status  
        },

        addNewModule() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            if (this.addModuleProcess == false) {
            this.addModuleProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-new-module`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Edit',
                username: username_admin,
                selectTypeModule: this.moduleSelect,
                addModuleName: this.addModuleName,
                addModuleSerial: this.addModuleSerial,
                addModuleCapacity: this.addModuleCapacity,
                addModuleNumberDevice: this.addModuleNumberDevice,
                addModuleCommunication: this.addModuleCommunication,
                addModuleInstallDate: this.addModuleInstallDate,
                addModuleKindModule: this.addModuleKindModule,
                addModuleSim: this.addModuleSim,
                addModuleBeginDate: this.addModuleBeginDate,
                addModuleEndDate: this.addModuleEndDate,
                addModuleMppt: this.addModuleMppt,
                addModuleInvest: this.addModuleInvest

            },{ headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                this.addModuleProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.addModuleProcess = false
            })
            }
        },

        changeLatLongEdit() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.changeLatLongProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-latlong-info`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Edit',
                username: username_admin,
                latitudeInput: this.latitudeInput,
                longtitudeInput: this.longtitudeInput
            }, { headers: { authorization: access_token } }).then(response => {
                this.$refs.bvmodalsuccess.show()
                this.changeLatLongProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.changeLatLongProcess = false
            })
        },

        changePassword() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.changePasswordProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-password-info`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Edit',
                username: username_admin,
                oldpassword: this.oldpassword,
                newpassword: this.newpassword
            }, { headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                this.changePasswordProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.changePasswordProcess = false
            })
        },

        editDeleteProject() {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            
            this.$http.post(`${this.$store.state.apiURL}/admin-update-delete-project`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Delete',
                username: username_admin
            }, { headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                window.close()
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
            })
        },

        saveEditModule () {
            let access_token = localStorage.getItem("accessTokAdmin")
            let id_admin = localStorage.getItem("id_admin")
            let username_admin = localStorage.getItem("username_admin")
            this.editModuleProcess = true
            this.$http.post(`${this.$store.state.apiURL}/admin-update-module-info`, {
                id: id_admin,
                PersonID: this.$props.personID,
                actionType: 'Edit',
                username: username_admin,
                systemEdit: this.systemEdit,
                moduleNameEdit: this.moduleNameEdit,
                serialEdit: this.serialEdit,
                capacityEdit: this.capacityEdit,
                kindProjectEdit: this.kindProjectEdit,
                numberDeviceEdit: this.numberDeviceEdit,
                communicationEdit: this.communicationEdit,
                simEdit: this.simEdit,
                daybeginEdit: this.daybeginEdit,
                dayendEdit: this.dayendEdit,
                numberMpptEdit: this.numberMpptEdit,
                serialToWhere: this.serialToWhere
            }, { headers: { authorization: access_token } })
            .then(response => {
                this.$refs.bvmodalsuccess.show()
                this.editModuleProcess = false
                setTimeout(function(){
                    window.location.reload()
                }, 3 * 1000);
            }).catch(err => {
                let status = err.response.status
                if (status === 403 || status === 409) {
                    localStorage.removeItem("accessTokAdmin")
                    localStorage.removeItem("id_admin")
                    localStorage.removeItem("username_admin")
                    sessionStorage.removeItem('jwt')
                    this.$router.push("/")
                } else {
                    this.$refs.bvmodalerror.show()
                }
                this.editModuleProcess = false
            })
        },
        info() {
      let access_token = localStorage.getItem("accessTokAdmin")
      this.$http
        .post(`${this.$store.state.apiURL}/login_auth`, {
          username: this.$props.personID,
          password: access_token,
          admin: true
        })
        .then(response => {
          sessionStorage.setItem("jwt", response.data.token)
          let projectType = response.data.projectType
          if (projectType === "SWH") {
            let routeData = this.$router.resolve({
              path: "/swh/tong-quan-he-thong"
            })
            window.open(routeData.href, "_blank")
          } else if (projectType === "PV") {
            let routeData = this.$router.resolve({
              path: "/pv/tong-quan-he-thong"
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
    },
    computed: {
        google: gmapApi,
        client_id () {
        return this.$store.state.client_id
        }
    },
}
</script>
<style scoped>
.module-information {
    border-bottom:1px solid #b3b3b3; padding: 10px 0;
}

.project-information {
    padding: 10px 0;
}

.vue-map-container {
  width: 100%;
  height: 300px;
}

button {
    margin: 5px 3px;
    float: right;
}
</style>