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

document.getElementById("add-product").addEventListener("click", () => {
  const productList = document.getElementById("product-list");

  // Linha para descrição
  const descriptionRow = document.createElement("tr");
  descriptionRow.classList.add("product-item");
  descriptionRow.innerHTML = `
    <td colspan="5">
      <input type="text" class="product-name" placeholder="Descrição do produto" required />
    </td>
  `;
  productList.appendChild(descriptionRow);

  // Linha para os demais campos
  const detailRow = document.createElement("tr");
  detailRow.classList.add("product-item");
  detailRow.innerHTML = `
    <td><input type="number" class="product-quantity" placeholder="Quant." required /></td>
    <td><input type="text" class="product-price" placeholder="Valor" required /></td>
    <td><input type="text" class="product-discount" placeholder="Desconto" /></td>
    <td class="product-total">0.00</td>
    <td>
      <button type="button" class="btn btn-danger btn-sm delete-product" title="Remover Produto">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;
  productList.appendChild(detailRow);

  // Adicionar os listeners de cálculo automático e remoção
  addProductListeners(detailRow);
  addDeleteListener(detailRow.querySelector(".delete-product"));
});

// Função para deletar um produto
function addDeleteListener(button) {
  button.addEventListener("click", (e) => {
    // Localiza a linha atual (detalhes do produto)
    const detailRow = e.target.closest("tr");

    // Localiza a linha anterior (descrição do produto)
    const descriptionRow = detailRow.previousElementSibling;

    // Remove ambas as linhas (descrição e detalhes)
    if (descriptionRow && descriptionRow.classList.contains("product-item")) {
      descriptionRow.remove();
    }
    detailRow.remove();
  });
}

// Adicionar os listeners de cálculo automático aos produtos existentes
document.querySelectorAll(".product-item").forEach((row) => {
  addProductListeners(row);
});

document.getElementById("payment-method").addEventListener("change", (e) => {
  const paymentMethod = e.target.value;
  const creditOptions = document.getElementById("credit-options");
  const discountedTotalDisplay = document.getElementById("discounted-total");
  const totalWithDiscountElement = document.getElementById(
    "total-with-discount"
  );

  // Esconde opções de parcelas por padrão
  creditOptions.style.display = "none";
  discountedTotalDisplay.style.display = "none";

  // Obtém o total atual da compra
  const total = Array.from(document.querySelectorAll(".product-total")).reduce(
    (acc, totalCell) => acc + parseFloat(totalCell.textContent || 0),
    0
  );

  if (paymentMethod === "credito") {
    // Mostra as opções de parcelas
    creditOptions.style.display = "block";
  } else if (
    paymentMethod === "debito" ||
    paymentMethod === "pix" ||
    paymentMethod === "dinheiro"
  ) {
    // Aplica 10% de desconto
    const totalWithDiscount = total * 0.95;

    // Mostra o total com desconto
    totalWithDiscountElement.textContent = totalWithDiscount.toFixed(2);
    discountedTotalDisplay.style.display = "block";
  }

  // Reseta o valor de parcelas se não for crédito
  if (paymentMethod !== "credito") {
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
    ordemObservation: document.getElementById("order-observation").value,
    products: Array.from(document.querySelectorAll(".product-item"))
      .filter((row) => row.querySelector(".product-quantity")) // Filtra apenas as linhas com campos numéricos
      .map((row) => {
        const quantity =
          parseFloat(row.querySelector(".product-quantity").value) || 0;
        const price =
          parseFloat(row.querySelector(".product-price").value) || 0;
        const discount =
          parseFloat(row.querySelector(".product-discount").value) || 0;
        const total = quantity * price * (1 - discount / 100);
        return {
          name: row.previousElementSibling.querySelector(".product-name").value, // Busca a descrição na linha anterior
          quantity,
          price,
          discount,
          total,
        };
      }),
    paymentMethod: document.getElementById("payment-method").value,
    installments: document.getElementById("installments").value || 1,
  };

  localStorage.setItem("formData", JSON.stringify(formData));
  window.location.href = "/gerar-comprovante.html";
});
