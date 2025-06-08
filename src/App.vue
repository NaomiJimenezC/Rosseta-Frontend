<template>
  <div class="app-layout">
    <Header class="app-layout__sidebar" />

    <main class="app-layout__content">
      <RouterView />
    </main>

    <aside class="app-layout__aside-secondary">
      <slot name="aside-secondary"></slot>
    </aside>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from "@/components/Header.vue";
</script>

<style lang="sass">
@use "SASS/main"
</style>
