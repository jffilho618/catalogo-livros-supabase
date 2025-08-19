<script setup>
import AnimatedBackground from '../components/AnimatedBackground.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Função para simular o logout e redirecionar para a página de login.
const handleLogout = () => {
  // No futuro, aqui você limpará o token de autenticação.
  console.log("Usuário deslogado");
  router.push('/');
};
</script>

<template>
  <div class="dashboard-layout">
    <AnimatedBackground />
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Livros App</h3>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <i class="pi pi-home"></i>
          <span>Início</span>
        </router-link>
        <router-link to="/dashboard/livros" class="nav-item">
          <i class="pi pi-plus-circle"></i>
          <span>Cadastro de Livros</span>
        </router-link>
        <router-link to="/dashboard/buscar" class="nav-item">
          <i class="pi pi-search"></i>
          <span>Buscar Livro</span>
        </router-link>
      </nav>
       <div class="sidebar-footer">
          <a @click="handleLogout" class="nav-item logout">
            <i class="pi pi-sign-out"></i>
            <span>Sair</span>
          </a>
       </div>
    </aside>
    <main class="main-content">
      <!-- O conteúdo das páginas (DashboardView, LivrosView, etc.) será renderizado aqui -->
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #ffffff;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  z-index: 10;
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.sidebar-nav {
  flex-grow: 1;
  padding-top: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #495057;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
}

.nav-item i {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.nav-item:hover, .router-link-exact-active {
  background-color: #f8f9fa;
  color: var(--primary-color);
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
}

.logout {
    cursor: pointer;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px; /* Garante espaço para o sidebar fixo */
  position: relative;
  z-index: 1;
}
</style>
