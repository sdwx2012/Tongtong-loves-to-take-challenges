import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, AlertCircle, RefreshCw, Landmark } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface Item {
  id: string;
  label: string;
  emoji: string;
}

interface LogicGridGameProps {
  levelData: {
    characters: string[];
    items: Item[];
    clues: string[];
    correctAnswer: Record<string, string>; // Map of Character Name -> Item ID
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const LogicGridGame: React.FC<LogicGridGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { characters, items, clues, correctAnswer } = levelData;

  // Track the selected item ID for each character
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Reset selections on level change
    const initialSelections: Record<string, string> = {};
    characters.forEach((char) => {
      initialSelections[char] = ""; // unselected
    });
    setSelections(initialSelections);
    setFeedback("欢迎来到侦探推理社！请仔细阅读左侧的“案件线索”，并在右侧为小动物匹配他们正确的物品吧！🔍");
  }, [levelData]);

  const handleSelect = (char: string, itemId: string) => {
    SoundEffects.playClick();
    setSelections((prev) => ({
      ...prev,
      [char]: itemId
    }));
  };

  const handleCheck = () => {
    // Verify all characters are matched
    const unselected = characters.filter((char) => !selections[char]);
    if (unselected.length > 0) {
      SoundEffects.playIncorrect();
      setFeedback(`推理还没做完哦！请为以下动物选定匹配物：${unselected.join("、")}。`);
      onIncorrect?.();
      return;
    }

    // Verify answers
    let isAllCorrect = true;
    for (const char of characters) {
      if (selections[char] !== correctAnswer[char]) {
        isAllCorrect = false;
        break;
      }
    }

    if (isAllCorrect) {
      SoundEffects.playCorrect();
      setFeedback("案情大白！🎉 你的逻辑推理完美无瑕，所有的匹配完全吻合！你真是一个福尔摩斯小侦探！🕵️‍♂️");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback("推测结果不符合线索哦，再仔细对比一下线索，重新推理一下吧！💪");
      onIncorrect?.();
    }
  };

  return (
    <div id="logic-grid-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-violet-50 border border-violet-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🕵️‍♂️</span>
          <div>
            <h3 className="font-bold text-violet-800 text-lg">小侦探推理探案社</h3>
            <p className="text-xs text-violet-600">梳理线索，排除干扰，推断唯一正确的逻辑关联</p>
          </div>
        </div>
        <button
          onClick={() => {
            SoundEffects.playClick();
            const initial: Record<string, string> = {};
            characters.forEach((char) => { initial[char] = ""; });
            setSelections(initial);
          }}
          className="flex items-center gap-1 text-xs text-violet-700 bg-violet-100 hover:bg-violet-200 px-2.5 py-1.5 rounded-lg font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置案情
        </button>
      </div>

      {/* Arena Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Hand: Clue Notebook (5 cols) */}
        <div className="md:col-span-5 bg-amber-50/40 border border-amber-100 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-bold text-amber-800 tracking-wider flex items-center gap-1">
            <span>📓</span> 侦探案件簿
          </span>
          <div className="flex flex-col gap-2.5">
            {clues.map((clue, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-amber-200/50 p-3 rounded-lg shadow-3xs flex items-start gap-2 text-xs leading-relaxed text-slate-700"
              >
                <span className="text-amber-500 font-extrabold shrink-0">【线索 {idx + 1}】</span>
                <p className="font-medium">{clue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hand: Match Board (7 cols) */}
        <div className="md:col-span-7 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1">
            <span>🎯</span> 匹配连线控制面板
          </span>

          <div className="flex flex-col gap-3.5">
            {characters.map((char) => {
              const currentSel = selections[char];
              return (
                <div
                  key={char}
                  className="bg-white border border-slate-100 p-3 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Subject Name */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm">
                      {char[0]}
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{char}</span>
                  </div>

                  {/* Options Selector Grid */}
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => {
                      const isSelected = currentSel === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(char, item.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                            isSelected
                              ? "bg-violet-600 text-white border-violet-700 shadow-sm"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check Answer and Feedback Bar */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🕵️‍♂️ 匹配完成后，请开始破案：
          </label>
          <button
            onClick={handleCheck}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-xs"
          >
            <Check className="w-4 h-4" />
            开始破案 (验证推理)
          </button>
        </div>

        {/* Dynamic feedback indicator */}
        {feedback && (
          <div className="text-xs font-semibold text-violet-700 bg-violet-50/70 border border-violet-100/50 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Small Clue/Hint Tip */}
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
