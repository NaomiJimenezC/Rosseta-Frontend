<template>
  <div
    v-if="visible"
    class="modal__overlay"
    @click.self="$emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="followers-modal-title"
  >
    <div class="modal__content">
      <header class="modal__header">
        <h2 id="followers-modal-title" class="modal__title">Seguidores</h2>
        <button
          type="button"
          class="modal__close-button"
          @click="$emit('close')"
          aria-label="Cerrar modal"
        >
          ×
        </button>
      </header>

      <div class="modal__body">
        <ul class="follows__results">
          <li
            v-for="follower in followers"
            :key="follower.id"
            class="follows__item"
          >
            <router-link
              v-if="follower && follower.id"
              :to="{ name: 'profile', params: { id: follower.id } }"
              class="follows__info"
              @click="$emit('close')"
            >
              <img
                :src="follower.profile_picture_url || defaultAvatar"
                alt="Foto de perfil"
                class="follows__avatar"
              />
              <span class="follows__username">{{ follower.username }}</span>
            </router-link>

            <div v-else class="follows__info">
              <img
                :src="follower.profile_picture_url || defaultAvatar"
                alt="Foto de perfil"
                class="follows__avatar"
              />
              <span class="follows__username">{{ follower.username || 'Usuario Desconocido' }}</span>
            </div>

            <button
              v-if="loggedInUserId === profileUserId"
              class="modal__submit-button"
              @click="$emit('unfollow', follower.id)"
            >
              Eliminar seguidor
            </button>
          </li>
        </ul>

        <p v-if="!followers.length" class="follows__no_results">
          No tienes seguidores todavía.
        </p>
      </div>

      <button
        type="button"
        class="modal__submit-button"
        @click="$emit('close')"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import defaultAvatar from '@/assets/Default_pfp.jpg'

export default defineComponent({
  name: 'FollowersListModal',
  props: {
    followers: {
      type: Array,
      required: true,
      default: () => []
    },
    visible: {
      type: Boolean,
      required: true
    },
    loggedInUserId: {
      type: [String, Number],
      required: true
    },
    profileUserId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      defaultAvatar
    }
  }
})
</script>

<style lang="sass" scoped>
@use "@/SASS/components/forms"
@use "@/SASS/components/modals"
@use "@/SASS/components/follows_list"
</style>
