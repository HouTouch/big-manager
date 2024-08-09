import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/layoutPage.vue'),
      redirect: '/article/manager',
      children: [
        {
          path: '/article/manager',
          component: () => import('@/views/article/articleManager.vue')
        }, //文章管理
        {
          path: '/article/channel',
          component: () => import('@/views/article/articleChannel.vue')
        }, //频道管理
        {
          path: '/user/profile',
          component: () => import('@/views/user/userProfile.vue')
        }, //个人详情
        {
          path: '/user/avatar',
          component: () => import('@/views/user/userAvatar.vue')
        }, //更换头像
        {
          path: '/user/password',
          component: () => import('@/views/user/userPassword.vue')
        } //重置密码
      ]
    }
  ]
})
export default router

//登录访问拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})
