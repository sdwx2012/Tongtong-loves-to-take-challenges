import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, Users } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface PermutationGameProps {
  levelData: {
    type: "digits" | "handshakes";
    items: string[]; // e.g. ["1", "2", "3"] or ["小猫", "小狗", "小熊", "小兔"]
    correctAnswer: number;
    hint: string;
    explanation: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const PermutationGame: React.FC<PermutationGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const { type, items, correctAnswer } = levelData;
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [connectedPairs, setConnectedPairs] = useState<string[]>([]); // "A-B"

  useEffect(() => {
    setUserInput("");
    setConnectedPairs([]);
    if (type === "handshakes") {
      setFeedback("欢迎来到握手连线晚会！点击两名成员，建立一条‘握手连线’。看看全部握手完一共需要多少条线？🤝");
    } else {
      setFeedback("数字神奇组合岛！利用给定的数字组成不同的、不重复的多位数。想一想一共有多少种不同的组法？🔢");
    }
  }, [levelData]);

  const handleNodeClick = (name: string) => {
    if (type !== "handshakes") return;
    SoundEffects.playClick();

    // If there's an active incomplete node, pair them
    const pending = connectedPairs.find((p) => p.endsWith("-pending"));
    if (pending) {
      const activeNode = pending.split("-")[0];
      if (activeNode === name) {
        // deselect
        setConnectedPairs((prev) => prev.filter((p) => p !== pending));
        return;
      }
      // complete pairing
      const pair = [activeNode, name].sort().join("-");
      setConnectedPairs((prev) => {
        const cleaned = prev.filter((p) => p !== pending);
        if (cleaned.includes(pair)) {
          return cleaned.filter((p) => p !== pair); // toggle off
        }
        return [...cleaned, pair];
      });
    } else {
      // initiate pairing
      setConnectedPairs((prev) => [...prev, `${name}-pending`]);
    }
  };

  const handleCheck = () => {
    const ans = parseInt(userInput.trim(), 10);
    if (isNaN(ans)) {
      SoundEffects.playIncorrect();
      setFeedback("请输入你算出的排列或握手总数！");
      onIncorrect?.();
      return;
    }

    if (ans === correctAnswer) {
      SoundEffects.playCorrect();
      setFeedback("大吉大利，答案完全正确！🎉 排列组合的核心是保证不漏不重，你的思维严丝合缝！");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      setFeedback("算出来的组合数不对哦。仔细想想：握手可以用公式 N * (N - 1) ÷ 2 算；数字组合要注意有没有 0 排在首位！");
      onIncorrect?.();
    }
  };

  const isPending = (name: string) => connectedPairs.some((p) => p === `${name}-pending`);
  const isConnected = (name1: string, name2: string) => {
    const pair = [name1, name2].sort().join("-");
    return connectedPairs.includes(pair);
  };

  return (
    <div id="permutation-game-container" className="flex flex-col gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 p-4 rounded-xl">
        <span className="text-3xl">{type === "handshakes" ? "🤝" : "🔢"}</span>
        <div>
          <h3 className="font-bold text-violet-800 text-lg">
            {type === "handshakes" ? "温暖友谊握手大聚会" : "神奇数字排列魔术屋"}
          </h3>
          <p className="text-xs text-violet-600">
            {type === "handshakes"
              ? `一共有 ${items.length} 位小动物聚会，每两个人都要握手一次。`
              : `用数字卡片 【${items.join(", ")}】 可以组成多少个不同且没有重复数字的数？`}
          </p>
        </div>
      </div>

      {/* Handshake Visual Arena */}
      {type === "handshakes" ? (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-slate-500">点击小动物头像，将它们两两连线，数数一共需要连接多少根绳子？🔗</span>
          <div className="flex flex-wrap gap-4 justify-center items-center py-4">
            {items.map((name) => {
              const pending = isPending(name);
              return (
                <button
                  key={name}
                  onClick={() => handleNodeClick(name)}
                  className={`relative p-3 rounded-xl border-2 font-bold text-xs transition active:scale-95 flex flex-col items-center gap-1.5 ${
                    pending
                      ? "bg-violet-500 text-white border-violet-600 shadow-md animate-pulse"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-2xl">🦁</span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Connected pair info indicator */}
          <div className="flex flex-wrap gap-2 justify-center">
            {connectedPairs
              .filter((p) => !p.endsWith("-pending"))
              .map((p) => (
                <span key={p} className="text-[10px] bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full">
                  🤝 {p.replace("-", " 与 ")} 握手成功
                </span>
              ))}
          </div>
        </div>
      ) : (
        /* Digits Permutation Arena */
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-slate-400">🔢 可用的数字卡片：</span>
          <div className="flex gap-3">
            {items.map((digit, idx) => (
              <div key={idx} className="w-12 h-16 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 text-white font-mono font-black text-2xl flex items-center justify-center shadow-md border-b-4 border-indigo-700 animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                {digit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer entry */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-slate-700 text-sm">
            🎯 那么，一共有多少种不同的组法 / 握手次数呢？
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="请填入答案"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              onClick={handleCheck}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              核实答案
            </button>
          </div>
        </div>

        {feedback && (
          <div className="text-xs font-semibold text-violet-800 bg-violet-50/70 border border-violet-100/50 p-3 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
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
