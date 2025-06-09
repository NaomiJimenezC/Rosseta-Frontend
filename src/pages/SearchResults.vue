<template>
  <div class="search-container">
    <input
      v-model="query"
      @input="onInput"
      type="text"
      placeholder="Buscar..."
      class="search-input"
    />
    <div class="button-group">

      <button
        @click="activeTab = 'posts'"
        :class="['tab-button', { 'active-tab': activeTab === 'posts' }]"
      >
        Ver Posts
      </button>
      <button
        @click="activeTab = 'users'"
        :class="['tab-button', { 'active-tab': activeTab === 'users' }]"
      >
        Ver Usuarios
      </button>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="activeTab === 'posts' && posts.length" class="results-section">
      <h2 class="section-title">Posts</h2>
      <ul class="posts-list">
        <li v-for="post in posts" :key="post.id">
          <Post
            :postId="post.id"
            :userId="post.users_id"
            :img="post.image_url"
            :caption="post.caption"
            :description="post.content"
          />
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'users' && users.length" class="results-section">
      <h2 class="section-title">Usuarios</h2>
      <ul class="users-list">
        <li
          v-for="user in users"
          :key="user.id"
          class="user-list-item" >
          <router-link
            :to="{ name: 'profile', params: { id: user.id } }"
            class="user-link"
          >
            <img
              v-if="user.profile_picture_url"
              :src="user.profile_picture_url"
              alt="avatar"
              class="user-avatar"
            />
            <span>{{ user.username }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div
      v-if="!loading && !posts.length && !users.length && query"
      class="no-results-message"
    >
      No se encontraron resultados para "{{ query }}".
    </div>
  </div>
</template>

<script>
import { getCalling } from '@/Helpers/CallToAPI.js';
import Post from "@/components/Post.vue";

export default {
  name: "SearchResults",
  components: {Post},
  data() {
    return {
      query: '',
      posts: [],
      users: [],
      loading: false,
      error: null,
      debounceTimer: null,
      activeTab: 'posts',
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
/* Contenedor principal de la búsqueda */
.search-container {
  padding: 16px; /* Equivalente a p-4 */
}

/* Input de búsqueda */
.search-input {
  border: 1px solid #d1d5db; /* Equivalente a border */
  border-radius: 4px; /* Equivalente a rounded */
  padding: 8px; /* Equivalente a p-2 */
  width: 100%; /* Equivalente a w-full */
  margin-bottom: 8px; /* Equivalente a mb-2 */
}

/* Grupo de botones */
.button-group {
  display: flex; /* Equivalente a flex */
  gap: 8px; /* Equivalente a space-x-2 */
  margin-bottom: 16px; /* Equivalente a mb-4 */
}

/* Botón de búsqueda */
.search-button {
  background-color: #2563eb; /* Equivalente a bg-blue-600 */
  color: white; /* Equivalente a text-white */
  border-radius: 4px; /* Equivalente a rounded */
  padding: 8px 16px; /* Equivalente a px-4 py-2 */
  border: none;
  cursor: pointer;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botones de pestaña (Ver Posts, Ver Usuarios) */
.tab-button {
  border-radius: 4px; /* Equivalente a rounded */
  padding: 8px 16px; /* Equivalente a px-4 py-2 */
  border: none;
  cursor: pointer;
  background-color: #e5e7eb; /* Equivalente a bg-gray-200 */
  color: black; /* Equivalente a text-black */
}

.tab-button.active-tab {
  background-color: #1f2937; /* Equivalente a bg-gray-800 */
  color: white; /* Equivalente a text-white */
}

/* Mensaje de error */
.error-message {
  color: #dc2626; /* Equivalente a text-red-600 */
  margin-bottom: 16px; /* Equivalente a mb-4 */
}

/* Sección de resultados (Posts/Usuarios) */
.results-section {
  /* No se necesitan estilos complejos aquí sin Tailwind */
}

.section-title {
  font-weight: bold; /* Equivalente a font-bold */
  font-size: 1.125rem; /* Equivalente a text-lg */
  margin-bottom: 8px; /* Equivalente a mb-2 */
}

/* Lista de posts */
.posts-list {
  list-style: none; /* Quita viñetas de lista */
  padding: 0;
  margin: 0;
  margin-bottom: 24px; /* Equivalente a mb-6 */
  display: flex; /* Para space-y-2 */
  flex-direction: column; /* Para space-y-2 */
  gap: 8px; /* Para space-y-2 */
}

/* Elemento individual de post */
.post-item {
  border: 1px solid #d1d5db; /* Equivalente a border */
  padding: 12px; /* Equivalente a p-3 */
  border-radius: 4px; /* Equivalente a rounded */
}

.post-caption {
  font-style: italic; /* Equivalente a italic */
}

.post-image {
  max-height: 192px; /* Equivalente a max-h-48 */
  border-radius: 4px; /* Equivalente a rounded */
  margin-top: 8px; /* Equivalente a mt-2 */
  width: auto; /* Asegura que la imagen no se estire */
  height: auto; /* Asegura que la imagen no se estire */
  display: block; /* Para que margin-top funcione bien */
}

/* Lista de usuarios */
.users-list {
  list-style: none; /* Quita viñetas de lista */
  padding: 0;
  margin: 0;
  display: flex; /* Para space-y-2 */
  flex-direction: column; /* Para space-y-2 */
  gap: 8px; /* Para space-y-2 */
}

/* Elemento individual de usuario en la lista */
.user-list-item {
  border: 1px solid #d1d5db; /* Equivalente a border */
  padding: 12px; /* Equivalente a p-3 */
  border-radius: 4px; /* Equivalente a rounded */
}

/* Enlace del usuario (router-link) */
.user-link {
  display: flex; /* Equivalente a flex */
  align-items: center; /* Equivalente a items-center */
  gap: 12px; /* Equivalente a space-x-3 */
  width: 100%; /* Equivalente a w-full */
  text-decoration: none; /* Quita el subrayado por defecto del enlace */
  color: inherit; /* Hereda el color del texto del padre */
  padding: 8px; /* Equivalente a p-2 */
  margin: -8px; /* Equivalente a -m-2 */
  border-radius: 4px; /* Equivalente a rounded */
  transition: background-color 0.15s ease; /* Equivalente a transition-colors duration-150 */
  cursor: pointer;
}

.user-link:hover {
  background-color: #f3f4f6; /* Equivalente a hover:bg-gray-100 */
}

/* Avatar del usuario */
.user-avatar {
  width: 40px; /* Equivalente a w-10 */
  height: 40px; /* Equivalente a h-10 */
  border-radius: 9999px; /* Equivalente a rounded-full */
  object-fit: cover; /* Para asegurar que la imagen se vea bien */
}

/* Mensaje de no resultados */
.no-results-message {
  color: #6b7280; /* Equivalente a text-gray-500 */
}
</style>
