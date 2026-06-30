import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const USERS_FILE = path.join(process.cwd(), "users.json");

// Simple JSON helper functions
function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading users.json:", e);
  }
  return {};
}

function writeUsers(users: any) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing users.json:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON parse middleware
  app.use(express.json());

  // Simple registration/login endpoint
  app.post("/api/auth/login", (req, res) => {
    try {
      const { username, currentLocalProgress } = req.body;
      if (!username || typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ error: "小名不能为空哦！" });
      }

      const trimmedName = username.trim();
      const lowerKey = trimmedName.toLowerCase();
      const users = readUsers();

      if (users[lowerKey]) {
        // User exists, log them in and return progress
        console.log(`[Auth] User logged in: ${trimmedName}`);
        return res.json({
          success: true,
          isNew: false,
          username: users[lowerKey].display,
          progress: users[lowerKey].progress
        });
      } else {
        // User doesn't exist, create automatically
        const progress = currentLocalProgress || {
          completedLevels: {},
          stars: {},
          unlockedWorlds: ["chicken_rabbit", "tang_poetry"],
          totalScore: 0
        };

        users[lowerKey] = {
          display: trimmedName,
          progress
        };
        writeUsers(users);
        console.log(`[Auth] Registered new user: ${trimmedName}`);
        return res.json({
          success: true,
          isNew: true,
          username: trimmedName,
          progress
        });
      }
    } catch (e: any) {
      console.error("Auth error:", e);
      return res.status(500).json({ error: e.message || "服务器开小差啦！" });
    }
  });

  // Sync progress endpoint
  app.post("/api/user/progress", (req, res) => {
    try {
      const { username, progress } = req.body;
      if (!username || !progress) {
        return res.status(400).json({ error: "参数不完整哦！" });
      }

      const lowerKey = username.trim().toLowerCase();
      const users = readUsers();

      if (!users[lowerKey]) {
        return res.status(404).json({ error: "找不到该账号哦，请重新登录！" });
      }

      // Update progress
      users[lowerKey].progress = progress;
      writeUsers(users);
      console.log(`[Sync] Progress updated for: ${users[lowerKey].display}`);
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Progress sync error:", e);
      return res.status(500).json({ error: e.message || "同步失败啦！" });
    }
  });

  // Server-side Gemini AI client initialization
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI Tutor chat will fail until key is configured.");
  }

  // API endpoint for math tutoring explanation
  app.post("/api/explain", async (req, res) => {
    try {
      const { prompt, context } = req.body;

      if (!ai) {
        return res.status(500).json({
          error: "Gemini client is not initialized because GEMINI_API_KEY is missing.",
          answer: "哎呀，我的魔法晶石（API密钥）还没准备好，现在没办法帮你算题呢。你可以让爸爸妈妈检查一下 Secrets 配置哦！🐾"
        });
      }

      const systemInstruction = `
        你是一个专门面向 6-10 岁儿童的趣味启蒙奥数老师。
        名字叫“奥数精灵小奥”。
        你的任务是：
        1. 以非常温柔、活泼、充满童趣、鼓励性的语气解答孩子们的数学提问。
        2. 使用生动的日常比喻（如苹果、兔子、糖果、排队）和丰富的emoji表情。
        3. 绝对不要给出深奥难懂的代数公式或方程式，尽量用一步步直观数数或画画的逻辑去引导。
        4. 如果有当前奥数题目的上下文，请结合该题目给孩子以启发。
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${context ? `[背景上下文: ${context}] \n` : ""}问: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 1.0,
        }
      });

      const text = response.text || "哎呀，刚才有一只小松鼠叼走了我的思路，没想出来，请你再说一遍吧！🌰";
      return res.json({ answer: text });
    } catch (error: any) {
      console.error("Gemini API Error in server:", error);
      return res.status(500).json({
        error: error.message || "Internal server error",
        answer: "哎呀，我的魔法杖好像卡住啦。你可以试着动手推一下天平或者移一下火柴棒，也许就想通啦！✨"
      });
    }
  });

  // API endpoint for Text-to-Speech using high-quality Google Translate TTS with Gemini Fallback
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Text is required for TTS." });
      }

      console.log(`Generating TTS Base64 for: "${text}"`);

      // 1. Try Google Translate TTS first - sweet Chinese female voice, extremely fast and reliable
      try {
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encodeURIComponent(text)}`;
        const response = await fetch(ttsUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://translate.google.com/"
          }
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64Audio = Buffer.from(arrayBuffer).toString("base64");
          return res.json({ audio: base64Audio, format: "mp3" });
        } else {
          console.warn(`Google Translate TTS failed with status ${response.status}. Falling back to Gemini TTS.`);
        }
      } catch (googleError) {
        console.warn("Google Translate TTS failed, falling back to Gemini:", googleError);
      }

      // 2. Fallback to Gemini 3.1 TTS model
      if (!ai) {
        return res.status(500).json({
          error: "Gemini client is not initialized because GEMINI_API_KEY is missing."
        });
      }

      const validVoices = ["Puck", "Charon", "Kore", "Fenrir", "Zephyr"];
      const selectedVoice = validVoices.includes(voice) ? voice : "Kore";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        return res.status(500).json({ error: "Failed to generate speech audio from Gemini." });
      }

      return res.json({ audio: base64Audio, format: "pcm" });
    } catch (error: any) {
      console.error("TTS API Error in server:", error);
      return res.status(500).json({
        error: error.message || "Internal server error during TTS generation."
      });
    }
  });

  // Direct MP3 Audio Stream Proxy for HTML5 <audio> tag elements - highly compatible with mobile Safari/Chrome
  app.get("/api/tts/stream", async (req, res) => {
    try {
      const text = req.query.text as string;
      if (!text) {
        return res.status(400).send("Text is required for TTS stream.");
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (response.ok) {
        res.setHeader("Content-Type", "audio/mpeg");
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      } else {
        console.warn(`Google Translate TTS stream failed with status ${response.status}`);
        return res.status(500).send("TTS stream retrieval failed.");
      }
    } catch (error: any) {
      console.error("Error in TTS stream endpoint:", error);
      return res.status(500).send(error.message || "Internal server error");
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static assets in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server is successfully running at http://localhost:${PORT}`);
  });
}

startServer();
