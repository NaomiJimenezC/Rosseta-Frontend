<script>
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js';
import defaultImage from '@/assets/Default_pfp.jpg';

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

        const processed = [];
        for (const notif of notifs) {
          let thumb = null;
          let skip = false;

          try {
            const type = notif.data.type;
            if (type === 'follow') {
              const user = await getCalling(`/users/${notif.data.follower_id}`);
              thumb = user.profile_picture_url || defaultImage;
            } else if (type === 'post_liked') {
              const post = await getCalling(`/posts/${notif.data.post_id}`);
              thumb = post.data.image_url;
            } else if (type === 'mention') {
              const user = await getCalling(`/users/${notif.data.mentioner_id}`);
              thumb = user.profile_picture;
            }
          } catch (inner) {
            const status = inner?.response?.status || inner?.status;
            if ([404, 405].includes(status)) {
              skip = true;
            } else {
              console.warn(inner);
            }
          }

          if (!skip) {
            notif.thumbnail = thumb;
            processed.push(notif);
          }
        }

        this.notifications = processed;
      } catch {
        this.error = 'No se pudieron cargar las notificaciones.';
      } finally {
        this.loading = false;
      }
    }
    ,
    async markAllRead() {
      try {
        await postCalling('/notifications/mark-read', {});
        this.fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    formatTimestamp(ts) {
      return new Date(ts).toLocaleString();
    },
    goToProfile(id) {
      this.$router.push(`/profile/${id}`);
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    }
  },
  mounted() {
    this.fetchNotifications();
  }
};
</script>

<template>
  <section class="notification-page">
    <header class="notification-page__header">
      <h1 class="notification-page__title">Notificaciones</h1>
      <div class="notification-page__meta">
        <span v-if="unreadCount" class="notification-page__badge">
          {{ unreadCount }} sin leer
        </span>
        <button
          v-if="unreadCount"
          @click="markAllRead"
          class="notification-page__mark-read"
        >
          Marcar todas leídas
        </button>
      </div>
    </header>

    <main class="notification-page__list-container">
      <p v-if="loading" class="notification-page__status">Cargando notificaciones…</p>
      <p v-else-if="error" class="notification-page__status notification-page__status--error">{{ error }}</p>
      <ul v-else class="notification-page__list">
        <li
          v-for="notif in notifications"
          :key="notif.id"
          :class="['notification-page__item', { 'notification-page__item--unread': !notif.read_at }]"
        >
          <div class="notification-page__item-content">
            <img
              v-if="notif.thumbnail"
              :src="notif.thumbnail"
              alt="miniatura"
              class="notification-page__thumbnail"
            />
            <div class="notification-page__text">
              <template v-if="notif.data.type === 'follow'">
                <span
                  class="notification-page__user"
                  @click="goToProfile(notif.data.follower_id)"
                >
                  {{ notif.data.follower_name }}
                </span>
                te ha empezado a seguir.
              </template>
              <template v-else-if="notif.data.type === 'post_liked'">
                <span
                  class="notification-page__user"
                  @click="goToProfile(notif.data.liker_id)"
                >
                  {{ notif.data.liker_name }}
                </span>
                le ha dado me gusta a tu
                <span
                  class="notification-page__post-link"
                  @click="goToPost(notif.data.post_id)"
                >
                  publicación
                </span>
              </template>
              <template v-else-if="notif.data.type === 'mention'">
                <span
                  class="notification-page__user"
                  @click="goToProfile(notif.data.mentioner_id)"
                >
                  {{ notif.data.mentioner_name }}
                </span>
                te ha mencionado en una publicación.
              </template>
              <small class="notification-page__time">
                {{ formatTimestamp(notif.created_at) }}
              </small>
            </div>
          </div>
        </li>
        <li v-if="!loading && !notifications.length" class="notification-page__empty">
          No hay notificaciones.
        </li>
      </ul>
    </main>
  </section>
</template>

<style lang="scss" scoped>
@use "@/SASS/pages/notifications";
</style>
