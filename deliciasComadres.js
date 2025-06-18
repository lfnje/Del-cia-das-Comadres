require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota: Enviar pedido via WhatsApp
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

  if (!numeroWhatsApp) {
    return res.status(500).json({ error: "Número do WhatsApp não configurado." });
  }

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  res.json({ whatsappUrl: url });
});

// Rota: Servir produtos a partir de produtos.json
app.get("/produtos", (req, res) => {
  const filePath = path.join(__dirname, "public", "produtos.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler produtos.json:", err);
      return res.status(500).json({ error: "Erro ao carregar os produtos." });
    }
    try {
      const produtos = JSON.parse(data);
      res.json(produtos);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      res.status(500).json({ error: "Erro ao interpretar os dados dos produtos." });
    }
  });
});

// Porta dinâmica para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
