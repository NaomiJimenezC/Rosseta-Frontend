<script>
import {getCalling, postCalling} from "@/Helpers/CallToAPI.js";
import defaultProfileImage from "@/assets/Default_pfp.jpg";

export default {
  name: "Profile",
  data() {
    return {
      user: null,
      posts: [],
      loading: true,
      error: null,
      defaultProfileImage,
      isCurrentUserProfile: false,
      isFollowing: false,
    };
  },
  computed: {
    loggedInUserId() {
      return localStorage.getItem("userId")
        ? parseInt(localStorage.getItem("userId"))
        : null;
    },
    profileId() {
      return Number(this.$route.params.id);
    }
  },
  async created() {
    await this.fetchProfileData();
  },
  watch: {
    "$route.params.id": {
      handler: "fetchProfileData",
      immediate: false
    }
  },
  methods: {
    async fetchProfileData() {
      this.loading = true;
      this.error = null;
      this.isCurrentUserProfile =
        this.loggedInUserId && this.loggedInUserId === this.profileId;

      try {
        this.user = await getCalling(`/users/${this.profileId}`, true);

        const response = await getCalling(`/users/${this.profileId}/posts`, true);
        this.posts = response.data;

      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        this.error = "No se pudo cargar el perfil.";
      } finally {
        this.loading = false;
      }
    },

    goToPost(postId) {
      this.$router.push({ name: "post", params: { id: postId } });
    },

    follow(idUsuario){
      try {
        //postCalling(/users/")
      } catch (e){
        console.log(e)
      }
    }
  }
};
</script>

<template>
  <main class="profile-container">
    <section v-if="loading" class="message">Cargando perfil...</section>
    <section v-else-if="error" class="message error">Error: {{ error }}</section>

    <section v-else>
      <header class="profile-header">
        <img
          :src="user.profile_picture_url || defaultProfileImage"
          alt="Foto de perfil"
          class="profile-picture"
        />
        <div>
          <h1 class="username">{{ user.username }}</h1>
          <nav class="stats">
            <span>{{ user.followers_count }} seguidores</span>
            <span>{{ user.following_count }} seguidos</span>
            <span>{{ posts.length }} publicaciones</span>
          </nav>

          <button
            v-if="!isCurrentUserProfile"
            class="follow-button"
            :disabled="loading"
          >
            {{ isFollowing ? "Dejar de Seguir" : "Seguir" }}
          </button>
          <button v-else class="edit-profile-button">Editar Perfil</button>
        </div>
      </header>

      <section class="publications-section">
        <h2 class="section-title">Publicaciones</h2>
        <p v-if="!posts.length" class="message">Este usuario no tiene publicaciones.</p>
        <ul v-else class="image-grid" aria-label="Publicaciones del usuario">
          <li
            v-for="post in posts"
            :key="post.id"
            class="image-grid__item"
            @click="goToPost(post.id)"
            role="button"
            tabindex="0"
            @keyup.enter="goToPost(post.id)"
          >
            <img
              :src="post.image_url"
              :alt="post.caption || 'Imagen de publicación'"
              class="image-grid__img"
            />
          </li>
        </ul>
      </section>
    </section>
  </main>
</template>

<style scoped>
.profile-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.profile-picture {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.stats {
  margin-top: 8px;
  font-size: 14px;
  color: #444;
}

.stats span {
  margin-right: 16px;
}

.follow-button,
.edit-profile-button {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.follow-button {
  background-color: #007bff;
  color: white;
}

.follow-button:hover {
  background-color: #0056b3;
}

.follow-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.edit-profile-button {
  background-color: #6c757d;
  color: white;
}

.edit-profile-button:hover {
  background-color: #5a6268;
}
.publications-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* Grid de imágenes */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.image-grid__item {
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #ff80ab;
  background-color: #fce4ec;
  transition: transform 0.2s ease;
}

.image-grid__item:hover,
.image-grid__item:focus {
  transform: scale(1.03);
  outline: none;
}

.image-grid__img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.message {
  font-size: 14px;
  color: #666;
}

.error {
  color: red;
}
</style>
