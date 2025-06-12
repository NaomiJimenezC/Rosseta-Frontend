<script>
import { defineComponent } from 'vue';
import RegisterForm from '@/components/RegisterForm.vue';

export default defineComponent({
  name: 'RegisterPage',
  components: { RegisterForm }
});
</script>

<template>
  <main class="register-page">
    <section class="register-page__container">
      <div class="register-page__welcome">
        <h1 class="register-page__welcome__title">Únete a Rosseta</h1>
        <p class="register-page__welcome__subtitle">Comparte tus fotos con la comunidad</p>
        <p class="register-page__welcome__login-text">
          ¿Ya tienes una cuenta?
          <router-link :to="{ name: 'login' }" class="register-page__welcome__login-link">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>
      <div class="register-page__form">
        <RegisterForm />
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/SASS/pages/register";
</style>
