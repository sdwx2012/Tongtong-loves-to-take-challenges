import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, Play, RotateCcw } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface MeetingChaseGameProps {
  levelData: {
    type: "meet" | "chase";
    distance: number;
    speed1: number; // speed of person A / pursuer
    speed2: number; // speed of person B / pursued
    correctAnswer: number; // time (hours or minutes)
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const MeetingChaseGame: React.FC<MeetingChaseGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { type, distance, speed1, speed2, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0); // 0 to 100 for visualizer
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setUserInput("");
    setProgress(0);
    setIsAnimating(false);
    setFeedback(`速度相遇追及大比拼！点击“播放运行模拟”来看看小动物们在跑道上的位移轨迹吧！🏃‍♂️`);
  }, [levelData]);

  // Handle animation simulation
  useEffect(() => {
    let intervalId: any;
    if (isAnimating) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isAnimating]);

  const handleCheck = () => {
    const ans = parseFloat(userInput.trim());
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你算出的答案！");
      onIncorrect?.();
      return;
    }

    if (Math.abs(ans - correctAnswer) < 0.01) {
      SoundEffects.playCorrect();
      setFeedback("答对啦！🎉 精准计算！两者的相对位移完美吻合！你真是一个行程计算大师！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback("算出的数值有些偏差哦，观察动画并重新根据公式计算一遍吧！");
      onIncorrect?.();
    }
  };

  // Compute animated positions based on current progress percentage
  // For 'meet': A starts from left (0), B starts from right (100)
  // meeting point is speed1 / (speed1 + speed2) * 100
  const meetPct = (speed1 / (speed1 + speed2)) * 100;
  const posA_meet = (progress / 100) * meetPct;
  const posB_meet = 100 - (progress / 100) * (100 - meetPct);

  // For 'chase': A starts from left (0), B starts from middle (distance ratio)
  // Let B start at 40%. Chase point is 100% (or offscreen, but we fit into 100%).
  const startB_chase = 40;
  const posA_chase = (progress / 100) * 100;
  const posB_chase = startB_chase + (progress / 100) * (100 - startB_chase);

  const posA = type === "meet" ? posA_meet : posA_chase;
  const posB = type === "meet" ? posB_meet : posB_chase;

  return (
    <div id="meeting-chase-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-sky-50 border border-sky-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏃‍♂️</span>
          <div>
            <h3 className="font-bold text-sky-800 text-lg">
              {type === "meet" ? "时速相遇森林跑道" : "极限追及阳光大草原"}
            </h3>
            <p className="text-xs text-sky-600">
              {type === "meet"
                ? `初始距离：${distance} 米 | 相对而行：速度 ${speed1} m/s 与 ${speed2} m/s`
                : `初始距离：${distance} 米 | 后面追赶：速度 ${speed1} m/s 与 ${speed2} m/s`}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            setProgress(0);
            setIsAnimating(true);
          }}
          className="flex items-center gap-1 text-xs bg-sky-600 text-white hover:bg-sky-700 px-3 py-2 rounded-lg font-bold transition duration-200 active:scale-95"
        >
          <Play className="w-3.5 h-3.5" />
          运行模拟
        </button>
      </div>

      {/* Visual Arena Track */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col gap-6 items-stretch relative overflow-hidden">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>🚩 起点</span>
          <span className="text-[10px] text-sky-500 font-mono">
            {type === "meet" ? "双向奔赴模式" : "加速追及模式"}
          </span>
          <span>🏁 终点</span>
        </div>

        {/* The Track Line */}
        <div className="relative h-14 bg-slate-200 rounded-full border border-slate-300 flex items-center px-4">
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-slate-400 pointer-events-none" />

          {/* Actor A */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center"
            style={{ left: `calc(${posA}% - 12px)` }}
          >
            <span className="text-2xl">🐯</span>
            <span className="text-[9px] font-black text-slate-500 font-mono bg-white border px-1 rounded">
              A ({speed1}m/s)
            </span>
          </div>

          {/* Actor B */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center"
            style={{ left: `calc(${posB}% - 12px)` }}
          >
            <span className="text-2xl">🐰</span>
            <span className="text-[9px] font-black text-slate-500 font-mono bg-white border px-1 rounded">
              B ({speed2}m/s)
            </span>
          </div>
        </div>

        {/* Dynamic distance indicator below */}
        <div className="flex justify-between items-center text-[11px] text-slate-500 bg-white border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <span>初始距离：<strong>{distance} 米</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            <span>速度差/和：<strong>{type === "meet" ? speed1 + speed2 : speed1 - speed2} m/s</strong></span>
          </div>
        </div>
      </div>

      {/* Input controls */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            ⏰ 请问跑了多少秒后，两只小动物会相遇/追上？
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="请输入相遇或追上所需的时间(秒)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Check className="w-4 h-4" />
              提交判定
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-sky-750 bg-sky-50/70 border border-sky-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Tips */}
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
