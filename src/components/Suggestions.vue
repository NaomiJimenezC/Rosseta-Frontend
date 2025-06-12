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
  <h2 class="tittle">Recomendaciones</h2>
  <section class="suggestions">
    <ul class="suggestions__list">
      <li
        v-for="user in suggestions"
        :key="user.id"
        class="suggestions__item"
        @click="goToProfile(user.id)"
      >
        <img
          :src="user.profile_picture_url || defaultProfileImage"
          alt="Avatar"
          class="suggestions__item__avatar"
        />
        <span class="suggestions__item__username">@{{ user.username }}</span>
      </li>
    </ul>
  </section>
</template>



<style lang="sass" scoped>
@use '@/SASS/components/recommendations'
</style>
