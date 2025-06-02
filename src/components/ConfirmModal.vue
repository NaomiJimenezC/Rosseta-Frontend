<template>
  <div class="modal-overlay" @click.self="cancel">
    <div class="modal-box">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="confirm" class="modal-confirm">Eliminar</button>
        <button @click="cancel" class="modal-cancel">Cancelar</button>
      </div>
    </div>
  </div>
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-confirm {
  background-color: #e91e63;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-cancel {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-confirm:hover {
  background-color: #c2185b;
}

.modal-cancel:hover {
  background-color: #aaa;
}
</style>
