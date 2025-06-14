<template>
  <header
    v-if="!shouldHideHeader"
    :class="['app-sidebar', { 'app-sidebar--open': showMenu }]"
  >
    <div class="app-sidebar__logo">
      <h1 class="app-sidebar__title">Rosseta</h1>
    </div>

    <button v-if="!showMenu" @click="toggleMenu" class="app-sidebar__mobile">
      <menu-icon :size="32" class="app-sidebar__mobile-icon" />
    </button>

    <nav class="app-sidebar__nav">
      <button @click="toggleMenu" class="app-sidebar__close">✕</button>

      <button @click="goToHome(); toggleMenu()" class="app-sidebar__nav-item">
        <home-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Inicio</h3>
      </button>
      <button @click="goToSearch(); toggleMenu()" class="app-sidebar__nav-item">
        <magnify-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Buscar</h3>
      </button>
      <button @click="goToProfile(); toggleMenu()" class="app-sidebar__nav-item">
        <account-circle-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Perfil</h3>
      </button>
      <button @click="goToNotifications(); toggleMenu()" class="app-sidebar__nav-item">
        <bell-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Notificaciones</h3>
        <span v-if="unreadNotifications > 0" class="app-sidebar__badge">{{ unreadNotifications }}</span>
      </button>
      <button @click="goToSettings(); toggleMenu()" class="app-sidebar__nav-item">
        <cog-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Ajustes</h3>
      </button>
      <button @click="goToMessages(); toggleMenu()" class="app-sidebar__nav-item">
        <message-text-icon :size="32" class="app-sidebar__nav-icon" />
        <h3 class="app-sidebar__nav-text">Mensajes</h3>
        <span v-if="unreadChats > 0" class="app-sidebar__badge">{{ unreadChats }}</span>
      </button>

      <button @click="logOut()" class="app-sidebar__nav-item">
        <logout-icon :size="32" class="app-sidebar__nav-icon"/>
        <h3 class="app-sidebar__nav-text">Salir</h3>
      </button>
    </nav>

    <button @click="openPublishModal" class="app-sidebar__publish">
      Publicar
    </button>

    <NewPublicationModal
      v-model:isVisible="showNewPublicationModal"
      @publication-successful="handlePublicationSuccessful"
      @modal-closed="handleModalClosed"
    />
  </header>
</template>

<script>
import HomeIcon from 'vue-material-design-icons/Home.vue'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue'
import BellIcon from 'vue-material-design-icons/Bell.vue'
import CogIcon from 'vue-material-design-icons/Cog.vue'
import MessageTextIcon from 'vue-material-design-icons/MessageText.vue'
import MenuIcon from 'vue-material-design-icons/Menu.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'
import {getCalling, postCalling} from '@/Helpers/CallToAPI.js'
import NewPublicationModal from '@/components/NewPublicationModal.vue'

export default {
  name: 'Header',
  components: {
    NewPublicationModal,
    HomeIcon,
    MagnifyIcon,
    AccountCircleIcon,
    BellIcon,
    CogIcon,
    MessageTextIcon,
    MenuIcon,
    LogoutIcon
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
    },
    shouldHideHeader() {
      return this.$route.meta.hideHeader || false;
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
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
    handleModalClosed() { this.$router.push('/home') },
    logOut() {
      try {
        postCalling("/logout",{},true)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
        localStorage.removeItem('user')
        this.$router.push('/')
      } catch (e){
        console.error(e)
      }
    }
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
  },
  beforeUnmount() {
    if (window.Echo) {
      if (this.currentUserId) window.Echo.private(`App.Models.User.${this.currentUserId}`).stopListening()
      this.conversations.forEach(conv => window.Echo.private(`chat.${conv.id}`).stopListening('.message.direct'))
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@/SASS/components/header";
</style>
