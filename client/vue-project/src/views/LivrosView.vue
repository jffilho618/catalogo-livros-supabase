<script setup>
import { ref, onMounted } from 'vue';
// Importando componentes do PrimeVue
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';

// --- Estado Reativo ---
const books = ref([]);
const bookDialog = ref(false); // Controla a visibilidade do modal de criar/editar
const deleteBookDialog = ref(false); // Controla a visibilidade do modal de exclusão
const book = ref({}); // Armazena os dados do livro sendo criado/editado

// --- Dados de Exemplo ---
// Simula dados que viriam do backend
onMounted(() => {
  books.value = [
    { id: 1, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', pages: 1200, year: 1954 },
    { id: 2, title: 'O Hobbit', author: 'J.R.R. Tolkien', pages: 300, year: 1937 },
    { id: 3, title: '1984', author: 'George Orwell', pages: 328, year: 1949 }
  ];
});

// --- Funções CRUD ---

// Abrir modal para novo livro
const openNew = () => {
  book.value = {}; // Limpa o objeto
  bookDialog.value = true;
};

// Abrir modal para editar livro
const editBook = (prod) => {
  book.value = { ...prod }; // Cria uma cópia do livro para edição
  bookDialog.value = true;
};

// Fechar o modal principal
const hideDialog = () => {
  bookDialog.value = false;
};

// Salvar livro (criação ou edição)
const saveBook = () => {
  if (book.value.title && book.value.author) {
    if (book.value.id) {
      // Editando um livro existente
      const index = books.value.findIndex(b => b.id === book.value.id);
      books.value[index] = book.value;
    } else {
      // Criando um novo livro
      book.value.id = Math.floor(Math.random() * 10000); // Simula um ID único
      books.value.push(book.value);
    }
    bookDialog.value = false; // Fecha o modal
    book.value = {}; // Limpa o objeto
  }
};

// Abrir modal de confirmação de exclusão
const confirmDeleteBook = (prod) => {
  book.value = prod;
  deleteBookDialog.value = true;
};

// Excluir o livro
const deleteBook = () => {
  books.value = books.value.filter(b => b.id !== book.value.id);
  deleteBookDialog.value = false;
  book.value = {};
};
</script>

<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button label="Novo Livro" icon="pi pi-plus" class="p-button-success" @click="openNew" />
      </template>
    </Toolbar>

    <!-- Tabela de Livros (Read) -->
    <DataTable :value="books" responsiveLayout="scroll">
      <Column field="title" header="Título" :sortable="true"></Column>
      <Column field="author" header="Autor" :sortable="true"></Column>
      <Column field="pages" header="Páginas"></Column>
      <Column field="year" header="Ano"></Column>
      <Column headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
        <template #body="slotProps">
          <!-- Botões de Ação (Update, Delete) -->
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success" @click="editBook(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteBook(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Modal de Criação/Edição (Create, Update) -->
  <Dialog v-model:visible="bookDialog" :style="{width: '450px'}" header="Detalhes do Livro" :modal="true" class="p-fluid">
    <div class="p-field">
      <label for="title">Título</label>
      <InputText id="title" v-model.trim="book.title" required="true" autofocus />
    </div>
    <div class="p-field">
      <label for="author">Autor</label>
      <InputText id="author" v-model.trim="book.author" required="true" />
    </div>
    <div class="p-field">
      <label for="pages">Quantidade de Páginas</label>
      <InputNumber id="pages" v-model="book.pages" integeronly />
    </div>
    <div class="p-field">
      <label for="year">Ano de Publicação</label>
      <InputNumber id="year" v-model="book.year" integeronly :useGrouping="false" />
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="saveBook" />
    </template>
  </Dialog>

  <!-- Modal de Confirmação de Exclusão (Delete) -->
  <Dialog v-model:visible="deleteBookDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="book">Tem certeza que deseja excluir <b>{{book.title}}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteBookDialog = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteBook" />
    </template>
  </Dialog>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.p-field {
  margin-bottom: 1.5rem;
}
.p-button-success {
  margin-right: .5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.confirmation-content {
    display: flex;
    align-items: center;
}
</style>
