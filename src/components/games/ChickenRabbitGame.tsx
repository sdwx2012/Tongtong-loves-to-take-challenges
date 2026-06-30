import React, { useState, useEffect } from "react";
import { HelpCircle, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface ChickenRabbitGameProps {
  levelData: {
    heads: number;
    legs: number;
    correctAnswer: { chickens: number; rabbits: number };
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const ChickenRabbitGame: React.FC<ChickenRabbitGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { heads, legs } = levelData;
  const [chickens, setChickens] = useState(0);
  const [rabbits, setRabbits] = useState(0);
  const [showHypothesis, setShowHypothesis] = useState(false);
  const [hypothesisStep, setHypothesisStep] = useState(0); // 0: initial, 1: assume chickens, 2: leg difference
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Reset state when level changes
    setChickens(0);
    setRabbits(0);
    setShowHypothesis(false);
    setHypothesisStep(0);
    setFeedback("笼子关着一些鸡和兔。动动小手，让笼子里的头和脚和题目一样吧！");
  }, [levelData]);

  const currentHeads = chickens + rabbits;
  const currentLegs = chickens * 2 + rabbits * 4;

  const handleAdjust = (type: "chicken" | "rabbit", amount: number) => {
    SoundEffects.playClick();
    if (type === "chicken") {
      const nextVal = Math.max(0, chickens + amount);
      if (nextVal + rabbits > heads) {
        setFeedback("头数太多啦！已经超过了 " + heads + " 个头哦。");
        return;
      }
      setChickens(nextVal);
    } else {
      const nextVal = Math.max(0, rabbits + amount);
      if (chickens + nextVal > heads) {
        setFeedback("头数太多啦！已经超过了 " + heads + " 个头哦。");
        return;
      }
      setRabbits(nextVal);
    }
    setFeedback(`当前头数：${chickens + rabbits}/${heads}，脚数：${chickens * 2 + rabbits * 4}/${legs}`);
  };

  const handleCheck = () => {
    if (chickens + rabbits !== heads) {
      SoundEffects.playIncorrect();
      setFeedback(`头数不对哦！现在有 ${chickens + rabbits} 个头，但笼子里应该有 ${heads} 个头。`);
      onIncorrect?.();
      return;
    }
    if (chickens * 2 + rabbits * 4 !== legs) {
      SoundEffects.playIncorrect();
      setFeedback(`脚数不对哦！现在有 ${chickens * 2 + rabbits * 4} 只脚，但应该有 ${legs} 只脚。`);
      onIncorrect?.();
      return;
    }

    // Success!
    SoundEffects.playCorrect();
    setFeedback("太棒了！你完美解决了这道题！🎉");
    onSolved(3);
  };

  // Automated Hypothesis animation workflow
  const runHypothesis = () => {
    SoundEffects.playClick();
    setShowHypothesis(true);
    setHypothesisStep(1);
    // All are chickens
    setChickens(heads);
    setRabbits(0);
    setFeedback(`假设全是鸡：现在有 ${heads} 只鸡。头数：${heads}，脚数变成：${heads} × 2 = ${heads * 2}。`);
  };

  const resetGame = () => {
    SoundEffects.playClick();
    setChickens(0);
    setRabbits(0);
    setShowHypothesis(false);
    setHypothesisStep(0);
    setFeedback("笼子关着一些鸡和兔。动动小手，让笼子里的头和脚和题目一样吧！");
  };

  const nextHypothesisStep = () => {
    SoundEffects.playClick();
    if (hypothesisStep === 1) {
      setHypothesisStep(2);
      setFeedback(`脚数相差：实际有 ${legs} 只脚，而假设只有 ${heads * 2} 只脚。少算了 ${legs - heads * 2} 只脚！`);
    } else if (hypothesisStep === 2) {
      setHypothesisStep(3);
      const neededRabbits = (legs - (heads * 2)) / 2;
      const neededChickens = heads - neededRabbits;
      setChickens(neededChickens);
      setRabbits(neededRabbits);
      setFeedback(`把鸡换成兔：一只兔比一只鸡多 2 只脚。少算的 ${legs - heads * 2} 只脚，分给鸡，每只鸡添 2 只脚变兔子！我们需要 ${neededRabbits} 只兔和 ${neededChickens} 只鸡。现在头脚完全一致啦！✨`);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="chicken-rabbit-game">
      {/* Target stats Display */}
      <div className="grid grid-cols-2 gap-4 animate-fadeIn">
        <div className="bg-white border-3 border-amber-300 p-3 rounded-2xl flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#f59e0b]">
          <span className="text-xs font-black text-amber-700">目标头数 👤</span>
          <span className="text-3xl font-black text-orange-600">{heads}</span>
        </div>
        <div className="bg-white border-3 border-amber-300 p-3 rounded-2xl flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#f59e0b]">
          <span className="text-xs font-black text-amber-700">目标脚数 🐾</span>
          <span className="text-3xl font-black text-orange-600">{legs}</span>
        </div>
      </div>

      {/* Main Sandbox Cage */}
      <div className="relative bg-amber-50/70 border-4 border-amber-400 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-inner animate-fadeIn">
        {/* Wooden Cage bars background */}
        <div className="absolute inset-0 flex justify-around opacity-15 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-full bg-amber-800" />
          ))}
        </div>

        {/* Animals Render area */}
        <div className="flex flex-wrap items-center justify-center gap-6 z-10 min-h-[120px] py-4">
          {/* Chickens */}
          {Array.from({ length: chickens }).map((_, idx) => (
            <div
              key={`c-${idx}`}
              onClick={() => {
                // Click a chicken to add legs (turns into rabbit)
                if (chickens > 0) {
                  SoundEffects.playClick();
                  setChickens(chickens - 1);
                  setRabbits(rabbits + 1);
                  setFeedback("你给一只小鸡加了两只脚，它变身成可爱的小兔子啦！🔮");
                }
              }}
              className="group cursor-pointer relative transform hover:scale-110 active:scale-95 transition-all animate-bounce"
              style={{ animationDuration: `${1.5 + idx * 0.1}s` }}
            >
              {/* Chicken SVG */}
              <svg viewBox="0 0 40 40" className="w-14 h-14 drop-shadow-md">
                {/* Comb */}
                <path d="M 16 6 Q 20 2 24 6 Q 28 2 30 10 Z" fill="#ef4444" />
                {/* Body */}
                <circle cx="20" cy="22" r="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                {/* Beak */}
                <path d="M 10 20 L 6 22 L 10 24 Z" fill="#f97316" />
                {/* Eye */}
                <circle cx="16" cy="18" r="2" fill="#1e293b" />
                <circle cx="15.5" cy="17.5" r="0.5" fill="#ffffff" />
                {/* Wing */}
                <path d="M 22 20 Q 28 20 26 26 Q 20 26 22 20 Z" fill="#facc15" />
                {/* 2 Legs */}
                <line x1="17" y1="33" x2="17" y2="38" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="23" y1="33" x2="23" y2="38" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
                {/* Feet claws */}
                <line x1="17" y1="38" x2="14" y2="39" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
                <line x1="23" y1="38" x2="26" y2="39" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-amber-100 text-[9px] font-black text-amber-800 px-1.5 rounded-full border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity">
                鸡(2脚)
              </span>
            </div>
          ))}

          {/* Rabbits */}
          {Array.from({ length: rabbits }).map((_, idx) => (
            <div
              key={`r-${idx}`}
              onClick={() => {
                // Click a rabbit to remove legs (turns into chicken)
                if (rabbits > 0) {
                  SoundEffects.playClick();
                  setRabbits(rabbits - 1);
                  setChickens(chickens + 1);
                  setFeedback("你拿走了兔子两只脚，它飞快地收起耳朵变回小鸡啦！🔮");
                }
              }}
              className="group cursor-pointer relative transform hover:scale-110 active:scale-95 transition-all animate-bounce"
              style={{ animationDuration: `${2.0 + idx * 0.15}s` }}
            >
              {/* Rabbit SVG */}
              <svg viewBox="0 0 40 40" className="w-14 h-14 drop-shadow-md">
                {/* Long Ears */}
                <ellipse cx="14" cy="9" rx="3.5" ry="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="14" cy="9" rx="1.5" ry="5" fill="#fda4af" />

                <ellipse cx="26" cy="9" rx="3.5" ry="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="26" cy="9" rx="1.5" ry="5" fill="#fda4af" />

                {/* Body */}
                <circle cx="20" cy="23" r="11" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Cheeks */}
                <circle cx="15" cy="25" r="1.5" fill="#fda4af" />
                <circle cx="25" cy="25" r="1.5" fill="#fda4af" />
                {/* Eye */}
                <circle cx="15" cy="19" r="2.2" fill="#ef4444" />
                <circle cx="25" cy="19" r="2.2" fill="#ef4444" />
                <circle cx="14.5" cy="18.5" r="0.6" fill="#ffffff" />
                <circle cx="24.5" cy="18.5" r="0.6" fill="#ffffff" />
                {/* Nose */}
                <polygon points="19,21 21,21 20,22.5" fill="#f43f5e" />
                {/* 4 Legs */}
                <line x1="15" y1="33" x2="13" y2="38" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="18" y1="33" x2="17" y2="38" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="33" x2="23" y2="38" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="25" y1="33" x2="27" y2="38" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-rose-100 text-[9px] font-black text-rose-800 px-1.5 rounded-full border border-rose-200 opacity-0 group-hover:opacity-100 transition-opacity">
                兔(4脚)
              </span>
            </div>
          ))}

          {/* Empty Cage warning */}
          {chickens === 0 && rabbits === 0 && (
            <div className="text-center text-amber-800/50 py-8 font-black select-none">
              笼子空荡荡的，快在下方召唤鸡和兔吧！👇
            </div>
          )}
        </div>

        {/* Live Counters */}
        <div className="flex justify-between items-center bg-orange-100/50 border-2 border-orange-200 px-4 py-2.5 rounded-xl text-xs font-black text-orange-800 shadow-sm mt-4">
          <span>当前头数: <span className="text-base text-orange-600 font-black">{currentHeads}</span> / {heads}</span>
          <span>当前脚数: <span className="text-base text-orange-600 font-black">{currentLegs}</span> / {legs}</span>
        </div>
      </div>

      {/* Control panel & Help */}
      <div className="flex flex-col gap-4">
        {/* Add/Remove tools */}
        <div className="grid grid-cols-2 gap-4">
          {/* Chicken summoner */}
          <div className="bg-amber-50 border-3 border-amber-300 p-4 rounded-2xl flex flex-col items-center shadow-[2px_2px_0px_0px_#f59e0b]">
            <span className="text-xs font-black text-amber-800 mb-2">小鸡 🐥 (2 只脚)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAdjust("chicken", -1)}
                className="w-10 h-10 flex items-center justify-center bg-white text-orange-600 rounded-xl border-2 border-orange-300 shadow-sm active:translate-y-0.5 font-black text-lg hover:bg-orange-50"
              >
                -
              </button>
              <span className="w-12 text-center flex items-center justify-center text-xl font-black text-amber-900">
                {chickens}
              </span>
              <button
                onClick={() => handleAdjust("chicken", 1)}
                className="w-10 h-10 flex items-center justify-center bg-orange-500 border-b-4 border-orange-700 text-white rounded-xl shadow-sm active:translate-y-0.5 active:border-b-0 font-black text-lg hover:bg-orange-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Rabbit summoner */}
          <div className="bg-amber-50 border-3 border-amber-300 p-4 rounded-2xl flex flex-col items-center shadow-[2px_2px_0px_0px_#f59e0b]">
            <span className="text-xs font-black text-amber-800 mb-2">兔子 🐰 (4 只脚)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAdjust("rabbit", -1)}
                className="w-10 h-10 flex items-center justify-center bg-white text-orange-600 rounded-xl border-2 border-orange-300 shadow-sm active:translate-y-0.5 font-black text-lg hover:bg-orange-50"
              >
                -
              </button>
              <span className="w-12 text-center flex items-center justify-center text-xl font-black text-amber-900">
                {rabbits}
              </span>
              <button
                onClick={() => handleAdjust("rabbit", 1)}
                className="w-10 h-10 flex items-center justify-center bg-orange-500 border-b-4 border-orange-700 text-white rounded-xl shadow-sm active:translate-y-0.5 active:border-b-0 font-black text-lg hover:bg-orange-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Explanation bubble */}
        <div className="bg-amber-50/70 border-3 border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex gap-2.5 items-start">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-black text-amber-900">小仙女秘籍：</span>
            <p className="mt-1 leading-relaxed text-amber-700/90 font-bold">{feedback}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap gap-2 justify-between mt-2">
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className="px-4 py-2.5 bg-white border-3 border-orange-400 text-orange-600 rounded-xl text-xs font-black hover:bg-orange-50 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#ea580c] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5px]" />
              清空重置
            </button>

            {!showHypothesis ? (
              <button
                onClick={runHypothesis}
                className="px-4 py-2.5 bg-white border-3 border-amber-400 text-amber-700 rounded-xl text-xs font-black hover:bg-amber-50 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#f59e0b] flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                假设法演示 💡
              </button>
            ) : (
              hypothesisStep < 3 && (
                <button
                  onClick={nextHypothesisStep}
                  className="px-4 py-2.5 bg-orange-500 border-b-4 border-orange-700 text-white rounded-xl text-xs font-black active:translate-y-0.5 active:border-b-0 flex items-center gap-1.5 shadow-sm animate-pulse"
                >
                  下一步 ({hypothesisStep}/3) 👉
                </button>
              )
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={currentHeads !== heads}
            className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-all transform ${
              currentHeads === heads
                ? "bg-orange-500 border-b-4 border-orange-700 hover:bg-orange-600 text-white active:translate-y-0.5 active:border-b-0"
                : "bg-amber-100 border-b-4 border-amber-200 text-amber-300 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            确认答案
          </button>
        </div>
      </div>
    </div>
  );
};
