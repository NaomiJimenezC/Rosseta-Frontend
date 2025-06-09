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

  <Form :validation-schema="schema" class="formularios" @submit="handleSubmit" v-slot="{ errors }">
    <div v-if="loginError" class="alert alert-danger">{{ loginError }}</div>
    <div class="form-group">
      <label for="username">Nombre de usuario:</label>
      <Field
        id="username"
        name="username"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.username }"
      />
      <ErrorMessage name="username" class="error-message" />
    </div>

    <div class="form-group">
      <label for="password">Contraseña:</label>
      <Field
        id="password"
        name="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password }"
      />
      <ErrorMessage name="password" class="error-message invalid-feedback" />
    </div>

    <button type="submit" class="btn btn-primary">Acceder</button>
  </Form>
</template>

<style lang="scss" scoped>
@use '@/SASS/components/forms';
</style>
