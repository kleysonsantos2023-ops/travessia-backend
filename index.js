index.js
import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

app.get("/", (req, res) => {
  res.send("Backend Travessia Fácil rodando");
});

app.post("/criar-pix", async (req, res) => {
  const payment = await mercadopago.payment.create({
    transaction_amount: 10,
    description: "Passagem Travessia Fácil",
    payment_method_id: "pix",
    payer: { email: "teste@teste.com" }
  });

  res.json(payment.body.point_of_interaction.transaction_data);
});

app.post("/webhook", async (req, res) => {
  const paymentId = req.body.data.id;
  const payment = await mercadopago.payment.get(paymentId);

  if (payment.body.status === "approved") {
    console.log("PAGAMENTO CONFIRMADO → LIBERAR PASSAGEM");
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
