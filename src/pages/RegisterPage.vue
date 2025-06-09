<script>
import {defineComponent} from 'vue';
import RegisterForm from "@/components/RegisterForm.vue";

export default defineComponent({
  name: "RegisterPage",
  components: {RegisterForm}
})
</script>

<template>
  <main class="register-page-container">
    <section>
      <h1>Únete a Rosseta</h1>
      <RegisterForm/>

      <p class="login-text">
        ¿Ya tienes una cuenta?
        <router-link :to="{ name: 'login' }" class="login-link">Inicia sesión aquí</router-link>
      </p>
    </section>
  </main>
</template>

<style lang="sass" scoped>

</style>
