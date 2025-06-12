<script>
import { defineComponent } from 'vue'
import LoginForm from '@/components/LoginForm.vue'

export default defineComponent({
  name: 'LoginPage',
  components: { LoginForm }
})
</script>

<template>
  <main class="login-page">
    <section class="login-page__container">
      <div class="login-page__welcome">
        <h1 class="login-page__title">Bienvenidos a Rosseta</h1>
        <p class="login-page__subtitle">Un lugar para subir fotos</p>
        <p class="login-page__register-text">
          ¿No tienes una cuenta?
          <router-link :to="{ name: 'register' }" class="login-page__register-link">
            Regístrate aquí
          </router-link>
        </p>
      </div>
      <div class="login-page__form">
        <LoginForm />
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/SASS/pages/login";
</style>
