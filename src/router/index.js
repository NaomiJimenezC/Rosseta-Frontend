import { createRouter, createWebHistory } from 'vue-router';
import ConfirmEmailForm from "@/components/ConfirmEmailForm.vue";
import Home from "@/pages/Home.vue";
import NewPublication from "@/components/NewPublication.vue";
import SearchResults from "@/pages/SearchResults.vue";
import Profile from "@/pages/Profile.vue";
import ChatList from "@/pages/ChatList.vue";
import Chat from "@/pages/Chat.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import NotificationPage from "@/pages/NotificationPage.vue";
import PostPage from "@/pages/PostPage.vue";
import Contact from "@/pages/Contact.vue";
import Settings from "@/pages/Settings.vue";
import AboutUs from "@/pages/AboutUs.vue";
import UserSettings from "@/pages/UserSettings.vue";
import Apariencia from "@/pages/Apariencia.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginPage, meta: { hideHeader: true } },
    { path: '/verify-email', name: 'verify-email', component: ConfirmEmailForm, meta: { hideHeader: true } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { hideHeader: true } },
    { path: '/home', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/publish', name: 'publish', component: NewPublication, meta: { requiresAuth: true } },
    { path: '/search', name: 'search', component: SearchResults, meta: { requiresAuth: true } },
    { path: '/profile/:id', name: 'profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/post/:id', name: 'post', component: PostPage, meta: { requiresAuth: true } },
    { path: '/notifications', name: 'notifications', component: NotificationPage, meta: { requiresAuth: true} },
    { path: '/chats', name: 'chats', component: ChatList, meta: { requiresAuth: true } },
    {
      path: '/chats/:id',
      name: 'chat-view',
      component: Chat,
      props: true,
      meta: { requiresAuth: true }
    },
    { path: '/settings', name: 'settings', component:Settings, meta: { requiresAuth: true } },
    { path: '/settings/contact', name: 'contact',component: Contact,meta:{requiresAuth: true} },
    { path: '/settings/about', name: 'about',component: AboutUs,meta:{requiresAuth: true} },
    { path: '/settings/user', name: 'user settings',component: UserSettings,meta:{requiresAuth: true} },
    { path: '/settings/appearance', name: 'appearance',component: Apariencia,meta:{requiresAuth: true} },
  ]
});

router.beforeEach((to, from, next) => {
  const authRoutes = ['login', 'register', 'verify-email'];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('authToken');

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (authRoutes.includes(to.name) && isAuthenticated) {
    next({ name: 'home' });
  }
  else {
    next();
  }
});

export default router;
