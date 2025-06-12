<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { postCalling } from "@/Helpers/CallToAPI.js";
import { uploadFormImageWebpAxios } from "@/Helpers/WebpConverter.js";

export default {
  name: 'RegisterForm',
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      values: {
        profile_photo: import.meta.env.VITE_DEFAULT_PROFILE_PHOTO
      },
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
          .nullable(),
        profile_photo: yup
          .string()
          .nullable(),
        terms_and_conditions: yup
          .boolean()
          .oneOf([true], 'Debes aceptar los términos y condiciones'),
      }),
      isSending: false,
      submitError: null,
    };
  },
  methods: {
    async handleSubmit(values, { resetForm }) {
      this.isSending = true;
      this.submitError = null;

      const processedValues = Object.keys(values).reduce((acc, key) => {
        const backendKey = key === 'profile_photo' ? 'profile_picture_url' : key;
        acc[backendKey] = values[key] == null ? '' : values[key];
        return acc;
      }, {});

      try {
        await postCalling('/register', processedValues, true);
        this.$router.push({ name: 'verify-email', query: { email: values.email } });
        resetForm();
      } catch (error) {
        this.submitError = 'Ocurrió un error al registrar. Inténtalo de nuevo.';
      } finally {
        this.isSending = false;
      }
    },
    async handleFileChange(event, setFieldValue) {
      const file = event.target.files[0];
      if (!file) return;

      this.isSending = true;
      this.submitError = null;
      try {
        const uploadResult = await uploadFormImageWebpAxios(file);
        if (uploadResult && uploadResult.secure_url) {
          this.values.profile_photo = uploadResult.secure_url;
          setFieldValue('profile_photo', uploadResult.secure_url);
        } else {
          this.submitError = 'Error al subir la foto de perfil.';
        }
      } catch (error) {
        this.submitError = 'Error al subir la foto de perfil.';
      } finally {
        this.isSending = false;
      }
    },
  },
};
</script>

<template>
  <Form
    :validation-schema="schema"
    :initial-values="values"
    @submit="handleSubmit"
    v-slot="{ errors, values, setFieldValue }"
    class="form"
  >
    <div v-if="submitError" class="form__alert form__alert--danger">{{ submitError }}</div>

    <div class="form__group">
      <label for="username" class="form__label">Nombre de usuario: <span class="form__required">*</span></label>
      <Field
        id="username"
        name="username"
        type="text"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.username }"
        v-model="values.username"
      />
      <ErrorMessage name="username" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="email" class="form__label">Correo electrónico: <span class="form__required">*</span></label>
      <Field
        id="email"
        name="email"
        type="email"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.email }"
        v-model="values.email"
      />
      <ErrorMessage name="email" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="password" class="form__label">Contraseña: <span class="form__required">*</span></label>
      <Field
        id="password"
        name="password"
        type="password"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.password }"
        v-model="values.password"
      />
      <ErrorMessage name="password" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="password_confirmation" class="form__label">Confirmar contraseña: <span class="form__required">*</span></label>
      <Field
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.password_confirmation }"
        v-model="values.password_confirmation"
      />
      <ErrorMessage name="password_confirmation" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="birthday" class="form__label">Fecha de nacimiento: <span class="form__required">*</span></label>
      <Field
        id="birthday"
        name="birthday"
        type="date"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.birthday }"
        v-model="values.birthday"
      />
      <ErrorMessage name="birthday" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="phone_number" class="form__label">Número de teléfono (Opcional):</label>
      <Field
        id="phone_number"
        name="phone_number"
        type="text"
        class="form__input"
        :class="{ 'form__input--is-invalid': errors.phone_number }"
        v-model="values.phone_number"
      />
      <ErrorMessage name="phone_number" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group">
      <label for="profile_photo" class="form__label">Foto de perfil (max 2MB, JPG/PNG):</label>
      <Field
        id="profile_photo"
        name="profile_photo"
        type="file"
        class="form__input form__input--file"
        @change="e => handleFileChange(e, setFieldValue)"
        accept="image/jpeg, image/png"
        :class="{ 'form__input--is-invalid': errors.profile_photo }"
      />
      <ErrorMessage name="profile_photo" class="form__error-message form__error-message--invalid-feedback" />
    </div>

    <div class="form__group form__group--check">
      <Field
        id="terms_and_conditions"
        name="terms_and_conditions"
        type="checkbox"
        :value="true"
        class="form__checkbox-input"
        :class="{ 'form__checkbox-input--is-invalid': errors.terms_and_conditions }"
        v-model="values.terms_and_conditions"
      />
      <label class="form__checkbox-label" for="terms_and_conditions">
        Acepto los <a href="/terminos" target="_blank" >términos y condiciones</a> <span class="form__required">*</span>
      </label>
      <ErrorMessage name="terms_and_conditions" class="form__error-message form__error-message--invalid-feedback form__error-message--block" />
    </div>

    <button type="submit" class="form__button" :disabled="isSending">
      {{ isSending ? 'Registrando...' : 'Acceder' }}
    </button>

  </Form>
</template>

<style lang="sass" scoped>
@use "@/SASS/components/forms"
</style>
