import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, MessageCircle, AlertCircle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface CharacterStatement {
  name: string;
  emoji: string;
  statement: string;
}

interface TruthLiarGameProps {
  levelData: {
    characters: CharacterStatement[];
    liarCount: number; // e.g. 1 liar, 2 truth-tellers
    correctAnswer: string; // the name of the liar / truth-teller requested
    questionType: "find_liar" | "find_honest";
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const TruthLiarGame: React.FC<TruthLiarGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { characters, liarCount, correctAnswer, questionType } = levelData;
  const [selectedChar, setSelectedChar] = useState("");
  const [feedback, setFeedback] = useState("");
  const [assumptions, setAssumptions] = useState<Record<string, "truth" | "lie">>({});

  useEffect(() => {
    setSelectedChar("");
    setFeedback(`真假谎言逻辑辨析室！点击每个角色的头像并做出假设，假设他是‘说真话’还是‘撒谎’。梳理他们的供词，看看是否存在自相矛盾吧！🕵️‍♀️`);
    const initialAssumptions: Record<string, "truth" | "lie"> = {};
    characters.forEach((c) => {
      initialAssumptions[c.name] = "truth"; // default
    });
    setAssumptions(initialAssumptions);
  }, [levelData]);

  const handleToggleAssumption = (name: string) => {
    SoundEffects.playClick();
    setAssumptions((prev) => ({
      ...prev,
      [name]: prev[name] === "truth" ? "lie" : "truth"
    }));
  };

  const handleCheck = () => {
    if (!selectedChar) {
      SoundEffects.playIncorrect();
      setFeedback("请点击下方头像选出你的推理判定对象！");
      onIncorrect?.();
      return;
    }

    if (selectedChar === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("福尔摩斯转世！🎉 完全正确！你精准锁定了嫌疑人，逻辑推理无可挑剔！太棒了！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`推理结果与线索相悖哦。换一种假设：如果是另一个人撒谎，会不会大家都说得通呢？再试试吧！`);
      onIncorrect?.();
    }
  };

  // Count lies in the assumptions
  const assumedLiarCount = Object.values(assumptions).filter((v) => v === "lie").length;

  return (
    <div id="truth-liar-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center gap-3 bg-fuchsia-50 border border-fuchsia-100 p-4 rounded-xl">
        <span className="text-3xl">🕵️‍♀️</span>
        <div>
          <h3 className="font-bold text-fuchsia-800 text-lg">谎言与真话逻辑辩论赛</h3>
          <p className="text-xs text-fuchsia-600">
            已知在场小动物中，正好有 <strong className="text-rose-600">{liarCount} 只在撒谎</strong>，其余在说真话！
          </p>
        </div>
      </div>

      {/* Characters and Statements Arena */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <span className="text-xs font-bold text-slate-500 tracking-wider">📜 辩论赛供词录：</span>

        <div className="flex flex-col gap-3.5">
          {characters.map((char) => {
            const currentAssumption = assumptions[char.name];
            return (
              <div key={char.name} className="bg-white border border-slate-100 p-4 rounded-xl shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-11 h-11 rounded-full bg-slate-150 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {char.emoji}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-slate-800">{char.name} 的发言：</span>
                    <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 italic relative">
                      <MessageCircle className="absolute -left-1.5 top-2 w-3.5 h-3.5 text-slate-200" />
                      “{char.statement}”
                    </p>
                  </div>
                </div>

                {/* Interactive assumption toggler */}
                <div className="flex flex-row sm:flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold">逻辑假设：</span>
                  <button
                    onClick={() => handleToggleAssumption(char.name)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition duration-200 active:scale-95 ${
                      currentAssumption === "truth"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    {currentAssumption === "truth" ? "😇 假设说真话" : "😈 假设在撒谎"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assumptions check indicator */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs font-bold text-indigo-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            当前逻辑假设：总计有 {assumedLiarCount} 个撒谎者。
            {assumedLiarCount === liarCount ? (
              <strong className="text-emerald-600">（数量契合题目要求！验证供词看是否冲突）</strong>
            ) : (
              <strong className="text-rose-600">（数量与题目所说“正好 {liarCount} 只撒谎”不符哦！）</strong>
            )}
          </span>
        </div>
      </div>

      {/* Answer selection */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <label className="font-bold text-slate-700 text-sm">
            🎯 最终破案：根据严密推理，请问【谁是真正的{questionType === "find_liar" ? "撒谎者" : "诚实说真话者"}】？
          </label>
          <div className="flex flex-wrap gap-2">
            {characters.map((char) => {
              const isSelected = selectedChar === char.name;
              return (
                <button
                  key={char.name}
                  onClick={() => {
                    SoundEffects.playClick();
                    setSelectedChar(char.name);
                  }}
                  className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-fuchsia-600 text-white border-fuchsia-700 shadow-md"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{char.emoji}</span>
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleCheck}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Check className="w-4 h-4" />
          开始结案宣判
        </button>

        {feedback && (
          <div className="text-xs font-semibold text-fuchsia-850 bg-fuchsia-50/70 border border-fuchsia-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-500 shrink-0 mt-0.5" />
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
