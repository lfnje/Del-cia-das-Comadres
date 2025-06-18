let carrinho = [];
let todosProdutos = [];

fetch("produtos.json")
  .then(response => response.json())
  .then(produtos => {
    todosProdutos = produtos;
    mostrarProdutos(produtos);
  });

function mostrarProdutos(produtos) {
  const produtosContainer = document.getElementById("produtos");
  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.classList.add("produto");
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
    `;
    produtosContainer.appendChild(div);
  });
}

function adicionarAoCarrinho(id) {
  const produto = todosProdutos.find(p => p.id === id);
  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoContainer = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");
  const cartCount = document.getElementById("cart-count");

  carrinhoContainer.innerHTML = "";
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    totalItens += item.quantidade;

    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <div class="item-line">
        <span class="item-name">${item.nome}</span> - <span class="item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
      </div>
      <div>
        <button class="cart-btn minus" onclick="decrementar(${item.id})">−</button>
        <span class="item-qty">${item.quantidade}</span>
        <button class="cart-btn plus" onclick="incrementar(${item.id})">+</button>
        <button onclick="removerItem(${index})" aria-label="Remover item">
          <svg class="icon-trash" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                 a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
          </svg>
        </button>
      </div>
    `;
    carrinhoContainer.appendChild(li);
  });

  totalSpan.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  cartCount.textContent = totalItens;

  const carrinhoFormatado = carrinho.map(item => `${item.nome} (${item.quantidade})`);
  localStorage.setItem("carrinho", JSON.stringify(carrinhoFormatado));

  atualizarEstadoBotaoSeguir();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function incrementar(id) {
  const item = carrinho.find(p => p.id === id);
  if (item) {
    item.quantidade += 1;
    atualizarCarrinho();
  }
}

function decrementar(id) {
  const item = carrinho.find(p => p.id === id);
  if (item && item.quantidade > 1) {
    item.quantidade -= 1;
  } else {
    const index = carrinho.findIndex(p => p.id === id);
    if (index !== -1) {
      carrinho.splice(index, 1);
    }
  }
  atualizarCarrinho();
}

document.getElementById("toggle-cart").addEventListener("click", () => {
  document.getElementById("carrinho").classList.toggle("hidden");
});

function irParaFormulario() {
  const itens = [];
  const elementos = document.querySelectorAll('#cart-items li');

  elementos.forEach(el => {
    const nome = el.querySelector('.item-name').textContent.trim();
    const quantidade = el.querySelector('.item-qty').textContent.trim();
    itens.push(`${nome} (x ${quantidade})`);
  });

  localStorage.setItem("carrinho", JSON.stringify(itens));
  window.location.href = "formDelicias.html";
}

function atualizarEstadoBotaoSeguir() {
  const seguirBtn = document.getElementById('seguir-btn');
  if (seguirBtn) {
    seguirBtn.disabled = carrinho.length === 0;
  }
}

// ✅ Atualiza o estado do botão ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  atualizarEstadoBotaoSeguir();
});