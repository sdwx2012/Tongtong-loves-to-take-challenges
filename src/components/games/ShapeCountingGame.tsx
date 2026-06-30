import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface ShapeCountingGameProps {
  levelData: {
    shapeType: "triangle" | "rectangle";
    gridSize: number; // e.g. 3 blocks in a row or 2x2 grid
    correctAnswer: number;
    hint: string;
    explanation: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const ShapeCountingGame: React.FC<ShapeCountingGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { shapeType, gridSize, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedSubParts, setSelectedSubParts] = useState<number[]>([]);

  useEffect(() => {
    setUserInput("");
    setSelectedSubParts([]);
    setFeedback(`分类有序计数魔法岛！在下面的示意图中，一共有多少个${shapeType === "triangle" ? "三角形" : "长方形"}？试着用分类相加法：先数单个的，再数十对、十几组合的，不要重复也不要遗漏哦！🔍`);
  }, [levelData]);

  const handleCheck = () => {
    const ans = parseInt(userInput.trim(), 10);
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你数出的图形总数！");
      onIncorrect?.();
      return;
    }

    if (ans === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("完美答案！🎉 太聪明了！你掌握了有序图形计数的灵魂——分层、分类、组合！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`算得不太对哦。再仔细看一看：可以用公式 1 + 2 + 3... 或者按基本块、二合一、三合一来算算！`);
      onIncorrect?.();
    }
  };

  const toggleSubPart = (idx: number) => {
    SoundEffects.playClick();
    setSelectedSubParts((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div id="shape-counting-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <span className="text-3xl">📐</span>
        <div>
          <h3 className="font-bold text-indigo-800 text-lg">分类组合图形计数岛</h3>
          <p className="text-xs text-indigo-600">
            在下面的多功能拼图格中，计算包含的<strong>全部{shapeType === "triangle" ? "三角形" : "长方形（含正方形）"}</strong>。
          </p>
        </div>
      </div>

      {/* Interactive visual canvas/grid */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
        <span className="text-xs font-bold text-slate-500 tracking-wider">💡 交互提示：点击基本块可以着色标记，辅助你分类计数</span>

        {shapeType === "triangle" ? (
          /* A divided triangle with lines radiating from top vertex to base */
          <div className="relative w-64 h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 150" className="w-full h-full">
              {/* Main Outer Triangle */}
              <polygon points="100,10 10,140 190,140" fill="none" stroke="#4f46e5" strokeWidth="3" />

              {/* Dividers radiating from top (100,10) to bottom base */}
              {gridSize >= 2 && <line x1="100" y1="10" x2="100" y2="140" stroke="#4f46e5" strokeWidth="2" strokeDasharray={selectedSubParts.includes(1) ? "" : "3 3"} />}
              {gridSize >= 3 && (
                <>
                  <line x1="100" y1="10" x2="60" y2="140" stroke="#4f46e5" strokeWidth="2" strokeDasharray={selectedSubParts.includes(2) ? "" : "3 3"} />
                  <line x1="100" y1="10" x2="140" y2="140" stroke="#4f46e5" strokeWidth="2" strokeDasharray={selectedSubParts.includes(3) ? "" : "3 3"} />
                </>
              )}

              {/* Clickable regions (invisible buttons overlying base line areas to allow coloring) */}
              {/* Let's render small numbered circles near the base representing segments */}
              {Array.from({ length: gridSize }).map((_, i) => {
                const x = 20 + i * (160 / gridSize) + (80 / gridSize);
                const isSelected = selectedSubParts.includes(i + 10);
                return (
                  <g key={i} className="cursor-pointer" onClick={() => toggleSubPart(i + 10)}>
                    <circle cx={x} cy="125" r="10" fill={isSelected ? "#818cf8" : "#e2e8f0"} stroke="#4f46e5" strokeWidth="1.5" />
                    <text x={x} y="129" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isSelected ? "#ffffff" : "#4f46e5"}>
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Grid of rectangles */
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {Array.from({ length: gridSize }).map((_, i) => {
                const isSelected = selectedSubParts.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSubPart(i)}
                    className={`w-16 h-16 rounded-lg border-2 font-bold text-lg transition flex items-center justify-center active:scale-95 shadow-2xs ${
                      isSelected
                        ? "bg-indigo-500 text-white border-indigo-600"
                        : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* If 2D grid (gridSize > 3), show 2 rows */}
            {gridSize > 3 && (
              <div className="flex gap-2">
                {Array.from({ length: gridSize }).map((_, i) => {
                  const idx = i + 10;
                  const isSelected = selectedSubParts.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSubPart(idx)}
                      className={`w-16 h-16 rounded-lg border-2 font-bold text-lg transition flex items-center justify-center active:scale-95 shadow-2xs ${
                        isSelected
                          ? "bg-indigo-500 text-white border-indigo-600"
                          : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                      }`}
                    >
                      {i + 1 + gridSize}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 经过缜密的数数，图中一共有多少个{shapeType === "triangle" ? "三角形" : "长方形"}？
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入最终数出来的总数"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              提交核对
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-indigo-800 bg-indigo-50/70 border border-indigo-100/50 p-3 rounded-xl flex items-start gap-2">
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
