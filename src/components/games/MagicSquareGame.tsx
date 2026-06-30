import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, RefreshCw } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface MagicSquareGameProps {
  levelData: {
    grid: (number | null)[]; // 3x3 grid with null for inputs
    correctAnswer: number[]; // complete grid answers
    targetSum: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const MagicSquareGame: React.FC<MagicSquareGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { grid, correctAnswer, targetSum } = levelData;
  const [userGrid, setUserGrid] = useState<(number | null)[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setUserGrid([...grid]);
    setFeedback(`欢迎挑战九宫幻方魔法平衡盘！在空格中填入数字，使得‘每一横行’、‘每一竖列’以及‘斜对角线’上的数字相加之和都正好等于 ${targetSum}。🔢`);
  }, [levelData]);

  const handleInputChange = (idx: number, val: string) => {
    const parsed = parseInt(val.trim(), 10);
    const updated = [...userGrid];
    updated[idx] = isNaN(parsed) ? null : parsed;
    setUserGrid(updated);
  };

  const handleCheck = () => {
    // Check if any empty inputs
    const hasEmpty = userGrid.some((val) => val === null);
    if (hasEmpty) {
      SoundEffects.playIncorrect();
      setFeedback("盘面上还有空格哦，请把所有的格子都填上数字吧！");
      onIncorrect?.();
      return;
    }

    // Verify sums
    // Row sums
    const r1 = (userGrid[0] || 0) + (userGrid[1] || 0) + (userGrid[2] || 0);
    const r2 = (userGrid[3] || 0) + (userGrid[4] || 0) + (userGrid[5] || 0);
    const r3 = (userGrid[6] || 0) + (userGrid[7] || 0) + (userGrid[8] || 0);

    // Col sums
    const c1 = (userGrid[0] || 0) + (userGrid[3] || 0) + (userGrid[6] || 0);
    const c2 = (userGrid[1] || 0) + (userGrid[4] || 0) + (userGrid[7] || 0);
    const c3 = (userGrid[2] || 0) + (userGrid[5] || 0) + (userGrid[8] || 0);

    // Diag sums
    const d1 = (userGrid[0] || 0) + (userGrid[4] || 0) + (userGrid[8] || 0);
    const d2 = (userGrid[2] || 0) + (userGrid[4] || 0) + (userGrid[6] || 0);

    const isCorrect =
      r1 === targetSum &&
      r2 === targetSum &&
      r3 === targetSum &&
      c1 === targetSum &&
      c2 === targetSum &&
      c3 === targetSum &&
      d1 === targetSum &&
      d2 === targetSum;

    if (isCorrect) {
      SoundEffects.playCorrect();
      setFeedback("不可思议！🎉 九宫重组，魔法平衡成功建立！每一个方向的总和都完美达标！你太棒了！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`哎呀，当前有方向的总和不是 ${targetSum} 哦。例如第一行和为 ${r1}。请再仔细配平一下数字吧！💪`);
      onIncorrect?.();
    }
  };

  return (
    <div id="magic-square-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧩</span>
          <div>
            <h3 className="font-bold text-indigo-800 text-lg">九宫幻方魔法重组盘</h3>
            <p className="text-xs text-indigo-600">目标和：每一行、列、对角线数字和均为 {targetSum}</p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            setUserGrid([...grid]);
          }}
          className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1.5 rounded-lg font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置魔法盘
        </button>
      </div>

      {/* Grid Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
        {/* Sum guidelines */}
        <div className="text-xs text-slate-400 font-bold mb-1">
          💡 填入 1 到 9 之间的不重复数字 (已有部分填好)
        </div>

        {/* 3x3 Magic Grid */}
        <div className="grid grid-cols-3 gap-3 w-64 h-64 bg-slate-200 p-3 rounded-2xl shadow-inner border border-slate-300">
          {userGrid.map((val, idx) => {
            const isReadonly = grid[idx] !== null;
            return (
              <div
                key={idx}
                className={`rounded-xl flex items-center justify-center font-black text-xl shadow-xs transition-all ${
                  isReadonly
                    ? "bg-indigo-600 text-white border-2 border-indigo-500 cursor-not-allowed"
                    : "bg-white border-2 border-slate-300 focus-within:border-indigo-400"
                }`}
              >
                {isReadonly ? (
                  <span>{val}</span>
                ) : (
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={val === null ? "" : val}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    className="w-full h-full text-center bg-transparent text-slate-800 outline-none font-black text-xl rounded-xl"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification control */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <button
          onClick={handleCheck}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
        >
          <Check className="w-4 h-4" />
          建立幻方连接 (验证答案)
        </button>

        {feedback && (
          <div className="text-xs font-semibold text-indigo-850 bg-indigo-50/70 border border-indigo-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Hints */}
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
