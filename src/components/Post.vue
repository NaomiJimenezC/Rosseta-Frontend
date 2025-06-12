<script>
import { deleteCalling, getCalling, postCalling } from "@/Helpers/CallToAPI.js";
import Heart from 'vue-material-design-icons/Heart.vue';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import defaultProfileImage from '@/assets/Default_pfp.jpg';

export default {
  name: "Post",
  components: {
    ConfirmModal,
    Heart,
    HeartOutline,
    MessageOutline
  },
  props: {
    postId: Number,
    userId: Number,
    img: String,
    description: String,
    caption: String,
  },
  data() {
    return {
      hasLiked: false,
      userData: null,
      loading: true,
      error: null,
      defaultProfileImage,
      processingLike: false,
      showConfirmModal: false,
    };
  },
  computed: {
    loggedInUserId() {
      return localStorage.getItem("userId")
        ? parseInt(localStorage.getItem("userId"))
        : null;
    },
    isOwner() {
      return this.loggedInUserId === this.userId;
    }
  },
  async mounted() {
    try {
      this.userData = await getCalling(`/users/${this.userId}`, true);
      const res = await getCalling(`/posts/${this.postId}/liked`, true);
      this.hasLiked = !!res.hasLiked;
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.error = error;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async toggleLike() {
      if (this.processingLike) return;
      this.processingLike = true;
      try {
        if (this.hasLiked) {
          await deleteCalling(`/posts/${this.postId}/dislike`, { post_id: this.postId }, true);
          this.hasLiked = false;
        } else {
          await postCalling(`/posts/${this.postId}/like`, { post_id: this.postId }, true);
          this.hasLiked = true;
        }
      } catch (err) {
        console.error('Error toggling like:', err);
      } finally {
        this.processingLike = false;
      }
    },
    handleCommentClick() {
      this.$router.push({ name: 'post', params: { id: this.postId } });
    },
    deletePost() {
      this.showConfirmModal = true;
    },
    async confirmDelete() {
      try {
        await deleteCalling(`/posts/${this.postId}`, {post_id:this.postId}, true);
        this.showConfirmModal = false;
        window.location.reload();
      } catch (err) {
        console.error("Error deleting post:", err);
        this.showConfirmModal = false;
      }
    }

  }
};
</script>

<template>
  <!-- Post Content -->
  <article v-if="!loading && !error" class="post-card">
    <header class="post-card__header">
      <router-link :to="{ name: 'profile', params: { id: userId } }" class="post-card__profile-link">
        <img
          :src="userData.profile_picture_url || defaultProfileImage"
          :alt="`${userData.username} profile photo`"
          class="post-card__profile-picture"
        />
      </router-link>

      <router-link :to="{ name: 'profile', params: { id: userId } }" class="post-card__username-link">
        <h4 class="post-card__username">{{ userData.username }}</h4>
      </router-link>

      <button
        v-if="isOwner"
        @click="deletePost"
        class="post-card__delete-button"
        title="Eliminar publicación"
      >
        ×
      </button>
    </header>

    <div class="post-card__image-container">
      <img :src="img" :alt="caption" class="post-card__image" />
    </div>

    <div class="post-card__interactions">
      <span class="post-card__action-button post-card__like-button" @click="toggleLike">
        <HeartOutline v-if="!hasLiked" class="post-card__icon post-card__icon--outline" />
        <Heart v-else class="post-card__icon post-card__icon--filled" />
      </span>
      <span class="post-card__action-button post-card__comment-button" @click="handleCommentClick">
        <MessageOutline class="post-card__icon post-card__icon--outline" />
      </span>
    </div>

    <p v-if="description" class="post-card__description">{{ description }}</p>
  </article>

  <div v-else-if="loading" class="post-card post-card--loading">
    <p class="post-card__status-message">Loading post data...</p>
  </div>
  <div v-else class="post-card post-card--error">
    <p class="post-card__status-message">Error: {{ error.message }}</p>
  </div>

  <ConfirmModal
    v-if="showConfirmModal"
    message="¿Estás seguro de que quieres eliminar esta publicación?"
    @confirm="confirmDelete"
    @cancel="showConfirmModal = false"
  />
</template>

<style lang="sass" scoped>
@use "@/SASS/components/post"
</style>
