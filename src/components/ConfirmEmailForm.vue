<template>
  <div class="verify-email-container">
    <h2>Verificar tu correo electrónico</h2>

    <div v-if="errorMessage" class="alert alert-danger" v-html="errorMessage"></div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <p v-if="!errorMessage && !message">
      Se ha enviado un código de verificación a <strong>{{ email }}</strong>. Por favor, introduce el código a continuación para verificar tu correo electrónico.
    </p>

    <Form @submit="verifyEmail" :validation-schema="schema" v-slot="{ errors }">
      <div class="form-group visually-hidden">
        <label for="email">Correo electrónico:</label>
        <Field type="email" id="email" name="email" class="form-control" v-model="email" :readonly="true" />
        <ErrorMessage name="email" class="error-message invalid-feedback" />
      </div>
      <div class="form-group">
        <label for="verification_code">Código de verificación:</label>
        <Field type="text" id="verification_code" name="verification_code" class="form-control" v-model="verificationCode" />
        <ErrorMessage name="verification_code" class="error-message invalid-feedback" />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isVerifying">
        <span v-if="isVerifying">Verificando...</span>
        <span v-else>Verificar</span>
      </button>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { postCalling } from '@/Helpers/CallToAPI';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      email: this.$route.query.email || '',
      verificationCode: '',
      message: '',
      errorMessage: '',
      isVerifying: false,
      schema: yup.object({
        email: yup
          .string()
          .required('El correo electrónico es obligatorio')
          .email('El correo electrónico no es válido'),
        verification_code: yup
          .string()
          .required('El código de verificación es obligatorio'),
      }),
    };
  },
  mounted() {
    if (!this.email && !this.$route.query.email) {
      this.errorMessage = 'No se proporcionó el correo electrónico para la verificación.';
    }
  },
  methods: {
    async verifyEmail(values) {
      this.message = '';
      this.errorMessage = '';
      this.isVerifying = true;

      try {
        const response = await postCalling('/verify-email', values, true);
        if (response.status === 200) {
          this.$router.push({ name: 'login' });
        }
         else if (response.errors) {
          let errorString = '';
          for (const key in response.errors) {
            errorString += `${response.errors[key].join(', ')}<br>`;
          }
          this.errorMessage = errorString;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado durante la verificación.';
        }
      } catch (error) {
        console.error('Error al verificar el correo electrónico:', error);
        this.errorMessage = 'Ocurrió un error al comunicarse con el servidor.';
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        }
      } finally {
        this.isVerifying = false;
      }
    },
  },
};
</script>

<style scoped>
.verify-email-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.alert {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

/* Clase para ocultar visualmente un elemento */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
