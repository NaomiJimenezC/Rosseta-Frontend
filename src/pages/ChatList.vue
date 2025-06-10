<script>
import ConversationItem from '@/components/ConversationItem.vue';
import UserSearchModal  from '@/components/UserSearchModal.vue';
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js';

export default {
  name: 'ChatList',
  components: { ConversationItem, UserSearchModal },
  data() {
    return {
      conversations:  [],
      searchTerm:     '',
      showUserSearch: false,
      followees:      []
    };
  },
  computed: {
    currentUserId() {
      return Number(localStorage.getItem('userId'));
    },
    filteredConversations() {
      const term = this.searchTerm.toLowerCase();
      return this.conversations.filter(conv =>
        this.getConversationTitle(conv).toLowerCase().includes(term)
      );
    }
  },
  methods: {
    async fetchConversations() {
      try {
        const { data } = await getCalling('/conversations');
        this.conversations = data;
      } catch (e) {
        console.error('Error fetching conversations:', e);
      }
    },

    async fetchFollowees() {
      try {
        const res = await getCalling(`/users/${this.currentUserId}/following`);
        this.followees = res.data || [];
      } catch (e) {
        console.error('Error fetching followees:', e);
        this.followees = [];
      }
    },

    async openUserSearch() {
      if (this.followees.length === 0) {
        await this.fetchFollowees();
      }
      this.showUserSearch = true;
    },

    getConversationTitle(conv) {
      const other = conv.users.find(u => u.id !== this.currentUserId);
      return other ? other.username : '(sin título)';
    },

    selectConversation(conv) {
      this.$router.push({ name: 'chat-view', params: { id: conv.id } });
    },

    async startChat(userId) {
      try {
        const {data} = await postCalling(`/conversations/${userId}`, {});
        console.log(data.data.id);
        this.showUserSearch = false;
        this.$router.push({ name: 'chat-view', params: { id: data.data.id} });

      } catch (e) {
        console.error('Error starting chat:', e);
      }
    }
  },
  mounted() {
    this.fetchConversations();
    this.fetchFollowees();
  }
};
</script>

<template>
  <section class="chat-list">
    <header class="chat-list__header">
      <input
        v-model="searchTerm"
        placeholder="Buscar conversaciones..."
        class="chat-search__input"
      />
      <button
        @click="openUserSearch"
        class="chat-list__new-chat-btn"
      >
        + Nuevo chat
      </button>
    </header>

    <ul class="conversations">
      <conversation-item
        v-for="conv in filteredConversations"
        :key="conv.id"
        :conversation="conv"
        :current-user-id="currentUserId"
        @select="selectConversation"
      />
    </ul>

    <user-search-modal
      :visible="showUserSearch"
      :users="followees"
      @select-user="startChat"
      @close="showUserSearch = false"
    />
  </section>
</template>

<style  scoped>
.chat-list {
  padding: 1rem;
}
.chat-list__header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.chat-search__input {
  flex: 1;
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
</style>
