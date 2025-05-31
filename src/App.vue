<script setup>
import Header from './components/Header.vue'
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div id="app-layout" :class="{ 'no-sidebar-layout': route.meta.hideHeader }">
    <Header v-if="!route.meta.hideHeader" class="sidebar" />

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

#app-layout.no-sidebar-layout {
  grid-template-columns: 1fr;
  grid-template-areas: "main-content";
}

.sidebar {
  grid-area: sidebar;
}

.main-content {
  grid-area: main-content;
  padding: 20px 40px;
  overflow-y: auto;
}

#app-layout.no-sidebar-layout .main-content {
  padding: 0;
}
</style>
