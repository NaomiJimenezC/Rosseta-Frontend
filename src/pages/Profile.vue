<script>
import {deleteCalling, getCalling, postCalling} from "@/Helpers/CallToAPI.js";
import defaultProfileImage from "@/assets/Default_pfp.jpg";
import Post from "@/components/Post.vue";

export default {
  name: "Profile",
  components: {
    Post
  },
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
      return localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null;
    }
  },
  async created() {
    await this.fetchProfileData();
  },
  watch: {
    '$route.params.id': {
      handler: 'fetchProfileData',
      immediate: false
    }
  },
  methods: {
    async fetchProfileData() {
      this.loading = true;
      this.error = null;
      const profileId = this.$route.params.id;

      this.isCurrentUserProfile = (this.loggedInUserId && this.loggedInUserId === parseInt(profileId));

      try {
        const userData = await getCalling(`/users/${profileId}`, true);
        const postsData = await getCalling(`/users/${profileId}/posts`, {'user_id': profileId}, true);
        this.user = userData;
        this.posts = postsData;

        if (!this.isCurrentUserProfile && this.loggedInUserId) {
          await this.checkFollowStatus(profileId);
        }

      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        this.error = 'No se pudo cargar el perfil.';
      } finally {
        this.loading = false;
      }
    },

    async checkFollowStatus(profileId) {
      try {
        const response = await getCalling(`/users/${profileId}/is-following`, true);
        this.isFollowing = response.isFollowing;
      } catch (err) {
        console.error("Error al verificar el estado de seguimiento:", err);
        this.isFollowing = false;
      }
    },

    async toggleFollow() {
      if (!this.loggedInUserId) {
        alert("Debes iniciar sesión para seguir/dejar de seguir a usuarios.");
        return;
      }
      this.loading = true;
      try {
        let response;
        if (this.isFollowing) {
          response = await deleteCalling(`/users/${this.user.id}/unfollow`, {}, true);
        } else {
          response = await postCalling(`/users/${this.user.id}/follow`, {}, true);
        }
        if (response.status === 201 || response.status === 200) {
          await this.checkFollowStatus(this.user.id);
        } else {
          console.warn("La operación de seguir/dejar de seguir no fue exitosa:", response);
          alert("La acción no pudo completarse.");
        }
      } catch (err) {
        console.error("Error al seguir/dejar de seguir:", err);
        alert("Ocurrió un error al realizar la acción. Intenta de nuevo.");
      } finally {
        this.loading = false;
      }
    }
  },
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
          <div class="stats">
            <span>{{ user.followers_count }} seguidores</span>
            <span>{{ user.following_count }} seguidos</span>
            <span>{{ posts.length }} publicaciones</span>
          </div>

          <button
            v-if="!isCurrentUserProfile"
            @click="toggleFollow"
            :class="['follow-button', { 'unfollow': isFollowing }]"
            :disabled="loading"
          >
            {{ isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
          </button>
          <button v-else class="edit-profile-button">Editar Perfil</button>
        </div>
      </header>

      <section>
        <h2 class="section-title">Publicaciones</h2>
        <div v-if="posts.length">
          <Post
            v-for="post in posts"
            :key="post.id"
            :postId="post.id"
            :userId="post.users_id"
            :img="post.image_url"
            :description="post.content"
            :caption="post.caption"
          />
        </div>
        <p v-else class="message">Este usuario no tiene publicaciones.</p>
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

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.message {
  font-size: 14px;
  color: #666;
}

.error {
  color: red;
}

.follow-button, .edit-profile-button {
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

.follow-button.unfollow {
  background-color: #dc3545;
}

.follow-button.unfollow:hover {
  background-color: #c82333;
}

.edit-profile-button {
  background-color: #6c757d;
  color: white;
}

.edit-profile-button:hover {
  background-color: #5a6268;
}
</style>
