import React, { useState, useEffect } from "react";
import { RefreshCw, Sparkles, HelpCircle, AlertCircle, ArrowRight } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface Candy {
  id: string;
  name: string;
  emoji: string;
  color: string;
  svgId: number;
}

interface PatternGameProps {
  levelData: {
    sequence: string[]; // Emojis/IDs representing the repeating sequence, e.g. ["candy_red", "candy_blue", "candy_yellow"]
    targetIndex: number; // e.g. 14
    choices: string[]; // e.g. ["candy_red", "candy_blue", "candy_yellow"]
    correctAnswer: string; // "candy_blue"
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

const CANDY_TEMPLATES: { [id: string]: Candy } = {
  candy_red: { id: "candy_red", name: "红硬糖 🔴", emoji: "🍬", color: "#f87171", svgId: 0 },
  candy_blue: { id: "candy_blue", name: "蓝硬糖 🔵", emoji: "🍬", color: "#60a5fa", svgId: 1 },
  candy_yellow: { id: "candy_yellow", name: "黄硬糖 🟡", emoji: "🍬", color: "#fbbf24", svgId: 2 },
  apple: { id: "apple", name: "红苹果 🍎", emoji: "🍎", color: "#f87171", svgId: 3 },
  banana: { id: "banana", name: "香蕉 🍌", emoji: "🍌", color: "#fef08a", svgId: 4 },
  orange: { id: "orange", name: "甜橙 🍊", emoji: "🍊", color: "#fb923c", svgId: 5 }
};

export const PatternGame: React.FC<PatternGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { sequence, targetIndex, choices, correctAnswer } = levelData;

  const [showGroups, setShowGroups] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setShowGroups(false);
    setShowMath(false);
    setSelectedAnswer(null);
    setFeedback(`魔法输送带正在缓缓吐出糖果！快找出规律，算算看第 ${targetIndex} 个落下的会是什么糖果呢？🍬`);
  }, [levelData]);

  // Generate a list of candies representing the visible queue on the conveyor belt
  // Render about 12-14 items so the repeating pattern is clearly visible
  const visibleCandiesCount = 14;
  const visibleCandies = Array.from({ length: visibleCandiesCount }).map((_, idx) => {
    const candyId = sequence[idx % sequence.length];
    return CANDY_TEMPLATES[candyId] || CANDY_TEMPLATES["candy_red"];
  });

  const handleChoiceClick = (choiceId: string) => {
    SoundEffects.playClick();
    setSelectedAnswer(choiceId);
    setFeedback(`你猜是【${CANDY_TEMPLATES[choiceId]?.name}】，核对一下答案是否正确吧！`);
  };

  const handleCheck = () => {
    if (!selectedAnswer) {
      SoundEffects.playIncorrect();
      setFeedback("先在右边选一个你认为正确的糖果，再来核对答案哦！");
      onIncorrect?.();
      return;
    }

    if (selectedAnswer !== correctAnswer) {
      SoundEffects.playIncorrect();
      setFeedback(`不对哦！第 ${targetIndex} 个掉出来的不是这个。点击“画圈分组 💡”找找周期规律吧！`);
      onIncorrect?.();
      return;
    }

    // Success!
    SoundEffects.playCorrect();
    setFeedback(`太棒了！完全数对了！第 ${targetIndex} 个落下的确实是 ${CANDY_TEMPLATES[correctAnswer]?.name}！🎉`);
    onSolved(3);
  };

  const periodLength = sequence.length;
  const fullGroups = Math.floor(targetIndex / periodLength);
  const remainder = targetIndex % periodLength;
  const targetCandyIdInGroup = sequence[remainder === 0 ? periodLength - 1 : remainder - 1];

  // Helper renderer for candy vector graphics
  const renderCandySVG = (svgId: number, color: string, name: string) => {
    return (
      <div className="relative flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm" style={{ backgroundColor: `${color}15` }}>
          {/* Svg shapes */}
          {svgId <= 2 ? ( /* Hard Candies */
            <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-xs">
              {/* Left twist tie */}
              <polygon points="5,15 15,20 5,25" fill={color} opacity="0.8" stroke="#1e293b" strokeWidth="1" />
              {/* Right twist tie */}
              <polygon points="35,15 25,20 35,25" fill={color} opacity="0.8" stroke="#1e293b" strokeWidth="1" />
              {/* Center candy */}
              <circle cx="20" cy="20" r="8" fill={color} stroke="#1e293b" strokeWidth="1.5" />
              <ellipse cx="18" cy="18" rx="2" ry="4" fill="#ffffff" opacity="0.6" />
              {/* Swirl design */}
              <path d="M 16 20 A 4 4 0 0 1 24 20" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8" />
            </svg>
          ) : svgId === 3 ? ( /* Apple */
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              {/* Leaf */}
              <ellipse cx="22" cy="11" rx="4" ry="2" fill="#22c55e" transform="rotate(-20 22 11)" />
              {/* Stem */}
              <path d="M 20 15 Q 22 10 24 12" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Apple body */}
              <ellipse cx="16" cy="23" rx="8" ry="7" fill="#ef4444" />
              <ellipse cx="24" cy="23" rx="8" ry="7" fill="#ef4444" />
              <circle cx="20" cy="24" r="7.5" fill="#ef4444" />
              {/* Gloss */}
              <ellipse cx="14" cy="19" rx="1.5" ry="3.5" fill="#ffffff" opacity="0.6" transform="rotate(-15 14 19)" />
            </svg>
          ) : svgId === 4 ? ( /* Banana */
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <path d="M 10 12 Q 25 12 28 28 Q 18 28 10 12" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 10 12 L 8 10" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              <path d="M 28 28 L 30 29" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : ( /* Orange */
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <circle cx="20" cy="20" r="10" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
              <circle cx="20" cy="13" r="1" fill="#22c55e" />
              {/* Orange texture dots */}
              <circle cx="15" cy="18" r="0.5" fill="#ea580c" />
              <circle cx="25" cy="17" r="0.5" fill="#ea580c" />
              <circle cx="21" cy="24" r="0.5" fill="#ea580c" />
              <ellipse cx="17" cy="16" rx="1.5" ry="3" fill="#ffffff" opacity="0.4" transform="rotate(-30 17 16)" />
            </svg>
          )}
        </div>
        <span className="text-[7.5px] font-semibold text-slate-400 mt-1">{idxToOrdinal(svgId + 1)}</span>
      </div>
    );
  };

  const idxToOrdinal = (idx: number) => {
    return `第 ${idx} 个`;
  };

  return (
    <div className="flex flex-col gap-6" id="pattern-game">
      {/* Conveyer belt field */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-800 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Lights */}
        <div className="absolute top-2 left-4 text-[9px] font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 animate-pulse">
          ⚡ 魔法输送带（向右前行 ➡️）
        </div>

        {/* Conveyer Belt candies line */}
        <div className="flex items-center gap-3 py-6 z-10 overflow-x-auto min-w-full px-2 mt-4 relative">
          {visibleCandies.map((candy, idx) => {
            const isGroupStart = idx % periodLength === 0;
            const isGroupEnd = (idx + 1) % periodLength === 0;

            return (
              <div
                key={idx}
                className={`relative p-2 flex flex-col items-center transition-all ${
                  showGroups
                    ? "bg-slate-800/40 border-t border-b border-slate-700/60 " +
                      (isGroupStart ? "border-l rounded-l-xl pl-3 " : "") +
                      (isGroupEnd ? "border-r rounded-r-xl pr-3 " : "")
                    : ""
                }`}
              >
                {/* Index tag */}
                <span className="text-[9px] font-extrabold text-slate-500 mb-1.5">
                  #{idx + 1}
                </span>

                {/* Candy graphic */}
                {renderCandySVG(candy.svgId, candy.color, candy.name)}

                {/* Period grouping label at the bottom */}
                {showGroups && isGroupStart && (
                  <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[8px] font-extrabold text-indigo-400 whitespace-nowrap">
                    周期 (长度:{periodLength})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Conveyer belt roll wheels */}
        <div className="w-full h-4 bg-slate-800 rounded-full mt-4 border-t-2 border-slate-700 shadow-inner flex justify-around items-center px-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-600 animate-spin" style={{ animationDuration: "3s" }} />
          ))}
        </div>

        {/* Animated Calculation helper */}
        {showMath && (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs font-semibold text-slate-300 flex flex-col gap-1.5 shadow-sm max-w-xl mx-auto w-full mt-4">
            <div className="text-center font-bold text-amber-400 text-sm mb-1">
              📐 周期规律魔法算式 🔮
            </div>
            <div className="flex justify-around items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-base">
              <div>
                <span className="text-slate-500 text-xs block">要算的那个</span>
                <span className="text-sky-400 font-extrabold">{targetIndex}</span>
              </div>
              <div className="text-slate-600">÷</div>
              <div>
                <span className="text-slate-500 text-xs block">每组长度</span>
                <span className="text-indigo-400 font-extrabold">{periodLength}</span>
              </div>
              <div className="text-slate-600">=</div>
              <div>
                <span className="text-slate-500 text-xs block">一共几组</span>
                <span className="text-emerald-400 font-extrabold">{fullGroups}</span>
              </div>
              <div className="text-slate-600">...</div>
              <div>
                <span className="text-slate-500 text-xs block">余数(剩第几个)</span>
                <span className="text-amber-400 font-extrabold">{remainder === 0 ? "整除" : remainder}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-1.5">
              💡 <span className="font-bold text-amber-300">小奥大白话：</span>
              把糖果每 <span className="text-indigo-300 font-bold">{periodLength}</span> 个打包成一盒。第 {targetIndex} 个正好是第 <span className="text-emerald-300 font-bold">{fullGroups}</span> 盒后的
              {remainder === 0 ? (
                <span> 最后一颗，也就是该周期里的第 <span className="text-amber-300 font-bold">{periodLength}</span> 颗！</span>
              ) : (
                <span> 额外第 <span className="text-amber-300 font-bold">{remainder}</span> 颗！所以和周期里的第 <span className="text-amber-300 font-bold">{remainder}</span> 颗一模一样。</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Choices & Quiz submission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left target description */}
        <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-3xl text-left flex flex-col justify-center">
          <span className="text-xs font-bold text-indigo-800">🤔 思考题：</span>
          <p className="text-sm font-extrabold text-indigo-950 mt-1 leading-relaxed">
            如果输送带不停地吐出糖果，那么掉落下来的第 <span className="text-amber-500 text-lg font-black underline">{targetIndex}</span> 个会是哪种糖果？
          </p>
        </div>

        {/* Right Multiple Choices cards */}
        <div className="bg-slate-50 border-2 border-slate-100 p-4 rounded-3xl flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-500 text-left">点击以下糖果选择你的答案：</span>
          <div className="grid grid-cols-3 gap-2">
            {choices.map((choiceId) => {
              const candy = CANDY_TEMPLATES[choiceId];
              if (!candy) return null;
              const isSelected = selectedAnswer === choiceId;

              return (
                <button
                  key={choiceId}
                  onClick={() => handleChoiceClick(choiceId)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 text-center ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 scale-102 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl mb-1">{candy.emoji}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{candy.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explanation bubble */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold text-slate-700">小仙女秘籍：</span>
          <p className="mt-1 leading-relaxed text-slate-500">{feedback}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-2">
          <button
            onClick={() => {
              SoundEffects.playClick();
              setShowGroups(!showGroups);
            }}
            className={`px-3 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              showGroups
                ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-45" />
            {showGroups ? "隐藏分组圈" : "画圈分组 💡"}
          </button>

          <button
            onClick={() => {
              SoundEffects.playClick();
              setShowMath(!showMath);
            }}
            className={`px-3 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              showMath
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showMath ? "隐藏魔法算式" : "数学算式 💡"}
          </button>
        </div>

        <button
          onClick={handleCheck}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          核对答案
        </button>
      </div>
    </div>
  );
};
