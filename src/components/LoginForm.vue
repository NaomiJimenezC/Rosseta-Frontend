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
      loginError: null, // Para mostrar mensajes de error de inicio de sesión
    };
  },
  methods: {
    async handleSubmit(values) {
      this.loginError = null;
      try {
        const response = await postCalling("/login", values, false);

        console.log('Respuesta del inicio de sesión:', response);

        if (response && response.data && response.data.access_token) {
          const bearerToken = response.data.access_token;
          localStorage.setItem('authToken', bearerToken);

          this.$router.push({ name: 'home' });
        } else {
          this.loginError = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        }

      } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
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
  <Form :validation-schema="schema" @submit="handleSubmit" v-slot="{ errors }">
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
      <ErrorMessage name="username" class="error-message invalid-feedback" />
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

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
