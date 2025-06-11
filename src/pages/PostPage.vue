<template>
  <main class="post-page__container">
    <section v-if="loadingPost" class="post-page__loading">Cargando publicación…</section>
    <section v-else-if="errorPost" class="post-page__error">{{ errorPost }}</section>

    <article v-else class="post-page__post">
      <header class="post-page__header">
        <p class="post-page__author">
          <router-link
            v-if="post.user"
            :to="`/profile/${post.user.id}`"
            class="post-page__author-info"
          >
            <img
              :src="post.user.profile_picture_url || defaultProfileImage"
              alt="Foto de perfil"
              class="post-page__author-avatar"
            />
            <strong class="post-page__author-name">{{ post.user.username }}</strong>
            <time class="post-page__date">{{ formatDate(post.created_at) }}</time>
          </router-link>
        </p>
      </header>

      <figure v-if="post.image_url" class="post-page__figure">
        <img
          :src="post.image_url"
          :alt="post.caption || 'Imagen del post'"
          class="post-page__image"
        />
      </figure>

      <p v-if="post.content" class="post-page__text">{{ post.content }}</p>
    </article>

    <section class="post-page__comments-section">
      <h2 class="post-page__comments-title">Comentarios</h2>
      <p v-if="loadingComments" class="post-page__loading">Cargando comentarios…</p>
      <p v-else-if="errorComments" class="post-page__error">{{ errorComments }}</p>

      <ul v-else class="post-page__comments-list">
        <li v-if="comments.length === 0" class="post-page__no-comments">
          No hay comentarios aún.
        </li>
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="post-page__comment-item"
        >
          <article>
            <header class="post-page__comment-header">
              <router-link
                v-if="comment.user"
                :to="`/profile/${comment.user.id}`"
                class="post-page__comment-username"
              >
                <strong>{{ comment.user.username }}</strong>
              </router-link>
              <span v-else class="post-page__comment-username"><strong>Anon</strong></span>
              <time class="post-page__comment-date">{{ formatDate(comment.created_at) }}</time>
              <button
                v-if="currentUserId === comment.user?.id || currentUserId === post.user?.id"
                class="post-page__delete-comment-btn"
                @click="deleteComment(comment)"
              >
                Eliminar
              </button>
            </header>
            <p class="post-page__comment-text">{{ comment.content }}</p>
          </article>
        </li>
      </ul>
    </section>

    <section v-if="!loadingPost && !errorPost" class="post-page__form-section">
      <h3 class="post-page__form-title">Añadir un comentario</h3>
      <form @submit.prevent="submitComment" class="post-page__form">
        <textarea
          v-model="newComment"
          placeholder="Escribe tu comentario…"
          rows="3"
          class="post-page__textarea"
        ></textarea>
        <button
          type="submit"
          class="post-page__submit-btn"
          :disabled="submittingComment || !newComment.trim()"
        >
          {{ submittingComment ? 'Enviando…' : 'Enviar' }}
        </button>
      </form>
      <p v-if="submitError" class="post-page__error">{{ submitError }}</p>
    </section>
  </main>
</template>

<script>
import defaultProfileImage from '@/assets/Default_pfp.jpg';
import { deleteCalling, getCalling, postCalling } from '@/Helpers/CallToAPI.js';
export default {
  name: 'PostPage',
  data() {
    return {
      post: null,
      comments: [],
      newComment: '',
      loadingPost: true,
      loadingComments: true,
      errorPost: null,
      errorComments: null,
      submittingComment: false,
      submitError: null,
      defaultProfileImage,
    };
  },
  computed: {
    postId() {
      return this.$route.params.id;
    },
    currentUserId() {
      return Number(localStorage.getItem('userId'));
    },
  },
  methods: {
    async fetchPost() {
      this.loadingPost = true;
      this.errorPost = null;
      try {
        const res = await getCalling(`/posts/${this.postId}`, true);
        this.post = res.data;
      } catch (e) {
        this.errorPost = 'No se pudo cargar el post.';
        console.error(e);
      } finally {
        this.loadingPost = false;
      }
    },
    async fetchComments() {
      this.loadingComments = true;
      this.errorComments = null;
      try {
        const res = await getCalling(`/comments?post_id=${this.postId}`, true);
        this.comments = res.data || res;
      } catch (e) {
        this.errorComments = 'No se pudieron cargar los comentarios.';
        console.error(e);
      } finally {
        this.loadingComments = false;
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      this.submittingComment = true;
      this.submitError = null;
      try {
        const payload = { post_id: this.postId, content: this.newComment.trim() };
        await postCalling('/comments', payload, true);
        await this.fetchComments();
        this.newComment = '';
      } catch (e) {
        this.submitError = 'Error al enviar el comentario.';
        console.error(e);
      } finally {
        this.submittingComment = false;
      }
    },
    async deleteComment(comment) {
      const isCommentOwner = comment.user?.id === this.currentUserId;
      const isPostOwner = this.post?.user?.id === this.currentUserId;
      if (!isCommentOwner && !isPostOwner) return;
      try {
        if (isCommentOwner) {
          await deleteCalling(`/comments/${comment.id}`, {}, true);
        } else {
          await deleteCalling('/comments/author-delete', { comment_id: comment.id }, true);
        }
        await this.fetchComments();
      } catch (e) {
        console.error('Error al eliminar comentario:', e);
        this.submitError = 'No se pudo eliminar el comentario.';
      }
    },
    formatDate(datetime) {
      const dt = new Date(datetime);
      return (
        dt.toLocaleDateString()
      );
    },
  },
  mounted() {
    this.fetchPost();
    this.fetchComments();
  },
};
</script>

<style lang="scss" scoped>
@use '@/SASS/pages/post';
@use  '@/SASS/components/forms';
</style>
