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
    HiArrowUp,
    HiMail,
    HiLockClosed,
    HiEye,
    HiEyeOff,
    HiUser,
    HiHome,
    HiChartBar,
    HiChartPie,
    HiUserGroup,
    HiDocumentText,
    HiCreditCard,
    BiBarChart,
    HiPlus,
    HiClipboardList,
    HiCheckCircle,
    HiCurrencyDollar,
    HiUsers,
    HiLink,
    CoReload
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
  HiArrowDown,
  HiArrowUp,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiUser,
  HiHome,
  HiChartBar,
  HiChartPie,
  HiUserGroup,
  HiDocumentText,
  HiCreditCard,
  BiBarChart,
  HiPlus,
  HiClipboardList,
  HiCheckCircle,
  HiCurrencyDollar,
  HiUsers,
  HiLink,
  CoReload
);

createApp(App)
  .use(router)
  .use(VueQueryPlugin)
  .component('OhVueIcon', OhVueIcon)
  .mount('#app')
