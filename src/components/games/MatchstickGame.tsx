import React, { useState, useEffect } from "react";
import { RefreshCw, Sparkles, HelpCircle, AlertCircle, Sparkle } from "lucide-react";
import { SoundEffects } from "../SoundEffects";

interface Segment {
  id: string;
  type: "horizontal" | "vertical";
  x: number;
  y: number;
  w: number;
  h: number;
  headSide: "left" | "right" | "top" | "bottom";
}

interface MatchstickItem {
  itemId: string; // "num1", "op", "num2", "eq", "num3"
  itemType: "number" | "operator" | "equals";
  activeSegments: { [segId: string]: boolean };
}

interface MatchstickGameProps {
  levelData: {
    initialEquation: string; // e.g. "6 + 4 = 4"
    targetEquation: string; // e.g. "0 + 4 = 4" or "5 + 4 = 9"
    hint: string;
  };
  onSolved: (stars: number) => void;
  onIncorrect?: () => void;
}

// 7-segment configurations for digits 0-9
const DIGIT_SEGMENTS: { [key: number]: string[] } = {
  0: ["t", "tl", "tr", "bl", "br", "b"],
  1: ["tr", "br"],
  2: ["t", "tr", "m", "bl", "b"],
  3: ["t", "tr", "m", "br", "b"],
  4: ["tl", "tr", "m", "br"],
  5: ["t", "tl", "m", "br", "b"],
  6: ["t", "tl", "m", "bl", "br", "b"],
  7: ["t", "tr", "br"],
  8: ["t", "tl", "tr", "m", "bl", "br", "b"],
  9: ["t", "tl", "tr", "m", "br", "b"]
};

// Map segments back to a digit
const getDigitFromSegments = (activeList: string[]): number | null => {
  const sorted = [...activeList].sort().join(",");
  for (let d = 0; d <= 9; d++) {
    const dSegs = [...DIGIT_SEGMENTS[d]].sort().join(",");
    if (sorted === dSegs) return d;
  }
  return null;
};

// Segment coordinates for a digit container (60x100)
const NUMBER_LAYOUT: { [id: string]: Segment } = {
  t: { id: "t", type: "horizontal", x: 10, y: 6, w: 40, h: 6, headSide: "right" },
  tl: { id: "tl", type: "vertical", x: 4, y: 12, w: 6, h: 36, headSide: "top" },
  tr: { id: "tr", type: "vertical", x: 50, y: 12, w: 6, h: 36, headSide: "top" },
  m: { id: "m", type: "horizontal", x: 10, y: 48, w: 40, h: 6, headSide: "right" },
  bl: { id: "bl", type: "vertical", x: 4, y: 54, w: 6, h: 36, headSide: "bottom" },
  br: { id: "br", type: "vertical", x: 50, y: 54, w: 6, h: 36, headSide: "bottom" },
  b: { id: "b", type: "horizontal", x: 10, y: 90, w: 40, h: 6, headSide: "left" }
};

// Segment layouts for operators
const MINUS_LAYOUT: { [id: string]: Segment } = {
  m: { id: "m", type: "horizontal", x: 10, y: 48, w: 40, h: 6, headSide: "right" }
};

const PLUS_LAYOUT: { [id: string]: Segment } = {
  m: { id: "m", type: "horizontal", x: 10, y: 48, w: 40, h: 6, headSide: "right" },
  v: { id: "v", type: "vertical", x: 27, y: 31, w: 6, h: 40, headSide: "top" }
};

const EQUALS_LAYOUT: { [id: string]: Segment } = {
  t: { id: "t", type: "horizontal", x: 10, y: 38, w: 40, h: 6, headSide: "right" },
  b: { id: "b", type: "horizontal", x: 10, y: 58, w: 40, h: 6, headSide: "left" }
};

