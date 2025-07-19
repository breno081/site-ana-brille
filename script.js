// Controle do menu hamburger
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && menuToggle && mainNav) {
    console.log('Hamburger, menu-toggle e main-nav encontrados no DOM.');
    hamburger.addEventListener('click', () => {
      console.log('Hamburger clicado, estado atual do checkbox:', menuToggle.checked);
      menuToggle.checked = !menuToggle.checked;
      if (menuToggle.checked) {
        mainNav.classList.add('open');
        hamburger.classList.add('open');
      } else {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      }
      console.log('Novo estado do checkbox:', menuToggle.checked, 'Classe .open no main-nav:', mainNav.classList.contains('open'));
    });
  } else {
    console.error('Erro: Um ou mais elementos (.hamburger, #menu-toggle, .main-nav) não encontrados no DOM.');
  }

  // Fecha o menu ao clicar em um link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.checked = false;
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      console.log('Link do menu clicado, menu fechado.');
    });
  });
});

// Navegação suave para as seções
document.addEventListener('DOMContentLoaded', () => {
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
});

// Variável global do carrinho carregada do localStorage
let cart = (() => {
  try {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    // Valida cada item do carrinho
    if (Array.isArray(storedCart)) {
      return storedCart.filter(item => 
        item && 
        typeof item.name === 'string' && 
        typeof item.price === 'number' && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );
    }
    return [];
  } catch (e) {
    console.error('Erro ao carregar carrinho do localStorage:', e);
    return [];
  }
})();

// Atualiza o carrinho: contador, itens listados, total, link WhatsApp e visibilidade
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-whatsapp');
  const cartSection = document.getElementById('cart');

  // Calcula o total de itens no carrinho, tratando valores inválidos
  const totalItems = cart.reduce((sum, item) => {
    return sum + (typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0);
  }, 0);

  // Atualiza contador
  cartCount.textContent = totalItems || 0;

  // Limpa lista de itens
  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
    cartSection.style.display = 'none';
  } else {
    cart.forEach((item, index) => {
      if (typeof item.price === 'number' && typeof item.quantity === 'number') {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <span>${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}</span>
          <div>
            <button onclick="updateQuantity(${index}, ${item.quantity - 1})" aria-label="Diminuir quantidade de ${item.name}">-</button>
            <button onclick="updateQuantity(${index}, ${item.quantity + 1})" aria-label="Aumentar quantidade de ${item.name}">+</button>
            <button onclick="removeFromCart(${index})" aria-label="Remover ${item.name} do carrinho">Remover</button>
          </div>
        `;
        cartItems.appendChild(itemElement);
      }
    });
    cartSection.style.display = 'block';
  }

  cartTotal.textContent = total.toFixed(2);

  // Atualiza link para WhatsApp com mensagem formatada
  const message = encodeURIComponent(
    `Olá! Gostaria de comprar os seguintes itens:\n${cart
      .map(item => `${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}`)
      .join('\n')}\nTotal: R$ ${total.toFixed(2)}`
  );
  checkoutButton.href = `https://wa.me/8192771986?text=${message}`;

  // Atualiza localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Atualiza a quantidade de um item no carrinho
function updateQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQuantity;
  }
  updateCart();
}

// Remove item do carrinho pelo índice e atualiza
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Limpar carrinho
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      cart = [];
      updateCart();
      localStorage.removeItem('cart');
    }
  });
});

// Modal do produto
document.addEventListener('DOMContentLoaded', () => {
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
        if (!isNaN(numericPrice)) {
          const existingItem = cart.find(item => item.name === name);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({ name, price: numericPrice, quantity: 1 });
          }
          updateCart();
          closeModalFunc();
        } else {
          console.error('Erro: Preço inválido ao adicionar ao carrinho:', price);
        }
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

  // Fecha modal com a tecla Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModalFunc();
    }
  });
});

// Botão Finalizar no WhatsApp
document.addEventListener('DOMContentLoaded', () => {
  const checkoutButton = document.getElementById('checkout-whatsapp');
  checkoutButton.addEventListener('click', (e) => {
    if (cart.length === 0) {
      e.preventDefault();
      alert('Seu carrinho está vazio!');
      return;
    }
    // Abre em nova aba
    window.open(checkoutButton.href, '_blank');
  });
});

// Atualiza carrinho ao carregar a página e garante modal fechado
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

// Efeito de hover para produtos
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('mouseover', () => {
      product.classList.add('hover');
    });
    product.addEventListener('mouseout', () => {
      product.classList.remove('hover');
    });
  });
});