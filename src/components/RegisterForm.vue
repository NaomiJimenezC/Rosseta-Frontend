<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import {postCalling} from "@/Helpers/CallToAPI.js";

export default {
  name: 'RegisterForm',
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
          .min(8, 'La contraseña debe tener al menos 6 caracteres'),
        email: yup
          .string()
          .required('El correo electrónico es obligatorio')
          .email('El correo electrónico no es válido'),
        confirm_password: yup
          .string()
          .required('Debes confirmar la contraseña')
          .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
        birthday: yup
          .date()
          .required('La fecha de nacimiento es obligatoria'),
        profile_photo: yup
          .mixed()
          .test('fileSize', 'La foto de perfil no debe exceder los 2MB', (value) => {
            if (value) {
              return value.size <= 2 * 1024 * 1024; // 2MB in bytes
            }
            return true;
          })
          .test('fileFormat', 'Formato de archivo no soportado. Solo se aceptan JPEG, JPG y PNG', (value) => {
            if (value) {
              return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type.toLowerCase());
            }
            return true;
          }),
        terms_and_conditions: yup
          .boolean()
          .oneOf([true], 'Debes aceptar los términos y condiciones'),
      }),
    };
  },
  methods: {
    handleSubmit(values) {
      console.log('Datos enviados:', values);
      postCalling("/register",values,false)
    },
  },
};
</script>

<template>
  <Form :validation-schema="schema" @submit="handleSubmit" v-slot="{ isSubmitting }">
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
      <label for="email">Correo electrónico:</label>
      <Field
        id="email"
        name="email"
        type="email"
        class="form-control"
      />
      <ErrorMessage name="email" class="error-message" />
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

    <div class="form-group">
      <label for="password_confirmation">Confirmar contraseña:</label>
      <Field
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        class="form-control"
      />
      <ErrorMessage name="password_confirmation" class="error-message" />
    </div>

    <div class="form-group">
      <label for="birthday">Fecha de nacimiento:</label>
      <Field
        id="birthday"
        name="birthday"
        type="date"
        class="form-control"
      />
      <ErrorMessage name="birthday" class="error-message" />
    </div>

    <div class="form-group">
      <label for="profile_photo">Foto de perfil:</label>
      <Field
        id="profile_photo"
        name="profile_photo"
        type="file"
        class="form-control"
      />
      <ErrorMessage name="profile_photo" class="error-message" />
    </div>

    <div class="form-group form-check">
      <Field
        id="terms_and_conditions"
        name="terms_and_conditions"
        type="checkbox"
        class="form-check-input"
      />
      <label class="form-check-label" for="terms_and_conditions">
        Acepto los <a href="/terminos" target="_blank">términos y condiciones</a>
      </label>
      <ErrorMessage name="terms_and_conditions" class="error-message" />
    </div>

    <button type="submit" :disabled="isSubmitting">
      Acceder
    </button>
  </Form>
</template>

<style scoped>

</style>
