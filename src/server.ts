import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API funcionando!",
  });
});

app.post("/urls", (req, res) => {
  const { url } = req.body;

  res.json({
    originalUrl: url,
    message: "URL recebida com sucesso!",
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});