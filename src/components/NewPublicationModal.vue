<template>
  <div
    v-if="isVisible"
    class="modal__overlay"
    @click.self="closeModal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <section class="modal__content">
      <header class="modal__header">
        <h2 id="modal-title" class="modal__title">
          Selecciona la imagen que quieres postear
        </h2>
        <button
          class="modal__close-button"
          @click="closeModal"
          aria-label="Cerrar modal"
        >
          ×
        </button>
      </header>
      <main class="modal__body">
        <NewPublication @publication-success="handlePublicationSuccess" />
      </main>
    </section>
  </div>
</template>
<script>
import NewPublication from './NewPublication.vue';

export default {
  name: 'NewPublicationModal',
  components: {
    NewPublication,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * Closes the modal by emitting an event to the parent.
     * The parent component should update the `isVisible` prop based on this event.
     */
    closeModal() {
      this.$emit('update:isVisible', false);

      this.$emit('modal-closed');
    },

    handlePublicationSuccess() {
      this.$emit('publication-successful');
      this.closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
@use "@/SASS/components/modals"
</style>
