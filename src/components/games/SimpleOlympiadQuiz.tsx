import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, AlertCircle, RefreshCw, Trash2, ArrowRight } from "lucide-react";
import { SoundEffects } from "../SoundEffects";
import { WorldId } from "../../types";

interface SimpleOlympiadQuizProps {
  worldId: WorldId;
  levelData: any;
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

export const SimpleOlympiadQuiz: React.FC<SimpleOlympiadQuizProps> = ({
  worldId,
  levelData,
  onSolved,
  onIncorrect
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  // Game-specific interactive states
  const [substitutionCount, setSubstitutionCount] = useState<number>(0); // Grapes / carrots placed
  const [clickedCubes, setClickedCubes] = useState<{ [key: string]: boolean }>({}); // Interactive counting stars
  const [coinsPlaced, setCoinsPlaced] = useState<number[]>([]); // Cashier coins added
  const [oddEvenSelection, setOddEvenSelection] = useState<string | null>(null); // "奇数" or "偶数"

  useEffect(() => {
    setSelectedOption(null);
    setTextAnswer("");
    setSubstitutionCount(0);
    setClickedCubes({});
    setCoinsPlaced([]);
    setOddEvenSelection(null);
    setFeedback("仔细阅读题目，点击选项或在控制区里操作来解答吧！✨");
  }, [levelData]);

  // Handle Verify Answer
  const handleCheckAnswer = () => {
    let isCorrect = false;
    const correctAns = levelData.correctAnswer;

    if (worldId === WorldId.SubstitutionMath) {
      if (substitutionCount === correctAns) {
        isCorrect = true;
      } else {
        setFeedback(`不对哦。你放了 ${substitutionCount} 个物品在盘子里，天平还没有平衡！再试一次。`);
      }
    } else if (worldId === WorldId.SupermarketChange) {
      const sum = coinsPlaced.reduce((a, b) => a + b, 0);
      if (sum === correctAns) {
        isCorrect = true;
      } else {
        setFeedback(`不对哦。你找零了 ${sum} 元，而阿姨需要找你 ${correctAns} 元！再数数金币。`);
      }
    } else if (levelData.options && levelData.options.length > 0) {
      if (selectedOption === correctAns) {
        isCorrect = true;
      } else {
        setFeedback("哎呀，答错啦！再开动脑筋想一想。");
      }
    } else {
      // Input text or number
      const cleanInput = textAnswer.trim();
      if (cleanInput === String(correctAns)) {
        isCorrect = true;
      } else {
        setFeedback(`算出来的答案不对哦。填的是 [${textAnswer || "空"}]，再仔细看题算算吧！`);
      }
    }

    if (isCorrect) {
      SoundEffects.playCorrect();
      setFeedback("哇！太棒了！你的答案完全正确，成功通关！🎉");
      onSolved(3);
    } else {
      SoundEffects.playIncorrect();
      if (onIncorrect) onIncorrect();
    }
  };

  const resetGame = () => {
    SoundEffects.playClick();
    setSelectedOption(null);
    setTextAnswer("");
    setSubstitutionCount(0);
    setClickedCubes({});
    setCoinsPlaced([]);
    setOddEvenSelection(null);
    setFeedback("题目已重置，重新开始思考吧！🌿");
  };

  // Render different SVG visualization depending on worldId
  const renderVisualArea = () => {
    switch (worldId) {
      case WorldId.SubstitutionMath: {
        // Equivalent equations visual
        // Left side: Source Fruit, Right side: Target Fruits
        const sourceEmoji = levelData.visualData?.source || "🍎";
        const middleEmoji = levelData.visualData?.middle || "🍓";
        const targetEmoji = levelData.visualData?.target || "🍇";
        const eq1Ratio = levelData.visualData?.eq1Ratio || 2;
        const eq2Ratio = levelData.visualData?.eq2Ratio || 3;

        return (
          <div className="flex flex-col gap-4 w-full select-none">
            {/* Rule panel */}
            <div className="flex justify-center gap-6 bg-amber-50 border-2 border-amber-200 p-3 rounded-2xl text-xs font-black text-amber-800">
              <div className="flex items-center gap-1">
                <span>1 {sourceEmoji}</span>
                <span>=</span>
                <span>{eq1Ratio} {middleEmoji}</span>
              </div>
              <div className="w-px h-4 bg-amber-300" />
              <div className="flex items-center gap-1">
                <span>1 {middleEmoji}</span>
                <span>=</span>
                <span>{eq2Ratio} {targetEmoji}</span>
              </div>
            </div>

            {/* Interactive balance scale */}
            <div className="relative bg-gradient-to-b from-sky-50 to-blue-100 border-3 border-white rounded-3xl p-4 min-h-[180px] flex flex-col justify-end overflow-hidden shadow-inner">
              {/* Scale beam */}
              <div className="relative w-full h-2 bg-amber-800 rounded-full mb-10 flex justify-between px-8">
                {/* Center fulcrum */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-8 h-12 bg-slate-500 rounded-t-full border-b-4 border-slate-600 z-10" />

                {/* Left plate (1 Source fruit) */}
                <div className="absolute left-4 -bottom-6 flex flex-col items-center">
                  <div className="w-16 h-1 bg-slate-400 rounded-full" />
                  <div className="flex gap-1 justify-center mt-[-10px] text-3xl animate-pulse">
                    {sourceEmoji}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 mt-2">1个{levelData.visualData?.sourceName || "物品"}</span>
                </div>

                {/* Right plate (User added target fruits) */}
                <div className="absolute right-4 -bottom-6 flex flex-col items-center">
                  <div className="w-16 h-1 bg-slate-400 rounded-full" />
                  <div className="flex flex-wrap max-w-[80px] gap-0.5 justify-center mt-[-10px] min-h-[36px] text-xl">
                    {substitutionCount === 0 ? (
                      <span className="text-[10px] text-slate-400 font-bold self-center">空空如也</span>
                    ) : (
                      Array.from({ length: substitutionCount }).map((_, idx) => (
                        <span key={idx} className="animate-bounce inline-block" style={{ animationDelay: `${idx * 0.05}s` }}>
                          {targetEmoji}
                        </span>
                      ))
                    )}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 mt-2">放了 {substitutionCount} 个{levelData.visualData?.targetName || "物品"}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-2 justify-center z-20">
                <button
                  onClick={() => {
                    SoundEffects.playClick();
                    setSubstitutionCount(prev => prev + 1);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                >
                  放一个 {targetEmoji}
                </button>
                <button
                  onClick={() => {
                    SoundEffects.playClick();
                    setSubstitutionCount(Math.max(0, substitutionCount - 1));
                  }}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                  disabled={substitutionCount === 0}
                >
                  拿走一个
                </button>
                <button
                  onClick={() => {
                    SoundEffects.playClick();
                    setSubstitutionCount(0);
                  }}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                  title="清空"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case WorldId.CubeStack: {
        // Isometric 3D block stacked visualizer
        // Kids click cubes to highlight and count them
        const cubesCount = levelData.visualData?.cubesCount || 4;
        const layout = levelData.visualData?.layout || []; // coordinates for rendering cubes

        return (
          <div className="flex flex-col gap-3 w-full items-center select-none">
            <span className="text-xs font-bold text-slate-500">💡 小诀窍：你可以点击积木，在上面贴上“已数星星”，防止数重复哦！</span>
            <div className="relative w-full max-w-[280px] h-[180px] bg-sky-50 border-3 border-white rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
              <svg viewBox="0 0 200 150" className="w-full h-full">
                {/* Render blocks based on layout coords */}
                {layout.map((cube: any, index: number) => {
                  const key = `cube_${index}`;
                  const isClicked = !!clickedCubes[key];

                  // Iso projective coordinates
                  const x = cube.x; // width position
                  const y = cube.y; // height position
                  const z = cube.z; // depth layer

                  // Project 3D to 2D
                  const screenX = 100 + (x - z) * 16;
                  const screenY = 110 - (x + z) * 8 - y * 18;

                  return (
                    <g
                      key={key}
                      onClick={() => {
                        SoundEffects.playClick();
                        setClickedCubes(prev => ({ ...prev, [key]: !prev[key] }));
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Left face of cube */}
                      <path
                        d={`M ${screenX} ${screenY} L ${screenX - 16} ${screenY - 8} L ${screenX - 16} ${screenY + 10} L ${screenX} ${screenY + 18} Z`}
                        fill={isClicked ? "#6366f1" : "#fbbf24"}
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                      {/* Right face of cube */}
                      <path
                        d={`M ${screenX} ${screenY} L ${screenX + 16} ${screenY - 8} L ${screenX + 16} ${screenY + 10} L ${screenX} ${screenY + 18} Z`}
                        fill={isClicked ? "#4f46e5" : "#f59e0b"}
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                      {/* Top face of cube */}
                      <path
                        d={`M ${screenX} ${screenY} L ${screenX - 16} ${screenY - 8} L ${screenX} ${screenY - 16} L ${screenX + 16} ${screenY - 8} Z`}
                        fill={isClicked ? "#818cf8" : "#fef08a"}
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                      {/* If counted, show a cute star in the center */}
                      {isClicked && (
                        <text
                          x={screenX}
                          y={screenY + 3}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="black"
                          className="pointer-events-none"
                        >
                          ⭐
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      }

      case WorldId.WeightCompare: {
        // Balances comparing items
        const scales = levelData.visualData?.scales || []; // scales left vs right heavy

        return (
          <div className="flex flex-col gap-4 w-full select-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scales.map((scale: any, idx: number) => {
                const heavy = scale.heavy;
                const light = scale.light;

                return (
                  <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 mb-2">天平秤量 {idx + 1}</span>
                    <div className="relative w-full h-12 flex items-center justify-between px-6">
                      {/* Tilted line */}
                      <div className="absolute left-1/10 right-1/10 h-1 bg-amber-800 transform rotate-6" />
                      
                      {/* Left Side: Heavy (Lower) */}
                      <div className="flex flex-col items-center translate-y-2 z-10">
                        <span className="text-2xl animate-bounce">{heavy}</span>
                        <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-1.5 rounded-full mt-1">沉 (重)</span>
                      </div>

                      {/* Right Side: Light (Higher) */}
                      <div className="flex flex-col items-center -translate-y-2 z-10">
                        <span className="text-2xl">{light}</span>
                        <span className="text-[9px] bg-sky-100 text-sky-700 font-extrabold px-1.5 rounded-full mt-1">轻</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case WorldId.ClockMatch: {
        // Render simple SVG analog clock
        const hours = levelData.visualData?.hours || 12;
        const minutes = levelData.visualData?.minutes || 0;

        // Angle calculations for clock hands
        const minuteAngle = minutes * 6; // 360 / 60
        const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 360 / 12 + extra hour drift

        return (
          <div className="flex flex-col items-center w-full select-none">
            <div className="relative w-36 h-36 bg-white border-4 border-slate-700 rounded-full flex items-center justify-center shadow-md">
              {/* Clock face numbers */}
              <div className="absolute top-1 font-black text-xs text-slate-700">12</div>
              <div className="absolute right-2 font-black text-xs text-slate-700">3</div>
              <div className="absolute bottom-1 font-black text-xs text-slate-700">6</div>
              <div className="absolute left-2 font-black text-xs text-slate-700">9</div>
              
              {/* Hands container */}
              <div className="relative w-full h-full pointer-events-none">
                {/* Hour Hand */}
                <div
                  className="absolute top-1/2 left-1/2 -ml-1 -mt-10 w-2 h-10 bg-slate-800 rounded-full origin-bottom"
                  style={{ transform: `rotate(${hourAngle}deg)` }}
                />
                {/* Minute Hand */}
                <div
                  className="absolute top-1/2 left-1/2 -ml-0.5 -mt-14 w-1 h-14 bg-rose-500 rounded-full origin-bottom"
                  style={{ transform: `rotate(${minuteAngle}deg)` }}
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-slate-950 border-2 border-white rounded-full" />
              </div>
            </div>
          </div>
        );
      }

      case WorldId.SupermarketChange: {
        // Shop Cashier change helper
        const itemName = levelData.visualData?.itemName || "玩具小熊";
        const itemEmoji = levelData.visualData?.itemEmoji || "🧸";
        const price = levelData.visualData?.price || 12;
        const paid = levelData.visualData?.paid || 20;

        const currentChangeSum = coinsPlaced.reduce((a, b) => a + b, 0);

        return (
          <div className="flex flex-col gap-4 w-full select-none">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                <span className="text-[10px] font-extrabold text-amber-700">购买：{itemName}</span>
                <div className="text-3xl my-1">{itemEmoji}</div>
                <span className="text-xs font-black text-amber-800">价格：{price} 元</span>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-center">
                <span className="text-[10px] font-extrabold text-sky-700">支付：大钞票</span>
                <div className="text-3xl my-1">💵</div>
                <span className="text-xs font-black text-sky-800">付了：{paid} 元</span>
              </div>
            </div>

            {/* Tray representing coins placed for change */}
            <div className="bg-emerald-50 border-3 border-dashed border-emerald-300 rounded-3xl p-4 min-h-[120px] flex flex-col justify-between items-center relative overflow-hidden">
              <span className="text-[10px] font-black text-emerald-700">找零盘 (拖入或点击下方金币凑数)</span>
              
              <div className="flex flex-wrap gap-2 justify-center items-center my-2 min-h-[40px]">
                {coinsPlaced.length === 0 ? (
                  <span className="text-xs font-bold text-slate-400">目前盘里没有金币，请添加</span>
                ) : (
                  coinsPlaced.map((val, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        SoundEffects.playClick();
                        setCoinsPlaced(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-md flex items-center justify-center font-black text-xs text-yellow-900 cursor-pointer animate-bounce hover:bg-yellow-300"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>

              <div className="text-xs font-black text-emerald-800">
                当前找零总额：<span className="text-lg text-emerald-600">{currentChangeSum}</span> 元
              </div>
            </div>

            {/* Buttons to add coins */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    SoundEffects.playClick();
                    setCoinsPlaced(prev => [...prev, val]);
                  }}
                  className="px-3 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-yellow-600 text-yellow-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                >
                  ➕ {val} 元硬币
                </button>
              ))}
              <button
                onClick={() => {
                  SoundEffects.playClick();
                  setCoinsPlaced([]);
                }}
                className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-md"
                disabled={coinsPlaced.length === 0}
              >
                清空
              </button>
            </div>
          </div>
        );
      }

      case WorldId.OneStroke: {
        // One stroke graph shapes preview
        const svgPath = levelData.visualData?.svgPath || "";

        return (
          <div className="flex flex-col items-center w-full select-none">
            <div className="w-40 h-40 bg-indigo-50 border-3 border-indigo-200 rounded-3xl flex items-center justify-center shadow-inner p-3">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-indigo-600 stroke-2 fill-none stroke-round">
                {/* Visualizing Eulerian Path graph skeleton */}
                <path d={svgPath} strokeWidth="3" />
                {/* Render nodes */}
                {levelData.visualData?.nodes?.map((node: any, idx: number) => (
                  <circle key={idx} cx={node.x} cy={node.y} r="4" fill="#fbbf24" stroke="#4f46e5" strokeWidth="2" />
                ))}
              </svg>
            </div>
          </div>
        );
      }

      case WorldId.SequenceTrain: {
        // Sequence train representation
        const seq = levelData.visualData?.sequence || [];

        return (
          <div className="flex flex-col items-center w-full select-none gap-3">
            <div className="flex items-center gap-2 overflow-x-auto py-3 max-w-full">
              {/* Train Locomotive */}
              <div className="w-16 h-12 bg-red-500 border-2 border-red-700 rounded-l-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                <span className="text-xl">🚂</span>
                <span className="text-[8px] font-black">奥数号</span>
              </div>
              
              {/* Carriages */}
              {seq.map((val: any, idx: number) => {
                const isBlank = val === "?";

                return (
                  <div
                    key={idx}
                    className={`w-12 h-10 border-2 rounded-xl flex flex-col items-center justify-center shadow-md shrink-0 relative ${
                      isBlank
                        ? "bg-amber-100 border-amber-400 border-dashed animate-pulse text-amber-800"
                        : "bg-sky-400 border-sky-600 text-white"
                    }`}
                  >
                    <span className="text-xs font-black">{val}</span>
                    <span className="text-[7px] text-slate-100/80 font-bold absolute bottom-0.5">车厢 {idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case WorldId.SymmetryGrid: {
        // Symmetry graphic grid or questions
        const gridLeft = levelData.visualData?.leftGrid || [];
        const isGridChoice = levelData.visualData?.isGridChoice;

        return (
          <div className="flex flex-col items-center w-full select-none gap-3">
            {isGridChoice ? (
              <div className="flex gap-4">
                {levelData.visualData?.choicesEmoji?.map((emoji: string, idx: number) => (
                  <div key={idx} className="bg-slate-100 border border-slate-300 rounded-2xl p-4 text-4xl shadow-xs">
                    {emoji}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500">🦋 左右对称：找出最美丽的轴对称平衡点吧！</span>
                {/* 4x4 mini grid for simple symmetry visualization */}
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-100 border-2 border-slate-300 rounded-2xl">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const row = Math.floor(idx / 4);
                    const col = idx % 4;
                    const isLeft = col < 2;
                    // Mock simple symmetry coloring
                    const isColored = isLeft ? gridLeft[row * 2 + col] : gridLeft[row * 2 + (3 - col)];

                    return (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-lg border shadow-xs transition-colors ${
                          isColored
                            ? "bg-purple-500 border-purple-700"
                            : "bg-white border-slate-200"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }

      case WorldId.NumberNeighbor: {
        // Caterpillar layout
        const centerNum = levelData.visualData?.centerNum || 20;

        return (
          <div className="flex flex-col items-center w-full select-none gap-3">
            <div className="flex items-center gap-2 py-3 bg-emerald-50/50 rounded-2xl w-full justify-center border border-dashed border-emerald-200">
              <span className="text-2xl animate-bounce">🐛</span>
              {/* Left Neighbor */}
              <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                {levelData.visualData?.left}
              </div>
              <span className="text-slate-400">➡️</span>
              {/* Center */}
              <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center font-black text-yellow-900 text-sm shadow-md animate-pulse">
                {centerNum}
              </div>
              <span className="text-slate-400">➡️</span>
              {/* Right Neighbor */}
              <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                {levelData.visualData?.right}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6" id="simple-olympiad-quiz">
      {/* Visual Sandbox Area */}
      {renderVisualArea()}

      {/* Answer Area */}
      {levelData.options && levelData.options.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black text-slate-500 text-left">💡 选择正确的选项：</span>
          <div className="grid grid-cols-2 gap-3">
            {levelData.options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  SoundEffects.playClick();
                  setSelectedOption(opt);
                }}
                className={`px-4 py-3 rounded-2xl font-black text-sm text-left border-3 transition-all cursor-pointer active:translate-y-0.5 shadow-sm ${
                  selectedOption === opt
                    ? "bg-indigo-600 border-indigo-800 text-white shadow-[0_3px_0_0_#3730a3]"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/20"
                }`}
              >
                <span className="inline-block bg-slate-100 text-slate-700 rounded-full w-5 h-5 text-center text-xs leading-5 mr-2 font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Render text input for numeric answers
        worldId !== WorldId.SubstitutionMath && worldId !== WorldId.SupermarketChange && (
          <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 select-none">
            <div className="text-left">
              <span className="text-xs font-black text-indigo-800">🤔 填写正确的通关数值：</span>
              <p className="text-[10px] text-slate-500 mt-1">在右侧输入框写下你的答案（正整数）：</p>
            </div>

            <div className="flex gap-2 items-center w-full md:w-auto">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="在此填数"
                className="w-full md:w-28 px-3 py-2 border-2 border-indigo-200 rounded-xl text-center font-extrabold text-indigo-900 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )
      )}

      {/* Helper Guide feedback */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 flex gap-2.5 items-start text-left select-none">
        <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold text-slate-700">小奥秘籍：</span>
          <p className="mt-1 leading-relaxed text-slate-500">{feedback}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center select-none">
        <button
          onClick={resetGame}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置关卡
        </button>

        <button
          onClick={handleCheckAnswer}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
          核对答案
        </button>
      </div>
    </div>
  );
};
