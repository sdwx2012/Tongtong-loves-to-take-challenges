import React, { useState, useEffect } from "react";
import { Clock, HelpCircle, ArrowRight, ArrowLeft, RotateCcw, Check, Sparkles } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface AgePuzzleGameProps {
  levelData: {
    kidAge: number;
    parentAge: number;
    difference: number;
    multiple?: number;
    targetSum?: number; // for L3 sum-diff style
    youngerAge?: number; // for L3 younger
    olderAge?: number; // for L3 older
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const AgePuzzleGame: React.FC<AgePuzzleGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { kidAge, parentAge, difference, multiple, targetSum, youngerAge, olderAge, correctAnswer } = levelData;

  // The state of how many years we are adjusting (+ or -)
  const [timeAdjust, setTimeAdjust] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setTimeAdjust(0);
    setUserAnswer("");
    setFeedback("移动滑块或按钮，看看随着时光流逝，两个人的年龄和倍数会发生什么奇妙的变化吧！⏳");
    setShowExplanation(false);
  }, [levelData]);

  // Determine actual age parameters based on whether it is L3 (sum-diff style)
  const isSumDiffStyle = targetSum !== undefined;

  const currentKidAge = isSumDiffStyle ? (youngerAge || 0) + timeAdjust : kidAge + timeAdjust;
  const currentParentAge = isSumDiffStyle ? (olderAge || 0) + timeAdjust : parentAge + timeAdjust;
  const currentDiff = Math.abs(currentParentAge - currentKidAge);
  const currentSum = currentParentAge + currentKidAge;
  const currentMultiple = currentKidAge > 0 ? (currentParentAge / currentKidAge).toFixed(1) : "0";

  const handleAdjustTime = (delta: number) => {
    SoundEffects.playClick();
    // Allow adjustment from -10 to +30
    setTimeAdjust((prev) => {
      const next = prev + delta;
      return Math.min(30, Math.max(-10, next));
    });
  };

  const handleCheck = () => {
    const numericAnswer = parseInt(userAnswer.trim(), 10);
    if (isNaN(numericAnswer)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你的答案哦！在输入框中填入你算出的岁数或年份。");
      onIncorrect?.();
      return;
    }

    if (numericAnswer === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("哇！你太厉害了！完全正确！🎉 掌握了‘年龄差永远不变’这个魔法，所有的年龄难题都难不倒你啦！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`不对哦，再仔细想一想！可以用上面的“时空推演器”调到你填写的答案，看看倍数或年龄和对不对。`);
      onIncorrect?.();
    }
  };

  return (
    <div id="age-puzzle-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-teal-50 border border-teal-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⏳</span>
          <div>
            <h3 className="font-bold text-teal-800 text-lg">时空年龄推演器</h3>
            <p className="text-xs text-teal-600">滑动时间轴，观察两人的年龄变化</p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            setTimeAdjust(0);
          }}
          className="flex items-center gap-1 text-xs text-teal-700 bg-teal-100 hover:bg-teal-200 px-2.5 py-1.5 rounded-lg font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置时空
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 md:p-6 flex flex-col gap-6">
        {/* Character cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Younger Character */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-3 shadow-xs">
            <span className="text-4xl">🧒</span>
            <span className="font-bold text-sm text-slate-700">
              {isSumDiffStyle ? "妹妹" : "孩子/小兔/小熊猫"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-extrabold text-teal-600 font-mono">
                {currentKidAge}
              </span>
              <span className="text-xs text-slate-400 font-medium">岁</span>
            </div>
            <div className="text-[10px] text-slate-400">
              初始年龄: {isSumDiffStyle ? youngerAge : kidAge} 岁
            </div>
          </div>

          {/* Older Character */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-3 shadow-xs">
            <span className="text-4xl">👨</span>
            <span className="font-bold text-sm text-slate-700">
              {isSumDiffStyle ? "姐姐" : "爸爸/妈妈/兔妈妈"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                {currentParentAge}
              </span>
              <span className="text-xs text-slate-400 font-medium">岁</span>
            </div>
            <div className="text-[10px] text-slate-400">
              初始年龄: {isSumDiffStyle ? olderAge : parentAge} 岁
            </div>
          </div>
        </div>

        {/* Const Diff Banner & Calculations */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex flex-col gap-2 text-center">
          <div className="flex justify-around text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1">
              <span>年龄差：</span>
              <span className="font-mono text-amber-700 text-sm bg-amber-100/60 px-1.5 py-0.5 rounded">
                {currentDiff} 岁
              </span>
              <span className="text-[10px] text-amber-600 font-normal">(始终保持不变! 🌟)</span>
            </div>
            {isSumDiffStyle ? (
              <div className="flex items-center gap-1">
                <span>年龄和：</span>
                <span className="font-mono text-indigo-700 text-sm bg-indigo-50 px-1.5 py-0.5 rounded">
                  {currentSum} 岁
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>倍数关系：</span>
                <span className="font-mono text-teal-700 text-sm bg-teal-50 px-1.5 py-0.5 rounded">
                  {currentMultiple} 倍
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Time Shifter Control Panel */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 flex justify-between">
            <span>⌛ 调节时空 (增加或减少年份)</span>
            <span className="font-bold text-teal-600 font-mono text-sm">
              {timeAdjust > 0 ? `+${timeAdjust}` : timeAdjust} 年
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAdjustTime(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95 text-slate-600"
              title="过去一年"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="range"
              min="-10"
              max="30"
              value={timeAdjust}
              onChange={(e) => {
                SoundEffects.playClick();
                setTimeAdjust(parseInt(e.target.value, 10));
              }}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <button
              onClick={() => handleAdjustTime(1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95 text-slate-600"
              title="未来一年"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>10年前 (-10)</span>
            <span>现在 (0)</span>
            <span>30年后 (+30)</span>
          </div>
        </div>
      </div>

      {/* Answer Area */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 请在下方输入你的计算答案：
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入一个数字"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <button
              onClick={handleCheck}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              提交验证
            </button>
          </div>
        </div>

        {/* Live Feedback Message */}
        {feedback && (
          <div className="text-xs font-semibold text-teal-700 bg-teal-50/70 border border-teal-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Help Tip */}
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
