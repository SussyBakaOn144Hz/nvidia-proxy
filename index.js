import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const NVIDIA_KEY = process.env.NVIDIA_KEY;

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const body = { ...req.body };

    // Force correct NVIDIA model
    body.model = "z-ai/glm5";
    body.stream = false;

    const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVIDIA_KEY}`
      },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    res.status(r.status).send(text);

  } catch (e) {
    res.status(500).send(e.toString());
  }
});

app.listen(10000, () => console.log("NVIDIA proxy running"));
