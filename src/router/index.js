// router/index.js (tu archivo de rutas)

import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";
import ConfirmEmailForm from "@/components/ConfirmEmailForm.vue";
import Home from "@/pages/Home.vue";
import NewPublication from "@/components/NewPublication.vue";
import SearchResults from "@/pages/SearchResults.vue";
import Profile from "@/pages/Profile.vue";
import ChatList from "@/pages/ChatList.vue";
import Chat from "@/pages/Chat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginForm, meta: { hideHeader: true } }, // Añadido meta
    { path: '/about', name: 'about', meta: { hideHeader: true } }, // Añadido meta (asumiendo que esta no requiere header)
    { path: '/verify-email', name: 'verify-email', component: ConfirmEmailForm, meta: { hideHeader: true } }, // Añadido meta
    { path: '/register', name: 'register', component: RegisterForm, meta: { hideHeader: true } }, // Añadido meta
    { path: '/home', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/publish', name: 'publish', component: NewPublication, meta: { requiresAuth: true } },
    { path: '/search', name: 'search', component: SearchResults, meta: { requiresAuth: true } },
    { path: '/profile/:id', name: 'profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/chats', name: 'chats', component: ChatList, meta: { requiresAuth: true } },
    {
      path: '/chats/:id',
      name: 'chat-view',
      component: Chat,
      props: true,
      meta: { requiresAuth: true }
    }
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
