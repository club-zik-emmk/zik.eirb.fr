import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './style.css';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'

createApp(App)
    .use(router)
    .use(store)
    .component('Datepicker', Datepicker)
    .component('ScaleLoader', ScaleLoader)
    .mount('#app')
