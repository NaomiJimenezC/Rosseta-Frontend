<template>
  <section class="chat-view">
    <header class="chat-header">
      <button @click="$router.back()">← Volver</button>
      <h2 v-if="otherUser">{{ otherUser.username }}</h2>
    </header>

    <main class="chat-messages">
      <p v-if="loading">Cargando mensajes…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <ul v-else>
        <li
          v-for="msg in messages"
          :key="msg.id"
          :class="{ mine: msg.sender_id === currentUserId }"
          class="chat-message"
        >
          <span class="message-content">{{ msg.content }}</span>
          <small class="message-time">
            {{ new Date(msg.created_at).toLocaleTimeString() }}
          </small>
        </li>
      </ul>
    </main>

    <form class="chat-form" @submit.prevent="sendMessage">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Escribe un mensaje…"
        autocomplete="off"
      />
      <button type="submit" :disabled="!newMessage.trim()">Enviar</button>
    </form>
  </section>
</template>

<script>
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default {
  name: 'Chat',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      conversation: null,
      messages: [],
      newMessage: '',
      loading: true,
      error: null,
      echoChannel: null
    };
  },
  computed: {
    currentUserId() {
      return Number(window.localStorage.getItem('userId'));
    },
    otherUser() {
      if (!this.conversation) return null;
      return this.conversation.users.find(u => u.id !== this.currentUserId);
    }
  },
  methods: {
    async fetchConversation() {
      try {
        this.loading = true;

        const convRes = await getCalling(`/conversations/${this.id}`);
        this.conversation = convRes.data;

        const msgRes = await getCalling(`/conversations/${this.id}/messages`);
        this.messages = msgRes.data.data || msgRes.data;
      } catch (e) {
        this.error = 'No se pudieron cargar los mensajes.';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const { data } = await postCalling(
          `/conversations/${this.id}/messages`,
          { content: this.newMessage }
        );
        this.messages.push(data);
        this.newMessage = '';
      } catch (e) {
        console.error('Error enviando mensaje:', e);
      }
    },

    handleIncoming(message) {
      this.messages.push(message);
    },

    /**
     * Inicializa Laravel Echo + Pusher si no está inicializado aún,
     * y devuelve la instancia global de Echo.
     */
    ensureEcho() {
      if (typeof window.Echo === 'undefined') {
        window.Pusher = Pusher;
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: import.meta.env.VITE_PUSHER_APP_KEY,
          cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
          wsHost: import.meta.env.VITE_PUSHER_HOST || undefined,
          wsPort: import.meta.env.VITE_PUSHER_PORT || 443,
          wssPort: import.meta.env.VITE_PUSHER_PORT || 443,
          forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
          enabledTransports: ['ws', 'wss'],

          // Autenticación para canales privados
          authEndpoint:
            import.meta.env.VITE_BACKEND_URL + '/broadcasting/auth',
          auth: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        });
      }
      return window.Echo;
    }
  },
  mounted() {
    // 1) Cargar la conversación y mensajes históricos
    this.fetchConversation();

    // 2) Inicializar Echo/Pusher y suscribirse al canal privado
    const echo = this.ensureEcho();
    // Suscribirse a "private-chat.{id}"
    this.echoChannel = echo.private(`chat.${this.id}`);

    this.echoChannel
      .listen('.message.direct', e => {
        // El payload e debe coincidir con lo que emite DirectMessageSent::broadcastWith()
        this.handleIncoming({
          id: Date.now(),        // o usa e.id si viene
          sender_id: e.from_id,  // desde el evento
          content: e.content,
          created_at: e.created_at
        });
      })
      .error(err => {
        console.error('Error suscripción canal chat:', err);
      });
  },
  beforeUnmount() {
    // Desuscribirse al destruir componente
    if (this.echoChannel) {
      this.echoChannel.stopListening('.message.direct');
    }
  }
};
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}
.chat-header h2 {
  margin: 0 auto;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.chat-messages ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.chat-message {
  margin-bottom: 0.75rem;
  max-width: 70%;
  word-wrap: break-word;
  padding: 0.5rem;
  border-radius: 8px;
}
.chat-message.mine {
  margin-left: auto;
  background: #dcf8c6;
}
.chat-message:not(.mine) {
  background: #f1f0f0;
}
.message-time {
  display: block;
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.25rem;
}

.chat-form {
  display: flex;
  padding: 0.5rem;
  border-top: 1px solid #ddd;
}
.chat-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chat-form button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
}

.error {
  color: red;
}
</style>
