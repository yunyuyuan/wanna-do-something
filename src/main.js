import Vue from "vue";
import '@/icons'

const App = ()=>import('@/views/index')

new Vue({
    el: '#app',
    render: h => h(App)
});
