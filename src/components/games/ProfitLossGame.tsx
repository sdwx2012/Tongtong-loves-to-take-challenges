import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, Plus, Minus } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface ProfitLossGameProps {
  levelData: {
    each1: number;
    surplus1: number; // > 0 for surplus, < 0 for deficit
    each2: number;
    surplus2: number; // > 0 for surplus, < 0 for deficit
    correctAnswer: { children: number; total: number };
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const ProfitLossGame: React.FC<ProfitLossGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { each1, surplus1, each2, surplus2, correctAnswer } = levelData;
  const [childrenInput, setChildrenInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [simChildren, setSimChildren] = useState(4);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setChildrenInput("");
    setTotalInput("");
    setSimChildren(4);
    setFeedback("欢迎来到盈亏分配天平！通过调整分配人数，观察两种分配方案对应的盈余与不足吧！⚖️");
  }, [levelData]);

  const handleCheck = () => {
    const kids = parseInt(childrenInput.trim(), 10);
    const total = parseInt(totalInput.trim(), 10);

    if (isNaN(kids) || isNaN(total)) {
      SoundEffects.playIncorrect();
      setFeedback("请完整输入人数和物品总数哦！");
      onIncorrect?.();
      return;
    }

    if (kids === correctAnswer.children && total === correctAnswer.total) {
      SoundEffects.playCorrect();
      setFeedback("太厉害了！🎉 分配方案完美平衡，你成功解开了盈亏问题的奥秘！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback("推算的人数或总数不太对哦，请利用下方模拟面板再次调整人数看看！");
      onIncorrect?.();
    }
  };

  // Calculate simulated surpluses based on custom chosen children number
  const calcSim1 = simChildren * each1 + surplus1;
  const calcSim2 = simChildren * each2 + surplus2;

  return (
    <div id="profit-loss-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 p-4 rounded-xl">
        <span className="text-3xl">⚖️</span>
        <div>
          <h3 className="font-bold text-amber-800 text-lg">盈亏分配魔法秤</h3>
          <p className="text-xs text-amber-600">方案一：每人分 {each1} 个，{surplus1 > 0 ? `多出 ${surplus1} 个` : `缺少 ${Math.abs(surplus1)} 个`} | 方案二：每人分 {each2} 个，{surplus2 > 0 ? `多出 ${surplus2} 个` : `缺少 ${Math.abs(surplus2)} 个`}</p>
        </div>
      </div>

      {/* Distribution Simulator */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">🔍 盈亏双规模拟天平</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-bold">模拟人数：</span>
            <button 
              onClick={() => { SoundEffects.playClick(); setSimChildren(prev => Math.max(1, prev - 1)); }}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-indigo-600 font-mono w-6 text-center">{simChildren}</span>
            <button 
              onClick={() => { SoundEffects.playClick(); setSimChildren(prev => Math.min(15, prev + 1)); }}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visualized scales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plan 1 Column */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">分配方案 1 (每人 {each1} 个)</span>
              <span className="text-xs font-mono font-bold text-slate-500">需：{simChildren * each1} 个</span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[50px] items-center">
              {Array.from({ length: Math.min(simChildren, 10) }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center bg-amber-50 border border-amber-150 px-2 py-1 rounded text-center">
                  <span className="text-sm">👶</span>
                  <span className="text-[9px] font-bold text-amber-800">+{each1}</span>
                </div>
              ))}
              {simChildren > 10 && <span className="text-xs text-slate-400 font-bold">...等 {simChildren} 人</span>}
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold text-center ${surplus1 > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {surplus1 > 0 ? `额外多出 +${surplus1} 个糖果` : `还差了 -${Math.abs(surplus1)} 个糖果`}
            </div>
          </div>

          {/* Plan 2 Column */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">分配方案 2 (每人 {each2} 个)</span>
              <span className="text-xs font-mono font-bold text-slate-500">需：{simChildren * each2} 个</span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[50px] items-center">
              {Array.from({ length: Math.min(simChildren, 10) }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center bg-sky-50 border border-sky-150 px-2 py-1 rounded text-center">
                  <span className="text-sm">👶</span>
                  <span className="text-[9px] font-bold text-sky-800">+{each2}</span>
                </div>
              ))}
              {simChildren > 10 && <span className="text-xs text-slate-400 font-bold">...等 {simChildren} 人</span>}
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold text-center ${surplus2 > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {surplus2 > 0 ? `额外多出 +${surplus2} 个糖果` : `还差了 -${Math.abs(surplus2)} 个糖果`}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs and Submit */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">🎯 请问一共有多少人？</label>
            <input
              type="number"
              placeholder="请输入人数"
              value={childrenInput}
              onChange={(e) => setChildrenInput(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">🍭 物品总数量是多少？</label>
            <input
              type="number"
              placeholder="请输入总物品数"
              value={totalInput}
              onChange={(e) => setTotalInput(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-xs"
        >
          <Check className="w-4 h-4" />
          验证解法答案
        </button>

        {feedback && (
          <div className="text-xs font-semibold text-amber-800 bg-amber-50/70 border border-amber-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Hint panel */}
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
