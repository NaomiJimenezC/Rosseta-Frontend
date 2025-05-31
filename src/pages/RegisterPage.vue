<script>
import {defineComponent} from 'vue'
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

<style scoped>
.register-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.login-text {
  margin-top: 20px;
  font-size: 1.1em;
  color: #555;
}

.login-link {
  color: #ff4081;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #e91e63;
  text-decoration: underline;
}
</style>
