<script>
import { getCalling } from "@/Helpers/CallToAPI.js";

export default {
  name: "Post",
  props: {
    userId: Number,
    img: String,
    description: String,
    caption: String,
  },
  data() {
    return {
      userData: null,
      loading: true,
      error: null,
      defaultProfilePicture: '@/assets/Default_pfp.jpg', // Define the URL por defecto aquí
    };
  },
  async mounted() {
    try {
      this.userData = await getCalling(`/users/${this.userId}`, true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.error = error;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = this.defaultProfilePicture; // Cambia la fuente de la imagen al valor por defecto
    },
  },
};
</script>

<template>
  <article v-if="!loading && !error">
    <header>
      <img
        :src="userData ? userData.profile_picture_url : defaultProfilePicture"
        @error="handleImageError"
        alt="User Profile"
      />
      <h4 v-if="userData">{{ userData.username }}</h4>
    </header>
    <img :src="img" :alt="caption" />
    <p>{{ description }}</p>
  </article>
  <div v-if="loading">
    <p>Loading user data...</p>
  </div>
  <div v-if="error">
    <p>Error: {{ error.message }}</p>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
