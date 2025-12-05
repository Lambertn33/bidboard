import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query';

import { 
    BiCheckCircleFill, 
    HiClock, 
    RiBarChartFill,
    HiMenu,
  } from 'oh-vue-icons/icons';      
import { addIcons, OhVueIcon } from 'oh-vue-icons'

addIcons(BiCheckCircleFill, HiClock, RiBarChartFill, HiMenu);

createApp(App)
  .use(router)
  .use(VueQueryPlugin)
  .component('OhVueIcon', OhVueIcon)
  .mount('#app')
