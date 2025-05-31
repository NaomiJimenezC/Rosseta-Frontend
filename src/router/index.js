import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm      from "@/components/RegisterForm.vue";
import LoginForm         from "@/components/LoginForm.vue";
import ConfirmEmailForm  from "@/components/ConfirmEmailForm.vue";
import Home              from "@/pages/Home.vue";
import NewPublication    from "@/components/NewPublication.vue";
import SearchResults     from "@/pages/SearchResults.vue";
import Profile           from "@/pages/Profile.vue";
import ChatList          from "@/pages/ChatList.vue";
import Chat              from "@/pages/Chat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',            name: 'home',         component: Home },
    { path: '/about',       name: 'about'  },
    { path: '/verify-email',name: 'verify-email', component: ConfirmEmailForm },
    { path: '/register',    name: 'register',     component: RegisterForm },
    { path: '/login',       name: 'login',        component: LoginForm },
    { path: '/publish',     name: 'publish',      component: NewPublication },
    { path: '/search',      name: 'search',       component: SearchResults },
    { path: '/profile/:id', name: 'profile',      component: Profile },
    { path: '/chats',       name: 'chats',        component: ChatList },
    {
      path: '/chats/:id',
      name: 'chat-view',
      component: Chat,
      props: true
    }
  ]
});

export default router;
