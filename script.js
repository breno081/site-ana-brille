// Controle do menu hamburger
document.querySelector('.hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('active');
});

// Fechar o menu ao clicar em um link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.remove('active');
  });
});

// Navegação suave para as seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Variável global do carrinho carregada do localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza o carrinho: contador, itens listados, total, link WhatsApp e visibilidade
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-whatsapp');

  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        ${item.name} - R$ ${item.price.toFixed(2)}
        <button onclick="removeFromCart(${index})" aria-label="Remover ${item.name} do carrinho">Remover</button>
      `;
      cartItems.appendChild(itemElement);
    });
  }

  cartTotal.textContent = total.toFixed(2);

  // Atualiza link para WhatsApp com mensagem formatada
  const message = encodeURIComponent(
    `Olá! Gostaria de comprar os seguintes itens:\n${cart
      .map(item => `${item.name} - R$ ${item.price.toFixed(2)}`)
      .join('\n')}\nTotal: R$ ${total.toFixed(2)}`
  );
  checkoutButton.href = `https://wa.me/8192771986?text=${message}`;

  // Mostrar a seção carrinho só se tiver itens
  document.getElementById('cart').style.display = cart.length > 0 ? 'block' : 'none';

  // Atualiza localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove item do carrinho pelo índice e atualiza
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Limpar carrinho
document.getElementById('clear-cart').addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    cart = [];
    updateCart();
    localStorage.removeItem('cart');
  }
});

// Modal do produto
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalAddToCart = document.getElementById('modal-add-to-cart');
const closeModal = document.querySelector('.close');

// Abre modal com dados do produto
document.querySelectorAll('.product-content').forEach(content => {
  content.addEventListener('click', () => {
    const product = content.closest('.product');
    const name = product.querySelector('h3').textContent;
    const price = product.querySelector('h4').textContent;
    const image = product.querySelector('img').getAttribute('src');

    modalTitle.textContent = name;
    modalPrice.textContent = price;
    modalImage.src = image;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    // Configura o botão adicionar do modal
    modalAddToCart.onclick = () => {
      const numericPrice = parseFloat(price.replace('R$', '').replace(',', '.'));
      cart.push({ name, price: numericPrice });
      updateCart();
      closeModalFunc();
    };
  });
});

// Função para fechar modal
function closeModalFunc() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}
closeModal.addEventListener('click', closeModalFunc);

// Fecha modal se clicar fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalFunc();
  }
});

// Evita que o clique no botão adicionar do produto abra o modal e adiciona direto ao carrinho
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // impedir abrir modal
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    cart.push({ name, price });
    updateCart();
  });
});

// Botão Finalizar no WhatsApp abre o link corretamente e alerta se o carrinho estiver vazio
const checkoutButton = document.getElementById('checkout-whatsapp');
checkoutButton.addEventListener('click', (e) => {
  if (cart.length === 0) {
    e.preventDefault();
    alert('Seu carrinho está vazio!');
    return;
  }
  // Previne comportamento padrão e abre em nova aba
  e.preventDefault();
  window.open(checkoutButton.href, '_blank');
});

// Atualiza carrinho ao carregar a página e garante modal fechado
window.addEventListener('DOMContentLoaded', () => {
  updateCart();
  closeModalFunc();
});

// Efeito de hover para produtos (opcional)
document.querySelectorAll('.product').forEach(product => {
  product.addEventListener('mouseover', () => {
    product.classList.add('hover');
  });
  product.addEventListener('mouseout', () => {
    product.classList.remove('hover');
  });
});
