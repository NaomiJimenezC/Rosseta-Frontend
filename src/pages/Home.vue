<script>
import { getCalling } from "@/Helpers/CallToAPI.js";
import Post from "@/components/Post.vue";
import Suggestions from "@/components/Suggestions.vue";

export default {
  name: 'Home',
  components: { Suggestions, Post },
  data() {
    return {
      posts: [],
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      this.posts = await this.getPostFollowed();
    } catch (error) {
      console.error('Error fetching posts:', error);
      this.error = error;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async getPostFollowed() {
      return await getCalling("/feed");
    }
  }
};
</script>

<template>
  <section class="home">
    <header class="home__header">
      <h1 class="home__title">Siguiendo</h1>
    </header>

    <template v-if="loading">
      <div class="home__status">
        <p>Cargando publicaciones...</p>
      </div>
    </template>

    <template v-else-if="error">
      <div class="home__status">
        <p>Error al cargar las publicaciones: {{ error.message }}</p>
      </div>
    </template>

    <template v-else-if="posts && posts.data && posts.data.length">
      <ul class="home__list">
        <li v-for="post in posts.data" :key="post.id" class="home__item">
          <Post
            :postId="post.id"
            :userId="post.users_id"
            :img="post.image_url"
            :caption="post.caption"
            :description="post.content"
          />
        </li>
      </ul>
    </template>

    <template v-else>
      <div class="home__empty">
        <h2>No hay publicaciones disponibles</h2>
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
@use "@/SASS/pages/home";
</style>
