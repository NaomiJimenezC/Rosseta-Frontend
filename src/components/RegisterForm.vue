<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { postCalling } from "@/Helpers/CallToAPI.js"; // Asegúrate que esta ruta es correcta

export default {
  name: 'RegisterForm',
  components: { Form, Field, ErrorMessage },
  data() {
    console.log('Yup object:', yup);
    return {
      schema: yup.object({
        username: yup
          .string()
          .required('El nombre de usuario es obligatorio'),
        password: yup
          .string()
          .required('La contraseña es obligatoria')
          .min(8, 'La contraseña debe tener al menos 8 caracteres'),
        email: yup
          .string()
          .required('El correo electrónico es obligatorio')
          .email('El correo electrónico no es válido'),
        password_confirmation: yup
          .string()
          .required('Debes confirmar la contraseña')
          .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
        birthday: yup
          .date()
          .required('La fecha de nacimiento es obligatoria'),
        phone_number: yup
          .string()
          .nullable(), // Permite valores nulos o cadenas vacías (no obligatorio)
        profile_photo: yup
          .mixed()
          .nullable(), // Permitimos null para el campo de archivo opcional
        terms_and_conditions: yup
          .boolean()
          .oneOf([true], 'Debes aceptar los términos y condiciones'),
      }),
      isSending: false,
      submitError: null,
    };
  },
  mounted() {
    console.log('RegisterForm component mounted.');
  },
  methods: {
    async handleSubmit(values, { resetForm }) {
      console.log('handleSubmit triggered!');
      this.isSending = true;
      this.submitError = null;

      // Establecer valores por defecto de "" para campos vacíos antes de enviar
      const processedValues = Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key] === null ? "" : values[key];
        return acc;
      }, {});

      console.log('Processed values for submit:', processedValues);

      try {
        console.log('Attempting to call postCalling with JSON...');
        // Llamamos a postCalling con el objeto 'processedValues'
        const response = await postCalling("/register", processedValues, true);

        console.log('postCalling successful:', response);
        alert('¡Registro exitoso!');
        resetForm();

      } catch (error) {
        console.error('Error during postCalling:', error);
        console.error('Detalles del error del backend:', error.response ? error.response.data : error);
        this.submitError = 'Ocurrió un error al registrar. Inténtalo de nuevo.';
      } finally {
        this.isSending = false;
        console.log('handleSubmit finished.');
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      console.log('File selected:', file ? file.name : 'No file selected');
      // Si decides enviar la foto como Base64 aquí, tendrías que leer el archivo
      // y actualizar el objeto 'values' (o 'processedValues') con la cadena Base64.
    }
  },
};
</script>

<template>
  <Form :validation-schema="schema" @submit="handleSubmit" v-slot="{ errors }">
    <div v-if="submitError" class="alert alert-danger">{{ submitError }}</div>

    <div class="form-group">
      <label for="username">Nombre de usuario: <span class="required">*</span></label>
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
      <label for="email">Correo electrónico: <span class="required">*</span></label>
      <Field
        id="email"
        name="email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors.email }"
      />
      <ErrorMessage name="email" class="error-message invalid-feedback" />
    </div>

    <div class="form-group">
      <label for="password">Contraseña: <span class="required">*</span></label>
      <Field
        id="password"
        name="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password }"
      />
      <ErrorMessage name="password" class="error-message invalid-feedback" />
    </div>

    <div class="form-group">
      <label for="password_confirmation">Confirmar contraseña: <span class="required">*</span></label>
      <Field
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password_confirmation }"
      />
      <ErrorMessage name="password_confirmation" class="error-message invalid-feedback" />
    </div>

    <div class="form-group">
      <label for="birthday">Fecha de nacimiento: <span class="required">*</span></label>
      <Field
        id="birthday"
        name="birthday"
        type="date"
        class="form-control"
        :class="{ 'is-invalid': errors.birthday }"
      />
      <ErrorMessage name="birthday" class="error-message invalid-feedback" />
    </div>

    <div class="form-group">
      <label for="phone_number">Número de teléfono (Opcional):</label>
      <Field
        id="phone_number"
        name="phone_number"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.phone_number }"
      />
      <ErrorMessage name="phone_number" class="error-message invalid-feedback" />
    </div>

    <div class="form-group">
      <label for="profile_photo">Foto de perfil (Opcional, max 2MB, JPG/PNG):</label>
      <Field
        id="profile_photo"
        name="profile_photo"
        type="file"
        class="form-control"
        @change="handleFileChange"
        accept="image/jpeg, image/png"
        :class="{ 'is-invalid': errors.profile_photo }"
      />
      <ErrorMessage name="profile_photo" class="error-message invalid-feedback" />
    </div>

    <div class="form-group form-check">
      <Field
        id="terms_and_conditions"
        name="terms_and_conditions"
        type="checkbox"
        :value="true" class="form-check-input"
        :class="{ 'is-invalid': errors.terms_and_conditions }"
      />
      <label class="form-check-label" for="terms_and_conditions">
        Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> <span class="required">*</span>
      </label>
      <ErrorMessage name="terms_and_conditions" class="error-message invalid-feedback d-block" />
    </div>

    <button type="submit" class="btn btn-primary" :disabled="isSending">
      {{ isSending ? 'Registrando...' : 'Acceder' }}
    </button>

  </Form>
</template>

<style scoped>
/* Estilos básicos para los mensajes de error (adapta según tu CSS/Framework) */
.error-message {
  color: red;
  font-size: 0.8em;
}
.form-group {
  margin-bottom: 1rem;
}
/* Estilos para campos inválidos si usas Bootstrap u otro framework */
.is-invalid {
  border-color: red;
}
.invalid-feedback {
  display: none; /* Oculto por defecto */
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545; /* Color rojo de Bootstrap para errores */
}
.is-invalid ~ .invalid-feedback,
.is-invalid ~ .form-check-label + .invalid-feedback { /* Mostrar el mensaje si el campo es inválido */
  display: block;
}
.d-block { /* Utilidad para asegurar que el mensaje de términos se muestre */
  display: block !important;
}
.required {
  color: red;
  font-weight: bold;
}
</style>
