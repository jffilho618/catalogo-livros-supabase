import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CatalogView from '@/views/CatalogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogView,
      meta: { requiresAuth: true } // Marca esta rota como protegida
    }
  ]
})

// Adiciona a "guarda de navegação" para proteger rotas
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('authToken'); // Verifica se o token existe

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Se a rota requer autenticação e o usuário não está logado,
    // redireciona para a página de login.
    next({ name: 'login' });
  } else {
    // Caso contrário, permite o acesso.
    next();
  }
});

export default router