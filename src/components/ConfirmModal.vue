<template>
  <aside class="modal__overlay" @click="cancel">
    <article class="modal__content" role="main">
      <header class="modal__header">
        <h2 class="modal__title">Confirmación</h2>
        <button class="modal__close-button" @click="cancel" aria-label="Cerrar">×</button>
      </header>
      <main class="modal__body">
        <p>{{ message }}</p>
      </main>
      <footer class="modal__footer">
        <button @click="confirm" class="modal__submit-button">Eliminar</button>
      </footer>
    </article>
  </aside>
</template>
<script>
export default {
  name: "ConfirmModal",
  props: {
    message: {
      type: String,
      default: "¿Estás seguro de que deseas continuar?"
    }
  },
  emits: ["confirm", "cancel"],
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="sass" scoped>
@use "@/SASS/components/modals"
</style>
