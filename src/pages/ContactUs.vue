<template>
  <div class="contact-form-container">
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, meta }">
      <h2>Formulario de Contacto</h2>

      <div class="form-group">
        <label for="nombre">Nombre Completo:</label>
        <Field name="nombre" type="text" id="nombre" v-model="formData.nombre" class="form-control" />
        <span class="error-message">{{ errors.nombre }}</span>
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <Field name="email" type="email" id="email" v-model="formData.email" class="form-control" />
        <span class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="asunto">Asunto:</label>
        <Field name="asunto" type="text" id="asunto" v-model="formData.asunto" class="form-control" />
        <span class="error-message">{{ errors.asunto }}</span>
      </div>

      <div class="form-group">
        <label for="mensaje">Mensaje:</label>
        <Field name="mensaje" as="textarea" id="mensaje" v-model="formData.mensaje" class="form-control" />
        <span class="error-message">{{ errors.mensaje }}</span>
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono (Opcional):</label>
        <Field name="telefono" type="tel" id="telefono" v-model="formData.telefono" class="form-control" />
        <span class="error-message">{{ errors.telefono }}</span>
      </div>

      <div class="form-group">
        <label for="aceptaTerminos">
          <Field
            name="aceptaTerminos"
            type="checkbox"
            id="aceptaTerminos"
            :value="true"
            :unchecked-value="false"
            v-model="formData.aceptaTerminos"
          />
          Acepto los términos y condiciones
        </label>
        <span class="error-message">{{ errors.aceptaTerminos }}</span>
      </div>

      <button type="submit" :disabled="!meta.valid || meta.isSubmitting">
        <span v-if="meta.isSubmitting">Enviando...</span>
        <span v-else>Enviar 📤</span>
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

      // Lógica para Netlify Forms:
      // Para usar Netlify Forms, tu <form> en el HTML renderizado necesitaría el atributo data-netlify="true"
      // VeeValidate renderiza un <form> internamente. Para añadir atributos a ese form, puedes usar:
      // <Form :initial-values="formData" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, meta }" data-netlify="true" name="contact">
      // Además, necesitarás campos ocultos para Netlify si no todos tus <Field name="..."> coinciden con los inputs que Netlify espera.
      // O, puedes enviar los datos usando fetch a tu endpoint de Netlify Function o a la acción del formulario de Netlify.

      // Ejemplo de envío con fetch para Netlify Forms (requiere que el <Form> tenga data-netlify="true" y un name):
      /*
      try {
        const response = await fetch('/', { // La acción por defecto para Netlify Forms es '/'
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'contact', // Asegúrate que este 'name' coincida con el del tag <Form>
            ...values, // Los valores validados por VeeValidate
          }).toString(),
        });

        if (response.ok) {
          alert('🎉 ¡Formulario enviado con éxito a Netlify! 🎉');
          resetForm({
            values: { ...initialFormData },
          });
        } else {
          const responseData = await response.text();
          alert('Hubo un error al enviar el formulario a Netlify.');
          console.error('Error de Netlify:', responseData);
          // setErrors({ globalError: 'Error al enviar. Intenta de nuevo.' });
        }
      } catch (error) {
        alert('Hubo un error de red al enviar el formulario.');
        console.error('Error de red:', error);
        // setErrors({ globalError: 'Error de red. Verifica tu conexión.' });
      }
      */

      // Si no usas la detección automática de Netlify Forms, sino una Netlify Function:
      /*
      try {
        const response = await fetch('/.netlify/functions/tuFuncionDeContacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          alert('🎉 ¡Formulario enviado con éxito a Netlify Function! 🎉');
          resetForm({
            values: { ...initialFormData },
          });
        } else {
          // Manejar error de la función
          const errorData = await response.json();
          // setErrors(errorData.errors); // Si tu función devuelve errores específicos por campo
          alert('Error al enviar a la función: ' + (errorData.message || 'Error desconocido'));
        }
      } catch (error) {
        console.error('Error al llamar a la Netlify Function:', error);
        alert('Error de red al contactar la función.');
      }
      */

      // Por ahora, mantendremos el alert simple y el reset:
      alert('🎉 ¡Formulario enviado con éxito! 🎉\n' + JSON.stringify(values, null, 2));
      resetForm({
        values: { ...initialFormData },
      });
    },
  },
};
</script>

<style scoped>
.contact-form-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 22px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 0.95em;
}

.form-control,
input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus,
input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
  outline: none;
}


textarea.form-control {
  height: 120px;
  resize: vertical;
}

input[type="checkbox"] {
  margin-right: 10px;
  vertical-align: middle;
  width: auto;
  height: auto;
}
.form-group label input[type="checkbox"] {
  display: inline-block;
  margin-bottom: 0;
}


.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.85em;
  margin-top: 6px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.05em;
  font-weight: 500;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  width: 100%;
  margin-top: 10px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="submit"]:disabled {
  background-color: #bdc3c7;
  opacity: 0.7;
  cursor: not-allowed;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 600;
}
</style>
