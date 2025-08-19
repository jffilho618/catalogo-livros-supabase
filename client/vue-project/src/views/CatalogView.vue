<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import { useToast } from 'primevue/usetoast'; // ATUALIZADO: Importar o hook de Toast

// Importando componentes do PrimeVue
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast'; // ATUALIZADO: Importar o componente Toast

const router = useRouter();
const toast = useToast(); // ATUALIZADO: Inicializar o serviço de Toast

// --- Estado Reativo ---
const allBooks = ref([]);
const bookDialog = ref(false);
const book = ref({});
const searchTerm = ref('');
const activeFilter = ref('Mais Relevantes');
const filters = ['Mais Relevantes', 'Mais Recentes', 'Ordem Alfabética'];
const isLoggedIn = ref(false);

// --- Carregar Livros da API ---
const fetchBooks = async () => {
  try {
    const response = await apiClient.get('/public/books');
    allBooks.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os livros.', life: 3000 });
  }
};

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('authToken');
  fetchBooks();
});

// --- Lógica de Filtro ---
const filteredBooks = computed(() => {
  let books = [...allBooks.value];
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    books = books.filter(b => 
      b.title.toLowerCase().includes(search) || 
      b.author.toLowerCase().includes(search)
    );
  }
  switch (activeFilter.value) {
    case 'Mais Recentes': books.sort((a, b) => b.year - a.year); break;
    case 'Ordem Alfabética': books.sort((a, b) => a.title.localeCompare(b.title)); break;
  }
  return books;
});

// --- Funções de Navegação e CRUD ---
const goToAddBook = () => {
    if (isLoggedIn.value) openModal();
    else router.push('/login');
};

const goToLogin = () => router.push('/login');

const openModal = (bookToEdit = null) => {
  book.value = bookToEdit ? { ...bookToEdit } : {};
  bookDialog.value = true;
};

const saveBook = async () => {
  if (!book.value.title || !book.value.author) {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Título e autor são obrigatórios.', life: 3000 });
    return;
  }
  try {
    const isEditing = !!book.value.id;
    if (isEditing) {
      await apiClient.put(`/books/${book.value.id}`, book.value);
    } else {
      await apiClient.post('/books', book.value);
    }
    bookDialog.value = false;
    fetchBooks();
    toast.add({ severity: 'success', summary: 'Sucesso', detail: `Livro ${isEditing ? 'atualizado' : 'salvo'} com sucesso!`, life: 3000 });
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Não foi possível conectar ao servidor.';
    toast.add({ severity: 'error', summary: 'Erro ao Salvar', detail: errorMessage, life: 3000 });
  }
};

