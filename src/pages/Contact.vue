<script>
import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

export default defineComponent({
  name: 'Contact',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      schema: yup.object({
        name: yup.string().required().min(2, 'El nombre debe tener al menos 2 caracteres'),
        email: yup.string().required().email('Debe ser un correo válido'),
        message: yup.string().required().min(10, 'El mensaje debe tener al menos 10 caracteres')
      }),
      submissionStatus: null
    }
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) =>
            encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        )
        .join('&')
    },
    async onSubmit(values, { resetForm }) {
      const formData = {
        'form-name': 'contact',
        name: values.name,
        email: values.email,
        message: values.message
      }
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.encode(formData)
        })
        this.submissionStatus = '¡Mensaje enviado correctamente!'
        resetForm()
      } catch {
        this.submissionStatus = 'Error al enviar el mensaje.'
      }
    }
  }
})
</script>

<template>
  <section class="contact-page">
    <h1>Contacto</h1>
    <Form
      :validation-schema="schema"
      @submit="onSubmit"
      name="contact"
      data-netlify="true"
    >
      <input type="hidden" name="form-name" value="contact" />

      <div class="form-group">
        <label for="name">Nombre</label>
        <Field id="name" name="name" type="text" class="form-input" />
        <ErrorMessage name="name" class="error-message" />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <Field id="email" name="email" type="email" class="form-input" />
        <ErrorMessage name="email" class="error-message" />
      </div>

      <div class="form-group">
        <label for="message">Mensaje</label>
        <Field
          id="message"
          name="message"
          as="textarea"
          rows="5"
          class="form-textarea"
        />
        <ErrorMessage name="message" class="error-message" />
      </div>

      <button type="submit" class="btn-submit">Enviar</button>
    </Form>

    <p v-if="submissionStatus" class="status-message">
      {{ submissionStatus }}
    </p>
  </section>
</template>

<style scoped>
.contact-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #333;
}

.form-input,
.form-textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn-submit {
  background-color: #007bff;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.status-message {
  margin-top: 1rem;
  text-align: center;
  color: #006600;
}
</style>
