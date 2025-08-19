<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import apiClient from '@/api';
import { useToast } from 'primevue/usetoast'; // 1. Importar o hook de Toast
import Toast from 'primevue/toast';         // 2. Importar o componente Toast

const email = ref('');
const password = ref('');
const router = useRouter();
const toast = useToast(); // 3. Inicializar o serviço de Toast

const handleLogin = async () => {
  if (!email.value || !password.value) {
    // 4. Substituir o errorMessage por um toast de aviso
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha o email e a senha.', life: 3000 });
    return;
  }

  try {
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const token = response.data.session.access_token;
    localStorage.setItem('authToken', token);
    
    // 5. Adicionar um toast de sucesso antes de redirecionar
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso!', life: 2000 });

    // Adiciona um pequeno delay para o usuário ver a mensagem antes do redirecionamento
    setTimeout(() => {
        router.push('/');
    }, 1000);

  } catch (error) {
    console.error('Erro no login:', error.response?.data);
    // 6. Substituir o errorMessage por um toast de erro
    const detail = error.response?.data?.error || 'Credenciais inválidas. Tente novamente.';
    toast.add({ severity: 'error', summary: 'Falha no Login', detail: detail, life: 3000 });
  }
};
</script>

<template>
  <div class="login-page">
    <!-- 7. Adicionar o componente Toast ao template -->
    <Toast />

    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>

    <div class="login-container">
      <div class="logo-wrapper">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C20 15 10 30 10 50C10 70 20 85 50 85C80 85 90 70 90 50C90 30 80 15 50 15Z" fill="#E6F2FF"/>
            <path d="M50 15V85C50 85 65 75 65 50C65 25 50 15 50 15Z" fill="#CCE4FF"/>
            <path d="M40 35H50V65H60" stroke="#007BFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Lumina</h2>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="p-field">
          <span class="p-input-icon-left">
            <i class="pi pi-envelope" />
            <InputText id="email" type="email" v-model="email" placeholder="Email" />
          </span>
        </div>
        <div class="p-field">
          <span class="p-input-icon-left">
            <i class="pi pi-lock" />
            <InputText id="password" type="password" v-model="password" placeholder="Senha" />
          </span>
        </div>
        
        <!-- A mensagem de erro em texto foi removida -->

        <Button type="submit" label="Entrar" class="p-button-primary" />
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Os estilos permanecem exatamente os mesmos */
.login-page { height: 100vh; margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; }
.bg { animation: slide 3s ease-in-out infinite alternate; background-image: linear-gradient(-60deg, #55C595 50%, #007BFF 50%); bottom: 0; left: -50%; opacity: .5; position: fixed; right: -50%; top: 0; z-index: -1; }
.bg2 { animation-direction: alternate-reverse; animation-duration: 4s; }
.bg3 { animation-duration: 5s; }
@keyframes slide { 0% { transform: translateX(-25%); } 100% { transform: translateX(25%); } }
.login-container { background-color: rgba(255, 255, 255, 0.9); padding: 3rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
.logo-wrapper { margin-bottom: 2rem; }
.logo-wrapper h2 { font-size: 2rem; font-weight: 600; color: #0d2c4b; margin: 0.5rem 0 0 0; }
.login-form { display: flex; flex-direction: column; gap: 1.5rem; }
.p-field .p-input-icon-left { width: 100%; position: relative; }
.p-field .p-input-icon-left > i { position: absolute; top: 50%; left: 1rem; transform: translateY(-50%); color: var(--text-color-secondary); }
.p-field .p-input-icon-left > .p-inputtext { width: 100%; padding-left: 3rem !important; }
.p-button-primary { padding: 0.75rem; font-weight: 600; background-color: var(--primary-color) !important; border: none !important; }
.p-button-primary:hover { background-color: var(--primary-color-dark) !important; }
</style>
