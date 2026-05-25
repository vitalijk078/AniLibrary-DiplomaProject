import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3001;
const SHIKIMORI_API_URL = "https://shikimori.one/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);

app.use(express.json());

app.use("/api", async (request, response) => {
  try {
    const targetUrl = `${SHIKIMORI_API_URL}${request.url}`;

    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Accept: "application/json",
        "User-Agent": "AnimeHub/1.0",
      },
    });

    const contentType = apiResponse.headers.get("content-type") || "application/json";
    const body = await apiResponse.text();

    response.status(apiResponse.status);
    response.setHeader("Content-Type", contentType);
    response.send(body);
  } catch (error) {
    console.error("Proxy error:", error);

    response.status(502).json({
      message: "Не удалось получить данные от внешнего источника.",
    });
  }
});

app.use(express.static(distPath));

app.get("*", (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AnimeHub proxy server started: http://localhost:${PORT}`);
});