export const MatchstickGame: React.FC<MatchstickGameProps> = ({
  levelData,
  onSolved,
  onIncorrect
}) => {
  const [items, setItems] = useState<MatchstickItem[]>([]);
  const [stickInHand, setStickInHand] = useState<{ itemId: string; segId: string } | null>(null);
  const [movesCount, setMovesCount] = useState(0);
  const [feedback, setFeedback] = useState("快来动动小手，移动一根火柴棒，让算式成立吧！");

  // Parse equation into active matchstick lists
  const initEquation = (eqStr: string) => {
    const parts = eqStr.replace(/\s+/g, "").split(""); // e.g. ["6", "+", "4", "=", "4"]
    if (parts.length < 5) return;

    const parsedItems: MatchstickItem[] = [
      {
        itemId: "num1",
        itemType: "number",
        activeSegments: createActiveSegsForDigit(parseInt(parts[0]))
      },
      {
        itemId: "op",
        itemType: "operator",
        activeSegments: parts[1] === "+" ? { m: true, v: true } : { m: true }
      },
      {
        itemId: "num2",
        itemType: "number",
        activeSegments: createActiveSegsForDigit(parseInt(parts[2]))
      },
      {
        itemId: "eq",
        itemType: "equals",
        activeSegments: { t: true, b: true }
      },
      {
        itemId: "num3",
        itemType: "number",
        activeSegments: createActiveSegsForDigit(parseInt(parts[4]))
      }
    ];

    setItems(parsedItems);
    setStickInHand(null);
    setMovesCount(0);
    setFeedback("点击一根火柴棒拿起来，再点击虚线格子放下去！试试看！💪");
  };

  const createActiveSegsForDigit = (d: number): { [segId: string]: boolean } => {
    const active: { [segId: string]: boolean } = {};
    const segs = DIGIT_SEGMENTS[d] || [];
    segs.forEach((s) => {
      active[s] = true;
    });
    return active;
  };

  useEffect(() => {
    initEquation(levelData.initialEquation);
  }, [levelData]);

  // Handle clicking a matchstick segment
  const handleSegmentClick = (itemId: string, segId: string) => {
    const clickedItem = items.find((it) => it.itemId === itemId);
    if (!clickedItem) return;

    const isActive = !!clickedItem.activeSegments[segId];

    if (stickInHand === null) {
      // Trying to lift an active matchstick
      if (!isActive) return; // Can't lift empty space

      // Special check: don't lift the equals sign or destroy essential structures
      if (itemId === "eq") {
        setFeedback("等号 '=' 不能拆开哦，拆了就不是等式啦！");
        return;
      }

      SoundEffects.playClick();
      // Remove segment
      setItems((prev) =>
        prev.map((it) => {
          if (it.itemId === itemId) {
            return {
              ...it,
              activeSegments: { ...it.activeSegments, [segId]: false }
            };
          }
          return it;
        })
      );
      setStickInHand({ itemId, segId });
      setFeedback("拿起了 1 根火柴棒 🪵。快给它找一个虚线新家放下去吧！");
    } else {
      // Trying to place the matchstick in hand
      if (isActive) {
        // Clicked an already active stick: put current stick back or swap
        if (stickInHand.itemId === itemId && stickInHand.segId === segId) {
          // Clicked same stick: return to original position
          SoundEffects.playClick();
          setItems((prev) =>
            prev.map((it) => {
              if (it.itemId === itemId) {
                return {
                  ...it,
                  activeSegments: { ...it.activeSegments, [segId]: true }
                };
              }
              return it;
            })
          );
          setStickInHand(null);
          setFeedback("把火柴棒放回原处了。");
        } else {
          setFeedback("那个地方已经有火柴棒了哦，不能重叠放！");
        }
        return;
      }

      // Can place here!
      SoundEffects.playClick();
      setItems((prev) =>
        prev.map((it) => {
          if (it.itemId === itemId) {
            return {
              ...it,
              activeSegments: { ...it.activeSegments, [segId]: true }
            };
          }
          return it;
        })
      );
      setStickInHand(null);
      setMovesCount((prev) => prev + 1);
      setFeedback("放好啦！我们来看看新算式是否成立？点击下方按钮确认吧！");
    }
  };

  // Check equation maths
  const checkAnswer = () => {
    if (stickInHand !== null) {
      SoundEffects.playIncorrect();
      setFeedback("手里还有一根火柴棒呢，快把它放到算式里吧！");
      return;
    }

    // Decode digits and operators
    const getNumVal = (itemId: string): number | null => {
      const it = items.find((i) => i.itemId === itemId);
      if (!it) return null;
      const activeSegs = Object.keys(it.activeSegments).filter((k) => it.activeSegments[k]);
      return getDigitFromSegments(activeSegs);
    };

    const getOpVal = (): string | null => {
      const it = items.find((i) => i.itemId === "op");
      if (!it) return null;
      const isPlus = !!it.activeSegments.v;
      const isMinus = !!it.activeSegments.m;
      if (isPlus && isMinus) return "+";
      if (isMinus && !isPlus) return "-";
      return null;
    };

    const num1 = getNumVal("num1");
    const num2 = getNumVal("num2");
    const num3 = getNumVal("num3");
    const op = getOpVal();

    if (num1 === null || num2 === null || num3 === null || op === null) {
      SoundEffects.playIncorrect();
      setFeedback("有些火柴棒摆得不对哦，拼不出完整的数字或符号！再调整一下。");
      onIncorrect?.();
      return;
    }

    // Compute
    let result = false;
    if (op === "+") {
      result = num1 + num2 === num3;
    } else if (op === "-") {
      result = num1 - num2 === num3;
    }

    const currentEquationText = `${num1} ${op} ${num2} = ${num3}`;

    if (result) {
      SoundEffects.playCorrect();
      setFeedback(`太棒了！算式成立：${currentEquationText}！🎉 你成功解开了谜题！`);
      // Determine stars based on moves
      const stars = movesCount <= 1 ? 3 : movesCount === 2 ? 2 : 1;
      onSolved(stars);
    } else {
      SoundEffects.playIncorrect();
      setFeedback(`可惜！虽然拼出了 ${currentEquationText}，但是不相等哦 (${op === "+" ? num1+num2 : num1-num2} 不等于 ${num3})，再动脑筋想想！💡`);
      onIncorrect?.();
    }
  };

  // Render matchstick element
  const renderMatchstick = (
    seg: Segment,
    isActive: boolean,
    itemId: string,
    segId: string
  ) => {
    const isHorizontal = seg.type === "horizontal";
    // Base colors
    const strokeColor = isActive ? "#ca8a04" : "transparent";
    const bodyFill = isActive ? "url(#matchstick-wood)" : "transparent";

    return (
      <g
        key={segId}
        className="cursor-pointer group"
        onClick={() => handleSegmentClick(itemId, segId)}
      >
        {/* Invisible larger click helper */}
        <rect
          x={seg.x - (isHorizontal ? 0 : 4)}
          y={seg.y - (isHorizontal ? 4 : 0)}
          width={seg.w + (isHorizontal ? 0 : 8)}
          height={seg.h + (isHorizontal ? 8 : 0)}
          fill="transparent"
        />

        {/* Outer Highlight Glow on hover or hand */}
        <rect
          x={seg.x}
          y={seg.y}
          width={seg.w}
          height={seg.h}
          rx={2}
          fill={isActive ? "#ca8a04" : "rgba(226, 232, 240, 0.2)"}
          className={`transition-all duration-300 ${
            isActive
              ? "group-hover:fill-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.5)]"
              : "stroke-slate-300/30 stroke-dasharray-2 group-hover:fill-slate-300/25"
          }`}
          stroke={isActive ? "none" : "#94a3b8"}
          strokeWidth={isActive ? 0 : 1}
          style={{ strokeDasharray: isActive ? "none" : "2,2" }}
        />

        {/* Real matchstick details if active */}
        {isActive && (
          <>
            {/* Matchstick wooden body */}
            <rect
              x={seg.x + (isHorizontal ? 2 : 1)}
              y={seg.y + (isHorizontal ? 1 : 2)}
              width={seg.w - (isHorizontal ? 4 : 2)}
              height={seg.h - (isHorizontal ? 2 : 4)}
              rx={1}
              fill="#fbbf24"
            />
            {/* Sulfur head */}
            {renderSulfurHead(seg)}
          </>
        )}
      </g>
    );
  };

  const renderSulfurHead = (seg: Segment) => {
    let cx = 0, cy = 0, rx = 3, ry = 3;
    if (seg.headSide === "right") {
      cx = seg.x + seg.w - 1;
      cy = seg.y + seg.h / 2;
      rx = 2;
      ry = 2.8;
    } else if (seg.headSide === "left") {
      cx = seg.x + 1;
      cy = seg.y + seg.h / 2;
      rx = 2;
      ry = 2.8;
    } else if (seg.headSide === "top") {
      cx = seg.x + seg.w / 2;
      cy = seg.y + 1;
      rx = 2.8;
      ry = 2;
    } else {
      cx = seg.x + seg.w / 2;
      cy = seg.y + seg.h - 1;
      rx = 2.8;
      ry = 2;
    }

    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="#f43f5e"
        className="animate-pulse"
      />
    );
  };

  const resetGame = () => {
    SoundEffects.playClick();
    initEquation(levelData.initialEquation);
  };

  return (
    <div className="flex flex-col gap-6" id="matchstick-game">
      {/* Hand status indicator */}
      <div className="bg-amber-100/70 border-3 border-amber-300 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
          <span className="text-xs font-black text-amber-800">
            {stickInHand ? "🌟 手中拿着 1 根火柴棒" : "👉 点击火柴棒开始移动"}
          </span>
        </div>
        <div className="text-xs bg-orange-500 border-2 border-orange-600 text-white font-black px-2.5 py-1 rounded-full shadow-sm">
          移动步数: {movesCount}
        </div>
      </div>

      {/* Equations Board */}
      <div className="bg-[#fffbeb] border-4 border-amber-400 rounded-3xl p-6 md:p-8 flex items-center justify-center gap-2 md:gap-5 overflow-x-auto shadow-[4px_4px_0px_0px_#f59e0b] relative min-h-[180px] animate-fadeIn">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.8px,transparent_0.8px)] [background-size:16px_16px] pointer-events-none opacity-20" />

        {/* SVG definitions for gradients */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="matchstick-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Render each segment-based element */}
        {items.map((item) => {
          let layout: { [id: string]: Segment } = {};
          let width = 60;
          let height = 100;

          if (item.itemType === "number") {
            layout = NUMBER_LAYOUT;
          } else if (item.itemId === "op") {
            const isPlus = levelData.initialEquation.includes("+");
            layout = isPlus ? PLUS_LAYOUT : MINUS_LAYOUT;
          } else if (item.itemId === "eq") {
            layout = EQUALS_LAYOUT;
          }

          return (
            <div
              key={item.itemId}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
              >
                {Object.keys(layout).map((segId) =>
                  renderMatchstick(
                    layout[segId],
                    !!item.activeSegments[segId],
                    item.itemId,
                    segId
                  )
                )}
              </svg>
            </div>
          );
        })}
      </div>

      {/* Guide Card */}
      <div className="bg-amber-50/70 border-3 border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-black text-amber-900">火柴盒秘籍：</span>
          <p className="mt-1 leading-relaxed text-amber-700/90 font-bold">{feedback}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center gap-3 mt-1">
        <button
          onClick={resetGame}
          className="px-4 py-2.5 bg-white border-3 border-orange-400 text-orange-600 rounded-xl text-xs font-black hover:bg-orange-50 active:translate-y-0.5 active:shadow-none transition-all shadow-[2px_2px_0px_0px_#ea580c] flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5px]" />
          重置算式
        </button>

        <button
          onClick={checkAnswer}
          className="px-6 py-2.5 bg-orange-500 border-b-4 border-orange-700 text-white font-black rounded-xl text-xs hover:bg-orange-600 active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          验证等式
        </button>
      </div>
    </div>
  );
};
