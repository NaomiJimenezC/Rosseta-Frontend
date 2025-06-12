<script>
import HomeIcon from 'vue-material-design-icons/Home.vue'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue'
import BellIcon from 'vue-material-design-icons/Bell.vue'
import CogIcon from 'vue-material-design-icons/Cog.vue'
import MessageTextIcon from 'vue-material-design-icons/MessageText.vue'
import PlusCircleIcon from 'vue-material-design-icons/PlusCircle.vue'
import { getCalling } from '@/Helpers/CallToAPI.js'
import NewPublicationModal from '@/components/NewPublicationModal.vue'

export default {
  name: 'Footer_mobile',
  components: {
    NewPublicationModal,
    PlusCircleIcon,
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
      showNewPublicationModal: false,
      showMenu: false,
    }
  },
  computed: {
    currentUserId() {
      return Number(localStorage.getItem('userId'))
    }
  },
  methods: {
    async loadInitialCounts() {
      try {
        const notiRes = await getCalling('/notifications/unread-count', true)
        this.unreadNotifications = notiRes.unread_notifications || 0
        const convRes = await getCalling('/conversations', true)
        this.conversations = convRes.data || []
        const chatsRes = await getCalling('/conversations/unread-count', true)
        this.unreadChats = chatsRes.unread_chats || 0
      } catch (e) {
        console.error(e)
      }
    },
    goToHome() { this.$router.push('/home') },
    goToSearch() { this.$router.push('/search') },
    goToProfile() {
      const u = this.currentUserId
      if (u) this.$router.push(`/profile/${u}`)
    },
    goToNotifications() { this.$router.push('/notifications') },
    goToSettings() { this.$router.push({ name: 'settings' }) },
    goToMessages() { this.$router.push('/chats') },
    openPublishModal() { this.showNewPublicationModal = true },
    handlePublicationSuccessful() { this.$router.push('/home') },
  },
  async mounted() {
    await this.loadInitialCounts()
    if (this.currentUserId && window.Echo) {
      window.Echo.private(`App.Models.User.${this.currentUserId}`)
        .notification(() => { this.unreadNotifications += 1 })
        .error(err => console.error(err))
    }
    if (window.Echo) {
      this.conversations.forEach(conv => {
        window.Echo.private(`chat.${conv.id}`)
          .listen('.message.direct', e => {
            if (e.from_id !== this.currentUserId) this.unreadChats += 1
          })
          .error(err => console.error(err))
      })
    }
  }
}
</script>

<template>
  <footer class="app-footer">
    <nav class="app-footer__nav">
      <button @click="goToHome()" class="app-footer__nav-item">
        <home-icon :size="24" class="app-footer__nav-icon" />
      </button>

      <button @click="goToSearch()" class="app-footer__nav-item">
        <magnify-icon :size="24" class="app-footer__nav-icon" />
      </button>

      <button @click="openPublishModal" class="app-footer__nav-item app-footer__nav-item--add-button">
        <plus-circle-icon :size="32" class="app-footer__nav-icon" />
      </button>

      <button @click="goToNotifications()" class="app-footer__nav-item">
        <bell-icon :size="24" class="app-footer__nav-icon" />
        <span v-if="unreadNotifications > 0" class="app-footer__badge app-footer__badge--notifications">{{ unreadNotifications }}</span>
      </button>

      <button @click="goToMessages()" class="app-footer__nav-item">
        <message-text-icon :size="24" class="app-footer__nav-icon" />
      </button>

      <button @click="goToProfile()" class="app-footer__nav-item">
        <account-circle-icon :size="24" class="app-footer__nav-icon" />
      </button>
      <button @click="goToSettings()" class="app-footer__nav-item">
        <cog-icon :size="24" class="app-footer__nav-icon" />
      </button>

    </nav>

    <NewPublicationModal
      v-model:isVisible="showNewPublicationModal"
      @publication-successful="handlePublicationSuccessful"
      @modal-closed="handleModalClosed"
    />
  </footer>
</template>

<style scoped lang="sass">
@use "@/SASS/components/footer"
</style>
