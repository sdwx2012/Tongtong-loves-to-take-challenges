import React, { useState, useEffect } from "react";
import { RefreshCw, Sparkles, Scale, AlertCircle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface SumDiffGameProps {
  levelData: {
    total: number;
    difference: number;
    largerLabel: string; // e.g. "红苹果"
    smallerLabel: string; // e.g. "绿苹果"
    correctAnswer: { larger: number; smaller: number };
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const SumDiffGame: React.FC<SumDiffGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { total, difference, largerLabel, smallerLabel, correctAnswer } = levelData;

  const [largerCount, setLargerCount] = useState(0);
  const [smallerCount, setSmallerCount] = useState(0);
  const [demoStep, setDemoStep] = useState(0); // 0: manual, 1: show total, 2: slice difference, 3: scale balance, 4: combine back
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setLargerCount(0);
    setSmallerCount(0);
    setDemoStep(0);
    setFeedback(`把苹果装进左右两个篮子。现在一共需要分配 ${total} 个苹果，且${largerLabel}比${smallerLabel}多 ${difference} 个！🍎`);
  }, [levelData]);

  const handleAdjust = (basket: "larger" | "smaller", amount: number) => {
    SoundEffects.playClick();
    if (basket === "larger") {
      const next = Math.max(0, largerCount + amount);
      if (next + smallerCount > total) {
        setFeedback(`分出去的苹果总数已经超过 ${total} 个啦！`);
        return;
      }
      setLargerCount(next);
    } else {
      const next = Math.max(0, smallerCount + amount);
      if (largerCount + next > total) {
        setFeedback(`分出去的苹果总数已经超过 ${total} 个啦！`);
        return;
      }
      setSmallerCount(next);
    }
    setFeedback(`当前分配状况 ➡️ ${largerLabel}: ${largerCount} 个，${smallerLabel}: ${smallerCount} 个。总计: ${largerCount + smallerCount}/${total}`);
  };

  const handleCheck = () => {
    if (largerCount + smallerCount !== total) {
      SoundEffects.playIncorrect();
      setFeedback(`苹果数量分配不够哦！现在只分配了 ${largerCount + smallerCount} 个苹果，但我们需要分配完 ${total} 个。`);
      onIncorrect?.();
      return;
    }

    if (largerCount - smallerCount !== difference) {
      SoundEffects.playIncorrect();
      setFeedback(`两个篮子的苹果数量差值不对哦！目前 ${largerLabel} 比 ${smallerLabel} 多了 ${largerCount - smallerCount} 个，应该正好相差 ${difference} 个。`);
      onIncorrect?.();
      return;
    }

    // Success!
    SoundEffects.playCorrect();
    setFeedback("太棒了！天平完美平衡并且符合所有差值条件！你解开了这道题！🎉");
    onSolved(3);
  };

  // Run the animated step-by-step hypothesis
  const runDemo = () => {
    SoundEffects.playClick();
    setDemoStep(1);
    setLargerCount(correctAnswer.larger);
    setSmallerCount(correctAnswer.smaller);
    setFeedback(`假设分配好苹果：总数是 ${total} 个。${largerLabel} 比 ${smallerLabel} 多了 ${difference} 个。天平向下倾斜了。`);
  };

  const nextDemoStep = () => {
    SoundEffects.playClick();
    if (demoStep === 1) {
      setDemoStep(2);
      // Lift the difference from the larger basket
      setLargerCount(correctAnswer.larger - difference);
      setFeedback(`第一步：我们先把 ${largerLabel} 多出来的 ${difference} 个苹果【拿走】(此时总数变成 ${total} - ${difference} = ${total - difference} 个)。`);
    } else if (demoStep === 2) {
      setDemoStep(3);
      // Now both are equal!
      setFeedback(`第二步：看！两个篮子的苹果现在【完全一样多】了！天平完美平衡！所以，现在绿篮子（较小数）分到了：(${total} - ${difference}) ÷ 2 = ${(total - difference) / 2} 个！`);
    } else if (demoStep === 3) {
      setDemoStep(4);
      // Put the difference back
      setLargerCount(correctAnswer.larger);
      setFeedback(`第三步：最后，我们把多出的 ${difference} 个苹果【还给】红篮子。所以，红篮子分到了：${(total - difference) / 2} + ${difference} = ${correctAnswer.larger} 个！大功告成！`);
    }
  };

  const resetGame = () => {
    SoundEffects.playClick();
    setLargerCount(0);
    setSmallerCount(0);
    setDemoStep(0);
    setFeedback("重置完成，来挑战一下，看你能不能手动分配出完美平衡吧！🍏");
  };

  // Calculate balance tilt angle
  // angle > 0 tilts left (larger goes down), angle < 0 tilts right (smaller goes down)
  const diff = largerCount - smallerCount;
  const maxTilt = 12; // max rotation degrees
  const tiltAngle = Math.max(-maxTilt, Math.min(maxTilt, diff * 1.5));

  return (
    <div className="flex flex-col gap-6" id="sum-diff-game">
      {/* Target specs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-50 border-2 border-rose-100 p-3 rounded-2xl text-center shadow-sm">
          <p className="text-xs font-bold text-rose-600">总共苹果数量 🍎</p>
          <p className="text-3xl font-extrabold text-rose-800">{total} 个</p>
        </div>
        <div className="bg-amber-50 border-2 border-amber-100 p-3 rounded-2xl text-center shadow-sm">
          <p className="text-xs font-bold text-amber-600">两个篮子差值 ⚖️</p>
          <p className="text-3xl font-extrabold text-amber-800">{difference} 个</p>
        </div>
      </div>

      {/* Tiltable Balance Scale Visualizer */}
      <div className="relative bg-gradient-to-b from-blue-50 to-indigo-100/50 border-4 border-white rounded-3xl p-6 min-h-[250px] flex flex-col justify-between overflow-hidden shadow-md">
        {/* Cute background birds or trees */}
        <div className="absolute top-4 left-6 text-slate-400 font-bold text-[10px] bg-white/80 rounded px-2.5 py-1 border border-slate-200 shadow-3xs">
          ⚖️ 提示：左边是【{largerLabel}】篮子，右边是【{smallerLabel}】篮子！
        </div>

        {/* Dynamic Scale Drawing */}
        <div className="flex flex-col items-center justify-center h-44 mt-6 relative">
          {/* Scale Beam & Plates (rotatable group) */}
          <div
            className="w-full flex justify-between px-12 relative z-10 transition-transform duration-500 ease-out origin-center"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Center beam line */}
            <div className="absolute top-4 left-[10%] right-[10%] h-2.5 bg-slate-700/80 rounded-full" />

            {/* Left Plate (Larger basket) */}
            <div
              className="flex flex-col items-center transition-transform duration-500 origin-top"
              style={{ transform: `rotate(${-tiltAngle}deg)` }} // keep plate horizontal
            >
              <div className="w-0.5 h-6 bg-slate-500" />
              {/* Wooden Red Basket */}
              <div className="w-24 h-16 bg-rose-500/90 border-3 border-rose-700 rounded-b-3xl rounded-t-lg relative flex flex-wrap items-end justify-center p-2 shadow-md hover:bg-rose-600 cursor-pointer">
                <span className="absolute -top-6 text-[10px] font-extrabold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                  {largerLabel}: {largerCount}个
                </span>

                {/* Apples inside red basket */}
                <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                  {Array.from({ length: largerCount }).map((_, i) => (
                    <div
                      key={`l-${i}`}
                      className="w-3.5 h-3.5 bg-rose-600 rounded-full border border-rose-800 shadow-3xs animate-bounce"
                      style={{ animationDuration: `${1.2 + i * 0.1}s` }}
                    />
                  ))}
                  {largerCount === 0 && (
                    <span className="text-[10px] text-rose-200/60 font-bold py-2">空空的</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Plate (Smaller basket) */}
            <div
              className="flex flex-col items-center transition-transform duration-500 origin-top"
              style={{ transform: `rotate(${-tiltAngle}deg)` }} // keep plate horizontal
            >
              <div className="w-0.5 h-6 bg-slate-500" />
              {/* Wooden Green Basket */}
              <div className="w-24 h-16 bg-emerald-500/90 border-3 border-emerald-700 rounded-b-3xl rounded-t-lg relative flex flex-wrap items-end justify-center p-2 shadow-md hover:bg-emerald-600 cursor-pointer">
                <span className="absolute -top-6 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  {smallerLabel}: {smallerCount}个
                </span>

                {/* Apples inside green basket */}
                <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                  {Array.from({ length: smallerCount }).map((_, i) => (
                    <div
                      key={`s-${i}`}
                      className="w-3.5 h-3.5 bg-emerald-500 rounded-full border border-emerald-700 shadow-3xs animate-bounce"
                      style={{ animationDuration: `${1.5 + i * 0.1}s` }}
                    />
                  ))}
                  {smallerCount === 0 && (
                    <span className="text-[10px] text-emerald-200/60 font-bold py-2">空空的</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scale Base (Stable pillar) */}
          <div className="absolute top-4 w-3.5 h-36 bg-slate-700 rounded-t-md" />
          <div className="absolute bottom-0 w-24 h-4 bg-slate-700 rounded-full" />
          <div className="absolute bottom-3 w-16 h-4 bg-slate-600 rounded-t-md" />
        </div>

        {/* Counter sum tracker */}
        <div className="flex justify-between items-center bg-white/70 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 shadow-sm max-w-md mx-auto w-full">
          <span>当前已分配苹果: <span className="text-sm font-extrabold text-rose-600">{largerCount + smallerCount}</span> / {total}</span>
          <span>当前两者差值: <span className="text-sm font-extrabold text-indigo-600">{Math.abs(largerCount - smallerCount)}</span> / {difference}</span>
        </div>
      </div>

      {/* Manual Allocation Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left red basket controls */}
        <div className="bg-rose-50 border-2 border-rose-200/80 p-3 rounded-2xl flex flex-col items-center">
          <span className="text-xs font-extrabold text-rose-800 mb-2">添加{largerLabel} 🍎</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleAdjust("larger", -1)}
              className="w-10 h-10 flex items-center justify-center bg-white text-rose-600 rounded-xl border border-rose-200 shadow-sm active:scale-90 font-bold text-lg hover:bg-rose-100/50"
            >
              -
            </button>
            <span className="w-12 text-center flex items-center justify-center text-xl font-extrabold text-rose-800">
              {largerCount}
            </span>
            <button
              onClick={() => handleAdjust("larger", 1)}
              className="w-10 h-10 flex items-center justify-center bg-rose-500 text-white rounded-xl shadow-sm active:scale-90 font-bold text-lg hover:bg-rose-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Right green basket controls */}
        <div className="bg-emerald-50 border-2 border-emerald-200/80 p-3 rounded-2xl flex flex-col items-center">
          <span className="text-xs font-extrabold text-emerald-800 mb-2">添加{smallerLabel} 🍏</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleAdjust("smaller", -1)}
              className="w-10 h-10 flex items-center justify-center bg-white text-emerald-600 rounded-xl border border-emerald-200 shadow-sm active:scale-90 font-bold text-lg hover:bg-emerald-100/50"
            >
              -
            </button>
            <span className="w-12 text-center flex items-center justify-center text-xl font-extrabold text-emerald-800">
              {smallerCount}
            </span>
            <button
              onClick={() => handleAdjust("smaller", 1)}
              className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl shadow-sm active:scale-90 font-bold text-lg hover:bg-emerald-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Secret tips box */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-800 flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold">天平秘籍：</span>
          <p className="mt-1 leading-relaxed text-amber-700">{feedback}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-2">
          <button
            onClick={resetGame}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重置清空
          </button>

          {demoStep === 0 ? (
            <button
              onClick={runDemo}
              className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 active:scale-95 flex items-center gap-1.5 shadow-sm border border-rose-100 transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              假设法演示 💡
            </button>
          ) : (
            demoStep < 4 && (
              <button
                onClick={nextDemoStep}
                className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold active:scale-95 flex items-center gap-1.5 shadow-md transition-all animate-pulse"
              >
                下一步 ({demoStep}/4) 👉
              </button>
            )
          )}
        </div>

        <button
          onClick={handleCheck}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          核对分配
        </button>
      </div>
    </div>
  );
};
