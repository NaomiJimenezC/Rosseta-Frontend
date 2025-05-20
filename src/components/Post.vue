<script>
import {deleteCalling, getCalling, postCalling} from "@/Helpers/CallToAPI.js";
import Heart from 'vue-material-design-icons/Heart.vue';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import defaultProfileImage from '@/assets/Default_pfp.jpg'

export default {
  name: "Post",
  components: {
    Heart,
    HeartOutline
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
    };
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
          await deleteCalling(`/posts/${this.postId}/dislike`,{'post_id':this.postId}, true);
          this.hasLiked = false;
        } else {
          await postCalling(`/posts/${this.postId}/like`,{'post_id':this.postId}, true);
          this.hasLiked = true;
        }
      } catch (err) {
        console.error('Error toggling like:', err);
      } finally {
        this.processingLike = false;
      }
    }
  }
};
</script>

<template>
  <article v-if="!loading && !error">
    <header>
      <img
        :src="userData.profile_picture_url || defaultProfileImage"
        :alt="`${userData.username} profile photo`"
      />
      <h4>{{ userData.username }}</h4>
    </header>

    <img :src="img" :alt="caption" />

    <span class="icon-wrapper" @click="toggleLike">
      <HeartOutline v-if="!hasLiked" class="icon-outline" />
      <Heart v-else class="icon-filled" />
    </span>

    <p>{{ description }}</p>
  </article>

  <div v-else-if="loading">
    <p>Loading user data...</p>
  </div>
  <div v-else>
    <p>Error: {{ error.message }}</p>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.icon-outline,
.icon-filled {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  transition: transform 0.2s;
}
.icon-wrapper:active .icon-outline,
.icon-wrapper:active .icon-filled {
  transform: scale(0.9);
}
</style>
