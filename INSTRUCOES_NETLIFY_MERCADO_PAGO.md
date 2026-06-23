# Novo site com pagamentos Mercado Pago

Este pacote mantém o código do site e troca os pagamentos manuais por Mercado Pago nos três pontos principais:

- campanhas de financiamento coletivo;
- loja;
- assinaturas.

## Variáveis obrigatórias no Netlify

Em Netlify > Project configuration > Environment variables, coloque:

```txt
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_do_mercado_pago
SITE_URL=https://mateusbuarque.com.br
```

Opcional:

```txt
REACT_APP_MERCADOPAGO_PUBLIC_KEY=sua_public_key_do_mercado_pago
```

## Deploy no Netlify

Use este pacote em um novo repositório GitHub e conecte na Netlify.

O `netlify.toml` já configura:

```txt
Build command: cd frontend && npm install --legacy-peer-deps && npm install ajv@8 ajv-keywords@5 --legacy-peer-deps && CI=false npm run build
Publish directory: frontend/build
Functions directory: netlify/functions
```

Depois faça o deploy sem cache.

## O que testar

1. `/loja` — botão de pagamento em produto.
2. `/campaign/...` — botão nas recompensas da campanha.
3. `/assinatura` — botão nos planos de assinatura.

Todos devem abrir o checkout do Mercado Pago com Pix e cartão.
