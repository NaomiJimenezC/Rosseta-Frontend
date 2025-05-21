<template>
  <div class="p-4">
    <input
      v-model="query"
      @input="onInput"
      type="text"
      placeholder="Buscar..."
      class="border rounded p-2 w-full mb-2"
    />
    <div class="flex space-x-2 mb-4">
      <button
        @click="performSearch"
        :disabled="loading"
        class="bg-blue-600 text-white rounded px-4 py-2"
      >
        {{ loading ? 'Buscando...' : 'Buscar' }}
      </button>
      <button
        @click="activeTab = 'posts'"
        :class="activeTab === 'posts' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'"
        class="rounded px-4 py-2"
      >
        Ver Posts
      </button>
      <button
        @click="activeTab = 'users'"
        :class="activeTab === 'users' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'"
        class="rounded px-4 py-2"
      >
        Ver Usuarios
      </button>
    </div>

    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <!-- POSTS -->
    <div v-if="activeTab === 'posts' && posts.length">
      <h2 class="font-bold text-lg mb-2">Posts</h2>
      <ul class="space-y-2 mb-6">
        <li v-for="post in posts" :key="post.id" class="border p-3 rounded">
          <p>{{ post.content }}</p>
          <p v-if="post.caption" class="italic">{{ post.caption }}</p>
          <img
            v-if="post.image_url"
            :src="post.image_url"
            class="max-h-48 rounded mt-2"
          />
        </li>
      </ul>
    </div>

    <!-- USERS -->
    <div v-if="activeTab === 'users' && users.length">
      <h2 class="font-bold text-lg mb-2">Usuarios</h2>
      <ul class="space-y-2">
        <li
          v-for="user in users"
          :key="user.id"
          class="flex items-center space-x-3 border p-3 rounded"
        >
          <img
            v-if="user.profile_picture_url"
            :src="user.profile_picture_url"
            alt="avatar"
            class="w-10 h-10 rounded-full"
          />
          <span>{{ user.username }}</span>
        </li>
      </ul>
    </div>

    <div
      v-if="!loading && !posts.length && !users.length && query"
      class="text-gray-500"
    >
      No se encontraron resultados para "{{ query }}".
    </div>
  </div>
</template>

<script>
import { getCalling } from '@/Helpers/CallToAPI.js';

export default {
  name: "SearchResults",
  data() {
    return {
      query: '',
      posts: [],
      users: [],
      loading: false,
      error: null,
      debounceTimer: null,
      activeTab: 'posts', // ← Aquí elegimos qué mostrar
    };
  },
  methods: {
    async performSearch() {
      if (!this.query.trim()) {
        this.posts = [];
        this.users = [];
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const data = await getCalling(`/search?q=${encodeURIComponent(this.query)}`, false);
        this.posts = data.posts;
        this.users = data.users;
      } catch (err) {
        console.error(err);
        this.error = 'Error al realizar la búsqueda.';
      } finally {
        this.loading = false;
      }
    },
    onInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch();
      }, 400);
    }
  }
};
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
