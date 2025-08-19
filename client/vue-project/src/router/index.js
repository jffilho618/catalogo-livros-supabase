import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CatalogView from '@/views/CatalogView.vue'

const router = createRouter({
history: createWebHistory(import.meta.env.BASE_URL),
routes: [
{
// A rota principal agora é o catálogo
path: '/',
name: 'catalog',
component: CatalogView
},
{
// A rota de login agora é /login
path: '/login',
name: 'login',
component: LoginView
}
]
})

// O router.beforeEach foi removido, pois a rota de catálogo agora é pública.

export default router