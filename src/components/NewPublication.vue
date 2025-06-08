<script>
import * as yup from 'yup';
import { Field, Form } from "vee-validate";
import {toWebpUrl, uploadFormImageWebpAxios} from "@/Helpers/WebpConverter.js";
import {postCalling} from "@/Helpers/CallToAPI.js";

export default {
  name: "NewPublication",
  components: { Field, Form },
  data() {
    return {
      image: null, // Holds the URL of the selected/uploaded image for display
      values: {
        content: null, // Initialize content to null
        image_url: null, // Will store the secure URL of the uploaded image
        caption: null, // Initialize caption to null
      },
      schema: yup.object({
        content: yup.string().nullable(),
        // Make image_url required with a user-friendly message
        image_url: yup.string().required('Por favor, selecciona una imagen para tu publicación.'),
        caption: yup.string().nullable(),
      }),
      isSending: false, // Controls loading state for buttons
      submitError: null, // Stores error messages related to image upload or post submission
      postSuccessMessage: null, // Stores success message after a post is created
    };
  },
  methods: {
    /**
     * Handles the file input change event.
     * Uploads the selected image and updates component state.
     */
    async handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.isSending = true; // Indicate that an operation is in progress
        this.submitError = null; // Clear any previous errors

        try {
          const uploadResult = await uploadFormImageWebpAxios(file);
          if (uploadResult && uploadResult.secure_url) {
            // Convert to webp URL and store for display and form submission
            this.image = toWebpUrl(uploadResult.secure_url);
            this.values.image_url = toWebpUrl(uploadResult.secure_url);
          } else {
            this.submitError = 'Error al subir la imagen. No se obtuvo una URL segura.';
            this.image = null;
            this.values.image_url = null;
          }
        } catch (error) {
          this.submitError = 'Error al subir la imagen: ' + (error.message || 'Error desconocido.');
          this.image = null;
          this.values.image_url = null;
        } finally {
          this.isSending = false; // Operation finished
        }
      } else {
        // If no file is selected, reset image state
        this.image = null;
        this.values.image_url = null;
      }
    },

    /**
     * Handles the form submission.
     * Calls the API to create a new post.
     * @param {Object} values - Form values (content, image_url, caption)
     */
    async handleSubmit(values) {
      this.isSending = true;
      this.submitError = null;
      this.postSuccessMessage = null; // Clear previous messages

      try {
        await postCalling("/posts", values, true);
        this.isSending = false;
        this.postSuccessMessage = '¡Publicación creada con éxito!';
        // Emit an event to the parent (the modal) to indicate success
        // This allows the modal to close itself or show a global success message
        this.$emit('publication-success');
        // Reset the form after successful submission
        this.resetForm();

      } catch (error) {
        console.error("Error al crear la publicación:", error);
        this.submitError = 'Error al crear la publicación. Inténtalo de nuevo.';
        this.isSending = false;
      }
    },

    /**
     * Resets all form fields and messages.
     * This is crucial for re-opening the modal with a clean state.
     */
    resetForm() {
      this.image = null;
      this.values.image_url = null;
      this.values.content = null; // Reset content field
      this.values.caption = null; // Reset caption field
      this.postSuccessMessage = null;
      this.submitError = null;
      // If you are using `ref="form"` in the template, you might want to reset VeeValidate's internal state too.
      // This ensures validation errors are cleared when the form is reset.
      if (this.$refs.form) {
        this.$refs.form.resetForm();
      }
    }
  },
  // Lifecycle hook: When the component is mounted, listen for a custom event from the modal
  // This could be an alternative way to trigger a reset when the modal is closed
  // but `resetForm` being called after handleSubmit is often sufficient.
  // mounted() {
  //   this.$parent.$on('modal-closed', this.resetForm);
  // },
  // beforeDestroy() {
  //   this.$parent.$off('modal-closed', this.resetForm);
  // }
};
</script>

<template>
  <div>
    <div v-if="!image">
      <h2>Selecciona la imagen que quieres postear</h2>
      <label class="image-upload-area">
        <input
          type="file"
          name="myImage"
          accept="image/png, image/jpeg, image/jpg"
          @change="handleImageChange"
          style="display: none;"
        />
        <div class="upload-icon">
          🖼️
        </div>
        <button class="select-button" type="button" :disabled="isSending">
          Seleccionar
        </button>
      </label>
      <div v-if="submitError" class="error-message">{{ submitError }}</div>
    </div>

    <div v-else>
      <h2>Nueva publicación</h2>
      <img :src="image" alt="Foto seleccionada" class="selected-image" />
      <Form :validation-schema="schema" @submit="handleSubmit" ref="form">
        <div class="form-group">
          <label for="content">Descripción</label>
          <Field
            id="content"
            name="content"
            as="textarea"
            placeholder="Escribe una descripción para tu publicación..."
            class="textarea-field"
          ></Field>
        </div>
        <div class="form-group">
          <label for="caption">Título</label>
          <Field
            id="caption"
            name="caption"
            type="text"
            placeholder="Escribe un título para tu publicación..."
            class="text-field"
          ></Field>
        </div>
        <Field type="hidden" name="image_url" :value="values.image_url" />

        <button type="submit" :disabled="isSending" class="submit-button">
          {{ isSending ? 'Publicando...' : 'Publicar' }}
        </button>
      </Form>
      <button @click="resetForm" class="change-image-button">Cambiar imagen</button>
      <div v-if="submitError" class="error-message">{{ submitError }}</div>
      <div v-if="postSuccessMessage" class="success-message">{{ postSuccessMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles specific to NewPublication.vue */
h2 {
  color: #e91e63; /* Pink from your image */
  margin-bottom: 1rem;
  text-align: center;
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #f8bbd0; /* Lighter pink border */
  border-radius: 8px;
  padding: 30px;
  cursor: pointer;
  background-color: #fce4ec; /* Very light pink background */
  text-align: center;
  min-height: 200px;
  margin-bottom: 1rem;
}

.upload-icon {
  font-size: 4rem;
  color: #e91e63;
  margin-bottom: 15px;
}

.select-button {
  background-color: #f8bbd0; /* Light pink */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.select-button:hover:not(:disabled) {
  background-color: #e91e63; /* Darker pink on hover */
}

.select-button:disabled {
  background-color: #f8bbd0;
  cursor: not-allowed;
  opacity: 0.7;
}

.selected-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e91e63;
  font-weight: bold;
}

.textarea-field,
.text-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #f8bbd0;
  border-radius: 5px;
  box-sizing: border-box; /* Include padding in width */
  font-size: 1rem;
}

.textarea-field {
  min-height: 80px;
  resize: vertical;
}

.submit-button {
  background-color: #e91e63;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1rem;
}

.submit-button:disabled {
  background-color: #f8bbd0;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #d81b60; /* Even darker pink on hover */
}

.change-image-button {
  background: none;
  border: 1px solid #e91e63;
  color: #e91e63;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.change-image-button:hover {
  background-color: #e91e63;
  color: white;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success-message {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>
