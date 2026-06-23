import { useState } from "react";

export default function PaymentButton({
  title = "Produto Mateus Buarque",
  price = 25,
  quantity = 1,
  type = "produto",
  referenceId = "",
  className = "brutalist-btn w-full flex items-center justify-center gap-2 text-sm",
  children,
}) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    const numericPrice = Number(price || 0);

    if (!numericPrice || numericPrice <= 0) {
      alert("Preço inválido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: numericPrice,
          quantity: Number(quantity || 1),
          type,
          referenceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro Mercado Pago:", data);
        alert(data.error || "Erro ao criar pagamento.");
        return;
      }

      if (!data.init_point) {
        alert("O Mercado Pago não retornou o link de pagamento.");
        return;
      }

      window.location.href = data.init_point;
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? "Abrindo Mercado Pago..." : children || "Pagar com Pix ou Cartão"}
    </button>
  );
}
