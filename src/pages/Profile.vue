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
            <span class="clickable" @click="openFollowers">
              {{ followers.data.length }} seguidores
            </span>
            <span class="clickable" @click="openFollowings">
              {{ followings.data.length }} seguidos
            </span>
            <span>{{ posts.length }} publicaciones</span>
          </nav>

          <button
            v-if="!isCurrentUserProfile"
            class="follow-button"
            :disabled="loading"
            @click="toggleFollow"
          >
            {{ isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
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

      <!-- Modales -->
      <FollowersListModal
        v-if="showFollowersModal"
        :followers="followers.data"
        :loggedInUserId="loggedInUserId"
        :profileUserId="profileId"
        @unfollow="handleRemoveFollower"
        @close="closeFollowers"
      />

      <FollowingListModal
        v-if="showFollowingsModal"
        :followings="followings.data"
        :loggedInUserId="loggedInUserId"
        :profileUserId="profileId"
        @unfollow="handleUnfollowUser"
        @close="closeFollowings"
      />
    </section>
  </main>
</template>

<script>
import { deleteCalling, getCalling, postCalling } from '@/Helpers/CallToAPI.js'
import defaultProfileImage from '@/assets/Default_pfp.jpg'
import FollowersListModal from '@/components/FollowersListModal.vue'
import FollowingListModal from '@/components/FollowingListModal.vue'

export default {
  name: 'Profile',
  components: {
    FollowersListModal,
    FollowingListModal
  },
  data() {
    return {
      user: { username: '', profile_picture_url: '' },
      posts: [],
      followers: { data: [] },
      followings: { data: [] },
      loading: true,
      error: null,
      defaultProfileImage,
      isCurrentUserProfile: false,
      isFollowing: false,
      showFollowersModal: false,
      showFollowingsModal: false
    }
  },
  computed: {
    loggedInUserId() {
      const id = localStorage.getItem('userId')
      return id ? Number(id) : null
    },
    profileId() {
      return Number(this.$route.params.id)
    }
  },
  watch: {
    '$route.params.id': 'fetchProfileData'
  },
  created() {
    this.fetchProfileData()
  },
  methods: {
    async fetchProfileData() {
      this.loading = true
      this.error = null
      try {
        const userRes = await getCalling(`/users/${this.profileId}`, true)
        this.user = userRes || {}

        const followersRes = await getCalling(`/users/${this.profileId}/followers`)
        this.followers = followersRes || { data: [] }

        const followingRes = await getCalling(`/users/${this.profileId}/following`)
        this.followings = followingRes || { data: [] }

        const postsRes = await getCalling(`/users/${this.profileId}/posts`, true)
        this.posts = postsRes.data || []

        this.isCurrentUserProfile = this.loggedInUserId === this.profileId
        if (this.loggedInUserId) {
          this.isFollowing = this.followers.data.some(f => f.id === this.loggedInUserId)
        }
      } catch (err) {
        console.error('Error al cargar el perfil:', err)
        this.error = 'No se pudo cargar el perfil.'
      } finally {
        this.loading = false
      }
    },
    goToPost(postId) {
      this.$router.push({ name: 'post', params: { id: postId } })
    },
    async toggleFollow() {
      try {
        if (this.isFollowing) {
          await deleteCalling(`/users/${this.profileId}/unfollow`, {}, true)
        } else {
          await postCalling(`/users/${this.profileId}/follow`, {}, true)
        }
        await this.fetchProfileData()
      } catch (err) {
        console.error(err)
      }
    },
    openFollowers() {
      this.showFollowersModal = true
    },
    closeFollowers() {
      this.showFollowersModal = false
    },
    openFollowings() {
      this.showFollowingsModal = true
    },
    closeFollowings() {
      this.showFollowingsModal = false
    },
    async handleRemoveFollower(followerId) {
      try {
        await deleteCalling(`/users/${followerId}/remove-follower`, {}, true)
        await this.fetchProfileData()
      } catch (err) {
        console.error(err)
      }
    },
    async handleUnfollowUser(userId) {
      try {
        await deleteCalling(`/users/${userId}/unfollow`, {}, true)
        await this.fetchProfileData()
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.profile-container { padding: 24px; max-width: 800px; margin: 0 auto; font-family: sans-serif; }
.clickable { cursor: pointer; text-decoration: underline; }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
.profile-picture { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
.username { font-size: 24px; font-weight: bold; margin: 0; }
.stats span { margin-right: 16px; }
.follow-button, .edit-profile-button { margin-top: 15px; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background-color 0.3s ease; }
.follow-button { background-color: #007bff; color: white; }
.follow-button:hover { background-color: #0056b3; }
.follow-button:disabled { background-color: #cccccc; cursor: not-allowed; }
.edit-profile-button { background-color: #6c757d; color: white; }
.edit-profile-button:hover { background-color: #5a6268; }
.publications-section { margin-top: 1.5rem; }
.section-title { font-size: 18px; font-weight: bold; margin-bottom: 16px; }
.image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; list-style: none; padding: 0; margin: 0; }
.image-grid__item { cursor: pointer; overflow: hidden; border-radius: 8px; border: 1px solid #ff80ab; background-color: #fce4ec; transition: transform 0.2s ease; }
.image-grid__item:hover, .image-grid__item:focus { transform: scale(1.03); outline: none; }
.image-grid__img { width: 100%; height: 180px; object-fit: cover; display: block; }
.message { font-size: 14px; color: #666; }
.error { color: red; }
</style>
