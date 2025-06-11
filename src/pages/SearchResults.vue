<template>
  <div class="search-results__container">
    <input
      v-model="query"
      @input="onInput"
      type="text"
      placeholder="Buscar..."
      class="search-results__input"
    />

    <div class="search-results__tabs">
      <button
        @click="activeTab = 'posts'"
        :class="['search-results__tab', { 'search-results__tab--active': activeTab === 'posts' }]"
      >
        Ver Posts
      </button>
      <button
        @click="activeTab = 'users'"
        :class="['search-results__tab', { 'search-results__tab--active': activeTab === 'users' }]"
      >
        Ver Usuarios
      </button>
    </div>

    <div v-if="error" class="search-results__error">{{ error }}</div>

    <section v-if="activeTab === 'posts' && posts.length" class="search-results__section">
      <h2 class="search-results__section-title">Posts</h2>
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
    </section>

    <section v-if="activeTab === 'users' && users.length" class="search-results__section">
      <h2 class="search-results__section-title">Usuarios</h2>
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
    </section>

    <div
      v-if="!loading && !posts.length && !users.length && query"
      class="search-results__no-results"
    >
      No se encontraron resultados para "{{ query }}".
    </div>
  </div>
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
@use '@/SASS/abstracts/colours' as c;

.search-results {
  &__container {
    padding: 16px;
  }

  &__input {
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }

  &__tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__tab {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #e5e7eb;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &--active {
      background-color: #1f2937;
      color: white;
    }
  }

  &__error {
    color: c.$color-secundario-800;
    margin-bottom: 16px;
  }

  &__section {
    margin-bottom: 24px;
  }

  &__section-title {
    font-size: 1.125rem;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;

    &--posts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &--users {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  &__item {
    border: 1px solid #d1d5db;
    padding: 12px;
    border-radius: 4px;
  }

  &__user-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__username {
    font-size: 1rem;
  }

  &__no-results {
    color: #6b7280;
  }
}
</style>
