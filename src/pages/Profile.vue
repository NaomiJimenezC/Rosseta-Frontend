<script>
import { getCalling } from "@/Helpers/CallToAPI.js";
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
    };
  },
  async mounted() {
    const userId = this.$route.params.id;

    try {
      const userData = await getCalling(`/users/${userId}`, true);
      const postsData = await getCalling(`/users/${userId}/posts`,{'user_id':userId}, true);
      this.user = userData;
      this.posts = postsData;
    } catch (err) {
      console.error(err);
      this.error = 'No se pudo cargar el perfil.';
    } finally {
      this.loading = false;
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
</style>
