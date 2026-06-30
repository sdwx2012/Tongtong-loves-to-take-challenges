import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, RefreshCw, HelpCircle, Check, Sparkles, Undo, Rewind, Play } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface Step {
  op: "+" | "-" | "*" | "/";
  val: number;
  label: string;
}

interface ReverseSolveGameProps {
  levelData: {
    steps: Step[];
    endVal: number;
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const ReverseSolveGame: React.FC<ReverseSolveGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { steps, endVal, correctAnswer } = levelData;

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [hoveredStepIdx, setHoveredStepIdx] = useState<number | null>(null);

  useEffect(() => {
    setUserAnswer("");
    setIsReverseMode(false);
    setFeedback("欢迎使用‘时光倒流还原仪’！点击下方按钮切换‘时间倒流’，观察运算是如何逆转的吧！⏳");
  }, [levelData]);

  const handleCheck = () => {
    const numericAnswer = parseInt(userAnswer.trim(), 10);
    if (isNaN(numericAnswer)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你的答案哦！在输入框中填入你算出的初始数量。");
      onIncorrect?.();
      return;
    }

    if (numericAnswer === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("哇！答案完全正确！🎉 时光倒流，真相大白！你完美地解开了还原谜题，太棒了！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`算出来的数量不对哦，再仔细推敲一下！开启“时光倒流”模式，从最终结果 ${endVal} 倒过来一步步算算看吧！`);
      onIncorrect?.();
    }
  };

  // Helper to render math operations
  const getOpText = (op: "+" | "-" | "*" | "/") => {
    switch (op) {
      case "+": return "加";
      case "-": return "减";
      case "*": return "乘";
      case "/": return "除";
    }
  };

  const getOppositeOpText = (op: "+" | "-" | "*" | "/") => {
    switch (op) {
      case "+": return "减 ➖";
      case "-": return "加 ➕";
      case "*": return "除 ➗";
      case "/": return "乘 ✖️";
    }
  };

  return (
    <div id="reverse-solve-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-fuchsia-50 border border-fuchsia-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔮</span>
          <div>
            <h3 className="font-bold text-fuchsia-800 text-lg">时光倒流还原仪</h3>
            <p className="text-xs text-fuchsia-600">点击按钮切换正向与逆向过程，探寻最初的秘密</p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            setIsReverseMode(!isReverseMode);
          }}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-bold transition duration-200 active:scale-95 ${
            isReverseMode
              ? "bg-fuchsia-600 text-white shadow-sm"
              : "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200"
          }`}
        >
          {isReverseMode ? (
            <>
              <Play className="w-3.5 h-3.5" />
              回到正向
            </>
          ) : (
            <>
              <Rewind className="w-3.5 h-3.5" />
              时光倒流
            </>
          )}
        </button>
      </div>

      {/* Main Flowchart Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 md:p-6 flex flex-col gap-6 items-center overflow-x-auto">
        <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
          {isReverseMode ? "⌛ 逆推模式：从结局返回起点 (符号取反)" : "🚀 正序过程：从小问号到最终结局"}
        </h4>

        {/* The interactive flow chart */}
        <div className="flex items-center gap-2 md:gap-4 py-4 min-w-[500px] justify-center">
          {/* Node 1: Start (Question Mark) */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 transition shadow-xs ${
              isReverseMode 
                ? "bg-emerald-50 border-emerald-400 text-emerald-600 animate-pulse" 
                : "bg-white border-slate-200 text-slate-400"
            }`}>
              ?
            </div>
            <span className="text-xs font-bold text-slate-500">初始数量</span>
          </div>

          {/* Connectors & Operations */}
          {steps.map((step, idx) => {
            const isHovered = hoveredStepIdx === idx;
            return (
              <React.Fragment key={idx}>
                {/* Arrow */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center text-slate-400 h-6">
                    {isReverseMode ? (
                      <ArrowLeft className="w-5 h-5 text-fuchsia-500 animate-pulse" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  {/* Action Bubble */}
                  <div 
                    onMouseEnter={() => setHoveredStepIdx(idx)}
                    onMouseLeave={() => setHoveredStepIdx(null)}
                    className={`text-[10px] px-2 py-1 rounded-full border transition font-medium ${
                      isReverseMode 
                        ? "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 font-bold" 
                        : "bg-indigo-50 border-indigo-100 text-indigo-700"
                    }`}
                  >
                    {isReverseMode ? getOppositeOpText(step.op) + " " + step.val : getOpText(step.op) + " " + step.val}
                  </div>
                </div>

                {/* Intermediate/Result Node */}
                <div className="flex flex-col items-center gap-2">
                  {idx === steps.length - 1 ? (
                    /* Final Node */
                    <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg border-2 border-indigo-500 shadow-md">
                      {endVal}
                    </div>
                  ) : (
                    /* Intermediate Node */
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-semibold text-xs border border-slate-200">
                      ...
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-slate-400">
                    {idx === steps.length - 1 ? "最终结局" : `第 ${idx + 1} 步`}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Descriptions / Story Steps */}
        <div className="w-full flex flex-col gap-2.5 bg-white border border-slate-100 rounded-xl p-4 shadow-3xs">
          <span className="text-xs font-bold text-slate-700">📜 奇妙的故事演变过程：</span>
          <div className="flex flex-col gap-2">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex justify-between items-center text-xs p-2.5 rounded-lg border transition ${
                  isReverseMode 
                    ? "bg-fuchsia-50/40 border-fuchsia-100 text-fuchsia-950" 
                    : "bg-slate-50/50 border-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-500 font-black">第 {idx + 1} 步:</span>
                  <span className="font-semibold">{step.label}</span>
                </div>
                <div className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-600 flex items-center gap-1">
                  <span>
                    {isReverseMode ? "逆运算：" : "正运算："}
                  </span>
                  <span className={isReverseMode ? "text-fuchsia-600" : "text-indigo-600"}>
                    {isReverseMode 
                      ? `${getOppositeOpText(step.op)} ${step.val}` 
                      : `${step.op === "*" ? "✖️" : step.op === "/" ? "➗" : step.op} ${step.val}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Area */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 最初的数量是多少？请写下你的答案：
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入一个数字"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500"
            />
            <button
              onClick={handleCheck}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Check className="w-4 h-4" />
              提交验证
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="text-xs font-semibold text-fuchsia-700 bg-fuchsia-50/70 border border-fuchsia-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-fuchsia-500 shrink-0 mt-0.5" />
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
