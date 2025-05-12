<script>
import * as yup from 'yup';
import { Field, Form } from "vee-validate";
import {uploadFormImageWebpAxios} from "@/Helpers/WebpConverter.js";
import {postCalling} from "@/Helpers/CallToAPI.js";

export default {
  name: "NewPublication",
  components: { Field, Form },
  data() {
    return {
      image: null,
      values: {},
      schema: yup.object({
        content: yup.string().nullable(),
        image_url: yup.string().required(),
        caption: yup.string().nullable(),
      }),
      isSending: false,
      submitError: null,
      postSuccessMessage: null,
    };
  },
  methods: {
    async handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.isSending = true;
        try {
          const uploadResult = await uploadFormImageWebpAxios(file);
          if (uploadResult && uploadResult.secure_url) {
            this.image = uploadResult.secure_url;
            this.values.image_url = uploadResult.secure_url;
          } else {
            this.submitError = 'Error al subir la imagen.';
            this.image = null;
          }
        } catch (error) {
          this.submitError = 'Error al subir la imagen: ' + error.message;
          this.image = null;
        } finally {
          this.isSending = false;
        }
      } else {
        this.image = null;
        this.values.image_url = null;
      }
    },
    async handleSubmit(values) {
      this.isSending = true;
      this.submitError = null;
      this.postSuccessMessage = null;
      try {
        await postCalling("/posts", values, true);
        this.isSending = false;
        this.image = null;
        this.values = {};
        this.postSuccessMessage = '¡Publicación creada con éxito!';
      } catch (error) {
        console.error("Error al crear la publicación:", error);
        this.submitError = 'Error al crear la publicación. Inténtalo de nuevo.';
        this.isSending = false;
      }
    },
  },
};
</script>

<template>
  <section v-if="!image">
    <label>
      Selecciona la imagen que quieres postear
      <input
        type="file"
        name="myImage"
        accept="image/png, image/jpeg, image/jpg"
        @change="handleImageChange"
      />
    </label>
    <div v-if="submitError" style="color: red;">{{ submitError }}</div>
  </section>

  <section v-else>
    <img :src="image" alt="Foto seleccionada" style="max-width: 300px; height: auto; margin-bottom: 1rem;" />
    <Form :validation-schema="schema" @submit="handleSubmit" ref="form">
      <label for="content">
        Descripción
      </label>
      <Field
        id="content"
        name="content"
      as="textarea"
      placeholder="Escribe una descripción para tu publicación..."
      ref="commentField"
      ></Field>
      <label for="caption">
        Título
      </label>
      <Field
        id="caption"
        name="caption"
        type="text"
        placeholder="Escribe un título para tu publicación..."
        ref="captionField"
      ></Field>
      <Field type="hidden" name="image_url" :value="values.image_url" />
      <button type="submit" :disabled="isSending">
        {{ isSending ? 'Publicando...' : 'Publicar' }}
      </button>
    </Form>
    <button @click="image = null; values.image_url = null; values.caption = null; postSuccessMessage = null; submitError = null;">Cambiar imagen</button>
    <div v-if="submitError" style="color: red;">{{ submitError }}</div>
    <div v-if="postSuccessMessage" style="color: green;">{{ postSuccessMessage }}</div>
  </section>
</template>

<style scoped>
</style>
