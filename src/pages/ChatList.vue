<template>
  <section class="chat-list">
    <header class="chat-list__header">
      <form @submit.prevent class="chat-search" role="search">
        <label for="chat-search-input" class="visually-hidden">Buscar conversaciones o usuarios</label>
        <input
          id="chat-search-input"
          type="search"
          v-model="searchTerm"
          placeholder="Buscar conversaciones o usuarios..."
          class="chat-search__input"
        />
      </form>
      <button
        @click="showUserSearch = true"
        class="chat-list__new-chat-btn"
        aria-label="Iniciar nuevo chat"
      >
        + Nuevo chat
      </button>
    </header>

    <nav aria-label="Lista de conversaciones">
      <ul class="conversations">
        <conversation-item
          v-for="conv in filteredConversations"
          :key="conv.id"
          :conversation="conv"
          :current-user-id="currentUserId"
          @select="selectConversation"
        />
      </ul>
    </nav>

    <user-search-modal
      :visible="showUserSearch"
      :users="userResults"
      @search="searchUsers"
      @select-user="startChat"
      @close="showUserSearch = false"
    />
  </section>
</template>

<script>
import ConversationItem from '@/components/ConversationItem.vue';
import UserSearchModal from '@/components/UserSearchModal.vue';
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js';

export default {
  name: 'ChatList',
  components: {
    ConversationItem,
    UserSearchModal
  },
  data() {
    return {
      conversations: [],
      searchTerm: '',
      showUserSearch: false,
      userSearchTerm: '',
      userResults: []
    };
  },
  computed: {
    currentUserId() {
      return this.$route.meta.userId;
    },
    filteredConversations() {
      const term = this.searchTerm.toLowerCase();
      return this.conversations.filter(conv =>
        this.getConversationTitle(conv)
          .toLowerCase()
          .includes(term)
      );
    }
  },
  methods: {
    async fetchConversations() {
      try {
        const data = await getCalling('/conversations');
        this.conversations = data.data;
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    },
    getConversationTitle(conv) {
      return conv.users
        .filter(u => u.id !== this.currentUserId)
        .map(u => u.name)
        .join(', ');
    },
    selectConversation(conv) {
      this.$emit('select-conversation', conv.id);
    },
    async searchUsers(term) {
      if (term.length < 2) {
        this.userResults = [];
        return;
      }
      try {
        const data = await getCalling(
          `/search?query=${encodeURIComponent(term)}`
        );
        this.userResults = data.users;
      } catch (error) {
        console.error('Error searching users:', error);
      }
    },
    async startChat(userId) {
      try {
        const data = await postCalling(`/conversations/${userId}`, {});
        const newConv = data.data;
        this.conversations.unshift(newConv);
        this.showUserSearch = false;
        this.$emit('select-conversation', newConv.id);
      } catch (error) {
        console.error('Error starting chat:', error);
      }
    }
  },
  watch: {
    userSearchTerm(term) {
      this.searchUsers(term);
    }
  },
  mounted() {
    this.fetchConversations();
  }
};
</script>

<style scoped>
.chat-list { padding: 1rem; }
.chat-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.chat-search__input,
.user-search__input {
  width: 100%;
  padding: 0.5rem;
}
.chat-list__new-chat-btn {
  padding: 0.5rem 1rem;
}
.conversations {
  list-style: none;
  padding: 0;
  margin: 0;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}
</style>
