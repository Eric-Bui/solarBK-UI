<template>
    <b-container>
        <b-button @click="turnback" style="float:left;margin-right: 10px" variant="success">
            <b-icon-caret-left-fill></b-icon-caret-left-fill>
            <b>Trở về</b>
        </b-button>
        <h5 id="changepass-title">Đổi mật khẩu người dùng</h5>
            <validation-observer ref="observer" v-slot="{ passes }">
            <b-form id="form-login" @submit.stop.prevent="passes(handleSubmit)">
                <b-row>
                <b-col sm="4">
                <validation-provider
                name="username"
                :rules="{required: true, min: 3, max: 50}"
                v-slot="validationContext">
                <label>Tên đăng nhập</label>
                <b-input-group>
                    <b-input-group-prepend>
                    <b-btn variant="outline-info" :disabled="true">
                        <b-icon-person-fill></b-icon-person-fill>
                    </b-btn>
                    </b-input-group-prepend>
                    <b-form-input type="text" name="username" v-model="username" @keydown="nameKeydown($event)"
                    :state="getValidationState(validationContext)"
                    autofocus></b-form-input>
                    <b-form-invalid-feedback id="input-1-live-feedback">
                    {{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-input-group>
                </validation-provider>
                <br />
                <validation-provider name="oldPassword" :rules="{ required: true, min: 3, max: 50}" v-slot="validationContext">
                <label>Mật khẩu cũ</label>
                <b-input-group>
                    <b-input-group-prepend>
                    <b-btn variant="outline-info" :disabled="true">
                        <b-icon-shield-lock-fill></b-icon-shield-lock-fill>
                    </b-btn>
                    </b-input-group-prepend>
                    <b-form-input :type="passwordToggle" name="oldPassword" v-model="oldPassword" 
                    @keydown="nameKeydown($event)"
                    :state="getValidationState(validationContext)"></b-form-input>
                    <b-form-invalid-feedback id="input-2-live-feedback">
                    {{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    <b-input-group-append>
                    <b-btn variant="outline-secondary" @click="switchVisibility"><b-icon-eye-fill></b-icon-eye-fill></b-btn>
                    </b-input-group-append>
                </b-input-group>
                </validation-provider>
                <br />
                <validation-provider name="confirmOldPassword" :rules="{ required: true, min: 3, max: 50}" v-slot="validationContext">
                <label>Xác nhận Mật khẩu cũ</label>
                <b-input-group>
                    <b-input-group-prepend>
                    <b-btn variant="outline-info" :disabled="true">
                        <b-icon-shield-fill></b-icon-shield-fill>
                    </b-btn>
                    </b-input-group-prepend>
                    <b-form-input :type="passwordToggle" name="confirmOldPassword" 
                    v-model="confirmOldPassword" @keydown="nameKeydown($event)"
                    :state="getValidationState(validationContext)"></b-form-input>
                    <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    <b-input-group-append>
                    <b-btn variant="outline-secondary" @click="switchVisibility"><b-icon-eye-fill></b-icon-eye-fill></b-btn>
                    </b-input-group-append>
                </b-input-group>
                </validation-provider>
                </b-col>
                <b-col sm="4">
                <validation-provider name="newPassword" :rules="{ required: true, min: 3, max: 50}" v-slot="validationContext">
                <label>Mật khẩu mới</label>
                <b-input-group>
                    <b-input-group-prepend>
                    <b-btn variant="outline-info" :disabled="true">
                        <b-icon-shield-lock></b-icon-shield-lock>
                    </b-btn>
                    </b-input-group-prepend>
                    <b-form-input :type="passwordToggle" name="newPassword" v-model="newPassword" 
                    @keydown="nameKeydown($event)"
                    :state="getValidationState(validationContext)"></b-form-input>
                    <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    <b-input-group-append>
                    <b-btn variant="outline-secondary" @click="switchVisibility"><b-icon-eye-fill></b-icon-eye-fill></b-btn>
                    </b-input-group-append>
                </b-input-group>
                </validation-provider>
                <br />
                <validation-provider name="confirmNewPassword" :rules="{ required: true, min: 3, max: 50}" v-slot="validationContext">
                <label>Xác nhận Mật khẩu mới</label>
                <b-input-group>
                    <b-input-group-prepend>
                    <b-btn variant="outline-info" :disabled="true">
                        <b-icon-shield></b-icon-shield>
                    </b-btn>
                    </b-input-group-prepend>
                    <b-form-input :type="passwordToggle" name="confirmNewPassword" 
                    v-model="confirmNewPassword" @keydown="nameKeydown($event)"
                    :state="getValidationState(validationContext)"></b-form-input>
                    <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    <b-input-group-append>
                    <b-btn variant="outline-secondary" @click="switchVisibility"><b-icon-eye-fill></b-icon-eye-fill></b-btn>
                    </b-input-group-append>
                </b-input-group>
                </validation-provider>
                <br />
                <b-form-checkbox
                    id="checkAccept"
                    v-model="status"
                    name="checkAccept"
                    value="accepted"
                    unchecked-value="not_accepted"
                    @change="checkBoxCheck($event)"
                    >
                    <i>Tôi xác nhận thay đổi mật khẩu</i>
                </b-form-checkbox>
                <b-button style="float:right" type="submit" v-if="loaded" :disabled="btnStatus">Đổi mật khẩu</b-button>
                </b-col>
                <b-col sm="4">
                <b>Thông báo từ hệ thống</b>
                <div v-if="!loaded">
                    <SpinningGroup></SpinningGroup>
                </div>
                    <div>
                    <b-alert
                    show
                    dismissible
                    fade
                    variant="danger"
                    v-model="showErrorAlert"
                    >
                    {{error}}
                    </b-alert>
                    </div>
                    <div>
                    <b-alert
                    show
                    dismissible
                    fade
                    variant="warning"
                    v-model="showWarningAlert"
                    >
                    <ul>Vui lòng 
                        <li>nhập các thông tin bắt buộc</li>
                        <li>Check chấp nhận thay đổi mật khẩu</li>
                        <li>Bấm đổi mật khẩu</li>
                    </ul>
                    </b-alert>
                    </div>
                    <div>
                    <b-alert
                    show
                    dismissible
                    fade
                    variant="success"
                    v-model="showSuccessAlert"
                    >
                    {{successMess}}
                    <ul> Quý khách vui lòng
                        <li>Giữ thông tin bảo mật về tài khoản</li>
                        <li>Ấn trở về</li>
                    </ul>
                    </b-alert>
                    </div>
                </b-col>
                </b-row>
            </b-form>
            </validation-observer>
    </b-container>    
</template>
<script>
export default {
    name: 'changePassView',
    data () {
        return {
            passwordToggle: 'password',
            loaded: true,
            username: null,
            oldPassword: null,
            confirmOldPassword: null,
            newPassword: null,
            confirmNewPassword: null,
            btnStatus: true,
            status: 'not_accepted',
            showErrorAlert: false,
            showWarningAlert: true,
            error: null,
            showSuccessAlert: false,
            successMess: null
        }
    },
    methods: {
        turnback () {
            this.$router.push('/');
        },
        checkBoxCheck (e) {
            if (e === 'accepted') {
                this.btnStatus = false
            } else {
                this.btnStatus = true
            }
        },
        switchVisibility() {
        this.passwordToggle = this.passwordToggle === 'password' ? 'text' : 'password'
        },
        getValidationState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
        },
        nameKeydown(e) {
        if (/[&\/\\#,+()$~%.'"!^:*?<>{}]/g.test(e.key)) {
            e.preventDefault();
        }
        },
        handleSubmit (e) {
            this.loaded = false
            this.$http.post(`${this.$store.state.apiURL}/change-pass`, {
                username: this.username,
                oldPassword: this.oldPassword,
                confirmOldPassword: this.confirmOldPassword,
                newPassword: this.newPassword,
                confirmNewPassword: this.confirmNewPassword
            }).then(response => {
                this.loaded = true
                this.showWarningAlert = false
                this.showSuccessAlert = true
                this.showErrorAlert = false

                this.successMess = response.data.message
            }).catch(err => {
                this.loaded = true
                this.showWarningAlert = false
                this.showSuccessAlert = false
                this.showErrorAlert = true

                this.error = err.response.data.message
            })
        }
    }
}
</script>
<style scoped>
.container {
    margin-top: 20px;
    /* background-color: lightgray; */
}

#form-login {
    margin-top: 20px;
    border-top: 1px solid grey;
    padding-top: 10px;
}

</style>