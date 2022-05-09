import Vue from 'vue'
import App from './App.vue'
import ".//scripts/mathml.css"
import "./scripts/LaTeXParser.js"
// import {getReplacedDollarFormula}from "./scripts/editorUtils"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./scripts/registerEditorPlugins"
Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
    render: h => h(App),
}).$mount('#app')
//
