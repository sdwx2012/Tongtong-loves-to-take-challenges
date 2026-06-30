import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, Trophy, Plus, Minus } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface BinaryScoreGameProps {
  levelData: {
    totalQuestions: number;
    correctPoints: number;
    wrongDeduct: number; // point deduction, e.g. 2 for losing 2 points
    earnedPoints: number;
    correctAnswer: number; // correct questions count
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const BinaryScoreGame: React.FC<BinaryScoreGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { totalQuestions, correctPoints, wrongDeduct, earnedPoints, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [simCorrect, setSimCorrect] = useState(5);

  useEffect(() => {
    setUserInput("");
    setSimCorrect(5);
    setFeedback(`知识竞赛得分王！已知满分、得分和罚分规则，可以用‘假设法’把错题全部假设成对题，或者对题全部假设成错题哦！💡`);
  }, [levelData]);

  const handleCheck = () => {
    const ans = parseInt(userInput.trim(), 10);
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你算出的答对题数！");
      onIncorrect?.();
      return;
    }

    if (ans === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("太棒了，回答完全正确！🎉 你的逻辑假设推理无懈可击！成功的金钥匙属于你！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`算出来的答对题数不对哦。提示：假设全部答对，会得 ${totalQuestions * correctPoints} 分。现在少拿了分数，想一想答错一题损失的是“得分 + 罚分”的和！`);
      onIncorrect?.();
    }
  };

  // Compute simulated points based on simCorrect questions
  const simWrong = totalQuestions - simCorrect;
  const simTotalPoints = simCorrect * correctPoints - simWrong * wrongDeduct;

  return (
    <div id="binary-score-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
        <Trophy className="w-8 h-8 text-emerald-600" />
        <div>
          <h3 className="font-bold text-emerald-800 text-lg">奥数知识竞赛得分天秤</h3>
          <p className="text-xs text-emerald-600">
            总题数：{totalQuestions} 题 | 答对一题得 +{correctPoints} 分，答错一题扣 -{wrongDeduct} 分 | 最终实得分数：{earnedPoints} 分
          </p>
        </div>
      </div>

      {/* Simulator Board */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
          <span className="text-xs font-bold text-slate-500">🏆 答题模拟得分板 (调整答对数量看得分变化)</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500">答对题数：</span>
            <button
              onClick={() => {
                SoundEffects.playClick();
                setSimCorrect((prev) => Math.max(0, prev - 1));
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-black text-sm text-indigo-600 w-6 text-center">{simCorrect}</span>
            <button
              onClick={() => {
                SoundEffects.playClick();
                setSimCorrect((prev) => Math.min(totalQuestions, prev + 1));
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500">答题卡总览：</span>
            <div className="flex flex-wrap gap-1.5 min-h-[48px] items-center">
              {Array.from({ length: simCorrect }).map((_, idx) => (
                <span key={idx} className="text-xl bg-emerald-50 border border-emerald-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-emerald-600">
                  ✔
                </span>
              ))}
              {Array.from({ length: simWrong }).map((_, idx) => (
                <span key={idx} className="text-xl bg-rose-50 border border-rose-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-rose-600">
                  ✘
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col justify-center items-center gap-1">
            <span className="text-xs font-bold text-slate-400">模拟最终总得分：</span>
            <div className={`font-mono font-black text-3xl ${simTotalPoints === earnedPoints ? "text-emerald-600 animate-bounce" : "text-indigo-600"}`}>
              {simTotalPoints} 分
            </div>
            {simTotalPoints === earnedPoints && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                🌟 刚好等于目标实得分！
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answer Area */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 那么，根据实际得分为 {earnedPoints} 分，请问一共【答对了多少道题】？
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入答对题数"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Check className="w-4 h-4" />
              核对答案
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
