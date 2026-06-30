import React, { useState, useEffect } from "react";
import { Trees, RefreshCw, Sparkles, HelpCircle, AlertCircle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface TreePlantingGameProps {
  levelData: {
    length: number;
    interval: number;
    type: "both" | "one" | "neither"; // 两端都种 | 一端种 | 两端都不种
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const TreePlantingGame: React.FC<TreePlantingGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { length, interval, type, correctAnswer } = levelData;

  const [selectedType, setSelectedType] = useState<"both" | "one" | "neither">("both");
  const [plantedSpots, setPlantedSpots] = useState<{ [meter: number]: boolean }>({});
  const [userNumberAnswer, setUserNumberAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");

  const maxSpotsCount = Math.floor(length / interval) + 1;
  const allPossibleMeters = Array.from({ length: maxSpotsCount }).map((_, idx) => idx * interval);

  useEffect(() => {
    setPlantedSpots({});
    setUserNumberAnswer("");
    setSelectedType("both");
    setFeedback("请仔细观察道路！选择种植模式，然后点击发光的坑位，亲手把小树苗种下去吧！🌱");
  }, [levelData]);

  // Determine which spots are active based on selectedType
  const isSpotValidForType = (meter: number, plantType: "both" | "one" | "neither") => {
    if (plantType === "both") {
      return true; // All spots valid
    }
    if (plantType === "one") {
      return meter > 0; // Skip 0m end
    }
    if (plantType === "neither") {
      return meter > 0 && meter < length; // Skip 0m and max L m ends
    }
    return false;
  };

  const handleSpotClick = (meter: number) => {
    if (!isSpotValidForType(meter, selectedType)) {
      SoundEffects.playClick();
      setFeedback("现在的种植模式下，这个坑位不能种树哦！请先切换模式。");
      return;
    }

    SoundEffects.playClick();
    setPlantedSpots((prev) => {
      const active = !prev[meter];
      const next = { ...prev };
      if (active) {
        next[meter] = true;
      } else {
        delete next[meter];
      }
      return next;
    });

    setFeedback("小树苗种下啦！吸饱水分，长大树喽 🌳！");
  };

  const handleTypeToggle = (typeChoice: "both" | "one" | "neither") => {
    SoundEffects.playClick();
    setSelectedType(typeChoice);
    // Clear planted spots that are no longer valid under new type
    setPlantedSpots((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        const m = parseInt(k);
        if (!isSpotValidForType(m, typeChoice)) {
          delete next[m];
        }
      });
      return next;
    });

    const chMap = { both: "两端都种", one: "一端不种(一端种)", neither: "两端都不种" };
    setFeedback(`种植模式已切到：【${chMap[typeChoice]}】，仔细数数新开放的树坑数量吧！🔍`);
  };

  const handleCheck = () => {
    // 1. Verify selectedType matches
    if (selectedType !== type) {
      SoundEffects.playIncorrect();
      const currentCh = selectedType === "both" ? "两端都种" : selectedType === "one" ? "一端种" : "两端都不种";
      const targetCh = type === "both" ? "两端都种" : type === "one" ? "一端种" : "两端都不种";
      setFeedback(`哎呀！题目要求是【${targetCh}】模式，但你选了【${currentCh}】。切换一下模式试试！`);
      onIncorrect?.();
      return;
    }

    // 2. Count planted trees
    const plantedCount = Object.keys(plantedSpots).length;
    const answerNum = parseInt(userNumberAnswer);

    // Get expected spots for correct type
    const expectedSpots = allPossibleMeters.filter((m) => isSpotValidForType(m, type));

    // Verify all active spots are planted
    const allExpectedPlanted = expectedSpots.every((m) => plantedSpots[m]);

    if (!allExpectedPlanted || plantedCount !== expectedSpots.length) {
      SoundEffects.playIncorrect();
      setFeedback(`发光的树坑还没有全部种满树哦，快去把所有小树苗种满。`);
      onIncorrect?.();
      return;
    }

    if (isNaN(answerNum) || answerNum !== correctAnswer) {
      SoundEffects.playIncorrect();
      setFeedback(`小树虽然种好了，但是你填写的树苗数量 [${userNumberAnswer || "空"}] 不对哦。数一数你一共种了多少棵？`);
      onIncorrect?.();
      return;
    }

    // Success!
    SoundEffects.playCorrect();
    setFeedback("恭喜你！完全正确！你掌握了植树问题的黄金法则！🎉");
    onSolved(3);
  };

  const resetGame = () => {
    SoundEffects.playClick();
    setPlantedSpots({});
    setUserNumberAnswer("");
    setSelectedType("both");
    setFeedback("重新排列，别灰心，树苗在等着你呢！🌳");
  };

  return (
    <div className="flex flex-col gap-6" id="tree-planting-game">
      {/* Parameters Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-sky-50 border border-sky-100 p-2 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-sky-600">总长度 📏</p>
          <p className="text-xl font-extrabold text-sky-800">{length} 米</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-2 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-amber-600">树间隔 📐</p>
          <p className="text-xl font-extrabold text-amber-800">{interval} 米</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-indigo-600">间隔个数 📊</p>
          <p className="text-xl font-extrabold text-indigo-800">{length / interval} 个</p>
        </div>
      </div>

      {/* Interactive Mode Toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-600 text-left">选择种植方式 (需符合题目要求)</span>
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => handleTypeToggle("both")}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === "both"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            🌳 两端都种
          </button>
          <button
            onClick={() => handleTypeToggle("one")}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === "one"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            🌱 一端种
          </button>
          <button
            onClick={() => handleTypeToggle("neither")}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === "neither"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            🍂 两端不种
          </button>
        </div>
      </div>

      {/* Main Path Field */}
      <div className="relative bg-gradient-to-b from-sky-100 via-emerald-100 to-emerald-200 border-4 border-white rounded-3xl p-6 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-md">
        {/* Sun in sky */}
        <div className="absolute top-4 right-6 w-10 h-10 bg-amber-400 rounded-full blur-xs opacity-80 animate-pulse" />

        {/* Clouds */}
        <div className="absolute top-6 left-10 w-16 h-6 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDuration: "12s" }} />

        {/* Earth Path / Road */}
        <div className="relative w-full h-8 bg-amber-800/80 rounded-full mt-16 shadow-inner flex items-center justify-between px-6 border-b-4 border-amber-900">
          {/* Milestone markers */}
          {allPossibleMeters.map((meter) => {
            const isValid = isSpotValidForType(meter, selectedType);
            const isPlanted = !!plantedSpots[meter];

            return (
              <div
                key={meter}
                className="absolute transform -translate-x-1/2 flex flex-col items-center select-none"
                style={{ left: `${(meter / length) * 88 + 6}%` }}
              >
                {/* Visual Tree */}
                <div className="h-20 flex flex-col items-center justify-end mb-1">
                  {isPlanted ? (
                    <div
                      onClick={() => handleSpotClick(meter)}
                      className="cursor-pointer transform hover:scale-115 hover:rotate-2 active:scale-95 transition-all origin-bottom animate-bounce"
                    >
                      {/* Detailed Tree SVG */}
                      <svg viewBox="0 0 40 50" className="w-12 h-16 drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
                        {/* Foilage */}
                        <circle cx="20" cy="18" r="12" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
                        <circle cx="14" cy="14" r="8" fill="#4ade80" />
                        <circle cx="26" cy="16" r="9" fill="#15803d" opacity="0.6" />
                        <circle cx="22" cy="12" r="6" fill="#86efac" />
                        {/* Red apples */}
                        <circle cx="16" cy="18" r="1.8" fill="#ef4444" />
                        <circle cx="24" cy="14" r="1.8" fill="#ef4444" />
                        <circle cx="20" cy="22" r="1.8" fill="#ef4444" />
                        {/* Trunk */}
                        <path d="M 18 30 L 16 48 L 24 48 L 22 30 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                        <line x1="17" y1="36" x2="13" y2="33" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="23" y1="39" x2="26" y2="36" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  ) : (
                    isValid && (
                      <div
                        onClick={() => handleSpotClick(meter)}
                        className="w-8 h-8 rounded-full border-2 border-dashed border-yellow-500 bg-yellow-400/20 hover:bg-yellow-400/40 cursor-pointer animate-pulse flex items-center justify-center text-[10px] font-bold text-amber-900 shadow-sm"
                      >
                        🕳️
                      </div>
                    )
                  )}
                </div>

                {/* Milestone Sign board */}
                <div className="bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800 shadow-sm relative z-20">
                  {meter}m
                </div>
              </div>
            );
          })}
        </div>

        {/* Brackets representing intervals below the road */}
        <div className="w-full flex justify-between px-6 mt-6 pointer-events-none select-none relative h-6">
          {Array.from({ length: length / interval }).map((_, i) => (
            <div
              key={i}
              className="absolute border-l-2 border-r-2 border-b-2 border-indigo-500/40 text-[9px] font-bold text-indigo-700 flex items-center justify-center h-4 text-center"
              style={{
                left: `${(i * interval / length) * 88 + 6}%`,
                width: `${(interval / length) * 88}%`
              }}
            >
              间隔 {i + 1} ({interval}米)
            </div>
          ))}
        </div>
      </div>

      {/* Answer Inputs */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-xs font-bold text-indigo-800">🤔 思考题：根据你的种植图，一共需要多少棵树苗？</span>
          <p className="text-[10px] text-slate-500 mt-1">请在输入框写下你的答案：</p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={userNumberAnswer}
            onChange={(e) => setUserNumberAnswer(e.target.value)}
            placeholder="填写数量"
            className="w-24 px-3 py-2 border-2 border-indigo-200 rounded-xl text-center font-extrabold text-indigo-900 bg-white focus:outline-none focus:border-indigo-500"
          />
          <span className="text-xs font-bold text-indigo-800">棵</span>
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

      {/* Bottom actions */}
      <div className="flex justify-between items-center mt-1">
        <button
          onClick={resetGame}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置树木
        </button>

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
