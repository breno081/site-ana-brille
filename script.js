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
        top: targetElement.offsetTop - 80, // Ajuste para o header
        behavior: 'smooth'
      });
    }
  });
});

// Array para armazenar os itens do carrinho (código existente)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza o contador do carrinho e a seção do carrinho
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-whatsapp');

  // Atualiza o contador
  cartCount.textContent = cart.length;

  // Atualiza a lista de itens
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      ${item.name} - R$ ${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})">Remover</button>
    `;
    cartItems.appendChild(itemElement);
  });

  // Atualiza o total
  cartTotal.textContent = total.toFixed(2);

  // Atualiza o link do WhatsApp
  const message = encodeURIComponent(
    `Olá! Gostaria de comprar os seguintes itens:\n${cart
      .map(item => `${item.name} - R$ ${item.price.toFixed(2)}`)
      .join('\n')}\nTotal: R$ ${total.toFixed(2)}`
  );
  checkoutButton.href = `https://wa.me/8192771986?text=${message}`;

  // Salva o carrinho no localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Mostra a seção do carrinho se houver itens
  document.getElementById('cart').style.display = cart.length > 0 ? 'block' : 'none';
}

// Adiciona um item ao carrinho
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    cart.push({ name, price });
    updateCart();
  });
});

// Remove um item do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Limpa o carrinho
document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  updateCart();
});

// Atualiza o carrinho ao carregar a página
updateCart();