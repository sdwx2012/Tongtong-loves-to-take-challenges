import React, { useState, useEffect } from "react";
import { Users, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface QueueGameProps {
  levelData: {
    questionType: "front_back" | "ordinal_both" | "between";
    frontCount?: number;
    backCount?: number;
    fromFront?: number;
    fromBack?: number;
    betweenPos?: { start: number; end: number }; // bunny at 2, panda at 7
    targetAnimal: string; // "kitty" | "bunny" | "bear"
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

// Visual animal definitions
const ANIMALS = [
  { id: "kitty", name: "小猫 🐱", color: "#fca5a5", svgId: 0 },
  { id: "bunny", name: "小兔 🐰", color: "#e2e8f0", svgId: 1 },
  { id: "puppy", name: "小狗 🐶", color: "#fde047", svgId: 2 },
  { id: "frog", name: "小蛙 🐸", color: "#86efac", svgId: 3 },
  { id: "panda", name: "熊猫 🐼", color: "#ffffff", svgId: 4 },
  { id: "bear", name: "小熊 🐻", color: "#fed7aa", svgId: 5 },
  { id: "penguin", name: "企鹅 🐧", color: "#93c5fd", svgId: 6 },
  { id: "fox", name: "小狐 🦊", color: "#fdba74", svgId: 7 }
];

export const QueueGame: React.FC<QueueGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { questionType, correctAnswer, targetAnimal } = levelData;

  const [clickedAnimals, setClickedAnimals] = useState<{ [idx: number]: boolean }>({});
  const [showGroups, setShowGroups] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setClickedAnimals({});
    setShowGroups(false);
    setUserAnswer("");
    setFeedback("点击小动物可以给它们编上号码哦！数一数，把正确的总人数填在下方吧！🔢");
  }, [levelData]);

  // Generate the list of animals for the line based on correctAnswer
  // Let's create an array of size equal to correctAnswer, or a static line of 8-10 animals depending on the level
  const queueLength = questionType === "between" && levelData.betweenPos
    ? levelData.betweenPos.end
    : correctAnswer;
  const lineAnimals = Array.from({ length: queueLength }).map((_, idx) => {
    // Select animal pattern based on index to ensure variety but keep target animal at correct index
    let targetIndex = 0;
    if (questionType === "front_back" && levelData.frontCount !== undefined) {
      targetIndex = levelData.frontCount;
    } else if (questionType === "ordinal_both" && levelData.fromFront !== undefined) {
      targetIndex = levelData.fromFront - 1;
    } else if (questionType === "between" && levelData.betweenPos !== undefined) {
      // bunny is at start, panda is at end
      if (idx === levelData.betweenPos.start - 1) return { ...ANIMALS[1], role: "start" }; // bunny
      if (idx === levelData.betweenPos.end - 1) return { ...ANIMALS[4], role: "end" }; // panda
    }

    if (idx === targetIndex && questionType !== "between") {
      const template = ANIMALS.find((a) => a.id === targetAnimal) || ANIMALS[0];
      return { ...template, role: "me" };
    }

    // Others
    const availableTemplates = ANIMALS.filter((a) => a.id !== targetAnimal);
    const template = availableTemplates[idx % availableTemplates.length];
    return { ...template, role: "queue" };
  });

  const handleAnimalClick = (idx: number) => {
    SoundEffects.playClick();
    setClickedAnimals((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCheck = () => {
    const answerNum = parseInt(userAnswer);
    if (isNaN(answerNum) || answerNum !== correctAnswer) {
      SoundEffects.playIncorrect();
      setFeedback("队伍里的小动物数量不对哦！再用小手指仔细数一数，或者点击‘显示排队分组’看看小奥的拆解图吧。");
      onIncorrect?.();
      return;
    }

    SoundEffects.playCorrect();
    setFeedback("哇！完美数对了！排队里的‘多算自己’和‘少算自己’陷阱都被你识破了，真了不起！🎉");
    onSolved(3);
  };

  // Render visual SVG based on template svgId
  const renderAnimalSVG = (svgId: number, color: string, isCrown: boolean, label: string) => {
    return (
      <div className="relative flex flex-col items-center">
        {isCrown && (
          <div className="absolute -top-7 animate-bounce">
            {/* Sparkling Gold Crown */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 drop-shadow-md fill-amber-400 stroke-amber-700">
              <polygon points="2,18 4,10 9,14 12,6 15,14 20,10 22,18" strokeWidth="1.5" />
              <circle cx="4" cy="9" r="1" fill="#f59e0b" />
              <circle cx="12" cy="5" r="1" fill="#f59e0b" />
              <circle cx="20" cy="9" r="1" fill="#f59e0b" />
              <rect x="5" y="18" width="14" height="2" fill="#ca8a04" rx="0.5" />
            </svg>
          </div>
        )}

        {/* Animal Head Wrapper */}
        <div className="w-14 h-14 rounded-full border-2 border-slate-700/10 flex items-center justify-center relative shadow-sm hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: color }}>
          {/* Simple Vector Animal Renderers */}
          {svgId === 0 && ( /* Kitty */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <polygon points="5,15 12,2 18,12" fill="#f87171" />
              <polygon points="35,15 28,2 22,12" fill="#f87171" />
              <circle cx="12" cy="22" r="2" fill="#1e293b" />
              <circle cx="28" cy="22" r="2" fill="#1e293b" />
              <ellipse cx="20" cy="25" rx="2" ry="1" fill="#f43f5e" />
              {/* Whiskers */}
              <line x1="8" y1="24" x2="1" y2="22" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="8" y1="26" x2="2" y2="28" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="32" y1="24" x2="39" y2="22" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="32" y1="26" x2="38" y2="28" stroke="#1e293b" strokeWidth="1.5" />
            </svg>
          )}
          {svgId === 1 && ( /* Bunny */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <ellipse cx="14" cy="12" rx="4" ry="10" fill="#f8fafc" />
              <ellipse cx="14" cy="12" rx="2" ry="7" fill="#fda4af" />
              <ellipse cx="26" cy="12" rx="4" ry="10" fill="#f8fafc" />
              <ellipse cx="26" cy="12" rx="2" ry="7" fill="#fda4af" />
              <circle cx="14" cy="25" r="2" fill="#ef4444" />
              <circle cx="26" cy="25" r="2" fill="#ef4444" />
              <polygon points="19,27 21,27 20,28.5" fill="#e11d48" />
            </svg>
          )}
          {svgId === 2 && ( /* Puppy */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <ellipse cx="8" cy="20" rx="4" ry="9" fill="#ca8a04" />
              <ellipse cx="32" cy="20" rx="4" ry="9" fill="#ca8a04" />
              <circle cx="13" cy="22" r="2" fill="#1e293b" />
              <circle cx="27" cy="22" r="2" fill="#1e293b" />
              <ellipse cx="20" cy="26" rx="3" ry="2" fill="#1e293b" />
            </svg>
          )}
          {svgId === 3 && ( /* Frog */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="13" cy="12" r="5" fill="#22c55e" />
              <circle cx="13" cy="12" r="2" fill="#ffffff" />
              <circle cx="13" cy="12" r="1" fill="#000000" />
              <circle cx="27" cy="12" r="5" fill="#22c55e" />
              <circle cx="27" cy="12" r="2" fill="#ffffff" />
              <circle cx="27" cy="12" r="1" fill="#000000" />
              <path d="M 12 25 Q 20 32 28 25" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="10" cy="22" r="1.5" fill="#fda4af" />
              <circle cx="30" cy="22" r="1.5" fill="#fda4af" />
            </svg>
          )}
          {svgId === 4 && ( /* Panda */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="10" cy="12" r="5" fill="#1e293b" />
              <circle cx="30" cy="12" r="5" fill="#1e293b" />
              <ellipse cx="14" cy="22" rx="4" ry="3" fill="#1e293b" />
              <ellipse cx="26" cy="22" rx="4" ry="3" fill="#1e293b" />
              <circle cx="14" cy="21" r="1.5" fill="#ffffff" />
              <circle cx="26" cy="21" r="1.5" fill="#ffffff" />
              <circle cx="20" cy="27" r="2" fill="#1e293b" />
            </svg>
          )}
          {svgId === 5 && ( /* Bear */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="10" cy="12" r="4.5" fill="#ca8a04" />
              <circle cx="30" cy="12" r="4.5" fill="#ca8a04" />
              <circle cx="13" cy="22" r="2" fill="#1e293b" />
              <circle cx="27" cy="22" r="2" fill="#1e293b" />
              <ellipse cx="20" cy="26" rx="4.5" ry="3" fill="#fef08a" />
              <circle cx="20" cy="25" r="1.5" fill="#1e293b" />
            </svg>
          )}
          {svgId === 6 && ( /* Penguin */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <ellipse cx="20" cy="20" rx="14" ry="16" fill="#1e293b" />
              <ellipse cx="20" cy="22" rx="9" ry="11" fill="#ffffff" />
              <circle cx="14" cy="18" r="2" fill="#000000" />
              <circle cx="26" cy="18" r="2" fill="#000000" />
              <polygon points="18,22 22,22 20,26" fill="#f97316" />
            </svg>
          )}
          {svgId === 7 && ( /* Fox */
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <polygon points="6,14 3,3 15,10" fill="#f97316" />
              <polygon points="34,14 37,3 25,10" fill="#f97316" />
              <polygon points="8,18 32,18 20,33" fill="#f97316" />
              <polygon points="13,18 27,18 20,30" fill="#ffffff" />
              <circle cx="13" cy="17" r="2" fill="#1e293b" />
              <circle cx="27" cy="17" r="2" fill="#1e293b" />
              <circle cx="20" cy="28" r="1.5" fill="#000000" />
            </svg>
          )}
        </div>

        {/* Text name label below animal */}
        <span className="text-[9px] text-slate-500 font-bold mt-1 bg-white border border-slate-100 rounded px-1 shadow-2xs">
          {label}
        </span>
      </div>
    );
  };

  // Helper values for dividing brackets
  const meIndex = lineAnimals.findIndex((a) => a.role === "me");
  const startIndex = lineAnimals.findIndex((a) => a.role === "start");
  const endIndex = lineAnimals.findIndex((a) => a.role === "end");

  const getGroupColorClass = (idx: number) => {
    if (!showGroups) return "";

    if (questionType === "between" && startIndex !== -1 && endIndex !== -1) {
      if (idx === startIndex) return "ring-4 ring-rose-400 ring-offset-2";
      if (idx === endIndex) return "ring-4 ring-rose-400 ring-offset-2";
      if (idx > startIndex && idx < endIndex) return "bg-rose-50 border-2 border-dashed border-rose-300 rounded-2xl scale-102";
      return "opacity-40";
    }

    if (idx === meIndex) {
      return "ring-4 ring-yellow-400 ring-offset-2 scale-105 z-30";
    }
    if (idx < meIndex) {
      return "bg-sky-100/50 border-2 border-dashed border-sky-300 rounded-2xl scale-98";
    }
    if (idx > meIndex) {
      return "bg-amber-100/50 border-2 border-dashed border-amber-300 rounded-2xl scale-98";
    }
    return "";
  };

  const getSequentialLabel = (idx: number) => {
    if (questionType === "between" && startIndex !== -1 && endIndex !== -1) {
      if (idx === startIndex) return "起点";
      if (idx === endIndex) return "终点";
      if (idx > startIndex && idx < endIndex) return `中间第 ${idx - startIndex} 只`;
      return "";
    }

    if (idx === meIndex) return "我自己";
    if (idx < meIndex) return `前面第 ${meIndex - idx} 个`;
    if (idx > meIndex) return `后面第 ${idx - meIndex} 个`;
    return "";
  };

  return (
    <div className="flex flex-col gap-6" id="queue-game">
      {/* Visual Line Field */}
      <div className="relative bg-gradient-to-b from-sky-50 to-indigo-50 border-4 border-slate-100 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between overflow-x-auto shadow-inner">
        {/* Sky Background objects */}
        <div className="absolute top-2 left-6 text-indigo-400 font-bold text-[10px] bg-indigo-50/80 rounded px-2 py-0.5 border border-indigo-100">
          📍 队伍方向：【 前 ⬅️ ⬅️ 后 】
        </div>

        {/* Queue of animals */}
        <div className="flex items-center gap-5 justify-center py-8 z-10 min-w-max mx-auto px-4 mt-4">
          {lineAnimals.map((animal, idx) => {
            const isTarget = animal.role === "me" || animal.role === "start" || animal.role === "end";
            const isMarked = !!clickedAnimals[idx];

            return (
              <div
                key={idx}
                className={`flex flex-col items-center relative p-2 transition-all duration-300 cursor-pointer ${getGroupColorClass(idx)}`}
                onClick={() => handleAnimalClick(idx)}
              >
                {/* Number tag above animal */}
                <div
                  className={`absolute -top-7 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-extrabold shadow-sm transition-all ${
                    isMarked
                      ? "bg-indigo-600 text-white border-indigo-700 scale-110"
                      : "bg-white text-slate-400 border-slate-200"
                  }`}
                >
                  {isMarked ? idx + 1 : "?"}
                </div>

                {/* Main Animal graphics */}
                {renderAnimalSVG(animal.svgId, animal.color, isTarget, animal.name)}

                {/* Subtitle label for explaining groups */}
                {showGroups && (
                  <span className="text-[8px] font-bold text-slate-500 mt-2 block max-w-[65px] text-center leading-tight">
                    {getSequentialLabel(idx)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live helper labels below */}
        {showGroups && (
          <div className="bg-white/80 border border-slate-200 p-3 rounded-2xl text-xs font-semibold text-slate-700 flex flex-col gap-1.5 shadow-sm max-w-xl mx-auto w-full">
            {questionType === "front_back" && (
              <>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-sky-200 rounded-full border border-sky-400" />
                  前面有 <span className="text-sky-600 font-extrabold">{levelData.frontCount}</span> 只动物（不包含我自己）
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full border border-yellow-500" />
                  我自己是 <span className="text-yellow-600 font-extrabold">1</span> 只动物
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-200 rounded-full border border-amber-400" />
                  后面有 <span className="text-amber-600 font-extrabold">{levelData.backCount}</span> 只动物
                </p>
                <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1 font-bold text-slate-800 text-center text-[13px]">
                  💡 算法公式：前面人数 ({levelData.frontCount}) + 我自己 (1) + 后面人数 ({levelData.backCount}) ={" "}
                  <span className="text-indigo-600 font-extrabold">{correctAnswer}</span> 人
                </div>
              </>
            )}

            {questionType === "ordinal_both" && (
              <>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-sky-200 rounded-full border border-sky-400" />
                  从前面数是第 <span className="text-sky-600 font-extrabold">{levelData.fromFront}</span> 个（数了 1 次我自己）
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-200 rounded-full border border-amber-400" />
                  从后面数是第 <span className="text-amber-600 font-extrabold">{levelData.fromBack}</span> 个（又数了 1 次我自己）
                </p>
                <p className="text-[10px] text-rose-500 italic font-medium pl-5 mt-0.5">
                  ⚠️ 发现了嘛？“我自己”被前后重复数了【两】次，所以需要减去多算的那一次哦！
                </p>
                <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1 font-bold text-slate-800 text-center text-[13px]">
                  💡 算法公式：从前数 ({levelData.fromFront}) + 从后数 ({levelData.fromBack}) - 1 (重复的自己) ={" "}
                  <span className="text-indigo-600 font-extrabold">{correctAnswer}</span> 人
                </div>
              </>
            )}

            {questionType === "between" && levelData.betweenPos && (
              <>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-rose-400 rounded-full" />
                  起点小兔是第 <span className="text-rose-600 font-extrabold">{levelData.betweenPos.start}</span> 个
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-rose-400 rounded-full" />
                  终点熊猫是第 <span className="text-rose-600 font-extrabold">{levelData.betweenPos.end}</span> 个
                </p>
                <p className="text-[10px] text-rose-500 italic font-medium pl-5 mt-0.5">
                  ⚠️ 注意：“之间”不包含两端（不包含起点小兔，也不包含终点熊猫）！
                </p>
                <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1 font-bold text-slate-800 text-center text-[13px]">
                  💡 算法公式：大位置 ({levelData.betweenPos.end}) - 小位置 ({levelData.betweenPos.start}) - 1 ={" "}
                  <span className="text-indigo-600 font-extrabold">{correctAnswer}</span> 只
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Answer Area */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-xs font-bold text-indigo-800">🤔 请计算：队伍一共有多少只小动物？</span>
          <p className="text-[10px] text-slate-500 mt-1">数对之后在右边填写数字吧：</p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="数一数"
            className="w-24 px-3 py-2 border-2 border-indigo-200 rounded-xl text-center font-extrabold text-indigo-900 bg-white focus:outline-none focus:border-indigo-500"
          />
          <span className="text-xs font-bold text-indigo-800">只</span>
        </div>
      </div>

      {/* Secret Guide bubble */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold text-slate-700">小仙女秘籍：</span>
          <p className="mt-1 leading-relaxed text-slate-500">{feedback}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-1">
        <button
          onClick={() => setShowGroups(!showGroups)}
          className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
            showGroups
              ? "bg-indigo-100 text-indigo-700 border-indigo-200"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Users className="w-3.5 h-3.5" />
          {showGroups ? "隐藏排队分组" : "显示排队分组 💡"}
        </button>

        <button
          onClick={handleCheck}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          核对答案
        </button>
      </div>
    </div>
  );
};
