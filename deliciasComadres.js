require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota da API
app.post("/enviar-pedido", (req, res) => {
  const { nome, itens, retirada } = req.body;

  if (!nome || !itens || !retirada) {
    return res.status(400).json({ error: "Nome, itens e retirada são obrigatórios." });
  }

  const listaItens = Array.isArray(itens)
    ? itens.map(item => item.trim()).filter(item => item.length > 0).join("\n")
    : itens.split("\n").map(item => item.trim()).filter(item => item.length > 0).join("\n");

  const mensagem = `Olá, meu nome é ${nome} e gostaria de confirmar o pedido:\n${listaItens}\nCom - ${retirada}`;
  const numeroWhatsApp = process.env.NUMERO_WHATSAPP;
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  res.json({ whatsappUrl: url });
});

// Porta dinâmica para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
