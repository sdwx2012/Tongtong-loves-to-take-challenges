import React, { useState, useEffect } from "react";
import { Ruler, Sparkles, HelpCircle, Check, Info } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface OverlappingGameProps {
  levelData: {
    tapeLength?: number;
    overlap?: number;
    totalLength?: number;
    length1?: number;
    length2?: number;

    totalCount?: number;
    countA?: number;
    countB?: number;
    bothCount?: number;

    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const OverlappingGame: React.FC<OverlappingGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const {
    tapeLength,
    overlap,
    totalLength,
    length1,
    length2,
    totalCount,
    countA,
    countB,
    bothCount,
    correctAnswer
  } = levelData;

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setUserAnswer("");
    setFeedback("请仔细观察上面的视觉演示图，然后把你的计算结果填在输入框中吧！🎯");
  }, [levelData]);

  // Determine game problem types
  const isTapeStyle = tapeLength !== undefined || length1 !== undefined;

  // Constants for tape rendering
  const lenA = tapeLength || length1 || 10;
  const lenB = tapeLength || length2 || 10;
  const overL = overlap !== undefined ? overlap : (lenA + lenB - (totalLength || 15));

  // Venn calculations
  const vennTotal = totalCount || 20;
  const vennA = countA || 15;
  const vennB = countB || 12;
  const vennBoth = bothCount !== undefined ? bothCount : (vennA + vennB - vennTotal);
  const vennOnlyA = vennA - vennBoth;
  const vennOnlyB = vennB - vennBoth;
  const vennNeither = vennTotal - (vennOnlyA + vennOnlyB + vennBoth);

  const handleCheck = () => {
    const numericAnswer = parseInt(userAnswer.trim(), 10);
    if (isNaN(numericAnswer)) {
      SoundEffects.playIncorrect();
      setFeedback("不要留空哦！请在输入框中写下你算出的数字。");
      onIncorrect?.();
      return;
    }

    if (numericAnswer === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("太棒了！你的答案完全正确！🎉 已经完全搞懂重叠和容斥原理的秘密啦，真是一个数学小天才！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback("算出来的数不对哦，再仔细数数看，或者查看下面的“解题灵感”找找灵感！💡");
      onIncorrect?.();
    }
  };

  return (
    <div id="overlapping-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
      {/* Visual Header */}
      <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="font-bold text-indigo-800 text-lg">
              {isTapeStyle ? "重叠长度模拟画板" : "重叠魔法圈圈 (Venn)"}
            </h3>
            <p className="text-xs text-indigo-600">
              {isTapeStyle ? "观察两条彩带重叠贴合时的缩水长度" : "观察两组集合的交集重合地带"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 md:p-6 flex flex-col items-center justify-center min-h-[220px]">
        {isTapeStyle ? (
          /* TAPE OVERLAPPING VISUALS */
          <div className="w-full flex flex-col items-center gap-6 py-4">
            {/* The ruler ribbon simulation */}
            <div className="relative w-full max-w-[450px] h-12 bg-slate-200/40 rounded-lg flex items-center border border-dashed border-slate-300">
              {/* Ribbon A */}
              <div
                style={{ width: `${(lenA / (lenA + lenB)) * 80}%` }}
                className="absolute left-4 h-8 bg-amber-400/85 text-amber-900 text-xs font-bold flex items-center justify-center rounded-l-md border border-amber-500/30"
              >
                <span>彩带甲 ({lenA}cm)</span>
              </div>

              {/* Ribbon B */}
              <div
                style={{
                  width: `${(lenB / (lenA + lenB)) * 80}%`,
                  left: `calc(4px + ${(lenA / (lenA + lenB)) * 80}% - ${(overL / (lenA + lenB)) * 80}%)`
                }}
                className="absolute h-8 bg-sky-400/85 text-sky-950 text-xs font-bold flex items-center justify-center rounded-r-md border border-sky-500/30"
              >
                <span>彩带乙 ({lenB}cm)</span>
              </div>

              {/* Overlap area overlay highlighting */}
              <div
                style={{
                  width: `${(overL / (lenA + lenB)) * 80}%`,
                  left: `calc(4px + ${(lenA / (lenA + lenB)) * 80}% - ${(overL / (lenA + lenB)) * 80}%)`
                }}
                className="absolute h-8 bg-emerald-500/90 text-white text-[10px] font-extrabold flex flex-col items-center justify-center border-x border-emerald-600 border-dashed"
              >
                <span className="leading-none">重叠</span>
                <span className="leading-none text-[8px] mt-0.5">{overL} cm</span>
              </div>
            </div>

            {/* Scale and details */}
            <div className="flex gap-4 text-xs font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-lg border border-slate-100 shadow-2xs">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-amber-500" />
                甲: {lenA} 厘米
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-sky-500" />
                乙: {lenB} 厘米
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-bold">
                重叠: {overL} 厘米
              </span>
              {totalLength && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-indigo-600 font-bold">
                    粘好总长: {totalLength} 厘米
                  </span>
                </>
              )}
            </div>
          </div>
        ) : (
          /* VENN DIAGRAM VISUALS */
          <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full max-w-[340px] h-[180px] bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-xs overflow-hidden">
              {/* Venn Box label for total count */}
              <div className="absolute top-2 left-3 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                全班总人数: {vennTotal}
              </div>

              {/* Left Circle (A) */}
              <div className="absolute left-10 w-36 h-36 rounded-full bg-red-100/60 border-2 border-red-400/50 flex flex-col items-start p-4 text-red-800">
                <span className="text-[10px] font-extrabold text-red-600">A圈: {vennA}</span>
                <span className="text-xl mt-3 ml-2">🍎</span>
              </div>

              {/* Right Circle (B) */}
              <div className="absolute right-10 w-36 h-36 rounded-full bg-blue-100/60 border-2 border-blue-400/50 flex flex-col items-end p-4 text-blue-800">
                <span className="text-[10px] font-extrabold text-blue-600">B圈: {vennB}</span>
                <span className="text-xl mt-3 mr-2">🌿</span>
              </div>

              {/* Overlapping Intersection (Middle) */}
              <div className="absolute w-12 h-20 bg-purple-200/80 border-y border-purple-400 flex flex-col items-center justify-center text-purple-900">
                <span className="text-[10px] font-extrabold text-purple-700">双重</span>
                <span className="text-[10px] font-bold">✨</span>
              </div>

              {/* Neither label */}
              {vennNeither > 0 && (
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-bold bg-slate-50 border px-1 rounded">
                  圈外 (都不会): {vennNeither}
                </div>
              )}
            </div>

            {/* Venn numerical description bar */}
            <div className="grid grid-cols-3 gap-2.5 w-full text-center text-xs font-bold text-slate-600">
              <div className="bg-red-50 p-2 rounded-lg border border-red-100 text-red-700">
                仅喜欢甲: {vennOnlyA} 人
              </div>
              <div className="bg-purple-50 p-2 rounded-lg border border-purple-100 text-purple-700 font-extrabold">
                两样都喜欢: {vennBoth} 人
              </div>
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-blue-700">
                仅喜欢乙: {vennOnlyB} 人
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Answer Submission Section */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
            <span>🎯 填入你的解答数值：</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入一个数字"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              onClick={handleCheck}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              提交验证
            </button>
          </div>
        </div>

        {/* Live Feedback Banner */}
        {feedback && (
          <div className="text-xs font-semibold text-indigo-700 bg-indigo-50/70 border border-indigo-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Help Tip */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-slate-700">小奥的解题灵感：</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{levelData.hint}</p>
        </div>
      </div>
    </div>
  );
};
