import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, RefreshCw, Layers } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface ColorCount {
  color: "red" | "blue" | "yellow";
  count: number;
}

interface PigeonholeGameProps {
  levelData: {
    pool: ColorCount[];
    targetDesc: string; // e.g. "2个颜色相同的球" or "红、蓝、黄各1个球"
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const PigeonholeGame: React.FC<PigeonholeGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { pool, targetDesc, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [drawnBalls, setDrawnBalls] = useState<("red" | "blue" | "yellow")[]>([]);
  const [remainingPool, setRemainingPool] = useState<("red" | "blue" | "yellow")[]>([]);

  useEffect(() => {
    setUserInput("");
    setDrawnBalls([]);
    setFeedback(`最不利抽屉原理挑战！闭上眼睛，至少需要摸出多少个球，才能“保证”达成目标？试试在下方魔法宝箱里多试几次摸球，感知最坏的情况吧！🔮`);

    // Flatten pool to single array for mock random testing
    const flat: ("red" | "blue" | "yellow")[] = [];
    pool.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        flat.push(item.color);
      }
    });
    setRemainingPool(flat);
  }, [levelData]);

  const handleDraw = () => {
    if (remainingPool.length === 0) {
      SoundEffects.playIncorrect();
      setFeedback("宝箱里的球已经摸完啦！可以点击“重置摸球”再次测试。");
      return;
    }
    SoundEffects.playClick();
    const idx = Math.floor(Math.random() * remainingPool.length);
    const item = remainingPool[idx];
    setDrawnBalls((prev) => [...prev, item]);
    setRemainingPool((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResetDraws = () => {
    SoundEffects.playClick();
    setDrawnBalls([]);
    const flat: ("red" | "blue" | "yellow")[] = [];
    pool.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        flat.push(item.color);
      }
    });
    setRemainingPool(flat);
  };

  const handleCheck = () => {
    const ans = parseInt(userInput.trim(), 10);
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请写下你算出的最少摸球数！");
      onIncorrect?.();
      return;
    }

    if (ans === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback(`完全正确！🎉 太聪明了！最不利情况就是“运气最差”的时候，加上关键的最后 1 步就能达到百分之百“保证”！`);
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`答案不对哦。提示：想一想你运气最差、最倒霉、怎么摸都凑不齐的情况，再加 1 就是答案！`);
      onIncorrect?.();
    }
  };

  const getEmoji = (c: "red" | "blue" | "yellow") => {
    if (c === "red") return "🔴";
    if (c === "blue") return "🔵";
    return "🟡";
  };

  const getColorName = (c: "red" | "blue" | "yellow") => {
    if (c === "red") return "红";
    if (c === "blue") return "蓝";
    return "黄";
  };

  return (
    <div id="pigeonhole-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 p-4 rounded-xl">
        <span className="text-3xl">🔮</span>
        <div>
          <h3 className="font-bold text-teal-800 text-lg">最不利抽屉原理宝箱</h3>
          <p className="text-xs text-teal-600">
            摸球目标：必须保证摸出【<strong>{targetDesc}</strong>】
          </p>
        </div>
      </div>

      {/* Box Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
          <span className="text-xs font-bold text-slate-500 tracking-wider">📦 魔法暗盒中的球</span>
          <button
            onClick={handleResetDraws}
            className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-100 hover:bg-teal-200 px-2.5 py-1 rounded-md font-bold transition"
          >
            <RefreshCw className="w-3 h-3" />
            重置摸球
          </button>
        </div>

        {/* Display of box pool */}
        <div className="flex flex-wrap gap-4 items-center justify-center bg-white border border-slate-100 p-4 rounded-xl">
          {pool.map((item) => (
            <div key={item.color} className="flex items-center gap-1.5 bg-slate-50 border border-slate-250 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700">
              <span className="text-base">{getEmoji(item.color)}</span>
              <span>{getColorName(item.color)}色球 x {item.count}</span>
            </div>
          ))}
        </div>

        {/* Drawn balls display */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400">👋 已模拟盲摸出的球 (目前已摸：{drawnBalls.length} 个)</span>
          <div className="min-h-[60px] bg-white border border-slate-100 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center">
            {drawnBalls.length === 0 ? (
              <span className="text-xs text-slate-350 italic">点击下方宝箱来体验盲摸吧...</span>
            ) : (
              drawnBalls.map((color, idx) => (
                <div key={idx} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-lg shadow-3xs animate-bounce" style={{ animationDuration: "0.5s" }}>
                  {getEmoji(color)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chest button */}
        <button
          onClick={handleDraw}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md self-center"
        >
          <Layers className="w-4 h-4" />
          📦 探入魔术盒摸 1 个球 ({remainingPool.length}个剩余)
        </button>
      </div>

      {/* User input */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 至少需要摸出多少个球，才能【绝对保证】有【{targetDesc}】？
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入最少需要摸的球数"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              提交确定
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-teal-800 bg-teal-50/70 border border-teal-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-slate-700">小奥的解题灵感：</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{levelData.hint}</p>
        </div>
      </div>
    </div>
  );
};
