import Vue from 'vue'
import Router from 'vue-router'
import dashBoard from '../components/dashboard.vue'
import loginPage from '../components/login.vue'
import overviewComponentSWH from '../components/swh/overview/the-content-overview.vue'
import overviewComponentPV from '../components/pv-sofar/overview/the-content-overview.vue'
import statusComponent from '../components/swh/status/the-content-status.vue'
import summaryComponent from '../components/swh/summary/the-content-thongke.vue'
import summaryChart from '../components/swh/summary/chart-summary.vue'
import report from '../components/swh/summary/report.vue'
import otherParams from '../components/swh/summary/other-params.vue'
import systemData from '../components/swh/summary/system-data.vue'
import summaryComponentPV from '../components/pv-sofar/summary/the-content-thongke.vue'
import detailView from '../components/pv-sofar/summary/detail-view.vue'
import changePassView from '../components/change-pass.vue'
import adminRedirect from '../components/admin-redirect.vue'
import adminDashboard from '../components/admin-dashboard.vue'
import warrantyComponentPV from '../components/pv-sofar/warranty/the-content-warranty.vue'
import maintenanceComponentPV from '../components/pv-sofar/maintenance/the-content-maintenance.vue'

//parent project
import dashboardParent from '../components/dashboard-parent-project.vue'
import listProjectParent from '../components/parent-project/list-project-parent.vue'

//admin children
import adminInfo from '../components/admin/admin-info/admin-info.vue'
import adminOverview from '../components/admin/overview/admin-overview.vue'
import allProjects from '../components/admin/projects/all-project.vue'
import projectByType from '../components/admin/projects/project-by-type.vue'
import projectEdit from '../components/admin/projects/edit-project.vue'

// admin setting
import adminSetting from '../components/admin/setting/admin-setting.vue'

// admin logger
import adminLogger from '../components/admin/logger/admin-logger.vue'

import axios from 'axios'

import { store } from '../store'

