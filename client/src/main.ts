import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query';
import { addIcons, OhVueIcon } from 'oh-vue-icons'

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    CoReload,
    GiMagnifyingGlass,
    HiPencil,
    HiTrash,
    HiChevronLeft,
    HiChevronRight,
    HiArrowLeft,
    HiExclamationCircle,
    IoClose,
    IoShieldCheckmarkSharp,
    IoCloseCircleOutline
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
  CoReload,
  GiMagnifyingGlass,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiArrowLeft,
  HiExclamationCircle,
  IoClose,
  IoShieldCheckmarkSharp,
  IoCloseCircleOutline
);

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
    theme: 'colored',
    transition: 'slide',
    position: 'top-right',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  })
  .use(router)
  .use(VueQueryPlugin)
  .component('OhVueIcon', OhVueIcon)
  .mount('#app')
