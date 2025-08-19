<script setup>
import { ref } from 'vue';
// Importando componentes do PrimeVue
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';

// --- Estado Reativo ---

// Termos de busca inseridos pelo usuário
const searchTerm = ref({
  title: '',
  author: '',
  year: null
});

// Lista completa de livros (simulando um banco de dados)
const allBooks = ref([
  { id: 1, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', pages: 1200, year: 1954 },
  { id: 2, title: 'O Hobbit', author: 'J.R.R. Tolkien', pages: 300, year: 1937 },
  { id: 3, title: '1984', author: 'George Orwell', pages: 328, year: 1949 },
  { id: 4, title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 256, year: 1953 },
  { id: 5, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', pages: 208, year: 1979 },
  { id: 6, title: 'Duna', author: 'Frank Herbert', pages: 688, year: 1965 }
]);

// Lista de livros filtrados para exibição
const filteredBooks = ref([]);
const searchPerformed = ref(false); // Para saber se uma busca já foi feita

// --- Funções ---

// Função de busca que filtra a lista de livros
const performSearch = () => {
  searchPerformed.value = true;
  let results = allBooks.value;

  // Filtra por título (se preenchido)
  if (searchTerm.value.title) {
    results = results.filter(book => 
      book.title.toLowerCase().includes(searchTerm.value.title.toLowerCase())
    );
  }

  // Filtra por autor (se preenchido)
  if (searchTerm.value.author) {
    results = results.filter(book => 
      book.author.toLowerCase().includes(searchTerm.value.author.toLowerCase())
    );
  }

  // Filtra por ano (se preenchido)
  if (searchTerm.value.year) {
    results = results.filter(book => book.year == searchTerm.value.year);
  }

  filteredBooks.value = results;
};

// Limpa os campos de busca e os resultados
const clearSearch = () => {
  searchTerm.value = { title: '', author: '', year: null };
  filteredBooks.value = [];
  searchPerformed.value = false;
};
</script>

<template>
  <div class="search-page">
    <!-- Card com os filtros de busca -->
    <Card class="search-filters">
      <template #title>
        <h2><i class="pi pi-search"></i> Buscar Livros</h2>
      </template>
      <template #content>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-4">
            <label for="title">Título</label>
            <InputText id="title" v-model="searchTerm.title" placeholder="Ex: O Hobbit" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="author">Autor</label>
            <InputText id="author" v-model="searchTerm.author" placeholder="Ex: J.R.R. Tolkien" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="year">Ano de Publicação</label>
            <InputText id="year" v-model="searchTerm.year" placeholder="Ex: 1954" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-content-end gap-2">
            <Button label="Limpar Filtros" icon="pi pi-times" class="p-button-outlined p-button-secondary" @click="clearSearch" />
            <Button label="Buscar" icon="pi pi-check" class="p-button-primary" @click="performSearch" />
        </div>
      </template>
    </Card>

    <!-- Seção de Resultados -->
    <div class="search-results">
      <transition-group name="fade" tag="div" class="results-grid">
        <Card v-for="book in filteredBooks" :key="book.id" class="book-card">
          <template #title>{{ book.title }}</template>
          <template #subtitle>{{ book.author }}</template>
          <template #content>
            <p>
              <i class="pi pi-file"></i> {{ book.pages }} páginas<br>
              <i class="pi pi-calendar"></i> Publicado em {{ book.year }}
            </p>
          </template>
        </Card>
      </transition-group>
      
      <div v-if="filteredBooks.length === 0 && searchPerformed" class="no-results">
        <i class="pi pi-info-circle"></i>
        <p>Nenhum livro encontrado com os critérios informados.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-filters {
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.book-card {
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: #fff;
  border-radius: 10px;
}

.no-results i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Animação para os resultados */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
