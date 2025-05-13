<script>
import { getCalling } from "@/Helpers/CallToAPI.js";
import Heart from 'vue-material-design-icons/Heart.vue';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';

export default {
  name: "Post",
  components: {
    Heart,
    HeartOutline
  },
  props: {
    postId: Number,
    userId: Number,
    img: String,
    description: String,
    caption: String,
  },
  data() {
    return {
      hasLiked: Boolean,
      userData: null,
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      this.userData = await getCalling(`/users/${this.userId}`, true);
      this.hasLiked = await getCalling(`posts/${this.postId}/liked`,true)
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.error = error;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<template>
  <article v-if="!loading && !error">
    <header>
      <img
        :src="userData.profile_picture_url"
        :alt="userData.username + ' profile photo'"
      />
      <h4>{{ userData.username }}</h4>
    </header>

    <img :src="img" :alt="caption" />

    <span class="icon-wrapper">
      <Heart v-if="!hasLiked" class="icon-filled" />
      <HeartOutline v-else class="icon-outline" />
<!--      TODO: Añadir la interacción para dar me gustas y añadir el emoji de comentarios-->
    </span>

    <p>{{ description }}</p>
  </article>

  <div v-else-if="loading">
    <p>Loading user data...</p>
  </div>
  <div v-else>
    <p>Error: {{ error.message }}</p>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
.icon-outline,
.icon-filled {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 8px;
}
</style>
