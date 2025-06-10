<template>
  <section class="chat">
    <header class="chat__header">
      <button @click="$router.back()">← Volver</button>
      <h2 v-if="otherUser">{{ otherUser.username }}</h2>
    </header>

    <main class="chat__messages" ref="messagesContainer"> <p v-if="loading">Cargando mensajes…</p>
      <p v-else-if="error" class="chat__messages__error">{{ error }}</p>

      <ul v-else>
        <li
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'chat__messages__item',
            msg.sender_id === currentUserId
              ? 'chat__messages__item__mine'
              : 'chat__messages__item__other'
          ]"
        >
          <span class="chat__messages__text">{{ msg.content }}</span>
          <small class="chat__messages__message-time">
            {{ new Date(msg.created_at).toLocaleTimeString() }}
          </small>
        </li>
      </ul>
    </main>

    <form class="chat__form" @submit.prevent="sendMessage">
      <input
        class="form__input"
        v-model="newMessage"
        type="text"
        placeholder="Escribe un mensaje…"
        autocomplete="off"
      />
      <button
        class="chat__form__button"
        type="submit"
        :disabled="!newMessage.trim()"
      >
        Enviar
      </button>
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
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
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
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
     * Scrolls the chat messages container to the bottom.
     */
    scrollToBottom() {
      const messagesContainer = this.$refs.messagesContainer;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
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
          cluster: 'eu',
          forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
          enabledTransports: ['ws', 'wss'],

          authEndpoint: import.meta.env.VITE_BACKEND_URL + '/broadcasting/auth',
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
    this.fetchConversation();

    const echo = this.ensureEcho();
    this.echoChannel = echo.private(`chat.${this.id}`);

    this.echoChannel
      .listen('.message.direct', e => {
        this.handleIncoming({
          id: e.id || Date.now(),
          sender_id: e.from_id,
          content: e.content,
          created_at: e.created_at
        });
      })
      .error(err => {
        console.error('Error suscripción canal chat:', err);
      });
  },
  beforeUnmount() {
    if (this.echoChannel) {
      this.echoChannel.stopListening('.message.direct');
    }
  }
};
</script>

<style lang="sass" scoped>
@use "@/SASS/components/forms"
@use '@/SASS/pages/chat'
</style>
