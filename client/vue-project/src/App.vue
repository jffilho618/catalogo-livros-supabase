<template>
  <!-- 
    Este componente é o ponto de entrada principal.
    <router-view /> é um componente especial que renderiza 
    a página correspondente à URL atual (LoginView, CatalogView, etc.).
    Se este componente não estiver aqui, nada será exibido.
  -->
  <router-view />
</template>

<style>
/* Estes são os estilos globais que se aplicam a toda a aplicação.
  É importante que eles estejam aqui.
*/
:root {
  --primary-color: #007BFF;
  --primary-color-dark: #0056b3;
  --background-color: #F8F9FA;
  --surface-card: #FFFFFF;
  --text-color: #212529;
  --text-color-secondary: #6c757d;
  --surface-border: #DEE2E6;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
