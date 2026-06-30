import React, { useState, useEffect, useRef } from "react";
import { Star, Home, ArrowRight, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, HelpCircle, ArrowLeft, Play, Pause, Headphones, User, LogOut } from "lucide-react";
import { WorldId, Level, UserProgress, Subject } from "./types";
import { WORLDS_DATA } from "./data/worlds";
import { LevelMap } from "./components/LevelMap";
import { MascotElf } from "./components/MascotElf";
import { SoundEffects } from "./components/SoundEffects";

// Games
import { ChickenRabbitGame } from "./components/games/ChickenRabbitGame";
import { MatchstickGame } from "./components/games/MatchstickGame";
import { TreePlantingGame } from "./components/games/TreePlantingGame";
import { QueueGame } from "./components/games/QueueGame";
import { SumDiffGame } from "./components/games/SumDiffGame";
import { PatternGame } from "./components/games/PatternGame";
import { AgePuzzleGame } from "./components/games/AgePuzzleGame";
import { OverlappingGame } from "./components/games/OverlappingGame";
import { ReverseSolveGame } from "./components/games/ReverseSolveGame";
import { LogicGridGame } from "./components/games/LogicGridGame";
import { ProfitLossGame } from "./components/games/ProfitLossGame";
import { MeetingChaseGame } from "./components/games/MeetingChaseGame";
import { PigeonholeGame } from "./components/games/PigeonholeGame";
import { ShapeCountingGame } from "./components/games/ShapeCountingGame";
import { PermutationGame } from "./components/games/PermutationGame";
import { MagicSquareGame } from "./components/games/MagicSquareGame";
import { ClockAngleGame } from "./components/games/ClockAngleGame";
import { BinaryScoreGame } from "./components/games/BinaryScoreGame";
import { TruthLiarGame } from "./components/games/TruthLiarGame";
import { WaterPouringGame } from "./components/games/WaterPouringGame";
import { TangPoetryGame } from "./components/games/TangPoetryGame";
import { SimpleOlympiadQuiz } from "./components/games/SimpleOlympiadQuiz";
import { getRandomizedLevel } from "./utils/randomizer";
import { smoothScrollTo, smoothScrollElementIntoView } from "./utils/scroll";

const DEFAULT_PROGRESS: UserProgress = {
  completedLevels: {},
  stars: {},
  unlockedWorlds: [WorldId.ChickenRabbit, WorldId.TangPoetry], // Start with first math world and poetry world unlocked
  totalScore: 0
};

