<script>
import * as yup from 'yup';
import { Field, Form } from "vee-validate";
import {uploadFormImageWebpAxios} from "@/Helpers/WebpConverter.js";

export default {
  name: "NewPublication",
  components: { Field, Form },
  data() {
    return {
      image: null,
      values: {},
      schema: yup.object({
        comment: yup.string().nullable(),
        imageData: yup.string().nullable(),
      }),
      isSending: false,
      submitError: null,
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
            this.values.imageData = uploadResult.secure_url;
            this.$nextTick(() => {
              if (this.$refs.commentField) {
                this.$refs.commentField.focus();
              }
            });
          } else {
            this.submitError = 'Error al subir la imagen.';
            this.image = null;
          }
        } catch (error) {
          this.submitError = 'Error al subir la imagen: ' + error.message;
          this.image = null;
        } finally {
          this.isSending = false;
          URL.revokeObjectURL(localUrl);
        }
      } else {
        this.image = null;
        this.values.imageData = null;
      }
    },
    handleSubmit(values) {
      this.isSending = true;
      console.log("Valores del formulario:", values);
      console.log("Imagen (URL de Cloudinary):", values.imageData);
      setTimeout(() => {
        this.isSending = false;
        this.image = null;
        this.values = {};
      }, 2000);
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
      <label for="comment">
        Descripción
      </label>
      <Field
        id="comment"
        name="comment"
        as="textarea"
        placeholder="Escribe una descripción para tu publicación..."
        ref="commentField"
      ></Field>
      <Field type="hidden" name="imageData" :value="values.imageData" />
      <button type="submit" :disabled="isSending">
        {{ isSending ? 'Publicando...' : 'Publicar' }}
      </button>
    </Form>
    <button @click="image = null; values.imageData = null;">Cambiar imagen</button>
    <div v-if="submitError" style="color: red;">{{ submitError }}</div>
  </section>
</template>

<style scoped>
</style>
