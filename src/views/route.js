import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            children: [
                {
                    path: '',
                    component: ()=>import('@/views/pages/tabs/index')
                },
                {
                    path: 'want-do',
                    component: ()=>import('@/views/pages/tabs/want')
                },
                {
                    path: 'need-do',
                    component: ()=>import('@/views/pages/tabs/need')
                },
                {
                    path: 'doing',
                    component: ()=>import('@/views/pages/tabs/want')
                },
                {
                    path: 'settings',
                    component: ()=>import('@/views/pages/tabs/settings')
                }
            ],
            component: ()=>import('@/views/pages/main')
        },
        {
            path: '/about',
            component: ()=>import('@/views/pages/about')
        },
    ]
});
