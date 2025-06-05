<script>
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js';
import defaultImage from '@/assets/Default_pfp.jpg'

export default {
  name: 'NotificationPage',
  data() {
    return {
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchNotifications() {
      this.loading = true;
      this.error = null;

      try {
        const notifs = await getCalling('/notifications');
        const countRes = await getCalling('/notifications/unread-count');
        this.unreadCount = countRes.unread_notifications;

        const processedNotifs = [];

        for (const notif of notifs) {
          const type = notif.data.type;

          try {
            if (type === 'follow') {
              const followerId = notif.data.follower_id;
              if (followerId) {
                const user = await getCalling(`/users/${followerId}`);
                console.log(user);
                notif.thumbnail = user.profile_picture_url || defaultImage ;
              }
            } else if (type === 'post_liked') {
              const postId = notif.data.post_id;
              if (postId) {
                const post = await getCalling(`/posts/${postId}`);
                console.log(post);
                notif.thumbnail = post.data.image_url;
              }
            } else if (type === 'mention') {
              const mentionerId = notif.data.mentioner_id;
              if (mentionerId) {
                const user = await getCalling(`/users/${mentionerId}`);
                notif.thumbnail = user.profile_picture;
              }
            } else {
              notif.thumbnail = null;
            }
            processedNotifs.push(notif);
          } catch (innerError) {
            const status = innerError?.response?.status || innerError?.status;
            if (status !== 404 && status !== 405) {
              console.warn('Error inesperado al procesar notificación:', innerError);
            }
          }
        }

        this.notifications = processedNotifs;
      } catch (e) {
        console.error(e);
        this.error = 'No se pudieron cargar las notificaciones.';
      } finally {
        this.loading = false;
      }
    },
    async markAllRead() {
      try {
        await postCalling('/notifications/mark-read', {});
        await this.fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    formatTimestamp(ts) {
      const date = new Date(ts);
      return date.toLocaleString();
    },
    goToProfile(id) {
      this.$router.push(`/profile/${id}`);
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    },
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>

<template>
  <section class="notification-page">
    <header class="notification-header">
      <h1>Notificaciones</h1>
      <div class="notification-meta">
        <span v-if="unreadCount > 0" class="badge">
          {{ unreadCount }} sin leer
        </span>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="mark-read-btn"
        >
          Marcar todas leídas
        </button>
      </div>
    </header>

    <main class="notification-list">
      <p v-if="loading">Cargando notificaciones…</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <ul v-else>
        <li
          v-for="notif in notifications"
          :key="notif.id"
          :class="{ unread: !notif.read_at }"
          class="notification-item"
        >
          <div class="notif-content">
            <!-- Mostrar miniatura si está disponible -->
            <img
              v-if="notif.thumbnail"
              :src="notif.thumbnail"
              alt="miniatura"
              class="thumbnail"
            />

            <div class="notif-text">
              <template v-if="notif.data.type === 'follow'">
                <span class="notif-user" @click="goToProfile(notif.data.follower_id)">
                  {{ notif.data.follower_name }}
                </span>
                te ha empezado a seguir.
              </template>

              <template v-else-if="notif.data.type === 'post_liked'">
                <span class="notif-user" @click="goToProfile(notif.data.liker_id)">
                  {{ notif.data.liker_name }}
                </span>
                le ha dado me gusta a tu publicación:
                <span class="post-link" @click="goToPost(notif.data.post_id)">
                  "{{ notif.data.post_excerpt }}"
                </span>
              </template>

              <template v-else-if="notif.data.type === 'mention'">
                <span class="notif-user" @click="goToProfile(notif.data.mentioner_id)">
                  {{ notif.data.mentioner_name }}
                </span>
                te ha mencionado en una publicación.
              </template>

              <small class="notif-time">
                {{ formatTimestamp(notif.created_at) }}
              </small>
            </div>
          </div>
        </li>

        <li v-if="!loading && notifications.length === 0">
          No hay notificaciones.
        </li>
      </ul>
    </main>
  </section>
</template>

<style scoped>
.notification-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notification-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.badge {
  background-color: #e3342f;
  color: #fff;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

.mark-read-btn {
  background: none;
  border: 1px solid #6c757d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.mark-read-btn:hover {
  background-color: #f0f0f0;
}

.notification-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: flex-start;
}

.notification-item.unread {
  background-color: #f9f9f9;
}

.notif-content {
  display: flex;
  align-items: center;
}

.thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 0.75rem;
  border: 1px solid #ccc;
}

.notif-text {
  flex: 1;
}

.notif-user {
  color: #db446b;
  cursor: pointer;
  font-weight: 600;
}

.notif-user:hover {
  text-decoration: underline;
}

.post-link {
  color: #0056b3;
  cursor: pointer;
  font-style: italic;
}

.post-link:hover {
  text-decoration: underline;
}

.notif-time {
  display: block;
  font-size: 0.75rem;
  color: #555;
  margin-top: 0.25rem;
}

.error {
  color: #e3342f;
}
</style>
