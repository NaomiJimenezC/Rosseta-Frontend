<template>
  <main class="profile__container">
    <section v-if="loading" class="profile__message">Cargando perfil...</section>
    <section v-else-if="error" class="profile__message profile__error">Error: {{ error }}</section>

    <section v-else>
      <header class="profile__header">
        <img
          :src="user.profile_picture_url || defaultProfileImage"
          alt="Foto de perfil"
          class="profile__picture profile__picture--clickable"
        />
        <div>
          <h1 class="profile__username">{{ user.username }}</h1>
          <nav class="profile__stats">
            <span class="clickable" @click="openFollowers">
              {{ followers.data.length }} seguidores
            </span>
            <span class="clickable" @click="openFollowings">
              {{ followings.data.length }} seguidos
            </span>
            <span class="">{{ posts.length }} publicaciones</span>
          </nav>

          <button
            v-if="!isCurrentUserProfile"
            class="profile__follow-button"
            :disabled="loading"
            @click="toggleFollow"
          >
            {{ isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
          </button>
          <button v-else class="profile__edit-button">Editar Perfil</button>
        </div>
      </header>

      <section class="profile__publications">
        <h2 class="profile__section-title">Publicaciones</h2>
        <p v-if="!posts.length" class="profile__message">Este usuario no tiene publicaciones.</p>
        <ul v-else class="profile__grid" aria-label="Publicaciones del usuario">
          <li
            v-for="post in posts"
            :key="post.id"
            class="profile__grid-item"
            @click="goToPost(post.id)"
            role="button"
            tabindex="0"
            @keyup.enter="goToPost(post.id)"
          >
            <img
              :src="post.image_url"
              :alt="post.caption || 'Imagen de publicación'"
              class="profile__grid-img"
            />
          </li>
        </ul>
      </section>

      <FollowersListModal
        v-model:visible="showFollowersModal"
        :followers="followers.data"
        :loggedInUserId="loggedInUserId"
        :profileUserId="profileId"
        @unfollow="handleRemoveFollower"
        @close="closeFollowers"
      />

      <FollowingListModal
        v-model:visible="showFollowingsModal"
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

<style lang="sass" scoped>
@use "@/SASS/pages/profile"
</style>
