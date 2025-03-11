// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Carga variables de entorno (si usas un archivo .env)
dotenv.config();

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea la app de Express
const app = express();

// Sirve los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Endpoint para obtener un token efímero de la Realtime API
app.get("/session", async (req, res) => {
  try {
    // Asegúrate de que process.env.OPENAI_API_KEY esté definido
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "OPENAI_API_KEY no está configurado en las variables de entorno",
      });
    }

    // Solicita un token efímero a la Realtime API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Cambia el modelo o la voz si deseas
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "ash", // Para recibir audio de respuesta
      }),
    });

    const data = await response.json();

    // Envía la respuesta al cliente (contiene client_secret.value)
    res.json(data);
  } catch (error) {
    console.error("Error al crear sesión Realtime:", error);
    res.status(500).json({ error: "No se pudo crear la sesión Realtime" });
  }
});

// Inicia el servidor en el puerto 3000 (o el que definas)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
