import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query';
import { addIcons, OhVueIcon } from 'oh-vue-icons'

import { 
    BiCheckCircleFill, 
    HiClock, 
    RiBarChartFill,
    HiMenu,
    HiArrowRight,
    BiFolderX,
    BiListTask,
    BiFolderFill,
    HiX,
    HiArrowDown,
  } from 'oh-vue-icons/icons';      


addIcons(
  BiCheckCircleFill,
  HiClock,
  RiBarChartFill, 
  HiMenu, 
  HiArrowRight, 
  BiFolderX, 
  BiListTask, 
  HiX, 
  BiFolderFill, 
  HiArrowDown
);

createApp(App)
  .use(router)
  .use(VueQueryPlugin)
  .component('OhVueIcon', OhVueIcon)
  .mount('#app')
