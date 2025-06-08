<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">X</button>
      <NewPublication @publication-success="handlePublicationSuccess" />
    </div>
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

    /**
     * Handles the 'publication-success' event emitted by the NewPublication component.
     * Re-emits this event to the parent of the modal and then closes the modal.
     */
    handlePublicationSuccess() {
      this.$emit('publication-successful');

      this.closeModal();
    }
  }
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000000;
}


.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #e91e63;
}
</style>
