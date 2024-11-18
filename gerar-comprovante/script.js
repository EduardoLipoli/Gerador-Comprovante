const formData = JSON.parse(localStorage.getItem("formData"));

if (!formData) {
  alert(
    "Nenhum dado foi encontrado! Redirecionando para a página de preenchimento."
  );
  window.location.href = "/index.html";
} else {
  const contentDiv = document.getElementById("comprovante");

  // Formatar data para DD/MM/AAAA
  const formattedDate = new Date(formData.orderDate).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  );

  contentDiv.innerHTML = `
    <div class="header-section">
        <img src="/gerar-comprovante/logo.png" height="100" />
        <div>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Pedido:</strong> ${formData.orderNumber}</p>
        </div>
    </div>
    
    <div class="info-section mt-4 mb-4">
        <strong>Informações do Vendedor:</strong>
        <p><strong>${formData.sellerName}</strong></p>
        <p><strong>${formData.sellerPhone}</strong></p>
    </div>
    <div class="info-section mb-4">
    <div>
        <p><strong>${formData.clientName}</strong></p>
        <p>Telefone: ${formData.clientPhone}</p>
        <p>Endereço: ${formData.clientAddress}</p>
    </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço Unitário</th>
                <th>Desconto (%)</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${formData.products
              .map((product) => {
                const discount = product.discount || 0;
                const total =
                  product.quantity * product.price * (1 - discount / 100);

                return `
                    <tr>
                        <td class="break-word">${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>R$ ${Number(product.price).toFixed(2)}</td>
                        <td>${discount.toFixed(2)}%</td>
                        <td>R$ ${total.toFixed(2)}</td>
                    </tr>
                  `;
              })
              .join("")}
        </tbody>
    </table>
    <div class="totals-section mt-5">
        <p><strong>Forma de Pagamento:</strong> ${
          formData.paymentMethod === "credito"
            ? `Crédito (${formData.installments}x)`
            : formData.paymentMethod.charAt(0).toUpperCase() +
              formData.paymentMethod.slice(1)
        }</p>
        <p><strong>Desconto:</strong> R$ ${formData.products
          .reduce(
            (total, product) =>
              total +
              product.quantity *
                product.price *
                ((product.discount || 0) / 100),
            0
          )
          .toFixed(2)}</p>
        <p><strong>Total da Compra:</strong> R$ ${formData.products
          .reduce(
            (total, product) =>
              total +
              product.quantity *
                product.price *
                (1 - (product.discount || 0) / 100),
            0
          )
          .toFixed(2)}</p>
    </div>
  `;
}

document.getElementById("download-btn").addEventListener("click", () => {
  html2canvas(document.querySelector("#comprovante")).then((canvas) => {
    const link = document.createElement("a");
    link.download = "comprovante.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
