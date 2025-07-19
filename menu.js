// Log para confirmar que o script do menu está sendo carregado
console.log('menu.js carregado com sucesso.');

// Controle do menu hamburger
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando menu hamburger.');
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    console.log('Hamburger e main-nav encontrados no DOM.');
    hamburger.addEventListener('click', (e) => {
      e.preventDefault(); // Evita comportamento padrão do label
      console.log('Hamburger clicado.');
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
      console.log('Classe .open no main-nav:', mainNav.classList.contains('open'));
      console.log('Classe .open no hamburger:', hamburger.classList.contains('open'));
    });
  } else {
    console.error('Erro: Um ou mais elementos (.hamburger, .main-nav) não encontrados no DOM.');
    alert('Erro: Hamburger ou main-nav não encontrados no DOM.');
  }

  // Fecha o menu ao clicar em um link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      console.log('Link do menu clicado, menu fechado.');
    });
  });
});