import {createRouter, createWebHistory} from 'vue-router'
import siteConfig from '@/site-config'

export function registerRouter(app) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        children: [
          {
            path: '',
            component: () => import('@/views/pages/main-page/tabs/index')
          },
          {
            path: 'want-do',
            component: () => import('@/views/pages/main-page/tabs/want')
          },
          {
            path: 'need-do',
            component: () => import('@/views/pages/main-page/tabs/need')
          },
          {
            path: 'doing',
            component: () => import('@/views/pages/main-page/tabs/want')
          },
          {
            path: 'settings',
            component: () => import('@/views/pages/main-page/tabs/settings')
          }
        ],
        component: () => import('@/views/pages/main-page/index')
      },
      {
        path: '/about',
        component: () => import('@/views/pages/about/index')
      },
      {
        path: `/oauth/:platform(${siteConfig.platforms.join('|')})`,
        params: ['code'],
        component: () => import('@/views/pages/oauth/index')
      },
    ]
  });
  app.use(router)
}
