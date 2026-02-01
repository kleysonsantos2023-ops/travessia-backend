import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend Travessia Fácil rodando");
});

// Criar pagamento PIX
app.post("/criar-pix", async (req, res) => {
  try {
    const payment = await mercadopago.payment.create({
      transaction_amount: 10,
      description: "Passagem Travessia Fácil",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    });

    res.json(payment.body.point_of_interaction.transaction_data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pagamento PIX" });
  }
});

// Webhook para confirmação de pagamento
app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.body.data.id;
    const payment = await mercadopago.payment.get(paymentId);

    if (payment.body.status === "approved") {
      console.log("✅ PAGAMENTO CONFIRMADO — LIBERAR PASSAGEM");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

// Porta (Render usa 3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
      