export default function App() {
  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.Math);
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isMuted, setIsMuted] = useState(false);

  // Simple Registration and Login State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loginInput, setLoginInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Success celebration modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [gainedStars, setGainedStars] = useState(3);

  // TTS (Text-to-Speech) State
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.03); // Sweet young female voice pitch by default (1.03 is clear and natural)
  const [isUsingGeminiVoice, setIsUsingGeminiVoice] = useState(false);

  // Audio refs for Gemini TTS
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);
  const isProceedingRef = useRef(false);

  // Cleanup Web Audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Floating helper bubble state
  const [helperSpeech, setHelperSpeech] = useState("嗨！我是奥数精灵小奥。点击世界，和我一起开启奇妙的数学冒险吧！🌟");
  const [mascotExpression, setMascotExpression] = useState<"idle" | "happy" | "thinking" | "sad">("idle");
  useEffect(() => {
    const savedUser = localStorage.getItem("kids_olympiad_user");
    const savedProgress = localStorage.getItem("kids_olympiad_progress");
    
    // First, restore local progress if it exists so the UI feels fast
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (!parsed.unlockedWorlds || parsed.unlockedWorlds.length === 0) {
          parsed.unlockedWorlds = [WorldId.ChickenRabbit, WorldId.TangPoetry];
        } else if (!parsed.unlockedWorlds.includes(WorldId.TangPoetry)) {
          parsed.unlockedWorlds.push(WorldId.TangPoetry);
        }
        setUserProgress(parsed);
      } catch (e) {
        console.error("Error parsing local progress:", e);
      }
    }

    if (savedUser) {
      setCurrentUser(savedUser);
      setHelperSpeech(`✨ 欢迎回来，亲爱的 ${savedUser}！正在同步你的闯关档案...`);
      // Pull down latest server-side progress
      setAuthLoading(true);
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: savedUser })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Server error");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.progress) {
            setUserProgress(data.progress);
            localStorage.setItem("kids_olympiad_progress", JSON.stringify(data.progress));
            setHelperSpeech(`✨ 同步成功！亲爱的 ${savedUser}，今天想挑战哪一关呢？🌸`);
          }
        })
        .catch((err) => {
          console.warn("Failed to sync server progress on mount, using local data:", err);
          setHelperSpeech(`✨ 网络有点慢，已加载本地进度。亲爱的 ${savedUser}，让我们继续挑战吧！🌸`);
        })
        .finally(() => {
          setAuthLoading(false);
        });
    } else {
      setHelperSpeech("嗨！我是奥数精灵小奥。输入你的小名，和我一起开启奇妙的数学冒险吧！🌟");
    }
  }, []);

  // Helper to fetch voices asynchronously to avoid empty list on mobile Safari/Chrome
  const getVoicesAsync = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve([]);
        return;
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      
      const handleVoicesChanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        if (updatedVoices.length > 0) {
          window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
          resolve(updatedVoices);
        }
      };
      
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const currentVoices = window.speechSynthesis.getVoices();
        if (currentVoices.length > 0 || attempts > 20) {
          clearInterval(interval);
          window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
          resolve(currentVoices);
        }
      }, 50);
    });
  };

  // Voice Read Aloud (High-Fidelity Chinese Female Voice with HTML5 streaming and Web Speech Fallback)
  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // 1. Stop all current speech and fetch requests immediately
      stopSpeaking();

      if (isMuted) {
        resolve();
        return;
      }

      // Clean up text for TTS (remove brackets, math symbols, emoji markers that sound weird in spoken Chinese)
      const cleanedText = text
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
        .replace(/[❌❓⭐🪙🌟🎉🐥🪵🌳🐼🍎🟣💡🗺️🚀🔒🧩💪👀✨🎈]/g, "")
        .replace(/[【】\[\]（）()]/g, " ") // Clean brackets to prevent reading them out or causing awkward pauses
        .replace(/A/g, "甲")
        .replace(/B/g, "乙")
        .replace(/C/g, "丙")
        .replace(/=/g, "等于")
        .replace(/\+/g, "加上")
        .replace(/-/g, "减去")
        .replace(/\*/g, "乘以")
        .replace(/\//g, "除以");

      try {
        setIsPlayingSpeech(true);
        setIsUsingGeminiVoice(true);

        if (!globalAudioRef.current) {
          globalAudioRef.current = new Audio();
        }

        const audio = globalAudioRef.current;
        // Point directly to our high-fidelity backend audio stream
        audio.src = `/api/tts/stream?text=${encodeURIComponent(cleanedText)}`;
        
        audio.onplay = () => {
          setIsPlayingSpeech(true);
        };
        
        audio.onended = () => {
          setIsPlayingSpeech(false);
          resolve();
        };
        
        audio.onerror = (e) => {
          console.warn("HTML5 audio stream failed, falling back to Web Speech:", e);
          fallbackToWebSpeech(cleanedText).then(resolve);
        };

        // Try to play
        audio.play().catch((err) => {
          console.warn("Autoplay or playback interrupted on mobile, falling back to Web Speech:", err);
          fallbackToWebSpeech(cleanedText).then(resolve);
        });
      } catch (err) {
        console.warn("Failed to set up HTML5 audio, falling back to Web Speech:", err);
        fallbackToWebSpeech(cleanedText).then(resolve);
      }
    });
  };

  // --- FALLBACK: Web Speech Synthesis ---
  const fallbackToWebSpeech = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsUsingGeminiVoice(false);
      
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsPlayingSpeech(false);
        resolve();
        return;
      }

      // Unstick Web Speech synthesis
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        console.error("Failed to unstick speechSynthesis:", e);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Prevent garbage collection
      utterance.lang = "zh-CN";
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

      // Select best voice
      getVoicesAsync().then((voices) => {
        const zhVoices = voices.filter(
          (v) =>
            v.lang.toLowerCase().startsWith("zh") ||
            v.lang.toLowerCase().includes("zh-") ||
            v.lang.toLowerCase().includes("zh_")
        );

        let bestVoice: SpeechSynthesisVoice | null = null;
        let maxScore = -9999;

        zhVoices.forEach((v) => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase();
          let score = 0;

          if (lang.includes("cn") || lang.includes("zh_cn")) {
            score += 30;
          } else if (lang.includes("tw") || lang.includes("hk")) {
            score += 15;
          }

          const femaleKeywords = [
            "xiaoxiao", "tingting", "ting-ting", "yaoyao", "huihui", "meijia", "mei-jia", 
            "lili", "hanhan", "yating", "siri", "xiaorui", "xiaoyi", "xiaoshuang", "xiaochen",
            "xiaoyan", "female", "girl", "lady", "woman", "nü", "sweet", "natural", "lulu", "shanshan",
            "x-sf", "x-sfg", "x-cnd", "x-cf", "x-ssc"
          ];
          femaleKeywords.forEach((keyword) => {
            if (name.includes(keyword)) {
              score += 40;
            }
          });

          const maleKeywords = [
            "yunyang", "yunjian", "yunxi", "yunye", "yunhe", "yunze", "kangkang", "zhiwei", 
            "lidong", "kuan", "male", "man", "boy", "gentleman", "nan",
            "x-sm", "x-md", "x-m-", "-male"
          ];
          maleKeywords.forEach((keyword) => {
            if (name.includes(keyword)) {
              score -= 150;
            }
          });

          if (name.includes("online") || name.includes("natural")) {
            score += 20;
          }

          if (name.includes("microsoft") || name.includes("apple") || name.includes("google")) {
            score += 5;
          }

          if (score > maxScore) {
            maxScore = score;
            bestVoice = v;
          }
        });

        const sweetVoice = bestVoice || zhVoices[0] || voices.find((v) => v.lang.toLowerCase().includes("zh"));

        if (sweetVoice) {
          utterance.voice = sweetVoice;
        }

        utterance.onstart = () => setIsPlayingSpeech(true);
        utterance.onend = () => {
          setIsPlayingSpeech(false);
          utteranceRef.current = null;
          resolve();
        };
        utterance.onerror = () => {
          setIsPlayingSpeech(false);
          utteranceRef.current = null;
          resolve();
        };

        window.speechSynthesis.speak(utterance);

        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch (e) {}
      });
    });
  };

  // Dual-format high-fidelity play helper (supports both Base64 MP3 decoding and raw PCM decoding)
  const playGeminiAudioBuffer = async (base64Data: string, format: "mp3" | "pcm" = "mp3"): Promise<boolean> => {
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        try {
          audioContextRef.current = new AudioContextClass();
        } catch (e) {
          console.warn("Failed to construct AudioContext:", e);
          return false;
        }
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch (e) {
          console.warn("Failed to resume AudioContext:", e);
        }
      }

      if (ctx.state === "suspended") {
        console.warn("AudioContext remains suspended. Skipping Web Audio playback.");
        return false;
      }

      if (format === "mp3") {
        // High-speed native MP3 decoding (supports Google Translate TTS base64)
        const decodedBuffer = await ctx.decodeAudioData(bytes.buffer);
        const source = ctx.createBufferSource();
        source.buffer = decodedBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setIsPlayingSpeech(false);
          setIsUsingGeminiVoice(false);
        };
        
        audioSourceRef.current = source;
        source.start(0);
        return true;
      } else {
        // Raw PCM 16-bit 24kHz fallback decoding (supports Gemini model response)
        const numSamples = len / 2;
        const int16Array = new Int16Array(bytes.buffer);
        const sampleRate = 24000;
        
        const buffer = ctx.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
          channelData[i] = int16Array[i] / 32768.0;
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setIsPlayingSpeech(false);
          setIsUsingGeminiVoice(false);
        };
        
        audioSourceRef.current = source;
        source.start(0);
        return true;
      }
    } catch (err) {
      console.error("Error decoding or playing Audio buffer:", err);
      return false;
    }
  };

  const stopSpeaking = () => {
    // 1. Cancel active AbortController
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }

    // 2. Stop HTML5 Streaming Audio player
    if (globalAudioRef.current) {
      try {
        globalAudioRef.current.pause();
        globalAudioRef.current.currentTime = 0;
      } catch (e) {}
    }

    // 3. Stop Web Speech speechSynthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        console.warn("Failed to cancel speechSynthesis:", e);
      }
    }
    
    // 4. Stop Web Audio buffers
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch (e) {}
      audioSourceRef.current = null;
    }

    utteranceRef.current = null;
    setIsPlayingSpeech(false);
    setIsUsingGeminiVoice(false);
  };

  // Sync helper speech when activeWorld or activeLevel changes
  useEffect(() => {
    stopSpeaking();

    if (activeLevel) {
      if (activeWorldId === WorldId.TangPoetry) {
        setHelperSpeech(`【当前唐诗】：${activeLevel.title}。请重复跟读，或者点击‘语音识别考考我’进行背诵考试哦！🏮`);
      } else {
        setHelperSpeech(`【当前题目】：${activeLevel.title}。${activeLevel.question}`);
      }
      setMascotExpression("thinking");
      
      // Auto play question voice on entering level after a tiny delay
      const timer = setTimeout(() => {
        if (activeWorldId === WorldId.TangPoetry) {
          speakText(`《${activeLevel.title}》，${activeLevel.data?.author || "唐诗"}。请跟读，大声读出整首诗过关！`);
        } else {
          speakText(`第${activeLevel.name.split(" ")[1]}关。${activeLevel.title}。${activeLevel.question}`);
        }
      }, 600);
      return () => clearTimeout(timer);
    } else if (activeWorldId) {
      const world = WORLDS_DATA.find((w) => w.id === activeWorldId);
      if (activeWorldId === WorldId.TangPoetry) {
        const speech = `欢迎来到【${world?.name}】！这里一共有 ${world?.levels.length || 10} 首经典的唐诗在等着你挑战。大声跟读并背诵通过吧！`;
        setHelperSpeech(speech);
      } else {
        const speech = `欢迎来到【${world?.name}】！这里一共有 ${world?.levels.length || 3} 个神奇的奥数关卡在等着你挑战。点击粉红色关卡气泡出发吧！`;
        setHelperSpeech(speech);
      }
      setMascotExpression("idle");
    } else {
      if (activeSubject === Subject.Chinese) {
        setHelperSpeech("嗨！我是国学精灵。点击选择下方的【唐诗三百首】小岛，和我一起开启奇妙的古诗朗读与背诵背诗冒险吧！🏮");
      } else {
        setHelperSpeech("嗨！我是奥数精灵小奥。点击选择下方任意一个小岛，和我一起开启奇妙的数学冒险吧！每个岛屿都有一种经典题型哦！🌟");
      }
      setMascotExpression("idle");
    }
  }, [activeWorldId, activeLevel, activeSubject]);

  // Automatically scroll to the question box when entering a level, or to the top when switching worlds/subjects
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeLevel) {
        // Wait a brief moment to ensure the DOM has updated and element is rendered
        setTimeout(() => {
          const element = document.getElementById("game-question-box");
          if (element) {
            smoothScrollElementIntoView(element, "start", 1000); // 1000ms duration for gentle, smooth transition
          } else {
            smoothScrollTo(0, 1000);
          }
        }, 120);
      } else {
        smoothScrollTo(0, 800);
      }
    }
  }, [activeLevel?.id, activeWorldId, activeSubject]);

  // Voice listener and AudioContext auto-unlocker (optimized for mobile Safari/iOS)
  useEffect(() => {
    const handleVoicesChanged = () => {};
    
    const unlockAudio = () => {
      // 1. Initialize and resume AudioContext synchronously inside user touch/click gesture
      if (typeof window !== "undefined") {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          if (!audioContextRef.current || audioContextRef.current.state === "closed") {
            try {
              audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
            } catch (e) {
              console.warn("Failed to init AudioContext on gesture:", e);
            }
          }
          if (audioContextRef.current && audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume().catch((err) => console.warn("Failed to resume context on gesture:", err));
          }
        }
      }

      // 2. Play a silent dummy speech synthesis to trigger TTS voice loading on mobile
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          const silentUtterance = new SpeechSynthesisUtterance("");
          silentUtterance.volume = 0;
          window.speechSynthesis.speak(silentUtterance);
        } catch (e) {
          console.warn("Failed to trigger silent speech:", e);
        }
      }

      // Remove handlers so we only trigger this once on first user gesture
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      }
      window.addEventListener("click", unlockAudio);
      window.addEventListener("touchstart", unlockAudio);
    }

    return () => {
      if (typeof window !== "undefined") {
        if (window.speechSynthesis) {
          window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
          window.speechSynthesis.cancel();
        }
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      }
    };
  }, []);

  // Save progress helper and background synchronization
  const saveProgress = (newProgress: UserProgress, usernameToSync?: string) => {
    setUserProgress(newProgress);
    localStorage.setItem("kids_olympiad_progress", JSON.stringify(newProgress));
    
    const user = usernameToSync || currentUser;
    if (user) {
      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, progress: newProgress })
      }).catch((err) => {
        console.warn("Failed to sync progress to server:", err);
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setAuthError("小名不能为空哦！");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginInput.trim(),
          currentLocalProgress: userProgress
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "登录失败啦！");
      }
      
      if (data.success) {
        SoundEffects.playClick();
        setCurrentUser(data.username);
        setUserProgress(data.progress);
        localStorage.setItem("kids_olympiad_user", data.username);
        localStorage.setItem("kids_olympiad_progress", JSON.stringify(data.progress));
        
        if (data.isNew) {
          setHelperSpeech(`🎉 哇！新创作者 ${data.username} 诞生啦！专属档案已建好，开始奥数探险吧！🚀`);
        } else {
          setHelperSpeech(`✨ 欢迎回来，${data.username}！我们要开始奇妙的数学冒险啦！🌟`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "登录失败，请重试！");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    SoundEffects.playClick();
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    SoundEffects.playClick();
    setCurrentUser(null);
    setLoginInput("");
    setUserProgress(DEFAULT_PROGRESS);
    localStorage.removeItem("kids_olympiad_user");
    localStorage.setItem("kids_olympiad_progress", JSON.stringify(DEFAULT_PROGRESS));
    setHelperSpeech("嗨！我是奥数精灵小奥。输入你的名字，和我一起开启奇妙的数学冒险吧！🌟");
    stopSpeaking();
    setShowLogoutConfirm(false);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    SoundEffects.playClick();
    if (nextMuted) {
      stopSpeaking();
    }
  };

  const handleSelectWorld = (worldId: WorldId | null) => {
    setActiveWorldId(worldId);
    setActiveLevel(null);
  };

  const handleSelectLevel = (level: Level) => {
    isProceedingRef.current = false;
    setActiveLevel(getRandomizedLevel(level));
  };

  // Called when level puzzle resolves correctly
  const handleLevelSolved = (stars: number) => {
    isProceedingRef.current = false;
    setGainedStars(stars);
    setShowSuccessModal(true);
    setMascotExpression("happy");
    
    const solvedSpeech = `哇！真了不起！你已经解开这道奥数题了。来，看看我的原理解析：${activeLevel?.explanation}`;
    setHelperSpeech(solvedSpeech);
    
    stopSpeaking();
    // Celebrate speaking
    setTimeout(() => {
      speakText(`真了不起！你通关成功啦！原理解析是：${activeLevel?.explanation}`);
    }, 1000);

    if (isMuted) return;
    SoundEffects.playWin();
  };

  // Called when level puzzle is answered incorrectly
  const handleLevelFailed = () => {
    if (!activeLevel) return;

    // Find the original template to re-randomize
    const currentWorld = WORLDS_DATA.find((w) => w.id === activeWorldId);
    const originalTemplate = currentWorld?.levels.find((l) => l.id === activeLevel.id);

    if (originalTemplate) {
      const newRandomLevel = getRandomizedLevel(originalTemplate);
      setActiveLevel(newRandomLevel);

      setMascotExpression("thinking");
      const failedSpeech = "哎呀，答错啦！为了防止死记硬背或反复试错，小奥已经为你重新随机了新数据，再仔细算一算哦！💪";
      setHelperSpeech(failedSpeech);

      stopSpeaking();
      speakText("答错啦！题目已经重新随机啦，请重新看题目算一算吧！");
    }
  };

  // Move onto next level or finish world
  const handleProceedNext = () => {
    if (isProceedingRef.current) return;
    isProceedingRef.current = true;
    SoundEffects.playClick();
    setShowSuccessModal(false);
    setMascotExpression("idle");
    stopSpeaking();

    if (!activeLevel) return;

    // 1. Mark completed
    const nextCompleted = { ...userProgress.completedLevels, [activeLevel.id]: true };

    // 2. Stars
    const currentStars = userProgress.stars[activeLevel.id] || 0;
    const nextStars = { ...userProgress.stars, [activeLevel.id]: Math.max(currentStars, gainedStars) };

    // Calculate score change
    const starDifference = Math.max(0, gainedStars - currentStars);
    const scoreGain = starDifference * 50; // 50 points per new star

    // 3. Unlock Next Worlds or Levels
    const currentWorld = WORLDS_DATA.find((w) => w.id === activeWorldId);
    const currentLevelIdx = currentWorld?.levels.findIndex((l) => l.id === activeLevel.id) ?? -1;

    let nextUnlockedWorlds = [...userProgress.unlockedWorlds];

    // If it was the last level in this world, unlock the next world
    if (currentLevelIdx === (currentWorld?.levels.length ?? 0) - 1) {
      const worldIdx = WORLDS_DATA.findIndex((w) => w.id === activeWorldId);
      const nextWorld = WORLDS_DATA[worldIdx + 1];
      if (nextWorld && !nextUnlockedWorlds.includes(nextWorld.id)) {
        nextUnlockedWorlds.push(nextWorld.id);
        setHelperSpeech(`恭喜你！解锁了全新区域：【${nextWorld.name}】！🎉`);
      }
    }

    const nextProgress: UserProgress = {
      completedLevels: nextCompleted,
      stars: nextStars,
      unlockedWorlds: nextUnlockedWorlds,
      totalScore: userProgress.totalScore + scoreGain
    };

    saveProgress(nextProgress);

    // If there is a next level in this world, select it
    if (currentWorld && currentLevelIdx !== -1 && currentLevelIdx < currentWorld.levels.length - 1) {
      setActiveLevel(getRandomizedLevel(currentWorld.levels[currentLevelIdx + 1]));
    } else {
      // Exit to level select map
      setActiveLevel(null);
    }
  };

  // Active world colors
  const activeWorld = WORLDS_DATA.find((w) => w.id === activeWorldId);

  // If user is not logged in, show the child-friendly simple login/registration screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] flex flex-col font-sans text-slate-800">
        {/* Simple Header */}
        <header className="bg-white border-b-4 border-indigo-100 px-6 py-4 flex items-center justify-between shadow-xs select-none">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-[0_3px_0_0_#3730a3] border border-indigo-400">
              <Sparkles className="w-6 h-6 text-teal-300 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-indigo-700 tracking-tight">儿童启蒙奥数闯关</h1>
              <p className="text-[10px] text-teal-600 font-extrabold tracking-widest uppercase">ANIMO OLYMPIAD ADVENTURE</p>
            </div>
          </div>
        </header>

        {/* Playful Login Panel */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-indigo-300 rounded-4xl p-6 md:p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#4f46e5] text-center select-none flex flex-col gap-6">
            {/* Mascot Greeting */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 bg-gradient-to-b from-indigo-100 to-indigo-50 border-4 border-indigo-200 rounded-full flex items-center justify-center text-5xl relative shadow-inner">
                🧙‍♂️
                <span className="absolute -bottom-1 -right-1 bg-teal-400 border-2 border-white rounded-full px-2 py-0.5 text-[10px] font-black text-white animate-bounce">
                  NEW
                </span>
              </div>
              <h2 className="text-2xl font-black text-indigo-800">奥数冒险启航啦！</h2>
              <p className="text-xs text-slate-500 font-bold leading-relaxed px-2">
                嗨！我是你的奥数精灵小奥。请输入你的闯关小名（例如：童童），专属的星星和通关成就就会自动保存在云端，换电脑也能继续玩哦！🌱
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  maxLength={12}
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="✍️ 输入你的闯关小名..."
                  className="w-full px-5 py-4 bg-slate-50 border-3 border-indigo-100 text-indigo-900 rounded-2xl text-center text-lg font-black placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all focus:bg-white"
                  disabled={authLoading}
                />
              </div>

              {authError && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-xs font-black text-rose-600 flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-4 text-white text-base font-black rounded-2xl shadow-[0_4px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 ${
                  authLoading 
                    ? "bg-slate-400 shadow-none pointer-events-none" 
                    : "bg-blue-600 hover:bg-blue-500 border-2 border-blue-400"
                }`}
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>🐾 开启奥数冒险 (Let's Go!)</span>
                  </>
                )}
              </button>
            </form>

            {/* Small Footer tip */}
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              💡 提示：输入之前玩过的小名，能立即找回之前的通关记录和星星。无需密码，最简单的快乐！
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] flex flex-col font-sans text-slate-800">
      {/* App Header */}
      <header className="bg-white border-b-4 border-indigo-100 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-50 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-[0_3px_0_0_#3730a3] border border-indigo-400">
            <Sparkles className="w-6 h-6 text-teal-300 animate-pulse fill-teal-300/30" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black text-indigo-700 tracking-tight">儿童启蒙奥数闯关</h1>
            <p className="text-[10px] text-teal-600 font-extrabold tracking-widest uppercase">ANIMO OLYMPIAD ADVENTURE</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Unlock All Levels Button */}
          <button
            onClick={() => {
              SoundEffects.playClick();
              const nextUnlocked = !userProgress.allUnlocked;
              const nextProgress = {
                ...userProgress,
                allUnlocked: nextUnlocked
              };
              saveProgress(nextProgress);
              setHelperSpeech(nextUnlocked ? "✨ 哇！你使用了神奇魔法，现在所有的奥数关卡都已经解锁啦！快去任意挑选一关体验吧！" : "✨ 关卡锁已经恢复，你可以继续一步步探索闯关啦！");
            }}
            className={`p-2.5 bg-white border-3 rounded-xl transition-all active:translate-y-0.5 active:shadow-none text-xs font-black flex items-center gap-1.5 ${
              userProgress.allUnlocked
                ? "border-emerald-400 text-emerald-600 shadow-[2px_2px_0px_0px_#10b981]"
                : "border-indigo-400 text-indigo-600 hover:border-teal-400 hover:text-teal-600 shadow-[2px_2px_0px_0px_#4338ca]"
            }`}
            title="一键解锁所有关卡"
          >
            {userProgress.allUnlocked ? "🔓 已解锁全部" : "🔒 一键解锁全部"}
          </button>

          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className="p-2.5 bg-white border-3 border-indigo-400 text-indigo-600 rounded-xl transition-all hover:bg-indigo-50 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#4338ca]"
            title={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600 stroke-[2.5px]" />}
          </button>

          {/* Account Indicator & Log out button */}
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 border-2 border-amber-300 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#f59e0b]">
                <User className="w-3.5 h-3.5 text-amber-600 stroke-[2.5px]" />
                <span>{currentUser}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-white border-3 border-rose-400 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#f43f5e] text-xs font-black flex items-center gap-1.5"
                title="切换账号"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">切换账号</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Layout Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map or Game Sandbox */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Floaty Tutor Mascot Elf always shown at top of action */}
          <MascotElf
            expression={mascotExpression}
            speech={helperSpeech}
            subject={activeSubject}
            onClickBubble={() => {
              if (activeLevel) {
                setHelperSpeech(activeLevel.hint);
              }
            }}
          />

          {/* Core Level-specific Gameplay Sandboxes */}
          {activeLevel ? (
            <div id="game-question-box" className="bg-white border-4 border-indigo-300 rounded-4xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#475569] flex flex-col gap-6 relative">
              {/* Back navigation button */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-slate-100 pb-4 select-none">
                <button
                  onClick={() => {
                    SoundEffects.playClick();
                    setActiveLevel(null);
                  }}
                  className="px-3.5 py-1.5 bg-white border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-black flex items-center gap-1 active:translate-y-0.5 active:shadow-none transition-all shadow-[2px_2px_0px_0px_#4338ca]"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5px]" />
                  返回关卡
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border-2 ${activeWorld?.accentColor} shadow-sm`}>
                    {activeWorld?.icon} {activeWorld?.name}
                  </span>
                  <span className="text-xs font-bold text-slate-300">/</span>
                  <span className="text-xs font-black text-indigo-600 underline underline-offset-4 decoration-2">
                    {activeLevel.name}: {activeLevel.title}
                  </span>
                </div>
              </div>

              {/* Game Question prompt */}
              <div className="bg-slate-50/80 border-3 border-slate-200 p-4 rounded-2xl text-left select-none shadow-inner animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <HelpCircle className="w-4 h-4 fill-slate-200" />
                    第 {activeLevel.name.split(" ")[1]} 关闯关题目
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                    {activeLevel.question}
                  </p>
                </div>
                <button
                  onClick={() => {
                    SoundEffects.playClick();
                    if (isPlayingSpeech) {
                      stopSpeaking();
                    } else {
                      speakText(activeWorldId === WorldId.TangPoetry ? `《${activeLevel.title}》，${activeLevel.data?.author || "唐诗"}。${activeLevel.data?.content?.join("") || ""}` : `第${activeLevel.name.split(" ")[1]}关。${activeLevel.title}。${activeLevel.question}`);
                    }
                  }}
                  className={`shrink-0 self-start sm:self-center px-4 py-2.5 bg-indigo-600 border-b-4 border-indigo-800 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition-all active:translate-y-0.5 active:border-b-0 flex items-center gap-1.5 ${
                    isPlayingSpeech ? "bg-rose-500 border-rose-700 hover:bg-rose-600" : ""
                  }`}
                >
                  {isPlayingSpeech ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white stroke-none animate-pulse" />
                      <span>停止朗读</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>语音读题</span>
                    </>
                  )}
                </button>
              </div>

              {/* Game Sandbox router */}
              <div className="min-h-[250px] relative animate-fadeIn">
                {activeWorldId === WorldId.ChickenRabbit && (
                  <ChickenRabbitGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.Matchstick && (
                  <MatchstickGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.TreePlanting && (
                  <TreePlantingGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.QueueMath && (
                  <QueueGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.SumDiff && (
                  <SumDiffGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.PatternSequence && (
                  <PatternGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.AgePuzzle && (
                  <AgePuzzleGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.Overlapping && (
                  <OverlappingGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.ReverseSolve && (
                  <ReverseSolveGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.LogicGrid && (
                  <LogicGridGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.ProfitLoss && (
                  <ProfitLossGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.MeetingChase && (
                  <MeetingChaseGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.Pigeonhole && (
                  <PigeonholeGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.ShapeCounting && (
                  <ShapeCountingGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.Permutation && (
                  <PermutationGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.MagicSquare && (
                  <MagicSquareGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.ClockAngle && (
                  <ClockAngleGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.BinaryScore && (
                  <BinaryScoreGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.TruthLiar && (
                  <TruthLiarGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.WaterPouring && (
                  <WaterPouringGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {(activeWorldId === WorldId.SubstitutionMath ||
                  activeWorldId === WorldId.CubeStack ||
                  activeWorldId === WorldId.WeightCompare ||
                  activeWorldId === WorldId.ClockMatch ||
                  activeWorldId === WorldId.OddEvenSort ||
                  activeWorldId === WorldId.SupermarketChange ||
                  activeWorldId === WorldId.OneStroke ||
                  activeWorldId === WorldId.SequenceTrain ||
                  activeWorldId === WorldId.SymmetryGrid ||
                  activeWorldId === WorldId.NumberNeighbor) && (
                  <SimpleOlympiadQuiz
                    worldId={activeWorldId}
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                  />
                )}
                {activeWorldId === WorldId.TangPoetry && (
                  <TangPoetryGame
                    levelData={activeLevel.data}
                    onSolved={handleLevelSolved}
                    onIncorrect={handleLevelFailed}
                    speakText={speakText}
                    stopSpeaking={stopSpeaking}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Game World selector or Stepping stone levels map */
            <div className="bg-white border-4 border-indigo-300 rounded-4xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#475569] min-h-[450px]">
              <LevelMap
                worlds={WORLDS_DATA}
                userProgress={userProgress}
                onSelectLevel={handleSelectLevel}
                activeWorldId={activeWorldId}
                onSelectWorld={handleSelectWorld}
                activeSubject={activeSubject}
                onSelectSubject={setActiveSubject}
              />
            </div>
          )}
        </section>

        {/* Right Column: AI Tutor & Side Curriculum Panel */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          {/* Sweet Voice Assistant Panel */}
          <div className="bg-white border-4 border-indigo-300 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#475569] flex flex-col gap-5 select-none min-h-[400px]">
            <div className="border-b-2 border-dashed border-slate-100 pb-3 text-left">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                  智能主播 · 语音读题
                </h3>
                <span className="text-[8px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2 h-2 animate-pulse" />
                  AI 播音
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                Gemini 3.1 暖心女声亲切读题，陪伴宝贝快乐成长！
              </p>
            </div>

            {/* Playback Box */}
            <div className="flex-1 bg-slate-50/50 border-2 border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden min-h-[220px]">
              {/* Dynamic waveform background decoration */}
              <div className="absolute inset-x-0 bottom-0 h-10 flex items-end justify-center gap-1 px-4 opacity-15 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-600 rounded-t-sm transition-all origin-bottom"
                    style={{
                      height: "100%",
                      animation: isPlayingSpeech ? `wave 1s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                      transform: isPlayingSpeech ? undefined : "scaleY(0.15)"
                    }}
                  />
                ))}
              </div>

              {activeLevel ? (
                <>
                  <div className="relative">
                    {/* Pulsing ring around speaker */}
                    <div className={`absolute inset-0 bg-indigo-100 rounded-full scale-150 opacity-0 ${isPlayingSpeech ? "animate-ping opacity-30" : ""}`} />
                    <button
                      onClick={() => {
                        SoundEffects.playClick();
                        if (isPlayingSpeech) {
                          stopSpeaking();
                        } else {
                          speakText(activeWorldId === WorldId.TangPoetry ? `《${activeLevel.title}》，${activeLevel.data?.author || "唐诗"}。${activeLevel.data?.content?.join("") || ""}` : `第${activeLevel.name.split(" ")[1]}关。${activeLevel.title}。${activeLevel.question}`);
                        }
                      }}
                      className="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                      title={isPlayingSpeech ? "暂停播放" : "播放题目"}
                    >
                      {isPlayingSpeech ? (
                        <Pause className="w-7 h-7 fill-white stroke-none" />
                      ) : (
                        <Play className="w-7 h-7 fill-white stroke-none translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="z-10 flex flex-col items-center">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      当前朗读：{activeLevel.name}
                      {isUsingGeminiVoice && (
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-1.5 py-0.2 rounded-md text-[7px] font-black tracking-wider scale-95 origin-center">
                          AI 原声
                        </span>
                      )}
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-2 line-clamp-2 max-w-[220px]">
                      {activeLevel.title}
                    </p>
                  </div>

                  {/* Playback status text */}
                  <span className="text-[10px] font-bold text-indigo-600 z-10 animate-pulse">
                    {isPlayingSpeech ? (isUsingGeminiVoice ? "✨ Gemini 智能高清原声播音中..." : "🎙️ 温柔小姐姐正在为您朗读中...") : "点击上方按钮重新播放题目"}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-slate-100 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Headphones className="w-6 h-6 stroke-[2px]" />
                  </div>
                  <div className="z-10 px-4">
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                      请在地图上选择一个关卡，甜美播音员就会为你语音读题哦！🌸
                    </p>
                    <button
                      onClick={() => {
                        SoundEffects.playClick();
                        speakText("欢迎来到儿童启盟奥数闯关！我是你的专属语音助手，我会用最甜美的声音陪伴你探索数学奥秘哦！");
                      }}
                      className="mt-3 px-4 py-1.5 bg-white border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-xl text-[10px] font-black shadow-[2px_2px_0px_0px_#4338ca] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      🔊 点击试听声音
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Controls Box */}
            {activeLevel && (
              <div className="flex flex-col gap-3 bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl">
                {/* Read Aloud Level Hint / Explanation */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      SoundEffects.playClick();
                      speakText(`名师提示：${activeLevel.hint}`);
                    }}
                    className="py-1 bg-white border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-lg text-[10px] font-extrabold active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    💡 听听提示
                  </button>
                  <button
                    onClick={() => {
                      SoundEffects.playClick();
                      speakText(`奥数精灵名师原理解析是：${activeLevel.explanation}`);
                    }}
                    className="py-1 bg-white border-2 border-teal-400 text-teal-600 hover:bg-teal-50 rounded-lg text-[10px] font-extrabold active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    📖 听原理解析
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Success Completion celebratory Dialog Modal */}
      {showSuccessModal && activeLevel && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-100 backdrop-blur-xs select-none animate-fadeIn">
          <div className="bg-white border-4 border-indigo-400 rounded-4xl p-6 max-w-lg w-full shadow-[8px_8px_0px_0px_#4338ca] text-center flex flex-col gap-4 relative overflow-hidden animate-fadeIn">
            {/* Sparkles designs */}
            <div className="absolute top-4 left-6 text-indigo-500 animate-spin" style={{ animationDuration: "6s" }}>
              <Sparkles className="w-8 h-8 fill-indigo-300/30" />
            </div>
            <div className="absolute bottom-6 right-6 text-indigo-500 animate-pulse">
              <Sparkles className="w-6 h-6 fill-indigo-300/30" />
            </div>

            <span className="text-5xl mt-2 block">🎉</span>
            <h3 className="text-2xl font-black text-indigo-700 mt-2">
              恭喜你，通关成功！
            </h3>
            <p className="text-sm font-black text-slate-600">
              【{activeLevel.name}：{activeLevel.title}】完美解答！
            </p>

            {/* Stars rendering */}
            <div className="flex gap-2 justify-center my-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 ${
                    i < gainedStars
                      ? "fill-yellow-400 text-yellow-500 stroke-yellow-600 stroke-2"
                      : "text-slate-100"
                  }`}
                />
              ))}
            </div>

            <div className="bg-slate-50/80 border-3 border-slate-200 p-4 rounded-2xl text-left">
              <span className="text-xs font-black text-indigo-800 flex items-center gap-1 mb-1">
                📖 奥数精灵名师原理解析
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                {activeLevel.explanation}
              </p>
            </div>

            <p className="text-xs text-slate-500 font-black">
              奖励金币：+{gainedStars * 50} 🪙 | 星星：+{gainedStars} ⭐️
            </p>

            <button
              onClick={handleProceedNext}
              className="mt-2 w-full py-3 bg-indigo-600 border-b-4 border-indigo-800 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md active:translate-y-0.5 active:border-b-0 flex items-center justify-center gap-2 text-base tracking-wider"
            >
              继续下一关
              <ArrowRight className="w-5 h-5 fill-white stroke-[2.5px]" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-100 backdrop-blur-xs select-none">
          <div className="bg-white border-4 border-indigo-400 rounded-4xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_#4338ca] text-center flex flex-col gap-4 relative animate-fadeIn">
            <span className="text-5xl mt-2 block">👋</span>
            <h3 className="text-xl font-black text-indigo-700">确定要切换账号吗？</h3>
            <p className="text-xs font-black text-slate-500 leading-relaxed px-2">
              切换账号后，你当前账号的奥数通关记录和星星都会安全保存在云端哦！随时可以重新用原来的小名登录找回。
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  SoundEffects.playClick();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-3 bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all active:translate-y-0.5"
              >
                取消
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 bg-rose-500 border-2 border-rose-600 hover:bg-rose-600 text-white font-black rounded-2xl transition-all active:translate-y-0.5 shadow-[0_3px_0_0_#be123c]"
              >
                确定切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t-4 border-indigo-100 py-6 mt-8 text-center text-xs text-slate-500 font-bold select-none">
        <p>儿童启蒙奥数闯关冒险游戏 © 2026 | 用全交互卡通动画启迪逻辑智慧 🌟</p>
      </footer>
    </div>
  );
}
