import Vue from 'vue'
import App from './App.vue'
import ".//scripts/mathml.css"
import ".//scripts/LaTeXParser.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
}).$mount('#app')
//
// import { Boot } from '@wangeditor/editor'
// import formulaModule from '@wangeditor/plugin-formula'
//
// // 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
// Boot.registerModule(formulaModule)
