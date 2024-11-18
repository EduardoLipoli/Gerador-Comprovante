// Função para atualizar os totais de cada produto
function updateProductTotal(row) {
  const quantity =
    parseFloat(row.querySelector(".product-quantity").value) || 0;
  const price = parseFloat(row.querySelector(".product-price").value) || 0;
  const discount =
    parseFloat(row.querySelector(".product-discount").value) || 0;

  // Cálculo correto do total considerando o desconto
  const total = quantity * price * (1 - discount / 100);

  // Atualiza o total na célula correspondente
  row.querySelector(".product-total").textContent = total.toFixed(2);
}

// Adicionar evento para recalcular o total quando os campos forem alterados
function addProductListeners(row) {
  const inputs = row.querySelectorAll(
    ".product-quantity, .product-price, .product-discount"
  );
  inputs.forEach((input) => {
    input.addEventListener("input", () => updateProductTotal(row));
  });
}

// Função para deletar um produto
function addDeleteListener(button) {
  button.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    row.remove(); // Remove a linha correspondente
  });
}

// Adicionar produto e configurar eventos de cálculo
document.getElementById("add-product").addEventListener("click", () => {
  const productList = document.getElementById("product-list");
  const newRow = document.createElement("tr");
  newRow.classList.add("product-item");
  newRow.innerHTML = `
          <td><input type="text" class="product-name" required></td>
          <td><input type="number" class="product-quantity" required></td>
          <td><input type="number" class="product-price" required></td>
          <td><input type="number" class="product-discount"></td>
          <td class="product-total">0.00</td>
                <td>
        <button type="button" class="btn btn-danger btn-sm delete-product"><i class="bi bi-trash"></i></button>
      </td>
        `;
  productList.appendChild(newRow);

  // Adicionar os listeners de cálculo automático
  addProductListeners(newRow);
  addDeleteListener(newRow.querySelector(".delete-product"));
});

// Função para deletar um produto
function addDeleteListener(button) {
  button.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    row.remove(); // Remove a linha correspondente
  });
}

// Adicionar listeners para as linhas existentes na inicialização
document.querySelectorAll(".product-item").forEach((row) => {
  addProductListeners(row);
});

document.getElementById("payment-method").addEventListener("change", (e) => {
  const creditOptions = document.getElementById("credit-options");
  if (e.target.value === "credito") {
    creditOptions.style.display = "block";
  } else {
    creditOptions.style.display = "none";
    document.getElementById("installments").value = "";
  }
});

// Gerar comprovante e armazenar os dados no localStorage
document.getElementById("dataForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    sellerName: document.getElementById("seller-name").value,
    sellerPhone: document.getElementById("seller-phone").value,
    clientName: document.getElementById("client-name").value,
    clientPhone: document.getElementById("client-phone").value,
    clientAddress: document.getElementById("client-address").value,
    orderNumber: document.getElementById("order-number").value,
    orderDate: document.getElementById("order-date").value,
    products: Array.from(document.querySelectorAll(".product-item")).map(
      (row) => {
        const quantity =
          parseFloat(row.querySelector(".product-quantity").value) || 0;
        const price =
          parseFloat(row.querySelector(".product-price").value) || 0;
        const discount =
          parseFloat(row.querySelector(".product-discount").value) || 0;
        const total = quantity * price * (1 - discount / 100);
        return {
          name: row.querySelector(".product-name").value,
          quantity,
          price,
          discount,
          total,
        };
      }
    ),
    paymentMethod: document.getElementById("payment-method").value,
    installments: document.getElementById("installments").value || 1,
  };

  localStorage.setItem("formData", JSON.stringify(formData));
  window.location.href = "/gerar-comprovante.html";
});
