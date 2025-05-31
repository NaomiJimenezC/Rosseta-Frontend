<script setup>
import Header from './components/Header.vue'
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app-layout">
    <Header class="sidebar" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 100vh;
  grid-template-areas: "sidebar main-content";
}

.sidebar {
  grid-area: sidebar;
}

.main-content {
  grid-area: main-content;
  padding: 20px 40px;
  overflow-y: auto;
}
</style>
