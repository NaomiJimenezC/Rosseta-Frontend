<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import {postCalling} from "@/Helpers/CallToAPI.js";

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
    };
  },
  methods: {
    handleSubmit(values) {
      console.log('Datos enviados:', values);
      postCalling("/login",values,false)
    },
  },
};
</script>

<template>
  <Form :validation-schema="schema" @submit="handleSubmit">
    <div class="form-group">
      <label for="username">Nombre de usuario:</label>
      <Field
        id="username"
        name="username"
        type="text"
        class="form-control"
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
      />
      <ErrorMessage name="password" class="error-message" />
    </div>

    <button type="submit" class="btn">Acceder</button>
  </Form>
</template>

<style scoped>

</style>
