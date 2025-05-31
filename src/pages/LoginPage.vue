<script>
import {defineComponent} from 'vue'
import LoginForm from "@/components/LoginForm.vue";

export default defineComponent({
  name: "LoginPage",
  components: {LoginForm}
})
</script>

<template>
  <main class="login-page-container">
    <section>
      <h1>Bienvenidos a Rosseta, un lugar para subir fotos</h1>
      <LoginForm/>

      <p class="register-text">
        ¿No tienes una cuenta?
        <router-link :to="{ name: 'register' }" class="register-link">Regístrate aquí</router-link>
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-page-container {
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

.register-text {
  margin-top: 20px;
  font-size: 1.1em;
  color: #555;
}

.register-link {
  color: #ff4081;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #e91e63;
  text-decoration: underline;
}
</style>
