import Vue from "vue";

const App = ()=>import('@/views/index')

new Vue({
    el: '#app',
    render: h => h(App)
});
