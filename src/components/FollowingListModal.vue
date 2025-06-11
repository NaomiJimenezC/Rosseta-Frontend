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
        <h2 id="modal-title" class="modal__title">Seguidos</h2>
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
        <ul class="follows__results">
          <li
            v-for="user in followings"
            :key="user.id"
            class="follows__item"
          >
            <router-link
              v-if="user?.id"
              :to="{ name: 'profile', params: { id: user.id } }"
              class="follows__info"
              @click="close"
            >
              <img
                :src="user.profile_picture_url || defaultAvatar"
                alt="Foto de perfil"
                class="follows__avatar"
              />
              <span class="follows__username">{{ user.username }}</span>
            </router-link>
            <div v-else class="follows__info">
              <img
                :src="user?.profile_picture_url || defaultAvatar"
                alt="Foto de perfil"
                class="follows__avatar"
              />
              <span class="follows__username">{{ user?.username || 'Usuario Desconocido' }}</span>
            </div>

            <span
              v-if="loggedInUserId === profileUserId"
              class="follows__unfollow"
              @click="unfollow(user.id)"
            >
              Dejar de seguir
            </span>
          </li>
        </ul>

        <p v-if="!followings.length" class="follows__no_results">
          No sigues a nadie todavía.
        </p>
      </div>

      <button
        type="button"
        class="modal__submit-button"
        @click="close"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/Default_pfp.jpg';
export default {
  name: 'FollowingListModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    followings: {
      type: Array,
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
        defaultAvatar: defaultAvatar,
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    unfollow(userId) {
      this.$emit('unfollow', userId);
    }
  }
};
</script>

<style lang="sass" scoped>
  @use "@/SASS/components/forms"
  @use "@/SASS/components/modals"
  @use "@/SASS/components/follows_list"
</style>