const deleteBook = async (bookId) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) { // confirm() ainda é aceitável para deleção
        try {
            await apiClient.delete(`/books/${bookId}`);
            fetchBooks();
            toast.add({ severity: 'info', summary: 'Deletado', detail: 'O livro foi removido.', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro ao Deletar', detail: 'Não foi possível remover o livro.', life: 3000 });
        }
    }
};

const handleLogout = () => {
  localStorage.removeItem('authToken');
  isLoggedIn.value = false;
  window.location.reload();
};
</script>

<template>
  <div class="page-wrapper">
    <!-- ATUALIZADO: Adicionado o componente Toast -->
    <Toast />

    <header class="main-header">
        <div class="header-content">
            <div class="logo-container">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 15C20 15 10 30 10 50C10 70 20 85 50 85C80 85 90 70 90 50C90 30 80 15 50 15Z" fill="#E6F2FF"/>
                    <path d="M50 15V85C50 85 65 75 65 50C65 25 50 15 50 15Z" fill="#CCE4FF"/>
                    <path d="M40 35H50V65H60" stroke="#007BFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2>Lumina</h2>
            </div>
            <div class="header-actions">
                <button class="add-book-btn-header" @click="goToAddBook">+ Adicionar Livro</button>
                <button v-if="isLoggedIn" class="logout-btn" @click="handleLogout">Sair</button>
                <button v-else class="login-btn" @click="goToLogin">Logar</button>
            </div>
        </div>
    </header>

    <main>
      <section class="hero-section">
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>
        <div class="hero-content">
          <h1>Catálogo</h1>
          <p>Faça uma busca e navegue pelos milhares de ebooks disponíveis.</p>
          <form class="search-form" @submit.prevent>
            <input type="search" v-model="searchTerm" placeholder="Busque por título ou autor">
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>
          <div class="toggle-filters">
            <button 
              v-for="filter in filters" 
              :key="filter"
              class="toggle-filter"
              :class="{ active: activeFilter === filter }"
              @click="activeFilter = filter">
              {{ filter }}
            </button>
          </div>
        </div>
      </section>

      <section class="catalog-section">
        <div class="container">
          <div class="catalog-header">
            <p class="results-info">Mostrando {{ filteredBooks.length }} de {{ allBooks.length }} resultados</p>
          </div>
          <div class="book-grid">
            <div v-for="b in filteredBooks" :key="b.id" class="book-card">
              <div v-if="isLoggedIn" class="book-card-actions">
                  <button class="action-btn edit-btn" @click="openModal(b)"><i class="pi pi-pencil"></i></button>
                  <button class="action-btn delete-btn" @click="deleteBook(b.id)"><i class="pi pi-trash"></i></button>
              </div>
              <img :src="b.image" :alt="'Capa do livro ' + b.title" @error="event => event.target.src='https://placehold.co/200x300/ccc/fff?text=Imagem+Inválida'">
              <h3>{{ b.title }}</h3>
              <p class="author">{{ b.author }}</p>
              <!-- ATUALIZADO: Exibindo a quantidade de páginas -->
              <p class="year">{{ b.year }} <span v-if="b.pages"> - {{ b.pages }} pág.</span></p>
            </div>
          </div>
          <div v-if="filteredBooks.length === 0" class="no-results">
            <p>Nenhum livro encontrado com os critérios atuais.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- ATUALIZADO: Modal com campo de páginas -->
    <Dialog v-model:visible="bookDialog" modal :header="book.id ? 'Editar Livro' : 'Adicionar Novo Livro'" :style="{ width: '500px' }">
        <div class="form-group">
            <label for="bookTitle">Título do Livro</label>
            <InputText id="bookTitle" v-model="book.title" />
        </div>
        <div class="form-group">
            <label for="bookAuthor">Autor</label>
            <InputText id="bookAuthor" v-model="book.author" />
        </div>
        <div class="form-group-inline">
            <div class="form-group">
                <label for="bookYear">Ano</label>
                <InputNumber id="bookYear" v-model="book.year" :useGrouping="false" />
            </div>
            <div class="form-group">
                <label for="bookPages">Páginas</label>
                <InputNumber id="bookPages" v-model="book.pages" />
            </div>
        </div>
        <div class="form-group">
            <label for="bookImage">URL da Imagem da Capa</label>
            <InputText id="bookImage" v-model="book.image" placeholder="https://exemplo.com/capa.png" />
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="bookDialog = false" class="p-button-text"/>
            <Button label="Salvar" icon="pi pi-check" @click="saveBook" />
        </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* ATUALIZADO: Estilos para o formulário inline */
.form-group-inline {
    display: flex;
    gap: 1rem;
}
.form-group-inline .form-group {
    flex: 1;
}

/* ... (o resto dos estilos continua o mesmo) ... */
.login-btn { background-color: #f1f1f1; color: #333; border: 1px solid #ccc; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
.login-btn:hover { background-color: #e0e0e0; }
.page-wrapper { background-color: #f4f4f4; color: #333; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.main-header { background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 0 20px; position: sticky; top: 0; z-index: 100; height: 70px; }
.header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 100%; }
.logo-container { display: flex; align-items: center; gap: 10px; }
.logo-container h2 { font-size: 1.5rem; color: #007BFF; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 15px; }
.add-book-btn-header { background-color: #007BFF; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
.add-book-btn-header:hover { background-color: #0056b3; }
.logout-btn { background: none; border: 1px solid #ccc; color: #555; padding: 10px 20px; border-radius: 5px; cursor: pointer; transition: all 0.3s; }
.logout-btn:hover { background-color: #f1f1f1; color: #333; }
.hero-section { position: relative; overflow: hidden; z-index: 1; }
.bg { animation: slide 3s ease-in-out infinite alternate; background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%); bottom: 0; left: -50%; opacity: .5; position: absolute; right: -50%; top: 0; z-index: -1; }
.bg2 { animation-direction: alternate-reverse; animation-duration: 4s; }
.bg3 { animation-duration: 5s; }
@keyframes slide { 0% { transform: translateX(-25%); } 100% { transform: translateX(25%); } }
.hero-content { position: relative; z-index: 2; color: #fff; padding: 60px 20px; text-align: center; }
.hero-content h1 { font-size: 2.5rem; margin-bottom: 10px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
.hero-content p { text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
.search-form { margin-top: 20px; display: flex; justify-content: center; max-width: 600px; margin-left: auto; margin-right: auto; }
.search-form input { width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 5px 0 0 5px; font-size: 1rem; color: #333; }
.search-form button { padding: 15px; border: none; background-color: #fff; cursor: pointer; border-radius: 0 5px 5px 0; }
.search-form button svg { stroke: #888; }
.toggle-filters { margin-top: 25px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
.toggle-filter { background: rgba(255, 255, 255, 0.2); border: 1px solid #fff; color: #fff; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.3s, color 0.3s; backdrop-filter: blur(2px); }
.toggle-filter.active { background-color: #fff; color: #09f; font-weight: bold; }
.catalog-section { padding: 50px 0; }
.catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.results-info { color: #666; }
.book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 30px; }
.book-card { background-color: #fff; padding: 10px; border-radius: 5px; text-align: left; transition: box-shadow 0.3s ease, transform 0.3s ease; position: relative; }
.book-card:hover { transform: translateY(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.book-card:hover .book-card-actions { opacity: 1; }
.book-card img { width: 100%; height: 270px; object-fit: cover; display: block; margin-bottom: 15px; border-radius: 4px; }
.book-card h3 { font-size: 1rem; margin-bottom: 5px; color: #333; height: 40px; overflow: hidden; }
.book-card .author, .book-card .year { font-size: 0.85rem; color: #777; }
.no-results { text-align: center; padding: 40px; color: #777; }
.book-card-actions { position: absolute; top: 15px; right: 15px; display: flex; gap: 5px; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); border-radius: 20px; padding: 5px; opacity: 0; transition: opacity 0.3s ease; }
.action-btn { background: none; border: none; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 30px; height: 30px; transition: background-color 0.2s; }
.action-btn i { font-size: 0.9rem; }
.edit-btn { color: #007BFF; }
.edit-btn:hover { background-color: #e6f2ff; }
.delete-btn { color: #DC3545; }
.delete-btn:hover { background-color: #fde8e8; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group .p-inputtext, .form-group .p-inputnumber { width: 100%; }
</style>
