<!-- src/components/Header.vue -->
<template>
  <header class="app-sidebar">
    <div class="logo-container">
      <img alt="Rosseta Logo" class="rosseta-logo" />
      <span class="app-title">Rosseta</span>
    </div>

    <nav class="main-nav">
      <section @click="goToHome" class="nav-item">
        <home-icon :size="24" />
        <span>Inicio</span>
      </section>

      <section @click="goToSearch" class="nav-item">
        <magnify-icon :size="24" />
        <span>Buscar</span>
      </section>

      <section @click="goToProfile" class="nav-item">
        <account-circle-icon :size="24" />
        <span>Perfil</span>
      </section>

      <section @click="goToNotifications" class="nav-item">
        <bell-icon :size="24" />
        <span>Notificaciones</span>
        <span v-if="unreadNotifications > 0" class="badge">
          {{ unreadNotifications }}
        </span>
      </section>

      <section @click="goToSettings" class="nav-item">
        <cog-icon :size="24" />
        <span>Ajustes</span>
      </section>

      <section @click="goToMessages" class="nav-item">
        <message-text-icon :size="24" />
        <span>Mensajes</span>
        <span v-if="unreadChats > 0" class="badge">
          {{ unreadChats }}
        </span>
      </section>
    </nav>

    <button @click="publish" class="publish-button">
      Publicar
    </button>
  </header>
</template>

<script>
import HomeIcon from 'vue-material-design-icons/Home.vue';
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue';
import BellIcon from 'vue-material-design-icons/Bell.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';
import MessageTextIcon from 'vue-material-design-icons/MessageText.vue';
import { getCalling } from '@/Helpers/CallToAPI.js';

export default {
  name: 'Header',
  components: {
    HomeIcon,
    MagnifyIcon,
    AccountCircleIcon,
    BellIcon,
    CogIcon,
    MessageTextIcon,
  },
  data() {
    return {
      unreadNotifications: 0,
      unreadChats: 0,
      conversations: [],
    };
  },
  computed: {
    currentUserId() {
      return Number(localStorage.getItem('userId'));
    },
  },
  methods: {
    async loadInitialCounts() {
      try {
        const notiRes = await getCalling('/notifications/unread-count', true);
        this.unreadNotifications = notiRes.unread_notifications || 0;

        const convRes = await getCalling('/conversations', true);
        this.conversations = convRes.data || [];

        const chatsRes = await getCalling('/conversations/unread-count', true);
        this.unreadChats = chatsRes.unread_chats || 0;
      } catch (e) {
        console.error(e);
      }
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToSearch() {
      this.$router.push('/search');
    },
    goToProfile() {
      const u = this.currentUserId;
      if (u) this.$router.push(`/profile/${u}`);
    },
    goToNotifications() {
      this.$router.push('/notifications');
    },
    goToSettings() {
      this.$router.push({ name: 'settings' });
    },
    goToMessages() {
      this.$router.push('/chats');
    },
    publish() {
      this.$router.push('/publish');
    },
  },
  async mounted() {
    await this.loadInitialCounts();

    if (this.currentUserId && window.Echo) {
      window.Echo.private(`App.Models.User.${this.currentUserId}`)
        .notification(() => {
          this.unreadNotifications += 1;
        })
        .error(err => {
          console.error(err);
        });
    }

    if (window.Echo) {
      this.conversations.forEach(conv => {
        window.Echo.private(`chat.${conv.id}`)
          .listen('.message.direct', e => {
            if (e.from_id !== this.currentUserId) {
              this.unreadChats += 1;
            }
          })
          .error(err => {
            console.error(err);
          });
      });
    }
  },
  beforeUnmount() {
    if (window.Echo) {
      if (this.currentUserId) {
        window.Echo.private(`App.Models.User.${this.currentUserId}`).stopListening();
      }
      this.conversations.forEach(conv => {
        window.Echo.private(`chat.${conv.id}`).stopListening('.message.direct');
      });
    }
  },
};
</script>

<style scoped>
.app-sidebar {
  background-color: #fcf6ed;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
}

.rosseta-logo {
  height: 40px;
  margin-right: 10px;
}

.app-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #db446b;
}

.main-nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  margin-bottom: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
  width: calc(100% - 30px);
  position: relative;
}

.nav-item:hover {
  background-color: rgba(219, 68, 107, 0.1);
  color: #db446b;
}

.nav-item svg {
  margin-right: 15px;
  color: #333;
}

.nav-item:hover svg {
  color: #db446b;
}

.nav-item span {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
}

.nav-item:hover span {
  color: #db446b;
}

.badge {
  position: absolute;
  top: 8px;
  right: 15px;
  background-color: #db446b;
  color: #fff;
  border-radius: 50%;
  font-size: 0.75rem;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-button {
  background-color: #db446b;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  width: calc(100% - 40px);
  text-align: center;
  align-self: center;
  margin-top: auto;
}

.publish-button:hover {
  background-color: #c03d5c;
  transform: translateY(-2px);
}

.publish-button:active {
  transform: translateY(0);
}
</style>
