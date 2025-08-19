import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importações do PrimeVue
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// ATUALIZADO: Importar o serviço de Toast
import ToastService from 'primevue/toastservice';

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService) // ATUALIZADO: Registrar o serviço

app.mount('#app')
