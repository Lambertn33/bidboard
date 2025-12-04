<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
