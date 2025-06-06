<script>
import { getCalling } from '@/Helpers/CallToAPI.js'
import defaultProfileImage from '@/assets/Default_pfp.jpg'

export default {
  name: 'Suggestions',
  data() {
    return {
      suggestions: [],
      defaultProfileImage
    }
  },
  methods: {
    async fetchSuggestions() {
      try {
        const res = await getCalling('/profile/suggestions', true)
        console.log(res)
        this.suggestions = Array.isArray(res) ? res : []
      } catch (e) {
        console.error('Error cargando sugerencias:', e)
        this.suggestions = []
      }
    },
    goToProfile(id) {
      this.$router.push(`/profile/${id}`);
    }
  },
  mounted() {
    this.fetchSuggestions()
  }
}
</script>

<template>
  <section class="suggestions-box">
    <ul class="suggestions-list">
      <li
        v-for="user in suggestions"
        :key="user.id"
        class="suggestion-item"
        @click="goToProfile(user.id)"
      >
        <img
          :src="user.profile_picture_url || defaultProfileImage"
          alt="Avatar"
          class="suggestion-avatar"
        />
        <span class="suggestion-username">@{{ user.username }}</span>
      </li>
    </ul>
  </section>
</template>



<style scoped>
.suggestions-box {
  background-color: #f48fb1;
  border-radius: 8px;
  padding: 16px;
  max-width: 280px;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-radius 0.2s ease-in-out;
}

.suggestion-item:hover {
  background-color: #fce4ec;
  border-radius: 6px;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.suggestion-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 2px solid #fff;
  background-color: #fff;
}

.suggestion-username {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
}
</style>
