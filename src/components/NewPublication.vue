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
      image: null,
      values: {
        content: null,
        image_url: null,
        caption: null,
      },
      schema: yup.object({
        content: yup.string().nullable(),
        image_url: yup.string().required('Por favor, selecciona una imagen para tu publicación.'),
        caption: yup.string().nullable(),
      }),
      isSending: false,
      submitError: null,
      postSuccessMessage: null,
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
        this.isSending = true;
        this.submitError = null;

        try {
          const uploadResult = await uploadFormImageWebpAxios(file);
          if (uploadResult && uploadResult.secure_url) {
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
          this.isSending = false;
        }
      } else {
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
      this.postSuccessMessage = null;

      try {
        await postCalling("/posts", values, true);
        this.isSending = false;
        this.postSuccessMessage = '¡Publicación creada con éxito!';

        this.$emit('publication-success');
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
      this.values.content = null;
      this.values.caption = null;
      this.postSuccessMessage = null;
      this.submitError = null;

      if (this.$refs.form) {
        this.$refs.form.resetForm();
      }
    }
  },
};
</script>

<template>
  <div>
    <div v-if="!image">
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
        <button type="button" :disabled="isSending">
          Seleccionar
        </button>
      </label>
      <div v-if="submitError" class="error-message">{{ submitError }}</div>
    </div>

    <div v-else>
      <img :src="image" alt="Foto seleccionada" class="selected-image" />
      <Form :validation-schema="schema" @submit="handleSubmit" ref="form">
        <div class="form__group">
          <label class="form__label" for="content">Descripción</label>
          <Field
            id="content"
            name="content"
            as="textarea"
            placeholder="Escribe una descripción para tu publicación..."
            class="textarea-field"
          ></Field>
        </div>
        <div class="form__group">
          <label class="form__label" for="caption">Caption de la foto</label>
          <Field
            id="caption"
            name="caption"
            type="text"
            placeholder="Escribe un título para tu publicación..."
            class="form__input text-field"
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

<style lang="sass" scoped>
@use "@/SASS/components/forms"
@use "@/SASS/components/new_publication"
</style>
