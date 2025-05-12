<script>
import { getCalling } from "@/Helpers/CallToAPI.js";
import Post from "@/components/Post.vue";

export default {
  name: 'Home',
  components: {Post},
  data() {
    return {
      posts: [],
      loading: true, // Para manejar el estado de carga
      error: null    // Para manejar errores
    };
  },
  async mounted() {
    try {
      this.posts = await this.getPostFollowed();
    } catch (error) {
      console.error('Error fetching posts:', error);
      this.error = error; // Guarda el error para mostrarlo en el template
    } finally {
      this.loading = false; // Actualiza el estado de carga
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
          :image="post.content"
        />
      </li>
    </ul>
    <h2 v-else>No hay publicaciones disponibles</h2>
  </div>
</template>

<style scoped>
</style>
