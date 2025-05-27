<script>
export default {
  name: 'UserSearchModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    users: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localSearchTerm: ''
    };
  },
  watch: {
    localSearchTerm(term) {
      this.$emit('search', term);
    }
  },
  methods: {
    selectUser(id) {
      this.$emit('select-user', id);
    }
  }
};
</script>

<template>
  <template>
    <dialog v-if="visible" class="user-search-modal">
      <form @submit.prevent class="user-search-form">
        <header class="modal-header">
          <h2>Buscar usuario</h2>
          <button @click="$emit('close')" aria-label="Cerrar modal">×</button>
        </header>
        <div class="modal-body">
          <label for="user-search-input" class="visually-hidden">Buscar usuario</label>
          <input
            id="user-search-input"
            type="search"
            v-model="localSearchTerm"
            placeholder="Nombre de usuario..."
            class="user-search__input"
          />
          <ul class="user-results" aria-label="Resultados de búsqueda">
            <li
              v-for="user in users"
              :key="user.id"
              @click="selectUser(user.id)"
              class="user-item"
              role="button"
              tabindex="0"
            >
              {{ user.name }}
            </li>
          </ul>
        </div>
        <footer class="modal-footer">
          <button @click="$emit('close')" class="btn-secondary">
            Cancelar
          </button>
        </footer>
      </form>
    </dialog>
  </template>



  <style scoped>
    .user-search-modal {
      border: none;
      padding: 0;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 1px solid #ddd;
    }
    .modal-body {
      padding: 0.75rem;
    }
    .modal-footer {
      padding: 0.75rem;
      border-top: 1px solid #ddd;
      text-align: right;
    }
    .user-search__input {
      width: 100%;
      padding: 0.5rem;
    }
    .user-results {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0;
      max-height: 200px;
      overflow-y: auto;
    }
    .user-item {
      padding: 0.5rem;
      cursor: pointer;
    }
    .user-item:hover {
      background-color: #f1f1f1;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }
  </style>

</template>

<style scoped>

</style>
