<template>
  <h2>Formulario de Contacto</h2>

  <div class="form">
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, meta }">

      <div class="form__group">
        <label for="email" class="form__label" >Correo Electrónico:</label>
        <Field name="email" type="email" id="email" v-model="formData.email" class="form__input"/>
        <span class="form__error-message">{{ errors.email }}</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="asunto">Asunto:</label>
        <Field name="asunto" type="text" id="asunto" v-model="formData.asunto" class="form__input" />
        <span class="form__error-message">{{ errors.asunto }}</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="mensaje">Mensaje:</label>
        <Field name="mensaje" as="textarea" id="mensaje" v-model="formData.mensaje" class="form__input" />
        <span class="form__error-message">{{ errors.mensaje }}</span>
      </div>

      <div class="form__group">
        <label for="aceptaTerminos" class="form__label">
          <Field
            name="aceptaTerminos"
            type="checkbox"
            id="aceptaTerminos"
            :value="true"
            :unchecked-value="false"
            v-model="formData.aceptaTerminos"
            class="form__checkbox-input"
          />
          Acepto los términos y condiciones
        </label>
        <span class="form__error-message">{{ errors.aceptaTerminos }}</span>
      </div>

      <button type="submit" class="form__button" :disabled="!meta.valid || meta.isSubmitting">
        <span v-if="meta.isSubmitting">Enviando...</span>
        <span v-else>Enviar</span>
      </button>
    </Form>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

const initialFormData = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
  telefono: '',
  aceptaTerminos: false,
};

export default {
  name: 'ContactUs',
  components: {
    Form,
    Field,
  },
  data() {
    const schema = yup.object({
      nombre: yup.string().required('El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres'),
      email: yup.string().required('El correo electrónico es obligatorio').email('Debe ser un correo electrónico válido'),
      asunto: yup.string().required('El asunto es obligatorio'),
      mensaje: yup.string().required('El mensaje es obligatorio').min(10, 'El mensaje debe tener al menos 10 caracteres'),
      telefono: yup.string()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, { message: 'Número de teléfono no válido', excludeEmptyString: true })
        .transform(value => (value === '' || value === null) ? undefined : value)
        .nullable(),
      aceptaTerminos: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones').required('Debes aceptar los términos'),
    });

    return {
      formData: { ...initialFormData },
      schema,
    };
  },
  methods: {
    async onSubmit(values, { resetForm, setErrors }) {
      console.log('Datos del formulario (Vue 3):', values);
      alert('🎉 ¡Formulario enviado con éxito! 🎉\n' + JSON.stringify(values, null, 2));
      resetForm({
        values: { ...initialFormData },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
@use '@/SASS/components/forms'
</style>
