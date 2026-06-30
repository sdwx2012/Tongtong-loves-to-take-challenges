import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Volume2 } from "lucide-react";
import { SoundEffects } from "./SoundEffects";
import { Subject } from "../types";

interface MascotElfProps {
  expression?: "idle" | "happy" | "thinking" | "sad";
  speech?: string;
  onClickBubble?: () => void;
  subject?: Subject;
}

const MATH_QUOTES = [
  "奥数其实就像捉迷藏，找到规律就能赢！",
  "别着急，动动小脑筋，小奥相信你一定可以！",
  "我们一起来假设一下，是不是就变简单啦？",
  "哇！你的逻辑思维棒极了，快去下一关吧！",
  "真聪明！每一个数学家都是从这样的小题目开始的哦！"
];

const CHINESE_QUOTES = [
  "熟读唐诗三百首，不会作诗也会吟哦！",
  "字里行间都是精美画卷，跟着小奥感受唐诗的美妙吧！",
  "别着急，大声跟读出来，小奥相信你一定能熟练背诵！",
  "哇！你的普通话朗读声音真动听，很有小诗人的儒雅风范呢！",
  "书读百遍，其义自见。多读几遍，你就更能领悟其中的智慧啦！"
];

export const MascotElf: React.FC<MascotElfProps> = ({
  expression = "idle",
  speech = "嗨！我是奥数精灵小奥。点击关卡，和我一起开启奇妙的数学冒险吧！",
  onClickBubble,
  subject = Subject.Math
}) => {
  const [localSpeech, setLocalSpeech] = useState(speech);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setLocalSpeech(speech);
  }, [speech]);

  const handleElfClick = () => {
    SoundEffects.playClick();
    setIsBouncing(true);
    const quotes = subject === Subject.Chinese ? CHINESE_QUOTES : MATH_QUOTES;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setLocalSpeech(randomQuote);
    setTimeout(() => setIsBouncing(false), 800);
  };

  // Render different faces based on expression
  const renderFace = () => {
    switch (expression) {
      case "happy":
        return (
          <>
            {/* Happy Eyes */}
            <path d="M 12 18 Q 16 14 20 18" stroke="#3730a3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 28 18 Q 32 14 36 18" stroke="#3730a3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Blushing cheeks */}
            <circle cx="10" cy="22" r="3" fill="#f43f5e" opacity="0.6" />
            <circle cx="38" cy="22" r="3" fill="#f43f5e" opacity="0.6" />
            {/* Laughing mouth */}
            <path d="M 20 23 Q 24 29 28 23 Z" fill="#e11d48" stroke="#3730a3" strokeWidth="1.5" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Thinking Eyes */}
            <path d="M 12 17 L 20 17" stroke="#3730a3" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="32" cy="18" r="2.5" fill="#3730a3" />
            {/* Wiggly/wavy mouth */}
            <path d="M 20 24 Q 22 21 24 24 T 28 24" stroke="#3730a3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Sweat drop */}
            <path d="M 37 11 Q 38 8 40 12" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );
      case "sad":
        return (
          <>
            {/* Sad Eyes */}
            <path d="M 12 20 Q 16 16 20 20" stroke="#3730a3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 28 20 Q 32 16 36 20" stroke="#3730a3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Tear */}
            <ellipse cx="14" cy="24" rx="2" ry="4" fill="#0284c7" className="animate-bounce" />
            {/* Sad downturned mouth */}
            <path d="M 20 27 Q 24 23 28 27" stroke="#3730a3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "idle":
      default:
        return (
          <>
            {/* Cute Normal Eyes */}
            <ellipse cx="16" cy="18" rx="2.5" ry="3.5" fill="#3730a3" />
            <ellipse cx="32" cy="18" rx="2.5" ry="3.5" fill="#3730a3" />
            {/* Eye sparkle */}
            <circle cx="15.5" cy="16.5" r="1" fill="#ffffff" />
            <circle cx="31.5" cy="16.5" r="1" fill="#ffffff" />
            {/* Soft pink cheeks */}
            <circle cx="11" cy="23" r="2" fill="#fda4af" />
            <circle cx="37" cy="23" r="2" fill="#fda4af" />
            {/* Smiling mouth */}
            <path d="M 21 23 Q 24 27 27 23" stroke="#3730a3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 bg-white p-5 rounded-3xl border-4 border-indigo-300 shadow-[6px_6px_0px_0px_#475569] w-full max-w-2xl h-[260px] md:h-[155px] mx-auto my-4 relative overflow-visible select-none flex-shrink-0">
      {/* Sparkle background elements */}
      <div className="absolute top-2 left-4 text-indigo-500 animate-pulse">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-2 right-4 text-teal-500 animate-bounce" style={{ animationDuration: "3s" }}>
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Elf SVG Avatar */}
      <div
        onClick={handleElfClick}
        className={`w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0 cursor-pointer transform transition-all active:scale-90 ${
          isBouncing ? "animate-bounce" : "animate-bounce"
        }`}
        style={{ animationDuration: isBouncing ? "0.4s" : "4.5s" }}
      >
        <svg
          viewBox="0 0 60 60"
          className="w-full h-full drop-shadow-[0_4px_6px_rgba(79,70,229,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Magic Wings */}
          <path d="M 12 35 C -5 40 -2 20 15 25 Z" fill="#99f6e4" opacity="0.8" className="animate-pulse" />
          <path d="M 48 35 C 65 40 62 20 45 25 Z" fill="#99f6e4" opacity="0.8" className="animate-pulse" />

          {/* Elf Ears */}
          <path d="M 6 22 C 0 15 5 10 12 18 Z" fill="#fecdd3" stroke="#6366f1" strokeWidth="1.5" />
          <path d="M 54 22 C 60 15 55 10 48 18 Z" fill="#fecdd3" stroke="#6366f1" strokeWidth="1.5" />

          {/* Cute Wizard Hat */}
          <path d="M 14 15 L 30 -5 L 46 15 Z" fill="#4f46e5" stroke="#3730a3" strokeWidth="2.5" />
          <circle cx="30" cy="-5" r="3.5" fill="#2dd4bf" stroke="#0d9488" strokeWidth="1.5" />
          {/* Hat Pattern */}
          <path d="M 23 7 L 30 2 L 37 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

          {/* Elf Head / Face */}
          <circle cx="30" cy="24" r="18" fill="#ffedd5" stroke="#4f46e5" strokeWidth="2.5" />

          {/* Hair fringe */}
          <path d="M 12 20 C 18 12 25 14 30 14 C 35 14 42 12 48 20 C 42 16 38 18 30 18 C 22 18 18 16 12 20 Z" fill="#ca8a04" />

          {/* Face Elements */}
          {renderFace()}

          {/* Cute bow tie or collar */}
          <path d="M 24 41 L 30 36 L 36 41 Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="1.5" />
          <circle cx="30" cy="38" r="1.5" fill="#ffffff" />
        </svg>

        {/* Level tutor indicator */}
        <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1.5 border-2 border-white shadow-md">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Speech Bubble */}
      <div
        className="flex-1 text-left relative cursor-pointer w-full md:w-auto"
        onClick={onClickBubble}
      >
        {/* Triangle pointer */}
        <div className="absolute left-1/2 -top-3.5 md:-left-3.5 md:top-6 transform -translate-x-1/2 md:translate-x-0 rotate-45 w-4 h-4 bg-white border-l-4 border-t-4 border-indigo-400 md:border-r-0 md:border-b-0" />

        <div className="bg-white p-3 md:p-4 rounded-2xl border-4 border-indigo-400 shadow-[4px_4px_0px_0px_#4338ca] hover:bg-indigo-50/20 transition-colors h-[115px] flex flex-col justify-between overflow-hidden">
          <div className="overflow-y-auto pr-1 flex-1 text-xs md:text-sm font-bold text-slate-800 leading-relaxed scrollbar-thin max-h-[52px]">
            {localSpeech}
          </div>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-dashed border-indigo-100 text-[10px] text-indigo-600 font-extrabold flex-shrink-0">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              {subject === Subject.Chinese ? "国学精灵小奥" : "奥数精灵小奥"}
            </span>
            <span>点击小奥或对话框有惊喜 🌟</span>
          </div>
        </div>
      </div>
    </div>
  );
};
