<template>
  <dialog ref="dialog" class="user-search-modal">
    <form @submit.prevent class="user-search-form">
      <header class="modal-header">
        <h2>Elegir usuario</h2>
        <button type="button" @click="close" aria-label="Cerrar">×</button>
      </header>
      <div class="modal-body">
        <input
          v-model="term"
          type="search"
          placeholder="Filtrar por nombre..."
          class="user-search__input"
        />
        <ul class="user-results">
          <li
            v-for="user in filtered"
            :key="user.id"
            @click="select(user.id)"
            class="user-item"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
      <footer class="modal-footer">
        <button type="button" @click="close">Cancelar</button>
      </footer>
    </form>
  </dialog>
</template>

<script>
export default {
  name: 'UserSearchModal',
  props: {
    visible: { type: Boolean, required: true },
    users:   { type: Array,   required: true }
  },
  data() {
    return { term: '' };
  },
  computed: {
    filtered() {
      const t = this.term.toLowerCase();
      return t.length < 2
        ? []
        : this.users.filter(u =>
          u.username.toLowerCase().includes(t)
        );
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => {
        val ? this.$refs.dialog.showModal() : this.$refs.dialog.close();
      });
    }
  },
  methods: {
    select(id) {
      this.$emit('select-user', id);
    },
    close() {
      this.$emit('close');
      this.term = '';
    }
  }
};
</script>

<style scoped>
.user-search-modal {
  border: none;
  padding: 0;
}
.modal-header,
.modal-footer {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
}
.modal-body {
  padding: 0.75rem;
}
.user-search__input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
.user-results {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}
.user-item {
  padding: 0.5rem;
  cursor: pointer;
}
.user-item:hover {
  background: #f1f1f1;
}
</style>
