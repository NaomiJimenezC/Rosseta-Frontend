<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { postCalling } from "@/Helpers/CallToAPI.js";

export default {
  name: 'LoginForm',
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      schema: yup.object({
        username: yup
          .string()
          .required('El nombre de usuario es obligatorio'),
        password: yup
          .string()
          .required('La contraseña es obligatoria')
          .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      }),
      loginError: null,
    };
  },
  methods: {
    async handleSubmit(values) {
      this.loginError = null;
      try {
        const response = await postCalling("/login", values, false);

        if (response && response.data && response.data.access_token) {
          const bearerToken = response.data.access_token;
          const userId = response.data.user.id;
          localStorage.setItem('authToken', bearerToken);
          localStorage.setItem('userId', userId);
          this.$router.push({ name: 'home' });
        } else {
          this.loginError = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        }

      } catch (error) {
        this.loginError = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
        if (error.response && error.response.data && error.response.data.message) {
          this.loginError = error.response.data.message;
        }
      }
    },
  },
};
</script>

<template>
  <Form :validation-schema="schema" class="form" @submit="handleSubmit" v-slot="{ errors }">
    <div v-if="loginError" class="form__alert form__alert--danger">{{ loginError }}</div>

    <div class="form__group">
      <label for="username" class="form__label">Nombre de usuario:</label>
      <Field
        id="username"
        name="username"
        type="text"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.username }"
      />
      <ErrorMessage name="username" class="form__error-message" />
    </div>

    <div class="form__group">
      <label for="password" class="form__label">Contraseña:</label>
      <Field
        id="password"
        name="password"
        type="password"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.password }"
      />
      <ErrorMessage name="password" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <button type="submit" class="form__button">Acceder</button>
  </Form>
</template>

<style lang="scss" scoped>
@use '@/SASS/components/forms';
</style>
