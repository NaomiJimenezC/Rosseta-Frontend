<script>
export default {
  name: 'ConversationItem',
  props: {
    conversation: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return this.conversation.users
        .filter(u => u.id !== this.currentUserId)
        .map(u => u.name)
        .join(', ');
    },
    lastMessage() {
      return this.conversation.messages[0]?.content || 'Sin mensajes aún';
    }
  },
  methods: {
    select() {
      this.$emit('select', this.conversation);
    }
  }
};
</script>

<template>
  <li
    class="conversation-item"
    role="button"
    tabindex="0"
    @click="select"
    @keyup.enter="select"
  >
    <article class="conversation-info">
      <h3 class="conversation-title">{{ title }}</h3>
      <p class="conversation-last-message">{{ lastMessage }}</p>
    </article>
    <aside v-if="conversation.unread_count > 0" class="conversation-unread">
      <span class="badge" aria-label="Chats sin leer">
        {{ conversation.unread_count }}
      </span>
    </aside>
  </li>
</template>

<style scoped>
.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.conversation-item:focus,
.conversation-item:hover {
  background-color: #f9f9f9;
  outline: none;
}
.conversation-title {
  margin: 0;
  font-size: 1rem;
}
.conversation-last-message {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #666;
}
.badge {
  background-color: red;
  color: #fff;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
