<script>
import {getCalling} from "@/Helpers/CallToAPI.js";

export default {
  name: 'Home',
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    try {
      console.log("probando")
      this.posts = await this.getPostFollowed();

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  },
  methods: {
    async getPostFollowed() {
      console.log("prueba")
      return await getCalling("/feed");
    }
  }
};
</script>

<template>
  <div>
    <h1>Siguiendo</h1>
    <ul v-if="posts.length > 0">
      <li  v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
    <h2 v-else> No hay publicaciones disponibles</h2>
<!--TODO: Hacer la funcionalidad de publicación para comprobar que feed funciona-->
  </div>
</template>

<style scoped>

</style>
