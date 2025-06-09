<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2 class="modal-title">Seguidos</h2>
      <ul class="followers-list">
        <li v-for="user in followings" :key="user.id" class="follower-item">
          <router-link
            v-if="user?.id"
            :to="{ name: 'profile', params: { id: user.id } }"
            class="follower-info"
            @click.native="$emit('close')"
          >
            <img
              :src="user.profile_picture_url || defaultAvatar"
              alt="Foto de perfil"
              class="avatar"
            />
            <span class="username">{{ user.username }}</span>
          </router-link>
          <div v-else class="follower-info">
            <img
              :src="user?.profile_picture_url || defaultAvatar"
              alt="Foto de perfil"
              class="avatar"
            />
            <span class="username">{{ user?.username || 'Usuario Desconocido' }}</span>
          </div>

          <button
            v-if="loggedInUserId === profileUserId"
            class="unfollow-btn"
            @click="$emit('unfollow', user.id)"
          >
            Dejar de seguir
          </button>
        </li>
      </ul>
      <button class="close-btn" @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import defaultAvatar from '@/assets/Default_pfp.jpg'

export default defineComponent({
  name: 'FollowingListModal',
  props: {
    followings: {
      type: Array,
      required: true,
      default: () => []
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
    return { defaultAvatar }
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.modal-title {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
}
.followers-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}
.follower-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaeaea;
}
.follower-info {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}
.username {
  font-size: 1rem;
}
.unfollow-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.875rem;
}
.close-btn {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  background: #3498db;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
