import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/login/login')
  },
  {
    path: '/forgetPassword',
    component: () => import('../views/forgetPassword/forgetPassword')
  },
  {
    path: '/index',
    component: () => import('../views/index/index')
  },
  {
    path: '/welcome',
    component: () => import('../views/welcome/welcome')
  },
  {
    path: '/roleManage',
    component: () => import('../views/roleManage/roleManage')
  },
  {
    path: '/userManage',
    component: () => import('../views/userManage/userManage')
  },
  {
    path: '/passwordManage',
    component: () => import('../views/passwordManage/passwordManage')
  },
  {
    path: '/contentConfig',
    component: () => import('../views/contentConfig/contentConfig')
  },
  {
    path: '/layoutConfig',
    component: () => import('../views/layoutConfig/layoutConfig')
  },
  {
    path: '/contentLayoutBind',
    component: () => import('../views/contentLayoutBind/contentLayoutBind')
  },
  {
    path: '/deptManage',
    component: () => import('../views/deptManage/deptManage')
  },
  {
    path: '/menuManage',
    component: () => import('../views/menuManage/menuManage')
  },
  {
    path: '/roleMenuManage',
    component: () => import('../views/roleMenuManage/roleMenuManage')
  },
  {
    path: '/systemBasicConfig',
    component: () => import('../views/systemBasicConfig/systemBasicConfig')
  },
  {
    path: '/thirdSecretKeyConfig',
    component: () => import('../views/thirdSecretKeyConfig/thirdSecretKeyConfig')
  },
  {
    path: '/quickMenuConfig',
    component: () => import('../views/quickMenuConfig/quickMenuConfig')
  },
  {
    path: '/dictionaryTableConfig',
    component: () => import('../views/dictionaryTableConfig/dictionaryTableConfig')
  },
  {
    path: '/dictionaryTableConfigDetail',
    component: () => import('../views/dictionaryTableConfig/dictionaryTableConfigDetail')
  },
  {
    path: '/systemLog',
    component: () => import('../views/systemLog/systemLog')
  },
  {
    path: '/dingTalkInfoConfig',
    component: () => import('../views/dingTalkInfoConfig/dingTalkInfoConfig')
  },
  {
    path: '/dingTalkSameOrganization',
    component: () => import('../views/dingTalkSameOrganization/dingTalkSameOrganization')
  },
  {
    path: '/weComInfoConfig',
    component: () => import('../views/weComInfoConfig/weComInfoConfig')
  },
  {
    path: '/weComSameOrganization',
    component: () => import('../views/weComSameOrganization/weComSameOrganization')
  },
  {
    path: '/formDesign',
    component: () => import('../views/formDesign/formDesign')
  },
  {
    path: '/hbTemplate',
    component: () => import('../views/hbTemplate/hbTemplate')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
      behavior: 'smooth'
    }
  }
})

export default router
