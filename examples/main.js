import 'element-ui/lib/theme-default/index.css'
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './app.vue';
import {modelButton, modelDialog} from '../src/index'
Vue.use(ElementUI)
Vue.component('model-button', modelButton)
Vue.component('model-dialog', modelDialog)
/* eslint-disable */
new Vue({
    el: '#app',
    render: h => h(App)
});
