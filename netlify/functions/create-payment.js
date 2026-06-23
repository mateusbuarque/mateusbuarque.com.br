exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const { title, price, quantity, type, referenceId } = JSON.parse(event.body || "{}");

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "MERCADOPAGO_ACCESS_TOKEN não configurado no Netlify." }),
      };
    }

    const siteUrl = (process.env.SITE_URL || process.env.URL || "https://mateusbuarque.com.br").replace(/\/$/, "");
    const unitPrice = Number(price || 0);
    const qty = Number(quantity || 1);

    if (!unitPrice || unitPrice <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Preço inválido." }),
      };
    }

    const preference = {
      items: [
        {
          title: title || "Produto Mateus Buarque",
          quantity: qty,
          currency_id: "BRL",
          unit_price: unitPrice,
        },
      ],
      back_urls: {
        success: `${siteUrl}/pagamento-sucesso`,
        failure: `${siteUrl}/pagamento-erro`,
        pending: `${siteUrl}/pagamento-pendente`,
      },
      auto_return: "approved",
      external_reference: `${type || "pagamento"}:${referenceId || Date.now()}`,
      metadata: {
        type: type || "pagamento",
        reference_id: referenceId || "",
        source: "mateusbuarque-site",
      },
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Erro ao criar pagamento no Mercado Pago",
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", details: error.message }),
    };
  }
};
