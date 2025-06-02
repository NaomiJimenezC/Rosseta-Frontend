<script>
import {deleteCalling, getCalling, postCalling} from "@/Helpers/CallToAPI.js";
import Heart from 'vue-material-design-icons/Heart.vue';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue';
import defaultProfileImage from '@/assets/Default_pfp.jpg'

export default {
  name: "Post",
  components: {
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
          await deleteCalling(`/posts/${this.postId}/dislike`, {'post_id':this.postId}, true);
          this.hasLiked = false;
        } else {
          await postCalling(`/posts/${this.postId}/like`, {'post_id':this.postId}, true);
          this.hasLiked = true;
        }
      } catch (err) {
        console.error('Error toggling like:', err);
      } finally {
        this.loading = false;
      }
    },
    handleCommentClick() {
      this.$router.push({ name: 'post', params: { id: this.postId } });
    }
  }
};
</script>

<template>
  <article v-if="!loading && !error" class="post-card">
    <header class="post-header">
      <router-link :to="{ name: 'profile', params: { id: userId } }" class="profile-link">
        <img
          :src="userData.profile_picture_url || defaultProfileImage"
          :alt="`${userData.username} profile photo`"
          class="profile-picture"
        />
      </router-link>

      <router-link :to="{ name: 'profile', params: { id: userId } }" class="profile-link username-link">
        <h4 class="username">{{ userData.username }}</h4>
      </router-link>
    </header>

    <div class="post-image-container">
      <img :src="img" :alt="caption" class="post-image" />
    </div>

    <div class="post-interactions">
      <span class="action-button like-button" @click="toggleLike">
        <HeartOutline v-if="!hasLiked" class="icon-outline" />
        <Heart v-else class="icon-filled" />
      </span>
      <span class="action-button comment-button" @click="handleCommentClick">
        <MessageOutline class="icon-outline" />
      </span>
    </div>

    <p v-if="description" class="post-description">{{ description }}</p>
  </article>

  <div v-else-if="loading" class="loading-message">
    <p>Loading post data...</p>
  </div>
  <div v-else class="error-message">
    <p>Error: {{ error.message }}</p>
  </div>
</template>

<style scoped>
.post-card {
  background-color: #fce4ec;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #ff80ab;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.profile-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.username-link {
  margin-left: 10px;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff80ab;
}

.username {
  font-weight: bold;
  font-size: 1.1em;
  color: #333;
  margin: 0;
}

.post-image-container {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid #d8bfd8;
}

.post-image {
  width: 100%;
  height: auto;
  display: block;
}

.post-interactions {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: rgba(255, 192, 203, 0.5);
}

.action-button:active {
  transform: scale(0.9);
}

.like-button {
  margin-right: 8px;
}

.icon-outline,
.icon-filled {
  width: 24px;
  height: 24px;
  color: #ff4081;
}

.icon-filled {
  color: #e91e63;
}

.post-description {
  font-size: 0.95em;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

.loading-message, .error-message {
  text-align: center;
  padding: 20px;
  color: #777;
}

.error-message {
  color: #d32f2f;
}
</style>
