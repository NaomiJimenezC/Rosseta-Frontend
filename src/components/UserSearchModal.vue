<template>
  <div
    v-if="visible"
    class="modal__overlay"
    @click.self="close"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="modal__content">
      <header class="modal__header">
        <h2 id="modal-title" class="modal__title">
          Elegir usuario
        </h2>
        <button
          type="button"
          class="modal__close-button"
          @click="close"
          aria-label="Cerrar modal"
        >
          ×
        </button>
      </header>

      <div class="modal__body">
        <input
          v-model="term"
          type="search"
          placeholder="Filtrar por nombre..."
          class="form__input"
        />
        <ul class="user__results">
          <li
            v-for="user in filtered"
            :key="user.id"
            @click="select(user.id)"
            class="user-item"
          >
            <img :src="user.profile_picture_url || defaultAvatar" alt="perfil de usuario">
            {{ user.username }}
          </li>
          <li v-if="!filtered.length" class="user__no_results">
            No se encontraron usuarios.
          </li>
        </ul>
      </div>
        <button type="button" @click="close" class="modal__submit-button">Cancelar</button>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/Default_pfp.jpg'
export default {
  name: 'UserSearchModal',
  props: {
    visible: { type: Boolean, required: true },
    users:   { type: Array,   required: true }
  },
  data() {
    return { term: '', defaultAvatar}
  },
  computed: {
    filtered() {
      const t = this.term.toLowerCase().trim();
      return t === ''
        ? this.users
        : this.users.filter(u =>
          u.username.toLowerCase().includes(t)
        );
    }
  },
  methods: {
    select(id) {
      this.$emit('select-user', id);
      this.close();
    },
    close() {
      this.$emit('update:visible', false);
      this.$emit('close');
      this.term = '';
    }
  }
}
</script>

<style lang="sass" scoped>
@use "@/SASS/components/modals"
@use "@/SASS/components/forms"
@use "@/SASS/components/user_searchmodal"
</style>
