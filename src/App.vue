<script setup>
import Header from './components/Header.vue'
import { RouterView } from 'vue-router';
import NewPublication from "@/components/NewPublication.vue";
</script>

<template>
  <Header/>
  <RouterView/> <NewPublication/> </template>

<style scoped>
</style>
