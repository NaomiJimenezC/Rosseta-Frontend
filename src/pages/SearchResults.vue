<template>
  <main class="search-results__container">
    <label for="search-input" class="visually-hidden">Buscar</label>
    <input
      id="search-input"
      v-model="query"
      @input="onInput"
      type="text"
      placeholder="Buscar..."
      class="search-results__input form__input"
    />

    <nav class="search-results__tabs" aria-label="Filtrar resultados">
      <button
        @click="activeTab = 'posts'"
        :class="['search-results__tab', { 'search-results__tab--active': activeTab === 'posts' }]"
        role="tab"
        :aria-selected="activeTab === 'posts'"
      >
        Posts
      </button>
      <button
        @click="activeTab = 'users'"
        :class="['search-results__tab', { 'search-results__tab--active': activeTab === 'users' }]"
        role="tab"
        :aria-selected="activeTab === 'users'"
      >
        Usuarios
      </button>
    </nav>

    <section v-if="error" class="search-results__error" role="alert">
      {{ error }}
    </section>

    <section
      v-if="activeTab === 'posts'"
      class="search-results__section"
      role="tabpanel"
      aria-labelledby="posts-tab"
    >
      <h2 id="posts-tab" class="search-results__section-title">Posts</h2>
      <ul class="search-results__list search-results__list--posts">
        <li v-for="post in posts" :key="post.id" class="search-results__item">
          <Post
            :postId="post.id"
            :userId="post.users_id"
            :img="post.image_url"
            :caption="post.caption"
            :description="post.content"
          />
        </li>
      </ul>
      <div
        v-if="!loading && posts.length === 0 && query"
        class="search-results__no-results"
      >
        No se encontraron posts para «{{ query }}».
      </div>
    </section>

    <section
      v-if="activeTab === 'users'"
      class="search-results__section"
      role="tabpanel"
      aria-labelledby="users-tab"
    >
      <h2 id="users-tab" class="search-results__section-title">Usuarios</h2>
      <ul class="search-results__list search-results__list--users">
        <li v-for="user in users" :key="user.id" class="search-results__item">
          <router-link
            :to="{ name: 'profile', params: { id: user.id } }"
            class="search-results__user-link"
          >
            <img
              v-if="user.profile_picture_url"
              :src="user.profile_picture_url"
              alt="avatar"
              class="search-results__avatar"
            />
            <span class="search-results__username">{{ user.username }}</span>
          </router-link>
        </li>
      </ul>
      <div
        v-if="!loading && users.length === 0 && query"
        class="search-results__no-results"
      >
        No se encontraron usuarios para «{{ query }}».
      </div>
    </section>
  </main>
</template>

<script>
import { getCalling } from '@/Helpers/CallToAPI.js';
import Post from '@/components/Post.vue';

export default {
  name: 'SearchResults',
  components: { Post },
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
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/SASS/components/forms';
@use "@/SASS/pages/search_results";
</style>
