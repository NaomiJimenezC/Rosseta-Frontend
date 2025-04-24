import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";
import ConfirmEmailForm from "@/components/ConfirmEmailForm.vue"; // Cambié el nombre para que coincida con lo que hemos estado usando

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
    },
    {
      path: '/about',
      name: 'about',
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: ConfirmEmailForm,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
    }
  ],
});

export default router;
