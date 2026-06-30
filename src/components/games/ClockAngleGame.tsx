import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, Clock } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface ClockAngleGameProps {
  levelData: {
    questionType: "angle" | "strike";
    timeStr?: string; // e.g. "3:00"
    strikeCount?: number;
    strikeSecs?: number;
    targetStrikes?: number;
    correctAnswer: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const ClockAngleGame: React.FC<ClockAngleGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { questionType, timeStr, strikeCount, strikeSecs, targetStrikes, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [customHour, setCustomHour] = useState(3);
  const [customMinute, setCustomMinute] = useState(0);

  useEffect(() => {
    setUserInput("");
    if (questionType === "angle" && timeStr) {
      const [h, m] = timeStr.split(":").map(Number);
      setCustomHour(h || 3);
      setCustomMinute(m || 0);
      setFeedback(`欢迎进入时空钟表魔法岛！你可以拖动下方的滑动条，观察时针和分针之间形成的角度。计算并输入题目要求算出的角度吧！📐`);
    } else {
      setFeedback(`神奇时钟敲击频率岛！这是一道经典的“间隔”思维题。时钟敲响 ${strikeCount} 下需要 ${strikeSecs} 秒，那敲响 ${targetStrikes} 下需要多少秒呢？别掉入陷阱哦！🔔`);
    }
  }, [levelData]);

  const handleCheck = () => {
    const ans = parseInt(userInput.trim(), 10);
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你的答案数字！");
      onIncorrect?.();
      return;
    }

    if (ans === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("完全正确！🎉 太棒了，你的时间与空间分析能力堪比科学家！时针一小格 30 度，敲钟要算‘间隔数’！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(
        questionType === "angle"
          ? "角度不太对哦。提示：钟表一圈是 360 度，分成 12 大格，每个大格代表 30 度！"
          : `敲钟时间计算有偏差。提示：敲 ${strikeCount} 下中间有 ${strikeCount! - 1} 个间隔！先算每个间隔用多久。`
      );
      onIncorrect?.();
    }
  };

  // SVG clock hands rotation calculation
  const hourAngle = (customHour % 12) * 30 + customMinute * 0.5;
  const minuteAngle = customMinute * 6;

  return (
    <div id="clock-angle-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl">
        <span className="text-3xl">⏰</span>
        <div>
          <h3 className="font-bold text-rose-800 text-lg">
            {questionType === "angle" ? "时空钟表面角度天秤" : "神奇频率敲击回音谷"}
          </h3>
          <p className="text-xs text-rose-600">
            {questionType === "angle"
              ? `问题：在 ${timeStr} 这个时刻，时针和分针之间组成的较小夹角是多少度？`
              : `问题：时钟敲击 ${strikeCount} 下，用了 ${strikeSecs} 秒。那么敲击 ${targetStrikes} 下需要多少秒？`}
          </p>
        </div>
      </div>

      {/* Interactive Clock Visualizer */}
      {questionType === "angle" && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col items-center gap-4">
          {/* SVG Clock Dial */}
          <div className="relative w-48 h-48 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Dial markings */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const rad = (angle * Math.PI) / 180;
                const x1 = 50 + 40 * Math.sin(rad);
                const y1 = 50 - 40 * Math.cos(rad);
                const x2 = 50 + 45 * Math.sin(rad);
                const y2 = 50 - 45 * Math.cos(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />;
              })}

              {/* Hour hand */}
              <line
                x1="50"
                y1="50"
                x2={50 + 25 * Math.sin((hourAngle * Math.PI) / 180)}
                y2={50 - 25 * Math.cos((hourAngle * Math.PI) / 180)}
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Minute hand */}
              <line
                x1="50"
                y1="50"
                x2={50 + 35 * Math.sin((minuteAngle * Math.PI) / 180)}
                y2={50 - 35 * Math.cos((minuteAngle * Math.PI) / 180)}
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Center point */}
              <circle cx="50" cy="50" r="3" fill="#1e293b" />
            </svg>
          </div>

          {/* Sliders to custom adjust clock to check angles */}
          <div className="w-full max-w-sm flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
              <span>调整模拟时间：</span>
              <span className="font-mono text-indigo-600 font-black">
                {customHour.toString().padStart(2, "0")}:{customMinute.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold">时：{customHour}</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={customHour}
                  onChange={(e) => {
                    SoundEffects.playClick();
                    setCustomHour(Number(e.target.value));
                  }}
                  className="w-full accent-rose-600"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold">分：{customMinute}</span>
                <input
                  type="range"
                  min="0"
                  max="59"
                  step="5"
                  value={customMinute}
                  onChange={(e) => {
                    SoundEffects.playClick();
                    setCustomMinute(Number(e.target.value));
                  }}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strike visualizer */}
      {questionType === "strike" && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col items-center justify-center gap-4">
          <div className="flex gap-4">
            {Array.from({ length: strikeCount! }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 animate-pulse" style={{ animationDelay: `${idx * 0.5}s` }}>
                <span className="text-3xl text-amber-500">🔔</span>
                <span className="text-[9px] font-black text-slate-400">击 {idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="w-full border-t border-slate-200/60 pt-3 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500">
              提示：{strikeCount} 下敲击，它们之间正好夹着 <strong className="text-rose-600">{strikeCount! - 1} 个静音间隔</strong>！
            </span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 请写下你最终算出的精确数字答案：
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请输入数字"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              核对答案
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-rose-850 bg-rose-50/70 border border-rose-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
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