import i18n from '../i18n'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  saveScrollPosition: true,
  routes: [
    {
      path: '/:lang',
      component: {
        template: '<router-view></router-view>'
      },
      children: [
        {
          path: 'swh',
          name: 'swh',
          component: dashBoard,
          meta: { requiresAuth: true },
          children: [
            {
              name: 'overview-swh',
              path: 'tong-quan-he-thong',
              component: overviewComponentSWH,
              meta: { title: 'Tổng quan', requiresAuth: true }
            },
            {
              name: 'status-swh',
              path: 'trang-thai-he-thong',
              component: statusComponent,
              meta: { title: 'Trạng thái', requiresAuth: true }
            },
            {
              name: 'summary-swh',
              path: 'thong-ke-bao-cao',
              component: summaryComponent,
              meta: { title: 'Thống kê', requiresAuth: true },
              children: [
                {
                  name: 'summarychart',
                  path: 'xem-bieu-do',
                  component: summaryChart,
                  meta: { title: 'Biểu đồ', requiresAuth: true }
                },
                {
                  name: 'statitic',
                  path: 'du-lieu-he-thong',
                  component: systemData,
                  meta: { title: 'Dữ liệu hệ thống', requiresAuth: true }
                },
                {
                  name: 'report',
                  path: 'bao-cao',
                  component: report,
                  meta: { title: 'Báo cáo tháng', requiresAuth: true }
                },
                {
                  name: 'otherparams',
                  path: 'thong-so-khac',
                  component: otherParams,
                  meta: { title: 'Thông số khác', requiresAuth: true }
                }
              ]
            }
          ]
        },
        {
          path: 'pv',
          name: 'pv',
          component: dashBoard,
          meta: { requiresAuth: true },
          children: [
            {
              name: 'overview-pv',
              path: 'tong-quan-he-thong',
              component: overviewComponentPV,
              meta: { title: 'Tổng quan', requiresAuth: true }
            },
            {
              name: 'summary-pv',
              path: 'thong-ke-bao-cao',
              component: summaryComponentPV,
              meta: { title: 'Thống kê', requiresAuth: true },
              children: [
                {
                  name: 'module',
                  path: 'module',
                  component: detailView,
                  meta: { title: 'Thống kê Module', requiresAuth: true },
                  props(route) {
                    return { Serial: route.query.data }
                  }
                }
              ]
            },
            {
              name: 'warranty-pv',
              path: 'bao-hanh',
              component: warrantyComponentPV,
              meta: { title: 'Bảo hành', requiresAuth: true }
            },
            {
              name: 'maintenance-pv',
              path: 'bao-tri',
              component: maintenanceComponentPV,
              meta: { title: 'Bảo trì', requiresAuth: true }
            }
          ]
        },
        { path: '', name: 'login', component: loginPage, meta: { guest: true, title: 'Login' } },
        { path: 'changepass', name: 'changepass', component: changePassView, meta: { guest: true, title: 'Change pass' } },
        {
          path: 'admin-redirect', name: 'adminRedirect', component: adminRedirect,
          meta: { guest: true, title: 'Chuyển hướng' }
        },
        {
          path: 'parent', name: 'parentProject', component: dashboardParent, meta: { requiresAuthParent: true },
          children: [
            {
              name: 'listProjectParent',
              path: 'danh-sach-du-an',
              component: listProjectParent,
              meta: { title: 'Danh sách dự án', requiresAuthParent: true }
            }
          ]
        },
        {
          path: 'admin',
          name: 'admin',
          component: adminDashboard,
          meta: { requiresAuthAdmin: true },
          children: [
            {
              name: 'adminInfo',
              path: 'thong-tin-admin',
              component: adminInfo,
              meta: { title: 'Thông tin quản trị viên', requiresAuthAdmin: true }
            },
            {
              name: 'adminOverview',
              path: 'trang-chu',
              component: adminOverview,
              meta: { title: 'Trang chủ', requiresAuthAdmin: true }
            },
            {
              name: 'adminLogger',
              path: 'logger',
              component: adminLogger,
              meta: { title: 'Logger', requiresAuthAdmin: true }
            },
            {
              name: 'adminSetting',
              path: 'tuy-chon',
              component: adminSetting,
              meta: { title: 'Tùy chọn', requiresAuthAdmin: true }
            },
            {
              name: 'adminProjects',
              path: 'du-an',
              component: allProjects,
              meta: { title: 'Dự án', requiresAuthAdmin: true },
              children: [
                {
                  name: 'projectType',
                  path: 'loai-du-an',
                  component: projectByType,
                  meta: { title: 'Dự án theo loại', requiresAuthAdmin: true },
                  props(route) {
                    return { projectType: route.query.data }
                  }
                },
                {
                  name: 'editProject',
                  path: 'chinh-sua-du-an',
                  component: projectEdit,
                  meta: { title: 'Chỉnh sửa dự án', requiresAuthAdmin: true },
                  props(route) {
                    return { personID: route.query.data }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})

function checkAdminToken() {
  let token
  if (localStorage.getItem('jwt') != null) {
    token = localStorage.getItem('jwt')
  } else {
    token = sessionStorage.getItem('jwt')
  }
  return token
}

function checkProjectTypeAdminTok() {
  let projectType
  if (localStorage.getItem('jwt') != null) {
    projectType = localStorage.getItem('projectType')
  } else {
    projectType = sessionStorage.getItem('projectType')
  }
  return projectType
}

function langSet(lang) {
  if (!['vi', 'en'].includes(lang)) {
    lang = 'vi'
  }
  if (i18n.locale === lang) {

  }
  i18n.locale = lang
  return lang
}

// NAVIGATION GUARD
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  let lang = to.params.lang
  if (lang === undefined) {
    let oldlang = localStorage.getItem('clientLang')
    if (oldlang != null || oldlang != undefined) {
      langSet(oldlang)
      next(oldlang)
    } else {
      langSet('vi')
      next('vi')
    }
    
  } else {
    langSet(lang)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if ((checkAdminToken() == null)) {
        next({
          path: `/`,
          params: { nextURL: to.fullPath }
        })
      } else {
        let token = checkAdminToken()
        axios.get(`${store.state.apiURL}/checktoken`, 
        { headers: { 'authorization': token } }).then(response => {
            if (localStorage.getItem('jwt') != null) {
              localStorage.setItem('username', response.data.userName)
              localStorage.setItem('projectType', response.data.projectType)
              localStorage.setItem('kindProject', response.data.kindProject)
              localStorage.setItem('Device', response.data.Device)
            } else {
              sessionStorage.setItem('username', response.data.userName)
              sessionStorage.setItem('projectType', response.data.projectType)
              sessionStorage.setItem('kindProject', response.data.kindProject)
              sessionStorage.setItem('Device', response.data.Device)
            }
            next()
          }).catch(err => {
            let errData = err.response
            if (errData !== undefined && errData.status === 409 && errData.data.message === 'Token expired') {
              axios.get(`${store.state.apiURL}/refreshtoken`, 
              { headers: { 'authorization': token } }).then(response => {
                  if (localStorage.getItem('jwt') != null) {
                    localStorage.setItem('jwt', response.data.token)
                    localStorage.setItem('username', response.data.userName)
                    localStorage.setItem('projectType', response.data.projectType)
                    localStorage.setItem('kindProject', response.data.kindProject)
                    localStorage.setItem('Device', response.data.Device)
                  } else {
                    sessionStorage.setItem('jwt', response.data.token)
                    sessionStorage.setItem('username', response.data.userName)
                    sessionStorage.setItem('projectType', response.data.projectType)
                    sessionStorage.setItem('kindProject', response.data.kindProject)
                    sessionStorage.setItem('Device', response.data.Device)
                  }
                  if (checkProjectTypeAdminTok() === 'PV') {
                    next({
                      path: `/${lang}/pv/tong-quan-he-thong`
                    })
                  } else if (checkProjectTypeAdminTok() === 'SWH') {
                    next({
                      path: `/${lang}/swh/tong-quan-he-thong`
                    })
                  } else {
                    this.$router.push(`'/${lang}`);
                  }
                }).catch(err => {
                  localStorage.removeItem('jwt')
                  sessionStorage.removeItem('jwt')
                  next({
                    path: `/`,
                    params: { nextURL: to.fullPath }
                  })
                })
            } else {
              localStorage.removeItem('jwt')
              sessionStorage.removeItem('jwt')
              next({
                path: `/`,
                params: { nextURL: to.fullPath }
              })
            }
          })
      }
    } else if (to.matched.some(record => record.meta.guest)) {
      if (checkAdminToken() == null) {
        next()
      } else if (checkAdminToken() != null) {
        if (checkProjectTypeAdminTok() === 'PV') {
          next({
            path: `/${lang}/pv/tong-quan-he-thong`
          })
        } else if (checkProjectTypeAdminTok() === 'SWH') {
          next({
            path: `/${lang}/swh/tong-quan-he-thong`
          })
        } else {
          next({
            path: `/`,
            params: { nextURL: to.fullPath }
          })
        }
      }
    }
    else if (to.matched.some(record => record.meta.requiresAuthAdmin)) {
      if (localStorage.getItem('accessTokAdmin') == null) {
        next({
          path: `/`,
          params: { nextURL: to.fullPath }
        })
      } else if (localStorage.getItem('accessTokAdmin') != null) {
        next()
      }
    }
    else if (to.matched.some(record => record.meta.requiresAuthParent)) {
      if (localStorage.getItem('jwtParent') == null) {
        next({
          path: `/`,
          params: { nextURL: to.fullPath }
        })
      } else if (localStorage.getItem('jwtParent') != null) {
        next()
      }
    }
    else {
      alert('here')
      next()
    }
  }
})

export default router
