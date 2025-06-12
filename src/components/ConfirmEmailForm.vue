<template>

  <div class="verify-email__container">
    <h1>Verificar tu correo electrónico</h1>

    <div v-if="errorMessage" class="verify-email__alert verify-email__alert--danger" v-html="errorMessage"></div>
    <div v-if="message" class="verify-email__alert verify-email__alert--success">{{ message }}</div>

    <p class="verify-email__p" v-if="!errorMessage && !message">
      Se ha enviado un código de verificación a <strong>{{ email }}</strong>. Por favor,
      introduce el código a continuación para verificar tu correo electrónico. No olvides revisar la
      carpeta de spam
    </p>

    <Form @submit="verifyEmail" class="form"  :validation-schema="schema" v-slot="{ errors }">
      <div class="form__group verify-email__visually-hidden">
        <label for="email">Correo electrónico:</label>
        <Field type="email" id="email" name="email" class="form-control" v-model="email" :readonly="true" />
        <ErrorMessage name="email" class="error-message invalid-feedback" />
      </div>
      <div class="form__group">
        <label class="form__label" for="verification_code">Código de verificación:</label>
        <Field type="text" id="verification_code" name="verification_code" class="form__input" v-model="verificationCode" />
        <ErrorMessage name="verification_code" class="error-message invalid-feedback" />
      </div>
      <button type="submit" class="form__button" :disabled="isVerifying">
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

<style lang="scss" scoped>
@use "@/SASS/components/forms";
@use "@/SASS/pages/verify-email";
</style>
