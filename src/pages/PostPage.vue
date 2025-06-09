<template>
  <main class="post-page">
    <section class="post-container">
      <p v-if="loadingPost" class="loading">Cargando publicación…</p>
      <p v-else-if="errorPost" class="error">{{ errorPost }}</p>
      <article v-else class="post">
        <header class="post-content">
          <p class="post-author">
            <router-link
              v-if="post.user"
              :to="`/profile/${post.user.id}`"
              class="username-link"
            >
              <strong>{{ post.user.username }}</strong>
            </router-link>
            <span v-else><strong>Usuario desconocido</strong></span>
            <time class="post-date">{{ formatDate(post.created_at) }}</time>
          </p>
        </header>
        <figure v-if="post.image_url">
          <img
            :src="post.image_url"
            :alt="post.caption || 'Imagen del post'"
            class="post-image"
          />
        </figure>
        <p v-if="post.content" class="post-text">{{ post.content }}</p>
      </article>
    </section>

    <section class="comments-section">
      <h2>Comentarios</h2>
      <p v-if="loadingComments" class="loading">Cargando comentarios…</p>
      <p v-else-if="errorComments" class="error">{{ errorComments }}</p>
      <ul v-else class="comments-list">
        <li v-if="comments.length === 0" class="no-comments">
          No hay comentarios aún.
        </li>
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <article>
            <header class="comment-header">
              <router-link
                v-if="comment.user"
                :to="`/profile/${comment.user.id}`"
              >
                <strong>{{ comment.user.username }}</strong>
              </router-link>
              <span v-else><strong>Anon</strong></span>
              <time class="comment-date">{{ formatDate(comment.created_at) }}</time>
              <button
                v-if="currentUserId === comment.user?.id || currentUserId === post.user?.id"
                class="btn-delete-comment"
                @click="deleteComment(comment)"
              >
                Eliminar
              </button>
            </header>
            <p class="comment-content">{{ comment.content }}</p>
          </article>
        </li>
      </ul>
    </section>

    <section v-if="!loadingPost && !errorPost" class="comment-form-section">
      <h3>Añadir un comentario</h3>
      <form @submit.prevent="submitComment" class="comment-form">
        <textarea
          v-model="newComment"
          placeholder="Escribe tu comentario…"
          rows="3"
          class="comment-input"
        ></textarea>
        <button
          type="submit"
          class="btn-submit"
          :disabled="submittingComment || !newComment.trim()"
        >
          {{ submittingComment ? 'Enviando…' : 'Enviar' }}
        </button>
      </form>
      <p v-if="submitError" class="error">{{ submitError }}</p>
    </section>
  </main>
</template>

<script>
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
        } else if (isPostOwner) {
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
        dt.toLocaleDateString() +
        ' ' +
        dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    },
  },
  mounted() {
    this.fetchPost();
    this.fetchComments();
  },
};
</script>

<style scoped>
.post-page { max-width: 700px; margin: 0 auto; padding: 1rem; font-family: Arial, sans-serif; }
.loading { text-align: center; color: #555; }
.error { text-align: center; color: red; }
.post-container { margin-bottom: 2rem; }
.post { border: 1px solid #ddd; border-radius: 4px; background: #fff; }
.post-image { width: 100%; display: block; }
.post-content { padding: 1rem; }
.post-author { margin: 0 0 0.5rem; color: #333; display: flex; align-items: center; gap: 8px; }
.post-date { font-size: 0.85rem; color: #777; margin-left: 8px; }
.post-text { margin: 0.5rem 0; color: #444; }
.comments-section { margin-bottom: 2rem; }
.comments-list { list-style: none; padding: 0; }
.no-comments { text-align: center; color: #666; }
.comment-item { border-bottom: 1px solid #eee; padding: 0.75rem 0; }
.comment-header { display: flex; align-items: center; gap: 8px; }
.comment-date { font-size: 0.75rem; color: #888; margin-left: auto; }
.comment-content { margin: 0; color: #444; }
.comment-form-section { border-top: 1px solid #ddd; padding-top: 1rem; }
.comment-form { display: flex; flex-direction: column; gap: 0.5rem; }
.comment-input { width: 100%; padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; resize: vertical; }
.btn-submit { align-self: flex-end; padding: 0.5rem 1rem; font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn-submit:disabled { background-color: #aaa; cursor: not-allowed; }
.btn-delete-comment { background: transparent; border: none; color: #e74c3c; cursor: pointer; font-size: 0.85rem; }
.btn-delete-comment:hover { text-decoration: underline; }
</style>
