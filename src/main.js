import Vue from "vue";

import '@/icons';
import favicon from '!file-loader!@/icons/svg/fight.svg'

const App = ()=>import('@/views/index');

document.head.getElementsByClassName('icon-link').forEach(e=>{
    e.href = favicon
})

new Vue({
    el: '#app',
    render: h => h(App)
});
