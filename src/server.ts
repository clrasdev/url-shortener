import "dotenv/config";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const app = express();

app.use(express.json());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API funcionando!",
  });
});

app.post("/urls", async (req, res) => {
 const { url } = req.body;

if (typeof url !== "string" || !URL.canParse(url)) {
  return res.status(400).json({
    message: "URL inválida",
  });
}

const shortCode = Math.random().toString(36).substring(2, 8);
  const createdUrl = await prisma.url.create({
    data: {
      originalUrl: url,
      shortCode,
    },
  });

  res.status(201).json(createdUrl);
});

app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  const url = await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });

  if (!url) {
    return res.status(404).json({
      message: "URL não encontrada",
    });
  }

  res.redirect(url.originalUrl);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});