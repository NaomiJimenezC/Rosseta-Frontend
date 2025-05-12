<script setup>
import Header from './components/Header.vue'
import { RouterView } from 'vue-router';
import RegisterForm from "@/components/RegisterForm.vue"; // Importa RouterView
</script>

<template>
  <Header/>
  <RouterView/> <RegisterForm/> </template>

<style scoped>
</style>
