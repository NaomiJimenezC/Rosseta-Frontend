<script>
import {getCalling, postCalling} from '@/Helpers/CallToAPI.js';

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
        this.notifications = await getCalling('/notifications');
        const countRes = await getCalling('/notifications/unread-count');
        this.unreadCount = countRes.unread_notifications;
      } catch (e) {
        this.error = 'No se pudieron cargar las notificaciones.';
      } finally {
        this.loading = false;
      }
    },
    async markAllRead() {
      try {
        await postCalling('/notifications/mark-read', {});
        await this.fetchNotifications();
      } catch (e) {}
    },
    formatTimestamp(ts) {
      const date = new Date(ts);
      return date.toLocaleString();
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
          <div class="notif-message">{{ notif.data.message }}</div>
          <small class="notif-time">
            {{ formatTimestamp(notif.created_at) }}
          </small>
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
}

.notification-item.unread {
  background-color: #f9f9f9;
}

.notif-message {
  margin: 0;
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
