import React, { useState, useEffect, useRef } from "react";
import { Check, Volume2, VolumeX, Mic, MicOff, RefreshCw, Sparkles, AlertCircle, Headphones, Award, Play, Pause } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface TangPoetryGameProps {
  levelData: {
    title: string;
    author: string;
    dynasty: string;
    content: string[];
    pinyin: string[];
    keywords: string[];
    cleanWords: string;
    translation: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
  speakText?: (text: string) => Promise<void>;
  stopSpeaking?: () => void;
}

export const TangPoetryGame: React.FC<TangPoetryGameProps> = ({
  levelData,
  onSolved,
  onIncorrect,
  speakText,
  stopSpeaking
}) => {
  const { title, author, dynasty, content, pinyin, cleanWords, translation } = levelData;

  const [isPlayingLine, setIsPlayingLine] = useState<number | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [matchedChars, setMatchedChars] = useState<boolean[]>([]);
  const [micError, setMicError] = useState<string | null>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Initialize matched character array whenever poem changes
  useEffect(() => {
    setMatchedChars(new Array(cleanWords.length).fill(false));
    setSpokenText("");
    setIsListening(false);
    setMicError(null);
    stopAllSpeech();

    // Check if webkitSpeechRecognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecognitionSupported(false);
    }
  }, [levelData]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const stopAllSpeech = () => {
    if (stopSpeaking) {
      stopSpeaking();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsPlayingLine(null);
    setIsPlayingFull(false);
  };

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

  const getBestChineseVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
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

      // Prioritize Mainland Mandarin (zh-CN)
      if (lang.includes("cn") || lang.includes("zh_cn")) {
        score += 30;
      } else if (lang.includes("tw") || lang.includes("hk")) {
        score += 15;
      }

      // Strong priority for female voice indicators
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

      // HEAVILY penalize male voices
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

    return bestVoice || zhVoices[0] || voices.find((v) => v.lang.toLowerCase().includes("zh")) || null;
  };

  // Single line voice read aloud (repeat reading practice)
  const speakLine = async (lineText: string, index: number) => {
    stopAllSpeech();
    SoundEffects.playClick();
    setIsPlayingLine(index);

    const cleanText = lineText.replace(/[，。？！、]/g, "");

    if (speakText) {
      try {
        await speakText(cleanText);
      } catch (e) {
        console.warn("Failed to speak line via prop, falling back:", e);
      } finally {
        setIsPlayingLine(null);
      }
    } else {
      // Local fallback
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsPlayingLine(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "zh-CN";
      utterance.rate = 0.85; // Slightly slower for children to hear clearly

      const voices = await getVoicesAsync();
      const sweetVoice = getBestChineseVoice(voices);
      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }

      utterance.onend = () => setIsPlayingLine(null);
      utterance.onerror = () => setIsPlayingLine(null);

      window.speechSynthesis.speak(utterance);
      
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {}
    }
  };

  // Full poem voice read aloud
  const speakFullPoem = async () => {
    if (isPlayingFull) {
      stopAllSpeech();
      return;
    }

    stopAllSpeech();
    SoundEffects.playClick();
    setIsPlayingFull(true);

    const fullText = `《${title}》，唐，${author}。${content.join("")}`;

    if (speakText) {
      try {
        await speakText(fullText);
      } catch (e) {
        console.warn("Failed to speak full poem via prop, falling back:", e);
      } finally {
        setIsPlayingFull(false);
      }
    } else {
      // Local fallback
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsPlayingFull(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = "zh-CN";
      utterance.rate = 0.9;

      const voices = await getVoicesAsync();
      const sweetVoice = getBestChineseVoice(voices);
      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }

      utterance.onend = () => setIsPlayingFull(false);
      utterance.onerror = () => setIsPlayingFull(false);

      window.speechSynthesis.speak(utterance);

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {}
    }
  };

  // Real-time voice recognition logic
  const startListening = async () => {
    SoundEffects.playClick();
    setMicError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("您的浏览器暂不支持语音识别，请点击‘模拟通关’体验！");
      return;
    }

    stopAllSpeech();

    if (isListening) {
      stopListening();
      return;
    }

    // Explicitly request microphone permission on mobile to trigger prompt
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request a temporary audio stream to force browser to prompt for permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release the stream immediately to avoid keeping microphone active unnecessarily
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: any) {
      console.warn("Microphone permission denied or error:", err);
      setMicError("请允许网页使用您的麦克风权限（可在浏览器地址栏或手机系统设置中开启），或者点击‘模拟通关’体验哦！");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenText("");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event);
        if (event.error === "not-allowed") {
          setMicError("请允许网页使用您的麦克风权限，或者点击‘模拟通关’体验哦！");
        } else {
          setMicError(`识别出错: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        const cleanTranscript = currentTranscript.replace(/[^\u4e00-\u9fa5]/g, ""); // Keep only Chinese characters
        setSpokenText(cleanTranscript);

        // Character matching logic (flexible lookahead alignment)
        // Mark character as matched if it has been spoken in the transcript
        const nextMatched = [...matchedChars];
        let matchCount = 0;

        for (let j = 0; j < cleanWords.length; j++) {
          const char = cleanWords[j];
          // Simple match: does the spoken text contain this character? 
          // To preserve order somewhat, we check if it is present.
          if (cleanTranscript.includes(char)) {
            nextMatched[j] = true;
          }
          if (nextMatched[j]) {
            matchCount++;
          }
        }

        setMatchedChars(nextMatched);

        // Check if level passed: >= 85% of poem's characters matched
        const matchPercent = matchCount / cleanWords.length;
        if (matchPercent >= 0.85) {
          recognition.stop();
          setIsListening(false);
          triggerSuccess();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (e: any) {
      console.error(e);
      setMicError(`无法启动语音识别: ${e.message}`);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Standard level pass trigger
  const triggerSuccess = () => {
    // Fill all matches
    setMatchedChars(new Array(cleanWords.length).fill(true));
    SoundEffects.playCorrect();
    // Award 3 stars
    onSolved(3);
  };

  // Calculate matching percentage
  const matchCount = matchedChars.filter(Boolean).length;
  const matchPercent = Math.round((matchCount / cleanWords.length) * 100);

  return (
    <div id="tang-poetry-game" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-3xl shadow-xs border border-slate-100 max-w-3xl mx-auto animate-fadeIn select-none">
      {/* Upper Subject Intro Card */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-rose-50/70 border border-rose-100 p-4 rounded-2xl gap-3 text-left">
        <div className="flex items-center gap-3">
          <span className="text-3.5xl p-2 bg-rose-100 rounded-xl">🏮</span>
          <div>
            <h3 className="font-extrabold text-rose-800 text-lg">经典国学 · 唐诗三百首</h3>
            <p className="text-xs text-rose-600 font-bold mt-0.5">
              跟读熟记，点击各行可 <strong className="text-rose-700">重复朗读</strong>；大声读出整首诗通关！
            </p>
          </div>
        </div>
        <button
          onClick={speakFullPoem}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs active:translate-y-0.5 transition-all ${
            isPlayingFull ? "bg-rose-700 ring-4 ring-rose-200" : ""
          }`}
        >
          {isPlayingFull ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white stroke-none animate-pulse" />
              <span>停止播放</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>整首听读</span>
            </>
          )}
        </button>
      </div>

      {/* Main Poem Display Panel */}
      <div className="bg-amber-50/30 border-4 border-amber-100 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Chinese Retro Motif background */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300 opacity-30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300 opacity-30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300 opacity-30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300 opacity-30 pointer-events-none" />

        {/* Title and Author */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-wide font-sans">{title}</h2>
          <p className="text-xs text-amber-700 font-extrabold mt-1.5 px-3 py-0.5 bg-amber-50 border border-amber-200 rounded-full inline-block">
            〔{dynasty}〕· {author}
          </p>
        </div>

        {/* Poem Verse Lines */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {content.map((line, lineIdx) => {
            // Find character index ranges to render color feedback based on matchedChars
            let charIndexOffset = 0;
            for (let k = 0; k < lineIdx; k++) {
              charIndexOffset += content[k].replace(/[，。？！、]/g, "").length;
            }

            const cleanLine = line.replace(/[，。？！、]/g, "");
            const punctuation = line.slice(cleanLine.length); // Assuming punctuation is at the end

            return (
              <button
                key={lineIdx}
                onClick={() => speakLine(line, lineIdx)}
                className={`group text-left p-2 rounded-xl transition-all border-2 border-transparent hover:border-amber-200 hover:bg-amber-50/40 flex items-center justify-between w-full ${
                  isPlayingLine === lineIdx ? "bg-amber-50 border-amber-300 shadow-sm" : ""
                }`}
                title="点击重复朗读此行"
              >
                <div className="flex-1">
                  {/* Pinyin representation */}
                  <p className="text-[10px] md:text-xs font-mono font-medium text-slate-400 tracking-wider">
                    {pinyin[lineIdx]}
                  </p>
                  {/* Chinese characters with Real-time Speech Highlights */}
                  <p className="text-lg md:text-xl font-bold tracking-widest text-slate-800 mt-0.5">
                    {Array.from(cleanLine).map((char, charIdx) => {
                      const absoluteIdx = charIndexOffset + charIdx;
                      const isCharMatched = matchedChars[absoluteIdx];
                      return (
                        <span
                          key={charIdx}
                          className={`transition-colors duration-300 ${
                            isCharMatched ? "text-emerald-600 font-black scale-105" : ""
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                    <span className="text-slate-400 font-medium">{punctuation}</span>
                  </p>
                </div>

                <div className="shrink-0 ml-4 p-2 bg-slate-100 group-hover:bg-amber-100 rounded-lg text-slate-400 group-hover:text-amber-600 transition-all">
                  <Volume2 className={`w-4 h-4 ${isPlayingLine === lineIdx ? "animate-bounce text-amber-600" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Translation / Explanation Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left">
        <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
          💡 诗意译文 (Translation)
        </span>
        <p className="text-xs font-medium text-slate-600 leading-relaxed mt-2">
          {translation}
        </p>
      </div>

      {/* Speech Exam Control Room */}
      <div className="border-3 border-dashed border-rose-200 rounded-2xl p-5 bg-rose-50/20 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-1.5">
            <Mic className="w-5 h-5 text-rose-600 animate-pulse" />
            <h4 className="font-extrabold text-slate-800 text-sm">唐诗背诵跟读挑战考场</h4>
          </div>
          <p className="text-[10px] text-slate-500 font-bold">
            大声朗读，当完成率达到 <span className="text-rose-600 font-black">85%</span> 以上，即可获得 3 颗小金星通关！
          </p>
        </div>

        {/* Dynamic Voice Matching Status Visualizer */}
        <div className="w-full bg-slate-100 border border-slate-200 h-6 rounded-full overflow-hidden relative flex items-center shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
            style={{ width: `${matchPercent}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
            背诵匹配率：{matchPercent}%
          </span>
        </div>

        {/* Real-time recognized speech preview bubble */}
        {spokenText && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold leading-relaxed max-w-md w-full text-center animate-fadeIn shadow-xs">
            <span className="text-[10px] text-emerald-600 font-black block mb-1">🎤 我听到了：</span>
            &ldquo;{spokenText}&rdquo;
          </div>
        )}

        {/* Mic Error Box if any */}
        {micError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2.5 rounded-xl text-xs font-bold leading-relaxed max-w-md flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{micError}</span>
          </div>
        )}

        {/* Actions button strip */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {/* Main Voice Test Button */}
          <button
            onClick={startListening}
            className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all border-b-4 active:translate-y-0.5 active:border-b-0 ${
              isListening
                ? "bg-rose-600 hover:bg-rose-700 border-rose-800 text-white animate-pulse"
                : "bg-gradient-to-tr from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 border-rose-600 text-white"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>停止语音识别考试</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>语音识别考考我 🎙️</span>
              </>
            )}
          </button>

          {/* Fallback Simulation Button (Super helpful for sandbox preview / older browsers) */}
          <button
            onClick={triggerSuccess}
            className="px-4 py-3 bg-white hover:bg-amber-50 border-2 border-amber-400 text-amber-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:translate-y-0.5 active:shadow-none transition-all"
            title="如果麦克风不可用，点击此键模拟通关"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span>模拟朗读成功 (直接通关)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
