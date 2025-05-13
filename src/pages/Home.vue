<script>
import { getCalling } from "@/Helpers/CallToAPI.js";
import Post from "@/components/Post.vue";

export default {
  name: 'Home',
  components: {Post},
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
  <div>
    <h1>Siguiendo</h1>
    <div v-if="loading">
      Cargando publicaciones...
    </div>
    <div v-else-if="error">
      Error al cargar las publicaciones: {{ error.message }}
    </div>
    <ul v-else-if="posts && posts.data && posts.data.length > 0">
      <li v-for="post in posts.data" :key="post.id">
        <Post
          :userId="post.users_id"
          :img="post.image_url"
          :caption="post.caption"
          :description="post.content"
        />
      </li>
    </ul>
    <h2 v-else>No hay publicaciones disponibles</h2>
  </div>
</template>

<style scoped>
</style>
