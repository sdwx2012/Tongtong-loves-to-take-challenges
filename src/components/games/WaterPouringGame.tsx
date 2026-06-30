import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, RefreshCw, ChevronRight } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface WaterPouringGameProps {
  levelData: {
    capA: number;
    capB: number;
    target: number;
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const WaterPouringGame: React.FC<WaterPouringGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { capA, capB, target } = levelData;
  const [volA, setVolA] = useState(0);
  const [volB, setVolB] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    setVolA(0);
    setVolB(0);
    setStepCount(0);
    setFeedback(`量水倒水魔法瓶！你拥有一个 ${capA} 升大杯和一个 ${capB} 升小杯。请通过‘加满’、‘清空’或‘倒入另一个杯子’的操作，直到其中一个杯子里正好装有 ${target} 升水！💧`);
  }, [levelData]);

  // Check victory condition automatically when volumes change
  useEffect(() => {
    if (volA === target || volB === target) {
      SoundEffects.playCorrect();
      setFeedback(`恭喜成功！🎉 在第 ${stepCount} 步，你成功量出了刚好 ${target} 升的水！你真是一个量水倒水天才魔法师！`);
      onSolved(3);
    }
  }, [volA, volB]);

  const fillA = () => {
    SoundEffects.playClick();
    setVolA(capA);
    setStepCount((s) => s + 1);
  };

  const fillB = () => {
    SoundEffects.playClick();
    setVolB(capB);
    setStepCount((s) => s + 1);
  };

  const emptyA = () => {
    SoundEffects.playClick();
    setVolA(0);
    setStepCount((s) => s + 1);
  };

  const emptyB = () => {
    SoundEffects.playClick();
    setVolB(0);
    setStepCount((s) => s + 1);
  };

  const pourAtoB = () => {
    SoundEffects.playClick();
    const spaceInB = capB - volB;
    const amountToPour = Math.min(volA, spaceInB);
    setVolA((prev) => prev - amountToPour);
    setVolB((prev) => prev + amountToPour);
    setStepCount((s) => s + 1);
  };

  const pourBtoA = () => {
    SoundEffects.playClick();
    const spaceInA = capA - volA;
    const amountToPour = Math.min(volB, spaceInA);
    setVolB((prev) => prev - amountToPour);
    setVolA((prev) => prev + amountToPour);
    setStepCount((s) => s + 1);
  };

  return (
    <div id="water-pouring-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-sky-50 border border-sky-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💧</span>
          <div>
            <h3 className="font-bold text-sky-800 text-lg">量水倒水魔法实验室</h3>
            <p className="text-xs text-sky-600">
              目标：量出刚好 <strong className="text-indigo-600">{target} 升</strong> 水 (当前已操作 {stepCount} 步)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            setVolA(0);
            setVolB(0);
            setStepCount(0);
            setFeedback(`实验重置成功！再接再厉，用大容量杯子装满倒向小容量杯子吧！`);
          }}
          className="flex items-center gap-1 text-xs text-sky-700 bg-sky-100 hover:bg-sky-200 px-2.5 py-1.5 rounded-lg font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置实验
        </button>
      </div>

      {/* Visual Cups Racetrack */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-around gap-8">
        {/* Cup A */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-500">🧪 魔法烧杯 A (容量 {capA} 升)</span>
          <div className="relative w-28 h-40 bg-slate-200 rounded-b-2xl border-4 border-slate-300 flex items-end overflow-hidden shadow-inner">
            {/* Water liquid */}
            <div
              className="w-full bg-gradient-to-t from-blue-400 to-sky-300 transition-all duration-300 relative"
              style={{ height: `${(volA / capA) * 100}%` }}
            >
              {volA > 0 && (
                <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-white text-base drop-shadow-md">
                  {volA} L
                </span>
              )}
            </div>
          </div>
          {/* Controls Cup A */}
          <div className="flex gap-1.5">
            <button
              onClick={fillA}
              className="text-[10px] bg-sky-600 hover:bg-sky-700 text-white font-bold px-2 py-1.5 rounded-md transition"
            >
              加满 A
            </button>
            <button
              onClick={emptyA}
              className="text-[10px] bg-slate-500 hover:bg-slate-600 text-white font-bold px-2 py-1.5 rounded-md transition"
            >
              清空 A
            </button>
          </div>
        </div>

        {/* Action arrow columns */}
        <div className="flex flex-row md:flex-col gap-3">
          <button
            onClick={pourAtoB}
            disabled={volA === 0 || volB === capB}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>A 倒入 B</span>
            <ChevronRight className="w-3.5 h-3.5 md:rotate-90" />
          </button>
          <button
            onClick={pourBtoA}
            disabled={volB === 0 || volA === capA}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180 md:-rotate-90" />
            <span>B 倒入 A</span>
          </button>
        </div>

        {/* Cup B */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-500">🧪 魔法烧杯 B (容量 {capB} 升)</span>
          <div className="relative w-24 h-32 bg-slate-200 rounded-b-2xl border-4 border-slate-300 flex items-end overflow-hidden shadow-inner">
            {/* Water liquid */}
            <div
              className="w-full bg-gradient-to-t from-blue-400 to-sky-300 transition-all duration-300 relative"
              style={{ height: `${(volB / capB) * 100}%` }}
            >
              {volB > 0 && (
                <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-white text-sm drop-shadow-md">
                  {volB} L
                </span>
              )}
            </div>
          </div>
          {/* Controls Cup B */}
          <div className="flex gap-1.5">
            <button
              onClick={fillB}
              className="text-[10px] bg-sky-600 hover:bg-sky-700 text-white font-bold px-2 py-1.5 rounded-md transition"
            >
              加满 B
            </button>
            <button
              onClick={emptyB}
              className="text-[10px] bg-slate-500 hover:bg-slate-600 text-white font-bold px-2 py-1.5 rounded-md transition"
            >
              清空 B
            </button>
          </div>
        </div>
      </div>

      {/* Realtime Feedback and Status indicators */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-3">
        {feedback && (
          <div className="text-xs font-semibold text-sky-850 bg-sky-50/70 border border-sky-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Tip panel */}
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
