import { World, WorldId, Subject } from "../types";

export const WORLDS_DATA: World[] = [
  {
    id: WorldId.ChickenRabbit,
    name: "鸡兔同笼世界",
    icon: "🐥",
    color: "from-amber-400 to-yellow-500",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50/50",
    accentColor: "text-amber-600 bg-amber-50 border-amber-200",
    description: "经典中国古代数学趣题，通过画头数和脚数，掌握‘假设法’的核心思维。",
    levels: Array.from({ length: 10 }).map((_, i) => ({
      id: `cr_${i + 1}`,
      worldId: WorldId.ChickenRabbit,
      name: `第 ${i + 1} 关`,
      title: `鸡兔大挑战 - 分步 ${i + 1}`,
      question: `农场笼子里关着一些鸡和兔子。从上面数一共有 ${5 + i} 个头，从下面数一共有 ${(5 + i) * 2 + (1 + Math.floor(i / 2)) * 2} 只脚。请问笼子里关着几只鸡和几只兔子？`,
      hint: `假设全是鸡！如果全是鸡，头数乘以 2 就是脚数。看看少算了几只脚？`,
      explanation: `假设全是鸡。计算得出脚的数量，然后用多出的脚数平分即可。`,
      correctAnswer: (5 + i) * 2 + (1 + Math.floor(i / 2)) * 2,
      data: {
        heads: 5 + i,
        legs: (5 + i) * 2 + (1 + Math.floor(i / 2)) * 2,
        correctAnswer: { chickens: (5 + i) - (1 + Math.floor(i / 2)), rabbits: 1 + Math.floor(i / 2) }
      }
    }))
  },
  {
    id: WorldId.Matchstick,
    name: "火柴棒变变变",
    icon: "🪵",
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-400",
    bgColor: "bg-orange-50/50",
    accentColor: "text-orange-600 bg-orange-50 border-orange-200",
    description: "移动一根火柴，化腐朽为神奇！锻炼孩子们的空间几何和代数等式感。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const equations = [
        { init: "6 + 4 = 4", target: "0 + 4 = 4", hint: "把数字 6 变成数字 0 吧！" },
        { init: "3 + 5 = 4", target: "9 - 5 = 4", hint: "把加号 '+' 移一根变成减号 '-'，放到数字 3 身上变成 9 吧！" },
        { init: "9 - 5 = 5", target: "8 - 3 = 5", hint: "把 5 拿走一根变成 3，放到 9 的左下角让它变成 8" },
        { init: "5 + 7 = 2", target: "9 - 7 = 2", hint: "把加号 '+' 移走一根变成减号 '-'，让 5 变成 9 吧！" },
        { init: "8 - 3 = 6", target: "8 - 2 = 6", hint: "把数字 3 的一根火柴移动到左下方，让它变成数字 2" },
        { init: "9 + 5 = 9", target: "9 - 5 = 4", hint: "把加号移走一根变成减号，去哪里呢？把后面得数 9 变成 4 吧！" },
        { init: "3 - 3 = 8", target: "9 - 3 = 6", hint: "把前面的 3 变成 9，后面的 8 变成 6" },
        { init: "5 + 5 = 8", target: "3 + 5 = 8", hint: "把第一个 5 移走一根变成 3 吧！" },
        { init: "6 + 1 = 5", target: "5 + 1 = 6", hint: "交换 6 和 5，把 6 变成 5，5 变成 6" },
        { init: "0 + 4 = 9", target: "8 - 4 = 4", hint: "把 0 补上一根变成 8，加号变成减号，9 变成 4" }
      ];
      const eq = equations[i] || equations[0];
      return {
        id: `ms_${i + 1}`,
        worldId: WorldId.Matchstick,
        name: `第 ${i + 1} 关`,
        title: `火柴魔法等式 - 探案 ${i + 1}`,
        question: `移动正好一根火柴，使得下面的算式成立：\n ${eq.init}`,
        hint: eq.hint,
        explanation: `通过移动火柴，把等式转化为：${eq.target}`,
        correctAnswer: eq.target,
        data: {
          initialEquation: eq.init,
          targetEquation: eq.target,
          hint: eq.hint
        }
      };
    })
  },
  {
    id: WorldId.TreePlanting,
    name: "绿野植树冒险",
    icon: "🌳",
    color: "from-emerald-400 to-green-500",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50/50",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    description: "在线条两端及中间种树。理清‘间隔数’与‘树棵数’之间加一减一的奥秘。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const types: ("both" | "one" | "neither")[] = ["both", "one", "neither", "one", "both", "one", "neither", "both", "one", "neither"];
      const t = types[i] || "both";
      const length = 20 + i * 5;
      const interval = 5;
      const intervals = length / interval;
      const ans = t === "both" ? intervals + 1 : t === "neither" ? intervals - 1 : intervals;
      const nameMap = { both: "两端都种", one: "一端不种", neither: "两端都不种" };
      return {
        id: `tp_${i + 1}`,
        worldId: WorldId.TreePlanting,
        name: `第 ${i + 1} 关`,
        title: `${nameMap[t]}的植树秘密`,
        question: `一条道路长 ${length} 米，每隔 ${interval} 米需要种一棵树（种植方式：${nameMap[t]}）。请问一共可以种多少棵树？`,
        hint: `当前模式是【${nameMap[t]}】！先算出间隔数：${length} ÷ ${interval} = ${intervals}。再想想该加 1、减 1 还是保持不变？`,
        explanation: `间隔数是 ${intervals}。由于是【${nameMap[t]}】模式，所以一共可以种 ${ans} 棵树。`,
        correctAnswer: ans,
        data: {
          length,
          interval,
          type: t,
          correctAnswer: ans,
          hint: `模式【${nameMap[t]}】：总树数 = ${t === "both" ? "间隔数 + 1" : t === "neither" ? "间隔数 - 1" : "间隔数"}`
        }
      };
    })
  },
  {
    id: WorldId.QueueMath,
    name: "排队中的秘密",
    icon: "🐼",
    color: "from-sky-400 to-indigo-500",
    borderColor: "border-sky-400",
    bgColor: "bg-sky-50/50",
    accentColor: "text-sky-600 bg-sky-50 border-sky-200",
    description: "基数与序数混淆问题。理解‘第几个’ and ‘有几个’在队列中的逻辑转换。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const qTypes: ("front_back" | "ordinal_both" | "between")[] = [
        "front_back", "ordinal_both", "between", "front_back", "ordinal_both", 
        "between", "front_back", "ordinal_both", "between", "ordinal_both"
      ];
      const qt = qTypes[i] || "front_back";
      let question = "";
      let hint = "";
      let ans = 0;
      let extraData: any = {};

      if (qt === "front_back") {
        const front = 3 + Math.floor(i / 2);
        const back = 4 + Math.floor(i / 3);
        ans = front + 1 + back;
        question = `小猫排在队伍里。小猫前面有 ${front} 只动物，后面有 ${back} 只动物。请问这列队伍一共有多少只小动物？`;
        hint = `别忘了小猫“我自己”也占队伍中的一个位置哦！公式：前面 + 1 + 后面。`;
        extraData = { questionType: "front_back", frontCount: front, backCount: back, targetAnimal: "kitty", correctAnswer: ans, hint };
      } else if (qt === "ordinal_both") {
        const front = 4 + Math.floor(i / 2);
        const back = 3 + Math.floor(i / 3);
        ans = front + back - 1;
        question = `小兔在队伍里。从前面数排在第 ${front} 个，从后面数排在第 ${back} 个。一共有多少只动物？`;
        hint = `小兔被从前和从后各数了一次，多算了一次自己哦！公式：前数 + 后数 - 1。`;
        extraData = { questionType: "ordinal_both", fromFront: front, fromBack: back, targetAnimal: "bunny", correctAnswer: ans, hint };
      } else {
        const start = 2 + Math.floor(i / 3);
        const end = 8 + Math.floor(i / 2);
        ans = end - start - 1;
        question = `小熊排在第 ${start} 个，熊猫排在第 ${end} 个。请问它们“之间”一共有多少只小动物？`;
        hint = `“之间”不包括小熊和熊猫两个人自己。公式：大位置 - 小位置 - 1。`;
        extraData = { questionType: "between", betweenPos: { start, end }, targetAnimal: "bear", correctAnswer: ans, hint };
      }

      return {
        id: `qm_${i + 1}`,
        worldId: WorldId.QueueMath,
        name: `第 ${i + 1} 关`,
        title: `排队队列大合集 - 关卡 ${i + 1}`,
        question,
        hint,
        explanation: `分析可知，这列队伍一共有 ${ans} 只小动物。`,
        correctAnswer: ans,
        data: extraData
      };
    })
  },
  {
    id: WorldId.SumDiff,
    name: "和差平衡天平",
    icon: "🍎",
    color: "from-rose-400 to-pink-500",
    borderColor: "border-rose-400",
    bgColor: "bg-rose-50/50",
    accentColor: "text-rose-600 bg-rose-50 border-rose-200",
    description: "已知两数之和与两数之差，求两数。通过天平倾斜与切割差额掌握解题本质。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const sum = 10 + i * 2;
      const diff = 2 + (i % 3) * 2;
      const larger = (sum + diff) / 2;
      const smaller = (sum - diff) / 2;
      return {
        id: `sd_${i + 1}`,
        worldId: WorldId.SumDiff,
        name: `第 ${i + 1} 关`,
        title: `天平的两端平衡术`,
        question: `红篮子和绿篮子一共有 ${sum} 个苹果。红篮子比绿篮子多 ${diff} 个。请问红篮子有多少个苹果？`,
        hint: `经典的“和差问题”！你可以先从总数里减去差额 ${diff}，得到两个一样多的绿篮子；也可以加上差额凑出两个红篮子！较大数 = (和 + 差) ÷ 2。`,
        explanation: `较大数（红篮子） = (和 + 差) ÷ 2 = (${sum} + ${diff}) ÷ 2 = ${larger} 个。较小数为 ${smaller} 个。`,
        correctAnswer: sum,
        data: {
          total: sum,
          difference: diff,
          largerLabel: "红苹果",
          smallerLabel: "绿苹果",
          correctAnswer: { larger, smaller },
          hint: `较大数 = (和 + 差) ÷ 2 = (${sum} + ${diff}) ÷ 2`
        }
      };
    })
  },
  {
    id: WorldId.PatternSequence,
    name: "神奇周期魔法",
    icon: "🔴",
    color: "from-purple-500 to-fuchsia-500",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-50/50",
    accentColor: "text-purple-600 bg-purple-50 border-purple-200",
    description: "找规律和数列问题。计算周期余数，在纷繁中找到重复的基本单元。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const seqTemplates = [
        { seq: ["candy_red", "candy_blue"], choices: ["candy_red", "candy_blue"], name: "红蓝双色循环" },
        { seq: ["candy_red", "candy_blue", "candy_yellow"], choices: ["candy_red", "candy_blue", "candy_yellow"], name: "三色绚丽循环" },
        { seq: ["apple", "apple", "banana"], choices: ["apple", "banana"], name: "水果双星循环" },
        { seq: ["apple", "banana", "orange", "orange"], choices: ["apple", "banana", "orange"], name: "四季甜橙循环" },
        { seq: ["candy_red", "candy_yellow", "candy_blue", "candy_yellow"], choices: ["candy_red", "candy_blue", "candy_yellow"], name: "彩虹交替循环" }
      ];
      const template = seqTemplates[i % seqTemplates.length];
      const targetIndex = 12 + i * 3;
      const period = template.seq.length;
      const remainder = targetIndex % period;
      const correctItem = remainder === 0 ? template.seq[period - 1] : template.seq[remainder - 1];

      return {
        id: `ps_${i + 1}`,
        worldId: WorldId.PatternSequence,
        name: `第 ${i + 1} 关`,
        title: `${template.name}`,
        question: `糖果传送带吐出糖果顺序是：${template.seq.map(id => id.includes("candy") ? "🍬" : id === "apple" ? "🍎" : "🍌").join("、")}。请问第 ${targetIndex} 个掉出的是什么？`,
        hint: `周期为 ${period}。计算：${targetIndex} ÷ ${period} 算出余数。余数代表它是循环中的第几个哦！`,
        explanation: `循环长度为 ${period}。计算：${targetIndex} ÷ ${period}，余数为 ${remainder}。余数对应的是第 ${remainder === 0 ? period : remainder} 个物体。`,
        correctAnswer: correctItem,
        data: {
          sequence: template.seq,
          targetIndex,
          choices: template.choices,
          correctAnswer: correctItem,
          hint: `用 ${targetIndex} ÷ ${period} 看余数，确定其在一组中的位置！`
        }
      };
    })
  },
  {
    id: WorldId.AgePuzzle,
    name: "时空年龄奇遇记",
    icon: "⏳",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50/50",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    description: "探索年龄‘差不变’的时间魔法。通过数轴和差额倍数，秒杀经典年龄算术题。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const diff = 20 + (i % 3) * 4;
      const currentKid = 5 + (i % 2) * 2;
      const currentParent = currentKid + diff;
      const multiple = 3 + (i % 2); // 3 or 4 times
      const kidFinal = diff / (multiple - 1);
      const yearsNeeded = kidFinal - currentKid;
      return {
        id: `ap_${i + 1}`,
        worldId: WorldId.AgePuzzle,
        name: `第 ${i + 1} 关`,
        title: `时光倍数齿轮`,
        question: `小明今年 ${currentKid} 岁，爸爸今年 ${currentParent} 岁。请问再过几年，爸爸的年龄正好是小明的 ${multiple} 倍？`,
        hint: `不管过多少年，两人的年龄差永远不变，始终是 ${diff} 岁！当爸爸是小明的 ${multiple} 倍时，两人的差值正好相当于小明的 ${multiple - 1} 倍！`,
        explanation: `两人的年龄差永远是 ${diff} 岁。当是 ${multiple} 倍时，小明的那时年龄 = 差值 ÷ (${multiple} - 1) = ${diff} ÷ ${multiple - 1} = ${kidFinal} 岁。所以要过 ${kidFinal} - ${currentKid} = ${yearsNeeded} 年。`,
        correctAnswer: yearsNeeded,
        data: {
          kidAge: currentKid,
          parentAge: currentParent,
          difference: diff,
          multiple,
          correctAnswer: yearsNeeded,
          hint: `年龄差 ${diff} 不变。当爸爸是 ${multiple} 倍时，差是小明的 ${multiple - 1} 倍，算出那时小明 ${kidFinal} 岁。`
        }
      };
    })
  },
  {
    id: WorldId.Overlapping,
    name: "神奇重叠大冒险",
    icon: "🎯",
    color: "from-indigo-500 to-blue-500",
    borderColor: "border-indigo-400",
    bgColor: "bg-indigo-50/50",
    accentColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    description: "探秘重叠画圈（维恩图）的奥秘。玩转纸条拼接和双重特征计数，搞懂‘重合与容斥原理’。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      // Alternate between ribbon overlap and Venn overlap puzzles
      const isRibbon = i % 2 === 0;
      if (isRibbon) {
        const L1 = 10 + i;
        const L2 = 12 + i;
        const over = 3 + (i % 3);
        const total = L1 + L2 - over;
        return {
          id: `ol_${i + 1}`,
          worldId: WorldId.Overlapping,
          name: `第 ${i + 1} 关`,
          title: `彩色丝带拼接魔法`,
          question: `黄丝带长 ${L1} 厘米，蓝丝带长 ${L2} 厘米。重叠部分粘起来后总共长 ${total} 厘米。请问重叠了多少厘米？`,
          hint: `如果不重叠，两根丝带总共应该长 ${L1} + ${L2} = ${L1 + L2} 厘米。对比贴好后的 ${total} 厘米，少掉的就是重叠部分！`,
          explanation: `重叠部分 = (原长 A + 原长 B) - 拼接后总长 = (${L1} + ${L2}) - ${total} = ${over} 厘米。`,
          correctAnswer: over,
          data: {
            length1: L1,
            length2: L2,
            totalLength: total,
            correctAnswer: over,
            hint: `重叠长度 = 原本总长 (${L1 + L2}) - 实际总长 (${total}) = ${over} 厘米。`
          }
        };
      } else {
        const total = 20 + i;
        const both = 4 + (i % 3);
        const onlyA = 6 + (i % 2);
        const onlyB = total - both - onlyA - 3;
        const A = onlyA + both;
        const B = onlyB + both;
        const neither = total - (onlyA + onlyB + both);
        return {
          id: `ol_${i + 1}`,
          worldId: WorldId.Overlapping,
          name: `第 ${i + 1} 关`,
          title: `班级双料魔法师`,
          question: `全班有 ${total} 只动物。喜欢画苹果的有 ${A} 只，喜欢画草地的有 ${B} 只，两样都喜欢的有 ${both} 只。两样“都不喜欢”的有几只？`,
          hint: `先算出喜欢至少一种的动物：画苹果的加上画草地的，再减去重合算了两次的 (${A} + ${B} - ${both})。然后用总数减去他们！`,
          explanation: `至少喜欢一种的人数 = ${A} + ${B} - ${both} = ${total - neither} 只。都不喜欢的动物 = 全班总数 ${total} - 至少喜欢一种 (${total - neither}) = ${neither} 只。`,
          correctAnswer: neither,
          data: {
            totalCount: total,
            countA: A,
            countB: B,
            bothCount: both,
            correctAnswer: neither,
            hint: `先求出有爱好的精灵 = ${A} + ${B} - ${both}。都不喜欢的 = ${total} 减去它。`
          }
        };
      }
    })
  },
  {
    id: WorldId.ReverseSolve,
    name: "逆向时光还原岛",
    icon: "🔮",
    color: "from-fuchsia-500 to-purple-600",
    borderColor: "border-fuchsia-400",
    bgColor: "bg-fuchsia-50/50",
    accentColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    description: "经历多重变动，逆流而上，寻找最初拥有的秘密。掌握倒推法的加减互换奥妙。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      // Generates beautiful reverse puzzles dynamically
      const startVal = 5 + i * 2;
      const op1 = i % 2 === 0 ? "+" : "-";
      const val1 = 3 + (i % 3);
      const temp1 = op1 === "+" ? startVal + val1 : startVal - val1;

      const op2 = i % 3 === 0 ? "*" : "-";
      const val2 = op2 === "*" ? 2 : 4;
      const endVal = op2 === "*" ? temp1 * val2 : temp1 - val2;

      const steps = [
        {
          op: op1 as "+" | "-",
          val: val1,
          label: op1 === "+" ? `在草地上又采了 ${val1} 个神奇蘑菇` : `吃掉了 ${val1} 个美味的水果`
        },
        {
          op: op2 as "*" | "-",
          val: val2,
          label: op2 === "*" ? `魔法井水让它的数量翻了 ${val2} 倍` : `送给了好朋友 ${val2} 个小礼物`
        }
      ];

      return {
        id: `rs_${i + 1}`,
        worldId: WorldId.ReverseSolve,
        name: `第 ${i + 1} 关`,
        title: `时光水晶大还原`,
        question: `小松鼠有一些松果。经过这两步变动：首先“${steps[0].label}”，接着“${steps[1].label}”。最后，松鼠还剩下 ${endVal} 个松果。请问小松鼠最初有多少个松果？`,
        hint: `从最终的结果 ${endVal} 出发，像坐时光机一样倒着推算！最后一步是【${steps[1].label}】，那倒数第一步就要做反向操作哦！把 ${op2 === "*" ? "除以" : "加上"} ${val2} 倒着算。`,
        explanation: `时光倒流！从最后的结果 ${endVal} 开始倒推：第二步逆运算得到 ${temp1}，第一步逆运算得到最初的数量为 ${startVal}。`,
        correctAnswer: startVal,
        data: {
          steps,
          endVal,
          correctAnswer: startVal,
          hint: `倒过来算！从结局 ${endVal} 开始：${op2 === "*" ? "÷" : "+"} ${val2}，然后再 ${op1 === "+" ? "-" : "+"} ${val1} 即可！`
        }
      };
    })
  },
  {
    id: WorldId.LogicGrid,
    name: "逻辑推理探案社",
    icon: "🕵️‍♂️",
    color: "from-violet-500 to-indigo-600",
    borderColor: "border-violet-400",
    bgColor: "bg-violet-50/50",
    accentColor: "text-violet-600 bg-violet-50 border-violet-200",
    description: "搜集多方线索，通过表格排除和因果递推，找出真凶并精准锁死真相。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const charPools = [
        ["小熊", "小兔", "小猫"],
        ["小鹿", "小猴", "小象"],
        ["狐狸", "熊猫", "松鼠"]
      ];
      const itemPools = [
        [
          { id: "apple", label: "红苹果", emoji: "🍎" },
          { id: "banana", label: "黄香蕉", emoji: "🍌" },
          { id: "fish", label: "小鱼", emoji: "🐟" }
        ],
        [
          { id: "grass", label: "青草", emoji: "🌿" },
          { id: "peach", label: "仙桃", emoji: "🍑" },
          { id: "carrot", label: "胡萝卜", emoji: "🥕" }
        ],
        [
          { id: "bamboo", label: "绿嫩竹", emoji: "🎋" },
          { id: "pine", label: "松果", emoji: "🥜" },
          { id: "honey", label: "甜蜂蜜", emoji: "🍯" }
        ]
      ];

      const chars = charPools[i % 3];
      const itms = itemPools[i % 3];

      // Define standard deductive templates
      let clues: string[] = [];
      let correctAnswer: Record<string, string> = {};

      if (i % 3 === 0) {
        // Template 0: Bear eats Honey/Apple, Kitty eats Fish, Bunny eats Carrot/Banana
        // Bear (chars[0]) -> Apple/Honey, Rabbit (chars[1]) -> Banana/Carrot, Kitty (chars[2]) -> Fish/Peach
        correctAnswer = {
          [chars[0]]: itms[0].id, // Apple
          [chars[1]]: itms[1].id, // Banana
          [chars[2]]: itms[2].id  // Fish
        };
        clues = [
          `${chars[2]}最爱吃鲜美的水产品，所以它拿到了${itms[2].label}。`,
          `${chars[0]}对黄黄的${itms[1].label}过敏，绝对不吃它。`,
          `三种好吃的分别被三只动物全部分完，没有任何余留。`
        ];
      } else if (i % 3 === 1) {
        // Template 1
        correctAnswer = {
          [chars[0]]: itms[1].id, // Peach
          [chars[1]]: itms[2].id, // Carrot
          [chars[2]]: itms[0].id  // Grass
        };
        clues = [
          `${chars[1]}是兔子家族，它迫不及待拿走了最喜欢的${itms[2].label}。`,
          `${chars[0]}不喜欢草本植物，所以它没有选${itms[0].label}。`,
          `三只动物各自选了一个最喜欢的，而且各不相同！`
        ];
      } else {
        // Template 2
        correctAnswer = {
          [chars[0]]: itms[2].id, // Honey
          [chars[1]]: itms[0].id, // Bamboo
          [chars[2]]: itms[1].id  // Pine
        };
        clues = [
          `${chars[1]}是国宝，它只吃绿意盎然的${itms[0].label}。`,
          `${chars[2]}是一只可爱的松鼠，它的尾巴很大，喜欢藏${itms[1].label}。`,
          `剩下一个最甜的${itms[2].label}分给了最胖的${chars[0]}。`
        ];
      }

      return {
        id: `lg_${i + 1}`,
        worldId: WorldId.LogicGrid,
        name: `第 ${i + 1} 关`,
        title: `侦探线索大解密`,
        question: `根据三条线索推理出：${chars.join("、")}各喜欢什么，并在控制板上选出来。`,
        hint: `仔细看线索！有的线索直接确定了一个配对（例如“国宝只吃绿嫩竹”），有的线索帮你排除选项（例如“不喜欢草”）。排除后剩下的就是答案！`,
        explanation: `根据第一条线索和第二条排除法，能够推断出唯一的正确对应关系。`,
        correctAnswer: "detective_solved", // we intercept this verification
        data: {
          characters: chars,
          items: itms,
          clues,
          correctAnswer,
          hint: `找到最确定的那一条先填上，然后用排除法推理其他动物的对应物品！`
        }
      };
    })
  },
  {
    id: WorldId.ProfitLoss,
    name: "盈亏分配岛",
    icon: "⚖️",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50/50",
    accentColor: "text-amber-600 bg-amber-50 border-amber-200",
    description: "通过分配两套方案中的‘盈余’与‘不足’，找到隐藏的人数和物品总数，掌握平衡法则。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const children = 4 + i;
      const each1 = 3 + (i % 3);
      const surplus1 = 2 + (i % 2);
      const total = children * each1 + surplus1;
      const each2 = each1 + 1;
      const surplus2 = total - children * each2; // this will be negative (deficit)

      return {
        id: `pl_${i + 1}`,
        worldId: WorldId.ProfitLoss,
        name: `第 ${i + 1} 关`,
        title: `盈亏天平衡量 - 分配 ${i + 1}`,
        question: `要把糖果分给一群小朋友。方案一：每人分 ${each1} 个，结果多出 ${surplus1} 个；方案二：每人分 ${each2} 个，结果缺少 ${Math.abs(surplus2)} 个。请问一共有多少个小朋友，糖果一共有多少个？`,
        hint: `盈亏总额之和代表两次分糖果的差额！分配差为每人差 ${each2 - each1} 个。公式：小朋友数 = (盈数 + 亏数) ÷ 两次每人分配数之差。`,
        explanation: `盈亏总差额 = ${surplus1} + ${Math.abs(surplus2)} = ${surplus1 + Math.abs(surplus2)} 个。每人分配差 = ${each2} - ${each1} = 1 个。因此小朋友数 = ${surplus1 + Math.abs(surplus2)} ÷ 1 = ${children} 人。糖果总数 = ${children} * ${each1} + ${surplus1} = ${total} 个。`,
        correctAnswer: total,
        data: {
          each1,
          surplus1,
          each2,
          surplus2,
          correctAnswer: { children, total },
          hint: `小朋友人数 = (多出的 ${surplus1} + 缺少的 ${Math.abs(surplus2)}) ÷ (方案每人差额 ${each2 - each1})`
        }
      };
    })
  },
  {
    id: WorldId.MeetingChase,
    name: "行程相遇追及岛",
    icon: "🏃‍♂️",
    color: "from-sky-400 to-blue-500",
    borderColor: "border-sky-400",
    bgColor: "bg-sky-50/50",
    accentColor: "text-sky-600 bg-sky-50 border-sky-200",
    description: "感受速度、时间、路程三位一体的奇妙行程世界。玩转双向相遇与同向追击。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const isMeet = i % 2 === 0;
      if (isMeet) {
        const speed_sum = 5 + i;
        const time = 8 + i * 2;
        const distance = speed_sum * time;
        const speed1 = Math.floor(speed_sum / 2) + 1;
        const speed2 = speed_sum - speed1;

        return {
          id: `mc_${i + 1}`,
          worldId: WorldId.MeetingChase,
          name: `第 ${i + 1} 关`,
          title: `双向奔赴的交汇`,
          question: `两只小动物相距 ${distance} 米，它们相对而行。一只的速度是每秒 ${speed1} 米，另一只的速度是每秒 ${speed2} 米。请问经过多少秒后它们在途中相遇？`,
          hint: `相遇公式：相遇时间 = 初始路程 ÷ 速度之和。在这里，速度之和是 ${speed1} + ${speed2} = ${speed_sum} 米每秒！`,
          explanation: `相遇时间 = 路程 ${distance} ÷ 速度和 (${speed1} + ${speed2}) = ${time} 秒。`,
          correctAnswer: time,
          data: {
            type: "meet",
            distance,
            speed1,
            speed2,
            correctAnswer: time,
            hint: `相遇时间 = 路程 ${distance} ÷ (速度和 ${speed1 + speed2})`
          }
        };
      } else {
        const speed_diff = 2 + (i % 3);
        const time = 10 + i * 3;
        const distance = speed_diff * time;
        const speed2 = 3 + i;
        const speed1 = speed2 + speed_diff;

        return {
          id: `mc_${i + 1}`,
          worldId: WorldId.MeetingChase,
          name: `第 ${i + 1} 关`,
          title: `森林草原急速追赶`,
          question: `猛兽和温顺的小动物相距 ${distance} 米。猛兽的速度是每秒 ${speed1} 米在后追赶，小动物的速度是每秒 ${speed2} 米。请问猛兽需要多少秒才能追上小动物？`,
          hint: `追及公式：追及时间 = 初始距离 ÷ 速度之差。速度差代表每秒钟拉近了多少距离！这里的速度差是 ${speed1} - ${speed2} = ${speed_diff} m/s。`,
          explanation: `追及时间 = 初始距离 ${distance} ÷ 速度差 (${speed1} - ${speed2}) = ${time} 秒。`,
          correctAnswer: time,
          data: {
            type: "chase",
            distance,
            speed1,
            speed2,
            correctAnswer: time,
            hint: `追及时间 = 初始距离 ${distance} ÷ (速度差 ${speed1 - speed2})`
          }
        };
      }
    })
  },
  {
    id: WorldId.Pigeonhole,
    name: "最坏打算抽屉岛",
    icon: "🔮",
    color: "from-teal-400 to-emerald-500",
    borderColor: "border-teal-400",
    bgColor: "bg-teal-50/50",
    accentColor: "text-teal-600 bg-teal-50 border-teal-200",
    description: "凡事做最坏的打算。通过极端的‘倒霉运气假设’，秒杀抽屉原理，找到必胜保证数。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const isTargetSame = i % 2 === 0;
      const count = 5 + i;
      const pool = [
        { color: "red" as const, count: count + 2 },
        { color: "blue" as const, count: count },
        { color: "yellow" as const, count: count - 1 }
      ];

      if (isTargetSame) {
        const target = 2 + Math.floor(i / 3);
        const ans = (target - 1) * 3 + 1;
        return {
          id: `ph_${i + 1}`,
          worldId: WorldId.Pigeonhole,
          name: `第 ${i + 1} 关`,
          title: `必胜的同色保证`,
          question: `暗盒里装有红、蓝、黄三种颜色的球，每种数量足够多。如果闭上眼睛往外摸球，至少要摸出几个球，才能“保证”其中有 ${target} 个球的颜色完全相同？`,
          hint: `想一想最倒霉的情况：你摸出来的红、蓝、黄每种球都正好差一个就达到 ${target} 个（也就是各有 ${target - 1} 个）。这时再多摸 1 个，就必然能凑齐 ${target} 个啦！`,
          explanation: `最不利情况（最坏运气）：每种颜色的球都摸出了 ${target - 1} 个，一共摸了 ${(target - 1) * 3} 个。此时再摸 1 个，无论是什么颜色，必定能保证有 ${target} 个球颜色相同。所以答案是：${(target - 1) * 3} + 1 = ${ans} 个。`,
          correctAnswer: ans,
          data: {
            pool,
            targetDesc: `${target}个颜色相同的球`,
            correctAnswer: ans,
            hint: `最不利公式：(目标数 ${target} - 1) * 颜色种类数 3 + 1 = ${ans}`
          }
        };
      } else {
        // Find one of each color
        const sorted = [...pool].sort((a, b) => b.count - a.count);
        const ans = sorted[0].count + sorted[1].count + 1;
        return {
          id: `ph_${i + 1}`,
          worldId: WorldId.Pigeonhole,
          name: `第 ${i + 1} 关`,
          title: `大满贯颜色大收集`,
          question: `箱子里装有 ${pool[0].count} 个红球、${pool[1].count} 个蓝球和 ${pool[2].count} 个黄球。至少摸出几个球，才能“保证”三种颜色的球都至少有一个？`,
          hint: `最倒霉的情况：你把数量最多的两种颜色的球全部摸光了，却还是没有摸到数量最少的那种颜色！所以你需要摸完最大的两个数量，再加 1 个就能保证集齐三种了！`,
          explanation: `最不利情况是把数量较多的红球和蓝球全部摸完（共 ${sorted[0].count} + ${sorted[1].count} = ${sorted[0].count + sorted[1].count} 个），此时箱中只剩下黄球。再摸 1 个黄球，就集齐了三种颜色。答案：${sorted[0].count + sorted[1].count} + 1 = ${ans} 个。`,
          correctAnswer: ans,
          data: {
            pool,
            targetDesc: `红、蓝、黄三种颜色都至少有一个`,
            correctAnswer: ans,
            hint: `最坏运气：摸光前两多颜色的球 (${sorted[0].count} + ${sorted[1].count})，再加 1 个即可！`
          }
        };
      }
    })
  },
  {
    id: WorldId.ShapeCounting,
    name: "分类有序几何岛",
    icon: "📐",
    color: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-400",
    bgColor: "bg-indigo-50/50",
    accentColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    description: "培养良好的空间感知与严密的递推方法。学会不重复、不遗漏地分类计数各种几何图形。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const isTriangle = i < 5;
      if (isTriangle) {
        const segments = 2 + (i % 3); // 2, 3, 4
        const ans = (segments * (segments + 1)) / 2;
        return {
          id: `sc_${i + 1}`,
          worldId: WorldId.ShapeCounting,
          name: `第 ${i + 1} 关`,
          title: `放射线三角形大搜索`,
          question: `一个大三角形，顶点到低底边引出了若干条分割线，底边一共被分成了 ${segments} 段。请问图中一共有多少个三角形？`,
          hint: `方法一：数数底边一共有多少个线段，三角形个数就和线段个数一样多！方法二：按大小分类，基本单块有 ${segments} 个，二合一有 ${segments - 1} 个，三合一有 ${segments - 2} 个……`,
          explanation: `底边线段个数 = 1 + 2 + ... + ${segments} = ${ans} 个。每个底边线段都对应一个三角形。所以一共有 ${ans} 个三角形。`,
          correctAnswer: ans,
          data: {
            shapeType: "triangle" as const,
            gridSize: segments,
            correctAnswer: ans,
            hint: `底段数是 ${segments}。公式：1 + 2 + ... + ${segments} = ${ans} 个。`
          }
        };
      } else {
        const segments = 3 + (i % 3); // 3, 4, 5
        const ans = (segments * (segments + 1)) / 2;
        return {
          id: `sc_${i + 1}`,
          worldId: WorldId.ShapeCounting,
          name: `第 ${i + 1} 关`,
          title: `拼图长方形欢乐数`,
          question: `一排长条积木由 ${segments} 个小正方形格子一字排开组成。请问这一排积木里一共有多少个长方形（包含正方形）？`,
          hint: `这和数线段完全一样！1 个格子的长方形有 ${segments} 个，2 个格子的长方形有 ${segments - 1} 个……以此类推，求 1 到 ${segments} 的连续相加和！`,
          explanation: `长方形总数 = 1 + 2 + ... + ${segments} = ${ans} 个。`,
          correctAnswer: ans,
          data: {
            shapeType: "rectangle" as const,
            gridSize: segments,
            correctAnswer: ans,
            hint: `长度为 ${segments}。公式：1 + 2 + ... + ${segments} = ${ans}`
          }
        };
      }
    })
  },
  {
    id: WorldId.Permutation,
    name: "排列组合变术屋",
    icon: "🔢",
    color: "from-violet-500 to-fuchsia-600",
    borderColor: "border-violet-400",
    bgColor: "bg-violet-50/50",
    accentColor: "text-violet-600 bg-violet-50 border-violet-200",
    description: "无序与有序，连线与卡片组合。通过乘法原理和握手公式，搞定排列组合基本概念。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const isHandshake = i % 2 === 0;
      if (isHandshake) {
        const people = 4 + (i % 3);
        const ans = (people * (people - 1)) / 2;
        const animals = ["小猫", "小狗", "小熊", "小兔", "小鹿", "小松鼠"].slice(0, people);
        return {
          id: `pm_${i + 1}`,
          worldId: WorldId.Permutation,
          name: `第 ${i + 1} 关`,
          title: `晚会连线握手公式`,
          question: `森林里举办了欢乐聚会，一共有 ${people} 只小动物。为了表达友好，每两只小动物都要握手一次。请问一共需要握手多少次？`,
          hint: `每个人要和其余 ${people - 1} 个人握手，所以是 ${people} * ${people - 1}。但每次握手都被两个人共同参与、重复算了一次，所以最后要除以 2 哦！公式：N * (N - 1) ÷ 2。`,
          explanation: `握手次数 = 成员数 ${people} * (成员数 ${people} - 1) ÷ 2 = ${ans} 次。`,
          correctAnswer: ans,
          data: {
            type: "handshakes" as const,
            items: animals,
            correctAnswer: ans,
            hint: `握手总数 = 动物数 ${people} * (${people} - 1) ÷ 2 = ${ans}`
          }
        };
      } else {
        const poolSize = 3 + (i % 2); // 3 or 4 digits
        const digits = ["1", "2", "3", "4"].slice(0, poolSize);
        // permutation P(poolSize, 3) = poolSize * (poolSize-1) * (poolSize-2)
        const ans = poolSize * (poolSize - 1) * (poolSize - 2);

        return {
          id: `pm_${i + 1}`,
          worldId: WorldId.Permutation,
          name: `第 ${i + 1} 关`,
          title: `数字卡片密码组合`,
          question: `用数字卡片 【${digits.join(", ")}】 （每张只能用一次），一共可以组成多少个不同的三位数？`,
          hint: `乘法原理分步计算！百位上有 ${poolSize} 种选法；十位上剩下 ${poolSize - 1} 种选法；个位上只剩下 ${poolSize - 2} 种选法。将它们相乘！`,
          explanation: `组数 = ${poolSize} (百位) * ${poolSize - 1} (十位) * ${poolSize - 2} (个位) = ${ans} 个。`,
          correctAnswer: ans,
          data: {
            type: "digits" as const,
            items: digits,
            correctAnswer: ans,
            hint: `百位 ${poolSize} 种 * 十位 ${poolSize - 1} 种 * 个位 ${poolSize - 2} 种 = ${ans} 个三位数。`
          }
        };
      }
    })
  },
  {
    id: WorldId.MagicSquare,
    name: "数阵九宫平衡盘",
    icon: "🧩",
    color: "from-blue-500 to-indigo-700",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50/50",
    accentColor: "text-blue-600 bg-blue-50 border-blue-200",
    description: "源于中国古代‘洛书’的数学九宫格。调配数字填补空隙，让四方天地达成和谐一致。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      // 3x3 Magic square with targetSum 15
      // Base array: [8, 1, 6, 3, 5, 7, 4, 9, 2]
      // Depending on i, we leave different cells as null
      const baseGrid = [8, 1, 6, 3, 5, 7, 4, 9, 2];
      const masks = [
        [0, 2, 7],    // level 1 mask indexes
        [1, 5, 6],    // level 2 mask indexes
        [3, 4, 8],    // level 3
        [2, 4, 6],    // level 4
        [0, 1, 5, 8], // level 5
        [2, 3, 4, 7], // level 6
        [1, 3, 5, 7], // level 7
        [0, 3, 6, 8], // level 8
        [0, 1, 2, 4, 8], // level 9
        [1, 2, 3, 5, 7]  // level 10
      ];
      const mask = masks[i] || masks[0];
      const grid = baseGrid.map((v, idx) => (mask.includes(idx) ? null : v));

      return {
        id: `msq_${i + 1}`,
        worldId: WorldId.MagicSquare,
        name: `第 ${i + 1} 关`,
        title: `幻方阵重组平衡`,
        question: `一个 3x3 九宫幻方盘，已知每一横行、竖列、对角线上的 3 个数之和都相等（等于 15）。请在空格中填上合适的数字使魔法阵配平。`,
        hint: `先找那一行/那一列/那一条对角线上只缺一个数的地方！例如如果知道了两个数 X 和 Y，那空格里就只能填 15 - X - Y。`,
        explanation: `通过观察和减法代入：首先从已给出两数的一行或一列入手，可求出第三个空。顺藤摸瓜即可解出全部九宫数字。`,
        correctAnswer: 15,
        data: {
          grid,
          correctAnswer: baseGrid,
          targetSum: 15,
          hint: `洛书口诀：戴九履一，左三右七，二四为肩，六八为足，五居中央！`
        }
      };
    })
  },
  {
    id: WorldId.ClockAngle,
    name: "时光夹角时钟岛",
    icon: "⏰",
    color: "from-rose-400 to-red-500",
    borderColor: "border-rose-400",
    bgColor: "bg-rose-50/50",
    accentColor: "text-rose-600 bg-rose-50 border-rose-200",
    description: "在滴答流转的时间中提取空间。数清敲钟的无声空档期，度量时针分针的重合视角。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const isAngle = i % 2 === 0;
      if (isAngle) {
        const hours = [3, 4, 6, 9, 2, 8, 1, 5, 10, 11][i];
        const ans = Math.min((hours % 12) * 30, 360 - (hours % 12) * 30);
        return {
          id: `ca_${i + 1}`,
          worldId: WorldId.ClockAngle,
          name: `第 ${i + 1} 关`,
          title: `时针分针的静止角`,
          question: `在时钟指向刚好 ${hours} 点整时，表盘上的时针和分针之间组成的【较小夹角】是多少度？`,
          hint: `钟表一圈一共有 12 个大格，对应 360 度。所以每个大格就是 30 度！${hours} 点整时，分针在 12 上，时针正好指向数 ${hours}。求它们之间的格子数乘上 30 吧！`,
          explanation: `每个大格代表 30 度。在 ${hours} 点整，时针和分针相差 ${hours % 12} 个大格。夹角为 ${hours % 12} * 30 = ${(hours % 12) * 30} 度。取较小角得到 ${ans} 度。`,
          correctAnswer: ans,
          data: {
            questionType: "angle" as const,
            timeStr: `${hours}:00`,
            correctAnswer: ans,
            hint: `大格数 = ${hours % 12} 格。每个格子 = 30 度。相乘即得：${ans} 度！`
          }
        };
      } else {
        const strikeCount = 3 + (i % 3); // 3, 4, 5
        const strikeSecs = (strikeCount - 1) * 3; // interval is 3 secs
        const targetStrikes = 6 + (i % 4); // 6, 7, 8, 9
        const ans = (targetStrikes - 1) * 3;

        return {
          id: `ca_${i + 1}`,
          worldId: WorldId.ClockAngle,
          name: `第 ${i + 1} 关`,
          title: `时钟鸣钟的回响`,
          question: `广场上的大钟，敲响 ${strikeCount} 下一共需要 ${strikeSecs} 秒。那么，当中午敲响 ${targetStrikes} 下时，一共需要多少秒时间？`,
          hint: `陷阱题！大钟敲击 ${strikeCount} 下，中间只有 ${strikeCount - 1} 个间隔！所以求出敲一下的“时间间隔”是：${strikeSecs} ÷ (${strikeCount} - 1)。敲 ${targetStrikes} 下则有 ${targetStrikes - 1} 个间隔！`,
          explanation: `敲击 ${strikeCount} 下，有 ${strikeCount - 1} 个时间间隔。每个间隔时间 = ${strikeSecs} ÷ ${strikeCount - 1} = 3 秒。敲击 ${targetStrikes} 下有 ${targetStrikes - 1} 个间隔，所需总时间 = (${targetStrikes} - 1) * 3 = ${ans} 秒。`,
          correctAnswer: ans,
          data: {
            questionType: "strike" as const,
            strikeCount,
            strikeSecs,
            targetStrikes,
            correctAnswer: ans,
            hint: `间隔数 = 敲响数 - 1。单间隔时间 = ${strikeSecs} ÷ (${strikeCount} - 1) = 3秒。总时间 = (${targetStrikes} - 1) * 3秒 = ${ans}秒。`
          }
        };
      }
    })
  },
  {
    id: WorldId.BinaryScore,
    name: "知识竞赛得分谷",
    icon: "🏆",
    color: "from-emerald-500 to-green-600",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50/50",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    description: "鸡兔同笼的极佳应用变体。理清答对加分与答错扣分的差额，算清真正的赢家。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const totalQuestions = 10 + (i % 3) * 5; // 10, 15, 20
      const correctPoints = 5;
      const wrongDeduct = 2;
      const correctAnswer = totalQuestions - 1 - (i % 3);
      const wrongCount = totalQuestions - correctAnswer;
      const earnedPoints = correctAnswer * correctPoints - wrongCount * wrongDeduct;

      return {
        id: `bs_${i + 1}`,
        worldId: WorldId.BinaryScore,
        name: `第 ${i + 1} 关`,
        title: `全能知识得分挑战`,
        question: `一次少儿奥数比赛一共有 ${totalQuestions} 道题。答对一题得 ${correctPoints} 分，答错一题扣 ${wrongDeduct} 分。小松鼠回答了全部问题，最后得到了 ${earnedPoints} 分。请问小松鼠一共答对了几道题？`,
        hint: `假设全部答对！如果全部答对应该得 ${totalQuestions * correctPoints} 分。但实际只得了 ${earnedPoints} 分，少拿了分数。少的分数是因为有些题答错了，答错一题不仅拿不到加分还要倒扣，这一来一回每错一题就要损失 ${correctPoints} + ${wrongDeduct} = ${correctPoints + wrongDeduct} 分！`,
        explanation: `假设全部答对：总得分 = ${totalQuestions} * ${correctPoints} = ${totalQuestions * correctPoints} 分。实际只得了 ${earnedPoints} 分，少了 ${totalQuestions * correctPoints - earnedPoints} 分。错一题损失 = ${correctPoints} + ${wrongDeduct} = ${correctPoints + wrongDeduct} 分。因此错题数 = ${totalQuestions * correctPoints - earnedPoints} ÷ ${correctPoints + wrongDeduct} = ${wrongCount} 题。答对题数 = ${totalQuestions} - ${wrongCount} = ${correctAnswer} 题。`,
        correctAnswer,
        data: {
          totalQuestions,
          correctPoints,
          wrongDeduct,
          earnedPoints,
          correctAnswer,
          hint: `答对一题拿5分，答错一题倒扣2分，相当于答错一题损失 7 分！`
        }
      };
    })
  },
  {
    id: WorldId.TruthLiar,
    name: "真真假假谎言屋",
    icon: "🕵️‍♀️",
    color: "from-fuchsia-500 to-pink-600",
    borderColor: "border-fuchsia-400",
    bgColor: "bg-fuchsia-50/50",
    accentColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    description: "辩驳真伪，解密供词。用假设法代入身份，理清人际供证，寻找逻辑唯一的说谎人。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const names = ["小红狐", "小蓝兔", "小绿蛙"];
      const emojis = ["🦊", "🐰", "🐸"];

      let characters = [
        { name: names[0], emoji: emojis[0], statement: "" },
        { name: names[1], emoji: emojis[1], statement: "" },
        { name: names[2], emoji: emojis[2], statement: "" }
      ];

      let liarName = "";
      let questionType: "find_liar" | "find_honest" = "find_liar";

      if (i % 3 === 0) {
        characters[0].statement = `${names[1]}在撒谎。`;
        characters[1].statement = `${names[2]}在说真话。`;
        characters[2].statement = `我们三个人中只有一个人在撒谎。`;
        liarName = names[1]; // Rabbit is lying
      } else if (i % 3 === 1) {
        characters[0].statement = `撒谎的人在我们中间。`;
        characters[1].statement = `我是老实人，我绝对没有撒谎。`;
        characters[2].statement = `${names[0]}和${names[1]}都在撒谎！`;
        liarName = names[2]; // Frog is lying
      } else {
        characters[0].statement = `${names[2]}抢走了红苹果。`;
        characters[1].statement = `我没有抢红苹果。`;
        characters[2].statement = `${names[1]}在撒谎，其实是我抢的。`;
        liarName = names[0]; // Fox is lying
      }

      return {
        id: `tl_${i + 1}`,
        worldId: WorldId.TruthLiar,
        name: `第 ${i + 1} 关`,
        title: `谎言真伪逻辑辩析`,
        question: `已知小狐、小兔和小蛙三名选手中，正好有且只有 1 个人在撒谎，其余人在说真话。根据他们的发言，请问【谁是唯一的撒谎者】？`,
        hint: `利用假设排除法！先假设 ${names[0]} 是撒谎者，验证另外两人是否都说了真话；再假设 ${names[1]} 是撒谎者……看哪种假设下没有任何矛盾！`,
        explanation: `假设${liarName}撒谎：那么其他人说的话完全合乎情理、互不冲突。如果换成别人撒谎，就会发生矛盾。所以撒谎的人是 ${liarName}。`,
        correctAnswer: liarName,
        data: {
          characters,
          liarCount: 1,
          correctAnswer: liarName,
          questionType,
          hint: `依次假设某一人是撒谎者，看剩下的两个人说的话是否都为真！`
        }
      };
    })
  },
  {
    id: WorldId.WaterPouring,
    name: "量水魔法烧杯岛",
    icon: "💧",
    color: "from-cyan-400 to-sky-600",
    borderColor: "border-cyan-400",
    bgColor: "bg-cyan-50/50",
    accentColor: "text-cyan-600 bg-cyan-50 border-cyan-200",
    description: "没有刻度也能精准量出目标体积！利用两只容器的倒灌与清空，体验数论中的加减组合。",
    levels: Array.from({ length: 10 }).map((_, i) => {
      const presets = [
        { capA: 7, capB: 3, target: 4 },
        { capA: 5, capB: 3, target: 2 },
        { capA: 9, capB: 4, target: 5 },
        { capA: 8, capB: 5, target: 3 },
        { capA: 6, capB: 4, target: 2 },
        { capA: 7, capB: 4, target: 3 },
        { capA: 10, capB: 3, target: 7 },
        { capA: 5, capB: 4, target: 1 },
        { capA: 8, capB: 3, target: 5 },
        { capA: 9, capB: 5, target: 4 }
      ];
      const preset = presets[i % presets.length];

      return {
        id: `wp_${i + 1}`,
        worldId: WorldId.WaterPouring,
        name: `第 ${i + 1} 关`,
        title: `量水容积倒罐艺术`,
        question: `魔法烧杯 A 的容量是 ${preset.capA} 升，烧杯 B 的容量是 ${preset.capB} 升。请问你能通过倒腾量出正好 ${preset.target} 升的水吗？操作控制面板来完成它！`,
        hint: `这个非常简单！例如先把大杯 ${preset.capA} 装满，然后往小杯 ${preset.capB} 里灌满，大杯里剩下来的水就是 ${preset.capA} - ${preset.capB} = ${preset.target} 升啦！`,
        explanation: `只需要将大杯装满 ${preset.capA} 升，然后往小杯倒满 ${preset.capB} 升，大杯里就剩下了 ${preset.capA} - ${preset.capB} = ${preset.target} 升水。`,
        correctAnswer: preset.target,
        data: {
          capA: preset.capA,
          capB: preset.capB,
          target: preset.target,
          hint: `直接把大烧杯 ${preset.capA}L 灌满，再倒满 ${preset.capB}L 的小烧杯，大烧杯剩下的正是 ${preset.target}L！`
        }
      };
    })
  },
  {
    id: WorldId.SubstitutionMath,
    name: "等量代换平衡岛",
    icon: "🍇",
    color: "from-purple-400 to-indigo-500",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-50/50",
    accentColor: "text-purple-600 bg-purple-50 border-purple-200",
    description: "通过等量代换，理清熊猫、兔子和胡萝卜之间的奇妙兑换关系。",
    subject: Subject.Math,
    levels: [
      {
        id: "substitution_1",
        worldId: WorldId.SubstitutionMath,
        name: "第 1 关",
        title: "苹果与葡萄的秘密",
        question: "已知 1 个苹果 = 2 个草莓，1 个草莓 = 3 个葡萄。请问：1 个苹果可以换几个葡萄？请在右侧天平上放入正确数量的葡萄吧！",
        hint: "1个草莓是3个葡萄。那2个草莓就是2个3相加，也就是：3 + 3 = 6。",
        explanation: "1个苹果等于2个草莓。因为1个草莓可以换3个葡萄，所以2个草莓就可以换 2 × 3 = 6 个葡萄。答案是 6 个葡萄。",
        correctAnswer: 6,
        data: {
          type: "substitution",
          visualData: { source: "🍎", middle: "🍓", target: "🍇", sourceName: "苹果", middleName: "草莓", targetName: "葡萄", eq1Ratio: 2, eq2Ratio: 3 },
          correctAnswer: 6,
          hint: "1个草莓是3个葡萄。那2个草莓就是2个3相加，也就是：3 + 3 = 6。"
        }
      },
      {
        id: "substitution_2",
        worldId: WorldId.SubstitutionMath,
        name: "第 2 关",
        title: "大熊猫的胡萝卜",
        question: "已知 1 只熊猫 = 3 只小兔，1 只小兔 = 2 根胡萝卜。请问：1 只熊猫可以换几根胡萝卜？",
        hint: "1只兔子换2根胡萝卜，3只兔子就可以换3个2根，即：2 + 2 + 2 = 6 根！",
        explanation: "1只熊猫等于3只小兔。因为1只小兔等于2根胡萝卜，所以3只小兔可以换 3 × 2 = 6 根胡萝卜。答案是 6。",
        correctAnswer: 6,
        data: {
          type: "substitution",
          visualData: { source: "🐼", middle: "🐰", target: "🥕", sourceName: "熊猫", middleName: "小兔", targetName: "胡萝卜", eq1Ratio: 3, eq2Ratio: 2 },
          correctAnswer: 6,
          hint: "1只兔子换2根胡萝卜，3只兔子就可以换3个2根，即：2 + 2 + 2 = 6 根！"
        }
      },
      {
        id: "substitution_3",
        worldId: WorldId.SubstitutionMath,
        name: "第 3 关",
        title: "小狗和小鱼",
        question: "已知 1 只小狗 = 2 只小猫，1 只小猫 = 4 条小鱼。请问：1 只小狗可以换几条小鱼？",
        hint: "1只猫换4条鱼，2只猫换 2 × 4 = 8 条鱼。",
        explanation: "1只小狗换2只猫。每只小猫可以换4条小鱼，所以2只小猫可以换 2 × 4 = 8 条小鱼。答案是 8。",
        correctAnswer: 8,
        data: {
          type: "substitution",
          visualData: { source: "🐶", middle: "🐱", target: "🐟", sourceName: "小狗", middleName: "小猫", targetName: "小鱼", eq1Ratio: 2, eq2Ratio: 4 },
          correctAnswer: 8,
          hint: "1只猫换4条鱼，2只猫换 2 × 4 = 8 条鱼。"
        }
      }
    ]
  },
  {
    id: WorldId.CubeStack,
    name: "立体积木叠叠乐",
    icon: "🧱",
    color: "from-amber-500 to-amber-600",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50/50",
    accentColor: "text-amber-600 bg-amber-50 border-amber-200",
    description: "数数立体堆叠在一起的小积木，别忘了那些藏在后面的“隐形积木”哦！",
    subject: Subject.Math,
    levels: [
      {
        id: "cubestack_1",
        worldId: WorldId.CubeStack,
        name: "第 1 关",
        title: "小小金字塔",
        question: "下面的积木堆叠在一起，请问一共有多少个小积木块？（点击积木可以给它贴上小星星，防止数漏哦）",
        hint: "最上层有1个。下层有3个支撑着它。所以一共是：1 + 3 = 4 个。",
        explanation: "最上层有1个积木，它必须要坐在下层的积木上。下层有3个积木。所以总数是 1 + 3 = 4 个。",
        correctAnswer: 4,
        data: {
          type: "cubes",
          visualData: {
            cubesCount: 4,
            layout: [
              { x: 0, y: 0, z: 0 },
              { x: 1, y: 0, z: 0 },
              { x: 0, y: 0, z: 1 },
              { x: 0, y: 1, z: 0 }
            ]
          },
          correctAnswer: 4,
          hint: "最上层有1个。下层有3个。一共是：1 + 3 = 4 个。"
        }
      },
      {
        id: "cubestack_2",
        worldId: WorldId.CubeStack,
        name: "第 2 关",
        title: "神奇转角积木",
        question: "下面的积木形成了一个转角，请问一共有多少个小积木块？",
        hint: "仔细看，最上面的那个积木底下一定有一个隐形积木托着它！",
        explanation: "上层有1个。下层成L形，有4个积木（包括顶层积木下面的那个支撑积木）。一共是：1 + 4 = 5 个。",
        correctAnswer: 5,
        data: {
          type: "cubes",
          visualData: {
            cubesCount: 5,
            layout: [
              { x: 0, y: 0, z: 0 },
              { x: 1, y: 0, z: 0 },
              { x: 0, y: 0, z: 1 },
              { x: 0, y: 0, z: 2 },
              { x: 0, y: 1, z: 0 }
            ]
          },
          correctAnswer: 5,
          hint: "最上层有1个。下层有4个（有1个在最上面的积木正下方）。总共是 5 个。"
        }
      },
      {
        id: "cubestack_3",
        worldId: WorldId.CubeStack,
        name: "第 3 关",
        title: "积木大台阶",
        question: "下面的积木排成了漂亮的台阶，请数一数一共有多少个积木块？",
        hint: "从上往下数：最上层有1个；第二层有2个（1个露出来，1个在最上层底下）；最底层有3个。所以是：1 + 2 + 3 = 6 个。",
        explanation: "从上往下分层数：第一层有 1 个；第二层有 2 个；最下面第三层有 3 个。1 + 2 + 3 = 6 个。",
        correctAnswer: 6,
        data: {
          type: "cubes",
          visualData: {
            cubesCount: 6,
            layout: [
              { x: 0, y: 0, z: 0 },
              { x: 1, y: 0, z: 0 },
              { x: 2, y: 0, z: 0 },
              { x: 0, y: 1, z: 0 },
              { x: 1, y: 1, z: 0 },
              { x: 0, y: 2, z: 0 }
            ]
          },
          correctAnswer: 6,
          hint: "从上到下一层层数：第一层有 1 个；第二层有 2 个；第三层有 3 个。1 + 2 + 3 = 6 个。"
        }
      }
    ]
  },
  {
    id: WorldId.WeightCompare,
    name: "小小秤重天平",
    icon: "⚖️",
    color: "from-sky-400 to-blue-500",
    borderColor: "border-sky-400",
    bgColor: "bg-sky-50/50",
    accentColor: "text-sky-600 bg-sky-50 border-sky-200",
    description: "看天平的倾斜方向，找出苹果、香蕉和西瓜中谁最重、谁最轻。",
    subject: Subject.Math,
    levels: [
      {
        id: "weight_1",
        worldId: WorldId.WeightCompare,
        name: "第 1 关",
        title: "谁最重？",
        question: "根据天平，红苹果 🍎 沉在下面，黄香蕉 🍌 翘在上面。请问哪个水果最重？",
        hint: "天平沉下去（低的那一端）代表对应的水果比较重哦！",
        explanation: "苹果端沉在下面，香蕉端翘在上面，说明苹果比香蕉重。所以最重的是 苹果 🍎。",
        correctAnswer: "苹果",
        options: ["苹果", "香蕉"],
        data: {
          type: "weight",
          options: ["苹果", "香蕉"],
          visualData: {
            scales: [
              { heavy: "🍎", light: "🍌" }
            ]
          },
          correctAnswer: "苹果",
          hint: "天平沉下去（低的那一端）代表对应的水果比较重哦！"
        }
      },
      {
        id: "weight_2",
        worldId: WorldId.WeightCompare,
        name: "第 2 关",
        title: "三只水果大比拼",
        question: "天平一：大西瓜 🍉 比 橙子 🍊 重；天平二：橙子 🍊 比 草莓 🍓 重。请问这三种水果里谁最重？",
        hint: "大西瓜比橙子重，橙子又比草莓重，说明西瓜 > 橙子 > 草莓。",
        explanation: "根据天平一可知 西瓜 > 橙子，根据天平二可知 橙子 > 草莓。所以 西瓜 > 橙子 > 草莓，最重的是 西瓜 🍉。",
        correctAnswer: "西瓜",
        options: ["西瓜", "橙子", "草莓"],
        data: {
          type: "weight",
          options: ["西瓜", "橙子", "草莓"],
          visualData: {
            scales: [
              { heavy: "🍉", light: "🍊" },
              { heavy: "🍊", light: "🍓" }
            ]
          },
          correctAnswer: "西瓜",
          hint: "西瓜 > 橙子，橙子 > 草莓，说明西瓜最重！"
        }
      },
      {
        id: "weight_3",
        worldId: WorldId.WeightCompare,
        name: "第 3 关",
        title: "森林里谁最轻？",
        question: "天平一：小松鼠 🐿️ 比 大熊猫 🐼 轻；天平二：小兔子 🐰 比 小松鼠 🐿️ 轻。请问这三只小动物谁最轻？",
        hint: "小松鼠比熊猫轻，小兔子又比小松鼠轻，说明 熊猫 > 小松鼠 > 小兔子。",
        explanation: "因为 熊猫 > 小松鼠 且 小松鼠 > 小兔子，所以最轻的是 小兔子 🐰。",
        correctAnswer: "小兔子",
        options: ["大熊猫", "小松鼠", "小兔子"],
        data: {
          type: "weight",
          options: ["大熊猫", "小松鼠", "小兔子"],
          visualData: {
            scales: [
              { heavy: "🐼", light: "🐿️" },
              { heavy: "🐿️", light: "🐰" }
            ]
          },
          correctAnswer: "小兔子",
          hint: "兔子比松鼠轻，松鼠又比熊猫轻，所以兔子是最轻的。"
        }
      }
    ]
  },
  {
    id: WorldId.ClockMatch,
    name: "认读时钟小岛",
    icon: "⏰",
    color: "from-teal-400 to-teal-500",
    borderColor: "border-teal-400",
    bgColor: "bg-teal-50/50",
    accentColor: "text-teal-600 bg-teal-50 border-teal-200",
    description: "学习认识表盘上的时针和分针，看看时钟指着几点钟，或者一小时后是几点。",
    subject: Subject.Math,
    levels: [
      {
        id: "clock_1",
        worldId: WorldId.ClockMatch,
        name: "第 1 关",
        title: "认识整点",
        question: "看看右边的钟表，现在是几点钟？",
        hint: "分针（红长针）指向12，时针（黑短针）指向3，说明是3点整。",
        explanation: "当时针指向3，分针指向12时，代表时间正好是 3 点整。",
        correctAnswer: "3:00",
        options: ["3:00", "12:00", "12:15", "9:00"],
        data: {
          type: "clock",
          options: ["3:00", "12:00", "12:15", "9:00"],
          visualData: { hours: 3, minutes: 0 },
          correctAnswer: "3:00",
          hint: "长针指着12是整点，短针指着几就是几点整！"
        }
      },
      {
        id: "clock_2",
        worldId: WorldId.ClockMatch,
        name: "第 2 关",
        title: "时间在跑步",
        question: "右边的时钟现在是 9点整。请问：再过 1 小时，是几点钟？",
        hint: "现在是9点。过1小时，时针会顺时针转动一格，指向下一个数字哦！",
        explanation: "9 点再过 1 小时就是 9 + 1 = 10 点。所以是 10:00。",
        correctAnswer: "10:00",
        options: ["9:00", "10:00", "11:00", "8:00"],
        data: {
          type: "clock",
          options: ["9:00", "10:00", "11:00", "8:00"],
          visualData: { hours: 9, minutes: 0 },
          correctAnswer: "10:00",
          hint: "往后数1小时：9点整的下一个整点是几点呢？"
        }
      },
      {
        id: "clock_3",
        worldId: WorldId.ClockMatch,
        name: "第 3 关",
        title: "时光倒流",
        question: "右边的时钟现在是 6点整。请问：2 小时之前，是几点钟？",
        hint: "“之前”要往前倒退数。6点整往前退2小时，就是 6 - 2 点。",
        explanation: "6 点往前倒退 2 小时，计算为 6 - 2 = 4 点。所以是 4:00。",
        correctAnswer: "4:00",
        options: ["4:00", "5:00", "6:00", "8:00"],
        data: {
          type: "clock",
          options: ["4:00", "5:00", "6:00", "8:00"],
          visualData: { hours: 6, minutes: 0 },
          correctAnswer: "4:00",
          hint: "往前倒数2小时：6减去2是多少呢？"
        }
      }
    ]
  },
  {
    id: WorldId.OddEvenSort,
    name: "奇偶数魔法师",
    icon: "🪄",
    color: "from-pink-400 to-pink-500",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-50/50",
    accentColor: "text-pink-600 bg-pink-50 border-pink-200",
    description: "找出数字中的奇数（单数）和偶数（双数），帮助小精灵分类魔法水晶。",
    subject: Subject.Math,
    levels: [
      {
        id: "oddeven_1",
        worldId: WorldId.OddEvenSort,
        name: "第 1 关",
        title: "单数还是双数？",
        question: "小熊有 7 个苹果。如果两两配对，会剩下一个苹果落单。请问 7 是奇数还是偶数？",
        hint: "不能被2整除、两两配对后剩下一个的，就是奇数（单数）；能分完没有落单的是偶数（双数）。",
        explanation: "7 不能被 2 整除，分两两一双后会剩下一个 1，所以 7 是 奇数。",
        correctAnswer: "奇数",
        options: ["奇数", "偶数"],
        data: {
          type: "oddeven",
          options: ["奇数", "偶数"],
          correctAnswer: "奇数",
          hint: "两两配对分一分：7 = 2 + 2 + 2 + 1。有一个落单，所以是奇数！"
        }
      },
      {
        id: "oddeven_2",
        worldId: WorldId.OddEvenSort,
        name: "第 2 关",
        title: "魔法加法",
        question: "算一算：3 + 5 的结果是奇数还是偶数？",
        hint: "先算出 3 + 5 = 8。然后再想想 8 是单数（奇数）还是双数（偶数）呢？",
        explanation: "3 + 5 = 8。因为 8 是 2 的倍数（能被2整除，双数），所以结果是 偶数。",
        correctAnswer: "偶数",
        options: ["奇数", "偶数"],
        data: {
          type: "oddeven",
          options: ["奇数", "偶数"],
          correctAnswer: "偶数",
          hint: "先加起来：3 + 5 = 8。8可以分成4个2，没有落单！"
        }
      },
      {
        id: "oddeven_3",
        worldId: WorldId.OddEvenSort,
        name: "第 3 关",
        title: "神奇乘法",
        question: "算一算：2 × 7 的结果是奇数还是偶数？",
        hint: "2 × 7 = 14。任何数乘上 2，结果一定是个双数（偶数）哦！",
        explanation: "2 × 7 = 14。因为 14 尾数是 4，能被 2 整除，所以 14 是 偶数。",
        correctAnswer: "偶数",
        options: ["奇数", "偶数"],
        data: {
          type: "oddeven",
          options: ["奇数", "偶数"],
          correctAnswer: "偶数",
          hint: "2 乘以 7 是 14，能被 2 整除，所以是偶数！"
        }
      }
    ]
  },
  {
    id: WorldId.SupermarketChange,
    name: "超市找零岛",
    icon: "🪙",
    color: "from-emerald-400 to-emerald-500",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50/50",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    description: "用你口袋里的小金币买零食，算算售货员阿姨应该找给你多少零钱。",
    subject: Subject.Math,
    levels: [
      {
        id: "change_1",
        worldId: WorldId.SupermarketChange,
        name: "第 1 关",
        title: "买巧克力",
        question: "你想买一盒巧克力 🍫，价格是 7 元。你付给售货员阿姨 10 元纸币 💵。请问阿姨应该找给你多少元零钱？（点击下方硬币放入找零盘，直到总数正确）",
        hint: "找零公式：付的钱 - 商品价格。即：10 - 7 = 3 元。",
        explanation: "付了 10 元，商品价格 7 元，找零为 10 - 7 = 3 元。",
        correctAnswer: 3,
        data: {
          type: "change",
          visualData: { itemName: "美味巧克力", itemEmoji: "🍫", price: 7, paid: 10 },
          correctAnswer: 3,
          hint: "用减法：付了 10 元，减去巧克力的 7 元，应该找回多少钱？"
        }
      },
      {
        id: "change_2",
        worldId: WorldId.SupermarketChange,
        name: "第 2 关",
        title: "买玩具熊",
        question: "你想买一只可爱的玩具小熊 🧸，价格是 12 元。你付给售货员阿姨 20 元。请问阿姨应该找给你多少元零钱？",
        hint: "用减法计算：20 - 12 = 8 元。",
        explanation: "付了 20 元，玩具熊价格 12 元，找零为 20 - 12 = 8 元。",
        correctAnswer: 8,
        data: {
          type: "change",
          visualData: { itemName: "玩具熊", itemEmoji: "🧸", price: 12, paid: 20 },
          correctAnswer: 8,
          hint: "20 元减去玩具熊的 12 元，剩下的就是找零！"
        }
      },
      {
        id: "change_3",
        worldId: WorldId.SupermarketChange,
        name: "第 3 关",
        title: "买冰淇淋",
        question: "你想买 2 个美味的冰淇淋 🍦，每个价格是 4 元。你付给阿姨 10 元。请问应该找回多少元零钱？",
        hint: "先算出 2 个冰淇淋一共多少钱：4 + 4 = 8 元。然后再用 10 元去减！",
        explanation: "2 个冰淇淋的价格是 2 × 4 = 8 元。找零为 10 - 8 = 2 元。",
        correctAnswer: 2,
        data: {
          type: "change",
          visualData: { itemName: "草莓冰淇淋", itemEmoji: "🍦", price: 8, paid: 10 },
          correctAnswer: 2,
          hint: "先加法再减法：两个冰淇淋是 4+4=8 元。付了10元，找回多少？"
        }
      }
    ]
  },
  {
    id: WorldId.OneStroke,
    name: "一笔画大挑战",
    icon: "🎨",
    color: "from-blue-400 to-indigo-500",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50/50",
    accentColor: "text-blue-600 bg-blue-50 border-blue-200",
    description: "连线不回头！看看这些漂亮的图形，哪些可以不抬笔一笔画出来？",
    subject: Subject.Math,
    levels: [
      {
        id: "onestroke_1",
        worldId: WorldId.OneStroke,
        name: "第 1 关",
        title: "基础三角形",
        question: "右边是一个简单的三角形 🔺。请问这个图形可以一笔画出来吗？",
        hint: "三角形只有3个角，没有任何奇数度数点，所以非常简单，可以一笔画出！",
        explanation: "三角形的所有顶点连接的线都是2条（偶数度数）。没有奇数点，因此可以一笔画出。",
        correctAnswer: "可以",
        options: ["可以", "不可以"],
        data: {
          type: "onestroke",
          options: ["可以", "不可以"],
          visualData: {
            svgPath: "M 50 15 L 85 75 L 15 75 Z",
            nodes: [{ x: 50, y: 15 }, { x: 85, y: 75 }, { x: 15, y: 75 }]
          },
          correctAnswer: "可以",
          hint: "试着从任意一个角出发绕一圈，是不是正好画完并且回到了起点？"
        }
      },
      {
        id: "onestroke_2",
        worldId: WorldId.OneStroke,
        name: "第 2 关",
        title: "神奇十字架",
        question: "右边是一个十字架形（加号 ➕）。请问这个图形可以一笔画出来吗？",
        hint: "数一数奇数点：十字架的4个端点都只连接了1条线。有4个奇数点，能一笔画吗？",
        explanation: "一笔画定理：只有当一个图形中奇数点（连接奇数条线的点）的个数是 0 个或 2 个时，才能一笔画。十字架有 4 个端点都是奇数点，所以不能一笔画。",
        correctAnswer: "不可以",
        options: ["可以", "不可以"],
        data: {
          type: "onestroke",
          options: ["可以", "不可以"],
          visualData: {
            svgPath: "M 50 15 L 50 85 M 15 50 L 85 50",
            nodes: [{ x: 50, y: 15 }, { x: 50, y: 85 }, { x: 15, y: 50 }, { x: 85, y: 50 }, { x: 50, y: 50 }]
          },
          correctAnswer: "不可以",
          hint: "十字架的四个端点都只连了一条线（1是奇数）。一辆火车进站必须能出站，奇数点太多就没法一笔画啦！"
        }
      },
      {
        id: "onestroke_3",
        worldId: WorldId.OneStroke,
        name: "第 3 关",
        title: "漏顶的小房子",
        question: "右边是一个小房子的框架。请问这个图形可以一笔画吗？",
        hint: "数一数：底部的两个角连接2条线，中间两个角连接3条线，顶部的角连接2条线。一共有2个奇数点！",
        explanation: "该图形一共有 2 个奇数点（中间两个连接 3 条线的角），其余为偶数点。根据一笔画定理，正好有 2 个奇数点的图形是可以一笔画的（从其中一个奇数点出发，在另一个奇数点结束）。",
        correctAnswer: "可以",
        options: ["可以", "不可以"],
        data: {
          type: "onestroke",
          options: ["可以", "不可以"],
          visualData: {
            svgPath: "M 20 50 L 50 20 L 80 50 L 80 85 M 20 50 L 20 85 L 80 85 M 20 50 L 80 50",
            nodes: [{ x: 20, y: 50 }, { x: 50, y: 20 }, { x: 80, y: 50 }, { x: 20, y: 85 }, { x: 80, y: 85 }]
          },
          correctAnswer: "可以",
          hint: "只要奇数点只有0个或2个，就可以一笔画！这个图形正好有2个奇数点（最底下两个角连了3根线）。"
        }
      }
    ]
  },
  {
    id: WorldId.SequenceTrain,
    name: "规律数字小火车",
    icon: "🚂",
    color: "from-yellow-400 to-orange-500",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50/50",
    accentColor: "text-yellow-600 bg-yellow-50 border-yellow-200",
    description: "观察火车车厢上的数字规律，把缺少的那个数字气球装上车厢吧！",
    subject: Subject.Math,
    levels: [
      {
        id: "sequencetrain_1",
        worldId: WorldId.SequenceTrain,
        name: "第 1 关",
        title: "双数跳跳跳",
        question: "小火车上拉着一组数字：2, 4, 6, ?, 10。请问问号（?）处的数字应该是几？",
        hint: "后一个数比前一个数多2！2 + 2 = 4，4 + 2 = 6。那 6 + 2 是多少呢？",
        explanation: "这是一组连续的偶数，规律是后一个数比前一个数多 2。所以问号处的数是 6 + 2 = 8。",
        correctAnswer: 8,
        data: {
          type: "train",
          visualData: { sequence: [2, 4, 6, "?", 10] },
          correctAnswer: 8,
          hint: "这是一组每次增加2的规律数列。2, 4, 6, [ ], 10。"
        }
      },
      {
        id: "sequencetrain_2",
        worldId: WorldId.SequenceTrain,
        name: "第 2 关",
        title: "五五大跨步",
        question: "小火车车厢上的数字规律是：5, 10, 15, ?, 25。请问问号（?）处的数字应该是几？",
        hint: "每次增加5：5, 10, 15... 15 加上 5 是多少？",
        explanation: "规律是每个数比前一个数多 5。所以问号处的数字是 15 + 5 = 20。",
        correctAnswer: 20,
        data: {
          type: "train",
          visualData: { sequence: [5, 10, 15, "?", 25] },
          correctAnswer: 20,
          hint: "每次增加 5 哦！5 ➡️ 10 ➡️ 15 ➡️ [?] ➡️ 25。"
        }
      },
      {
        id: "sequencetrain_3",
        worldId: WorldId.SequenceTrain,
        name: "第 3 关",
        title: "奇数小分队",
        question: "车厢上的数字是：1, 3, 5, ?, 9。请问问号（?）处的数字应该是几？",
        hint: "每个数比前一个数多2。5 + 2 是多少？",
        explanation: "数列规律是每次加上 2。5 后面加上 2 是 7。",
        correctAnswer: 7,
        data: {
          type: "train",
          visualData: { sequence: [1, 3, 5, "?", 9] },
          correctAnswer: 7,
          hint: "每次跳 2 格：1, 3, 5, [ ], 9。"
        }
      }
    ]
  },
  {
    id: WorldId.SymmetryGrid,
    name: "对称格子画",
    icon: "🦋",
    color: "from-fuchsia-400 to-fuchsia-500",
    borderColor: "border-fuchsia-400",
    bgColor: "bg-fuchsia-50/50",
    accentColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    description: "照镜子画画！了解轴对称的概念，找出完美的对称平衡点。",
    subject: Subject.Math,
    levels: [
      {
        id: "symmetry_1",
        worldId: WorldId.SymmetryGrid,
        name: "第 1 关",
        title: "照镜子涂格子",
        question: "在 4x4 的格子网格中，如果左边一半涂了 3 个格子，为了让整张图左右完全对称，右边一半应该涂几个格子？",
        hint: "就像蝴蝶的两只翅膀一样，左边和右边涂的格子数量要完全相等，图案也要镜像对称哦！",
        explanation: "对称图形的左右两部分能够完全重合。所以左边涂了 3 个格子，右边也必须对应涂上 3 个格子。",
        correctAnswer: 3,
        data: {
          type: "symmetry",
          visualData: { leftGrid: [true, false, true, true, false, false, false, false], isGridChoice: false },
          correctAnswer: 3,
          hint: "镜子里的世界是相等的。左边有3个，右边也要有3个！"
        }
      },
      {
        id: "symmetry_2",
        worldId: WorldId.SymmetryGrid,
        name: "第 2 关",
        title: "字母照镜子",
        question: "下面哪一个英文字母是“轴对称图形”（左右两边折叠后可以完全重合）？",
        hint: "试着在字母中间画一条竖线。左边和右边长得一模一样的是哪一个？",
        explanation: "字母 A 沿着中间画一条垂直线折叠，左右两边能完全重合，所以它是轴对称图形。而字母 F 无法重合。",
        correctAnswer: "A",
        options: ["A", "F"],
        data: {
          type: "symmetry",
          options: ["A", "F"],
          visualData: { isGridChoice: true, choicesEmoji: ["🅰️", "🇫"] },
          correctAnswer: "A",
          hint: "中间画一条竖线折起来，谁能完全重合？"
        }
      },
      {
        id: "symmetry_3",
        worldId: WorldId.SymmetryGrid,
        name: "第 3 关",
        title: "大自然对称性",
        question: "下列大自然中的物品，哪一个具有天然的“左右对称”特征？",
        hint: "想一想：蝴蝶 🦋 和 切成一半的香蕉 🍌，谁折叠后两边是完全一模一样的？",
        explanation: "蝴蝶 🦋 的左翅和右翅是镜像对称的，切对折可以完全重合。而半根香蕉是弯曲的，不对称。",
        correctAnswer: "蝴蝶",
        options: ["蝴蝶", "切开的弯香蕉"],
        data: {
          type: "symmetry",
          options: ["蝴蝶", "切开的弯香蕉"],
          visualData: { isGridChoice: true, choicesEmoji: ["🦋", "🍌"] },
          correctAnswer: "蝴蝶",
          hint: "谁长着两只完全一模一样的翅膀？"
        }
      }
    ]
  },
  {
    id: WorldId.NumberNeighbor,
    name: "数字邻居连环锁",
    icon: "🐛",
    color: "from-lime-400 to-emerald-500",
    borderColor: "border-lime-400",
    bgColor: "bg-lime-50/50",
    accentColor: "text-lime-600 bg-lime-50 border-lime-200",
    description: "每个数字都有它的小邻居。找出比它多 1 或少 1、多 10 或少 10 的邻居数。",
    subject: Subject.Math,
    levels: [
      {
        id: "neighbor_1",
        worldId: WorldId.NumberNeighbor,
        name: "第 1 关",
        title: "大数邻居",
        question: "毛毛虫身上，数字 19 右边紧挨着的“多 1”邻居应该是几？",
        hint: "数字邻居就是紧接着写下去的数。比 19 多 1 的数是几呢？",
        explanation: "19 的下一个数字就是 19 + 1 = 20。",
        correctAnswer: 20,
        data: {
          type: "neighbor",
          visualData: { left: 18, centerNum: 19, right: "?" },
          correctAnswer: 20,
          hint: "19 往后数一个数，或者 19 + 1 是多少？"
        }
      },
      {
        id: "neighbor_2",
        worldId: WorldId.NumberNeighbor,
        name: "第 2 关",
        title: "倒数小邻居",
        question: "数字 100 左边紧挨着的“少 1”邻居应该是多少？",
        hint: "“少 1”也就是前一个数字。100 的前一个数字是几？或者说 100 - 1 = ?",
        explanation: "100 之前的邻居数字就是 100 - 1 = 99。",
        correctAnswer: 99,
        data: {
          type: "neighbor",
          visualData: { left: "?", centerNum: 100, right: 101 },
          correctAnswer: 99,
          hint: "100 往前退一格，也就是 100 - 1 是多少？"
        }
      },
      {
        id: "neighbor_3",
        worldId: WorldId.NumberNeighbor,
        name: "第 3 关",
        title: "十个十个跳",
        question: "如果我们在数轴上“十个十个”地往后数：数字 45 的“多 10”邻居应该是多少？",
        hint: "多 10 就是加上 10！计算：45 + 10 是多少呢？",
        explanation: "比 45 多 10 的数字邻居就是 45 + 10 = 55。",
        correctAnswer: 55,
        data: {
          type: "neighbor",
          visualData: { left: 35, centerNum: 45, right: "?" },
          correctAnswer: 55,
          hint: "个位数不变，十位数加 1：45 + 10 是多少？"
        }
      }
    ]
  },
  {
    id: WorldId.TangPoetry,
    name: "唐诗三百首",
    icon: "🏮",
    color: "from-rose-500 to-red-600",
    borderColor: "border-rose-400",
    bgColor: "bg-rose-50/50",
    accentColor: "text-rose-600 bg-rose-50 border-rose-200",
    description: "诵读经典唐诗，体验国学魅力！通过智能语音识别，完成跟读与背诵关卡。",
    subject: Subject.Chinese,
    levels: [
      {
        id: "poetry_1",
        worldId: WorldId.TangPoetry,
        name: "第 1 关",
        title: "静夜思",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《静夜思》· 李白\n床前明月光，疑是地上霜。\n举头望明月，低头思故乡。",
        hint: "点击‘听朗读’听听甜美播音员怎么读，然后点击‘语音识别’，对准麦克风大声读出整首诗吧！",
        explanation: "《静夜思》是唐代诗人李白的经典之作，表达了诗人在寂静的月夜里思念家乡的深切情怀。",
        correctAnswer: "床前明月光疑是地上霜举头望明月低头思故乡",
        data: {
          title: "静夜思",
          author: "李白",
          dynasty: "唐",
          content: [
            "床前明月光，",
            "疑是地上霜。",
            "举头望明月，",
            "低头思故乡。"
          ],
          pinyin: [
            "chuáng qián míng yuè guāng",
            "yí shì dì shàng shuāng",
            "jǔ tóu wàng míng yuè",
            "dī tóu sī gù xiāng"
          ],
          keywords: ["床前明月光", "疑是地上霜", "举头望明月", "低头思故乡"],
          cleanWords: "床前明月光疑是地上霜举头望明月低头思故乡",
          translation: "床前洒满洁白的月光，好像地上铺了一层霜。抬头望向夜空中的明月，不由得低下头，思念起远方的家乡。"
        }
      },
      {
        id: "poetry_2",
        worldId: WorldId.TangPoetry,
        name: "第 2 关",
        title: "登鹳雀楼",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《登鹳雀楼》· 王之涣\n白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。",
        hint: "欲穷千里目，更上一层楼！要想看得更远，就要站得更高。加油，读出气势来！",
        explanation: "《登鹳雀楼》是盛唐诗人王之涣创作的一首五言绝句。这首诗前两句写的是自然景观，后两句蕴含着登高望远的哲理，催人奋进。",
        correctAnswer: "白日依山尽黄河入海流欲穷千里目更上一层楼",
        data: {
          title: "登鹳雀楼",
          author: "王之涣",
          dynasty: "唐",
          content: [
            "白日依山尽，",
            "黄河入海流。",
            "欲穷千里目，",
            "更上一层楼。"
          ],
          pinyin: [
            "bái rì yī shān jìn",
            "huáng hé rù hǎi liú",
            "yù qióng qiān lǐ mù",
            "gèng shàng yī céng lóu"
          ],
          keywords: ["白日依山尽", "黄河入海流", "欲穷千里目", "更上一层楼"],
          cleanWords: "白日依山尽黄河入海流欲穷千里目更上一层楼",
          translation: "太阳依傍着群山渐渐落山，黄河咆哮着向大海奔流而去。如果想要把千里的风光景物看个够，那就要再登上一层楼。"
        }
      },
      {
        id: "poetry_3",
        worldId: WorldId.TangPoetry,
        name: "第 3 关",
        title: "春晓",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《春晓》· 孟浩然\n春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。",
        hint: "描写春天清晨的景象。醒来听到到处都是小鸟叽叽喳喳的叫声，想起昨晚的风雨，不知有多少花儿飘落了。",
        explanation: "《春晓》是唐代诗人孟浩然的代表作。全诗通过描绘春天拂晓时的自然景象，表达了诗人对春光的无限喜爱和怜惜之情。",
        correctAnswer: "春眠不觉晓处处闻啼鸟夜来风雨声花落知多少",
        data: {
          title: "春晓",
          author: "孟浩然",
          dynasty: "唐",
          content: [
            "春眠不觉晓，",
            "处处闻啼鸟。",
            "夜来风雨声，",
            "花落知多少。"
          ],
          pinyin: [
            "chūn mián bù jué xiǎo",
            "chù chù wén tí niǎo",
            "yè lái fēng yǔ shēng",
            "huā luò zhī duō shǎo"
          ],
          keywords: ["春眠不觉晓", "处处闻啼鸟", "夜来风雨声", "花落知多少"],
          cleanWords: "春眠不觉晓处处闻啼鸟夜来风雨声花落知多少",
          translation: "春日里贪睡不知不觉天已破晓，醒来时只听到处处有鸟儿啼叫。想起昨夜里风雨交加的声音，真不知有多少花朵零落红尘。"
        }
      },
      {
        id: "poetry_4",
        worldId: WorldId.TangPoetry,
        name: "第 4 关",
        title: "悯农",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《悯农》· 李绅\n锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。",
        hint: "要珍惜粮食哦！每一粒米都是农民伯伯顶着烈日、流下汗水辛辛苦苦种出来的。",
        explanation: "《悯农》是唐代诗人李绅的经典诗篇。全诗描绘了烈日下农民辛勤劳作的场景，警示人们要爱惜粮食，尊重劳动成果。",
        correctAnswer: "锄禾日当午汗滴禾下土谁知盘中餐粒粒皆辛苦",
        data: {
          title: "悯农",
          author: "李绅",
          dynasty: "唐",
          content: [
            "锄禾日当午，",
            "汗滴禾下土。",
            "谁知盘中餐，",
            "粒粒皆辛苦。"
          ],
          pinyin: [
            "chú hé rì dāng wǔ",
            "hàn dī hé xià tǔ",
            "shuí zhī pán zhōng cān",
            "lì lì jiē xīn kǔ"
          ],
          keywords: ["锄禾日当午", "汗滴禾下土", "谁知盘中餐", "粒粒皆辛苦"],
          cleanWords: "锄禾日当午汗滴禾下土谁知盘中餐粒粒皆辛苦",
          translation: "农民在正午的烈日下锄禾劳作，汗水一滴滴落入禾苗下的泥土里。有谁知道那碗中的每一口饭菜，每一粒都是农民付出千辛万苦换来的。"
        }
      },
      {
        id: "poetry_5",
        worldId: WorldId.TangPoetry,
        name: "第 5 关",
        title: "江雪",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《江雪》· 柳宗元\n千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。",
        hint: "想象一幅安静神圣的画面：所有的山上都没有鸟儿飞翔了，所有的路上都没有了人的足迹。在寒冷的漫天大雪中，只有一位老翁独自在江上垂钓。",
        explanation: "《江雪》是唐代诗人柳宗元被贬永州时创作的五言绝句。诗中描绘了一幅幽冷孤僻的雪景画面，寄托了诗人坚贞不屈、孤傲超俗的品格。",
        correctAnswer: "千山鸟飞绝万径人踪灭孤舟蓑笠翁独钓寒江雪",
        data: {
          title: "江雪",
          author: "柳宗元",
          dynasty: "唐",
          content: [
            "千山鸟飞绝，",
            "万径人踪灭。",
            "孤舟蓑笠翁，",
            "独钓寒江雪。"
          ],
          pinyin: [
            "qiān shān niǎo fēi jué",
            "wàn jìng rén zōng miè",
            "gū zhōu suō lì wēng",
            "dú diào hán jiāng xuě"
          ],
          keywords: ["千山鸟飞绝", "万径人踪灭", "孤舟蓑笠翁", "独钓寒江雪"],
          cleanWords: "千山鸟飞绝万径人踪灭孤舟蓑笠翁独钓寒江雪",
          translation: "重重群山之中鸟儿的身影早已断绝，条条道路之上行人的足迹也已消逝。一叶孤舟上，一位披蓑戴笠的老翁，正独自一人顶着漫天大雪，在冰冷的江面上垂钓。"
        }
      },
      {
        id: "poetry_6",
        worldId: WorldId.TangPoetry,
        name: "第 6 关",
        title: "咏鹅",
        question: "请听写或跟读背诵这首著名的古诗：\n\n《咏鹅》· 骆宾王\n鹅鹅鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。",
        hint: "大白鹅拍着翅膀在清澈的水面上游动。它是怎么叫的呢？又是怎么游的呢？读出欢快的感觉吧！",
        explanation: "《咏鹅》是唐代诗人骆宾王在七岁时创作的著名诗作。全诗通过生动的动态和色彩对比，描绘了大白鹅在水面游乐的可爱形象，充满童趣。",
        correctAnswer: "鹅鹅鹅曲项向天歌白毛浮绿水红掌拨清波",
        data: {
          title: "咏鹅",
          author: "骆宾王",
          dynasty: "唐",
          content: [
            "鹅，鹅，鹅，",
            "曲项向天歌。",
            "白毛浮绿水，",
            "红掌拨清波。"
          ],
          pinyin: [
            "é é é",
            "qū xiàng xiàng tiān gē",
            "bái máo fú lǜ shuǐ",
            "hóng zhǎng bō qīng bō"
          ],
          keywords: ["鹅鹅鹅", "曲项向天歌", "白毛浮绿水", "红掌拨清波"],
          cleanWords: "鹅鹅鹅曲项向天歌白毛浮绿水红掌拨清波",
          translation: "鹅，鹅，鹅！弯曲着脖子朝天欢快地歌唱。洁白的羽毛漂浮在绿水之上，红红的脚掌拨动着清澈的波澜。"
        }
      },
      {
        id: "poetry_7",
        worldId: WorldId.TangPoetry,
        name: "第 7 关",
        title: "相思",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《相思》· 王维\n红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。",
        hint: "红豆代表着深切的思念。春天来了，红豆树长出新枝。希望你多多采摘一些，因为这最能寄托相思之情了。",
        explanation: "《相思》是唐代诗人王维的杰作，借物抒情，通过红豆来寄托对友人的深厚情谊和无限眷恋，含蓄优美，广为传诵。",
        correctAnswer: "红豆生南国春来发几枝愿君多采撷此物最相思",
        data: {
          title: "相思",
          author: "王维",
          dynasty: "唐",
          content: [
            "红豆生南国，",
            "春来发几枝？",
            "愿君多采撷，",
            "此物最相思。"
          ],
          pinyin: [
            "hóng dòu shēng nán guó",
            "chūn lái fā jǐ zhī",
            "yuàn jūn duō cǎi xié",
            "cǐ wù zuì xiāng sī"
          ],
          keywords: ["红豆生南国", "春来发几枝", "愿君多采撷", "此物最相思"],
          cleanWords: "红豆生南国春来发几枝愿君多采撷此物最相思",
          translation: "晶莹鲜红的红豆生长在南方，春天到来时它又会萌发出几缕新枝？希望你能够多多采摘一些红豆，因为红豆最能寄托彼此的思念和情意。"
        }
      },
      {
        id: "poetry_8",
        worldId: WorldId.TangPoetry,
        name: "第 8 关",
        title: "寻隐者不遇",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《寻隐者不遇》· 贾岛\n松下问童子，言师采药去。\n只在此山中，云深不知处。",
        hint: "在松树下询问小徒弟，他说师父去采药了。师父就在这座山里面，可是山高云密，不知道具体在什么地方。",
        explanation: "《寻隐者不遇》是唐代诗人贾岛的作品。全诗通过一问一答，勾勒出了隐者高洁的形象，空灵深远，余味无穷。",
        correctAnswer: "松下问童子言师采药去只在此山中云深不知处",
        data: {
          title: "寻隐者不遇",
          author: "贾岛",
          dynasty: "唐",
          content: [
            "松下问童子，",
            "言师采药去。",
            "只在此山中，",
            "云深不知处。"
          ],
          pinyin: [
            "sōng xià wèn tóng zǐ",
            "yán shī cǎi yào qù",
            "zhǐ zài cǐ shān zhōng",
            "yún shēn bù zhī chù"
          ],
          keywords: ["松下问童子", "言师采药去", "只在此山中", "云深不知处"],
          cleanWords: "松下问童子言师采药去只在此山中云深不知处",
          translation: "苍翠的松树下，我询问隐者的童子，童子说师父已经上山采药去了。他只说就在这座大山里面，可惜山深云雾缭绕，无法知道他究竟身在何处。"
        }
      },
      {
        id: "poetry_9",
        worldId: WorldId.TangPoetry,
        name: "第 9 关",
        title: "鹿柴",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《鹿柴》· 王维\n空山不见人，但闻人语响。\n返景入深林，复照青苔上。",
        hint: "空山不见人，但闻人语响。傍晚落日的余晖穿过茂密的树林，又重新洒照在绿绿的青苔上。",
        explanation: "《鹿柴》是唐代山水田园诗人王维的名作。通过写深林里的声音和光影变化，衬托出空山极其幽静、超凡脱俗的神奇意境。",
        correctAnswer: "空山不见人但闻人语响返景入深林复照青苔上",
        data: {
          title: "鹿柴",
          author: "王维",
          dynasty: "唐",
          content: [
            "空山不见人，",
            "但闻人语响。",
            "返景入深林，",
            "复照青苔上。"
          ],
          pinyin: [
            "kōng shān bù jiàn rén",
            "dàn wén rén yǔ xiǎng",
            "fǎn jǐng rù shēn lín",
            "fù zhào qīng tái shàng"
          ],
          keywords: ["空山不见人", "但闻人语响", "返景入深林", "复照青苔上"],
          cleanWords: "空山不见人单闻人语响返景入深林复照青苔上",
          translation: "在寂静宽广的空山之中看不见一个人影，只有偶尔能听到隐隐约约的说话人声。夕阳的余晖返照斜射进入了茂密幽深的丛林之中，又再一次映照在林地幽暗的绿绿青苔之上。"
        }
      },
      {
        id: "poetry_10",
        worldId: WorldId.TangPoetry,
        name: "第 10 关",
        title: "乐游原",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《乐游原》· 李商隐\n向晚意不适，驱车登古原。\n夕阳无限好，只是近黄昏。",
        hint: "虽然夕阳美得无与伦比，可惜时间已经接近傍晚了。读出对美好景色的珍惜吧！",
        explanation: "《乐游原》是唐代诗人李商隐的登高抒怀诗。最后两句‘夕阳无限好，只是近黄昏’成为了流传千古的名句，饱含对生命的珍惜和哲学思考。",
        correctAnswer: "向晚意不适驱车登古原夕阳无限好只是近黄昏",
        data: {
          title: "乐游原",
          author: "李商隐",
          dynasty: "唐",
          content: [
            "向晚意不适，",
            "驱车登古原。",
            "夕阳无限好，",
            "只是近黄昏。"
          ],
          pinyin: [
            "xiàng wǎn yì bù shì",
            "qū chē dēng gǔ yuán",
            "xī yáng wú xiàn hǎo",
            "zhǐ shì jìn huáng hūn"
          ],
          keywords: ["向晚意不适", "驱车登古原", "夕阳无限好", "只是近黄昏"],
          cleanWords: "向晚意不适驱车登古原夕阳无限好只是近黄昏",
          translation: "傍晚时分心情有些沉郁不适，于是独自驾着车马登上了乐游原古高地。眼前的漫天夕阳绚丽无比，美好到了极点，可惜已经临近黄昏，暮色很快就要来临了。"
        }
      },
      {
        id: "poetry_11",
        worldId: WorldId.TangPoetry,
        name: "第 11 关",
        title: "咏柳",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《咏柳》· 贺知章\n碧玉妆成一树高，万条垂下绿丝绦。\n不知细叶谁裁出，二月春风似剪刀。",
        hint: "二月的春风像一把神奇的剪刀，裁剪出了柳树细嫩的绿叶。多美的春天啊！",
        explanation: "《咏柳》是盛唐诗人贺知章的经典写景诗。全诗通过拟人和比喻手法，歌颂了春天的无限生机与活力。",
        correctAnswer: "碧玉妆成一树高万条垂下绿丝绦不知细叶谁裁出二月春风似剪刀",
        data: {
          title: "咏柳",
          author: "贺知章",
          dynasty: "唐",
          content: [
            "碧玉妆成一树高，",
            "万条垂下绿丝绦。",
            "不知细叶谁裁出，",
            "二月春风似剪刀。"
          ],
          pinyin: [
            "bì yù zhuāng chéng yī shù gāo",
            "wàn tiáo chuí xià lǜ sī tāo",
            "bù zhī xì yè shuí cái chū",
            "èr yuè chūn fēng sì jiǎn dāo"
          ],
          keywords: ["碧玉妆成一树高", "万条垂下绿丝绦", "不知细叶谁裁出", "二月春风似剪刀"],
          cleanWords: "碧玉妆成一树高万条垂下绿丝绦不知细叶谁裁出二月春风似剪刀",
          translation: "高高的柳树好像碧玉妆扮成的一样，下垂的柳枝宛如成千上万条绿色的丝带在随风飘拂。不知道那细嫩的叶子是谁剪裁出来的，原来是二月和煦的春风，就像一把神奇灵巧的剪刀。"
        }
      },
      {
        id: "poetry_12",
        worldId: WorldId.TangPoetry,
        name: "第 12 关",
        title: "回乡偶书",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《回乡偶书》· 贺知章\n少小离家老大回，乡音无改鬓毛衰。\n儿童相见不相识，笑问客从何处来。",
        hint: "诗人年纪很大时才回到故乡。村里的小孩子们都不认识他，笑着问他：‘您是从哪里来的呀？’",
        explanation: "《回乡偶书》是唐代诗人贺知章辞官回乡时写下的著名组诗。诗中通过描写儿童笑问客从何处来的细节，表达了诗人沧桑而深沉的乡愁。",
        correctAnswer: "少小离家老大回乡音无改鬓毛衰儿童相见不相识笑问客从何处来",
        data: {
          title: "回乡偶书",
          author: "贺知章",
          dynasty: "唐",
          content: [
            "少小离家老大回，",
            "乡音无改鬓毛衰。",
            "儿童相见不相识，",
            "笑问客从何处来。"
          ],
          pinyin: [
            "shào xiǎo lí jiā lǎo dà huí",
            "xiāng yīn wú gǎi bìn máo cuī",
            "ér tóng xiāng jiàn bù xiāng shí",
            "xiào wèn kè cóng hé chù lái"
          ],
          keywords: ["少小离家老大回", "乡音无改鬓毛衰", "儿童相见不相识", "笑问客从何处来"],
          cleanWords: "少小离家老大回乡音无改鬓毛衰儿童相见不相识笑问客从何处来",
          translation: "我年少时离开家乡，到了年老时才回来。家乡的口音没有改变，但两鬓的头发已经斑白稀疏。村里的小孩子们看见了我，都不认识我，笑着问我：‘这位客人，您是从哪里来的呀？’"
        }
      },
      {
        id: "poetry_13",
        worldId: WorldId.TangPoetry,
        name: "第 13 关",
        title: "送元二使安西",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《送元二使安西》· 王维\n渭城朝雨浥轻尘，客舍青青柳色新。\n劝君更尽一杯酒，西出阳关无故人。",
        hint: "送别好朋友的经典名篇。再多喝一杯美酒吧，西行出了阳关之后，就再也碰不到熟悉的朋友了。",
        explanation: "《送元二使安西》是唐代山水田园诗人王维的作品，也是古人送别时的经典乐曲《阳关三叠》的歌词。表达了对挚友依依不舍的情谊。",
        correctAnswer: "渭城朝雨浥轻尘客舍青青柳色新劝君更尽一杯酒西出阳关无故人",
        data: {
          title: "送元二使安西",
          author: "王维",
          dynasty: "唐",
          content: [
            "渭城朝雨浥轻尘，",
            "客舍青青柳色新。",
            "劝君更尽一杯酒，",
            "西出阳关无故人。"
          ],
          pinyin: [
            "wèi chéng zhāo yǔ yì qīng chén",
            "kè shè qīng qīng liǔ sè xīn",
            "quàn jūn gèng jìn yī bēi jiǔ",
            "xī chū yáng guān wú gù rén"
          ],
          keywords: ["渭城朝雨浥轻尘", "客舍青青柳色新", "劝君更尽一杯酒", "西出阳关无故人"],
          cleanWords: "渭城朝雨浥轻尘客舍青青柳色新劝君更尽一杯酒西出阳关无故人",
          translation: "清晨，渭城的一场春雨湿润了路上的浮尘。旅舍在雨后显得格外青翠，柳树也换上了崭新的绿装。劝你再多喝尽这杯酒吧，等出了阳关往西走，就再也没有相识的亲朋故友了。"
        }
      },
      {
        id: "poetry_14",
        worldId: WorldId.TangPoetry,
        name: "第 14 关",
        title: "黄鹤楼送孟浩然之广陵",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《黄鹤楼送孟浩然之广陵》· 李白\n故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。",
        hint: "李白送别好友孟浩然前往繁华的扬州。望着孤帆远去，一直消失在水天交界处。",
        explanation: "这是李白为孟浩然写下的千古送别诗。描绘了长江三月繁花似锦的明媚春光和诗人的款款深情，意境辽阔而优美。",
        correctAnswer: "故人西辞黄鹤楼烟花三月下扬州孤帆远影碧空尽唯见长江天际流",
        data: {
          title: "黄鹤楼送孟浩然之广陵",
          author: "李白",
          dynasty: "唐",
          content: [
            "故人西辞黄鹤楼，",
            "烟花三月下扬州。",
            "孤帆远影碧空尽，",
            "唯见长江天际流。"
          ],
          pinyin: [
            "gù rén xī cí huáng hè lóu",
            "yān huā sān yuè xià yáng zhōu",
            "gū fān yuǎn yǐng bì kōng jìn",
            "wéi jiàn cháng jiāng tiān jì liú"
          ],
          keywords: ["故人西辞黄鹤楼", "烟花三月下扬州", "孤帆远影碧空尽", "唯见长江天际流"],
          cleanWords: "故人西辞黄鹤楼烟花三月下扬州孤帆远影碧空尽唯见长江天际流",
          translation: "老朋友告别了西边的黄鹤楼，在这柳絮如烟、繁花似锦的三月，乘船东下前往扬州。那孤单的船帆在远方的碧空中渐渐隐去，直至完全消失，只看见浩浩荡荡的长江水向天边奔流。"
        }
      },
      {
        id: "poetry_15",
        worldId: WorldId.TangPoetry,
        name: "第 15 关",
        title: "早发白帝城",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《早发白帝城》· 李白\n朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。",
        hint: "两岸猿猴的叫声还在耳边回荡，轻快的小船早就穿过了万重崇山峻岭，速度极快！",
        explanation: "《早发白帝城》是李白被赦免后乘船顺江东下时写的。全诗意境欢快、急促而富有动感，充分表达了诗人重获自由时的欢愉心情。",
        correctAnswer: "朝辞白帝彩云间千里江陵一日还两岸猿声啼不住轻舟已过万重山",
        data: {
          title: "早发白帝城",
          author: "李白",
          dynasty: "唐",
          content: [
            "朝辞白帝彩云间，",
            "千里江陵一日还。",
            "两岸猿声啼不住，",
            "轻舟已过万重山。"
          ],
          pinyin: [
            "zhāo cí bái dì cǎi yún jiān",
            "qiān lǐ jiāng líng yī rì huán",
            "liǎng àn yuán shēng tí bù zhù",
            "qīng zhōu yǐ guò wàn chóng shān"
          ],
          keywords: ["朝辞白帝彩云间", "千里江陵一日还", "两岸猿声啼不住", "轻舟已过万重山"],
          cleanWords: "朝辞白帝彩云间千里江陵一日还两岸猿声啼不住轻舟已过万重山",
          translation: "清晨告别了高入彩云之中的白帝城，远在千里的江陵只要一天的时间就可以到达。长江两岸猿猴的啼叫声还在耳边不断回响，轻快的小船早就已经穿过了万重叠起的群山。"
        }
      },
      {
        id: "poetry_16",
        worldId: WorldId.TangPoetry,
        name: "第 16 关",
        title: "望庐山瀑布",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《望庐山瀑布》· 李白\n日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。",
        hint: "那雄伟的瀑布飞泻直下，真让人怀疑是不是天上的银河落到了人间呢！",
        explanation: "《望庐山瀑布》是李白创作的艺术杰作。诗中用夸张而神奇的想象描绘了庐山瀑布倾泻而下的磅礴气势，充满浪漫主义色彩。",
        correctAnswer: "日照香炉生紫烟遥看瀑布挂前川飞流直下三千尺疑是银河落九天",
        data: {
          title: "望庐山瀑布",
          author: "李白",
          dynasty: "唐",
          content: [
            "日照香炉生紫烟，",
            "遥看瀑布挂前川。",
            "飞流直下三千尺，",
            "疑是银河落九天。"
          ],
          pinyin: [
            "rì zhào xiāng lú shēng zǐ yān",
            "yáo kàn pù bù guà qián chuān",
            "fēi liú zhí xià sān qiān chǐ",
            "yí shì yín hé luò jiǔ tiān"
          ],
          keywords: ["日照香炉生紫烟", "遥看瀑布挂前川", "飞流直下三千尺", "疑是银河落九天"],
          cleanWords: "日照香炉生紫烟遥看瀑布挂前川飞流直下三千尺疑是银河落九天",
          translation: "太阳照射在香炉峰上，升腾起一片紫色的云烟，远远望去，飞流直下的瀑布就像一条巨大的白河挂在山川前。高耸的泉水飞速泻下好像有三千尺长，真叫人怀疑是美丽的银河从九天之上落入凡尘。"
        }
      },
      {
        id: "poetry_17",
        worldId: WorldId.TangPoetry,
        name: "第 17 关",
        title: "赠汪伦",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赠汪伦》· 李白\n李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。",
        hint: "就算桃花潭的水有千尺那么深，也比不上汪伦送我的深情厚谊啊！",
        explanation: "《赠汪伦》是李白写给好友汪伦的送别诗。全诗感情真挚，将深厚、抽象的友情比作清澈的桃花潭水，朴素自然而极其感人。",
        correctAnswer: "李白乘舟将欲行忽闻岸上踏歌声桃花潭水深千尺不及汪伦送我情",
        data: {
          title: "赠汪伦",
          author: "李白",
          dynasty: "唐",
          content: [
            "李白乘舟将欲行，",
            "忽闻岸上踏歌声。",
            "桃花潭水深千尺，",
            "不及汪伦送我情。"
          ],
          pinyin: [
            "lǐ bái chéng zhōu jiāng yù xíng",
            "hū wén àn shàng tà gē shēng",
            "táo huā tán shuǐ shēn qiān chǐ",
            "bù jí wāng lún sòng wǒ qíng"
          ],
          keywords: ["李白乘舟将欲行", "忽闻岸上踏歌声", "桃花潭水深千尺", "不及汪伦送我情"],
          cleanWords: "李白乘舟将欲行忽闻岸上踏歌声桃花潭水深千尺不及汪伦送我情",
          translation: "我李白正坐上小船准备出发远行，忽然听到岸上传来一边踏着步子一边唱歌的声音。即使桃花潭的水有上千尺那么深，也比不上汪伦特地来送我的深重情谊。"
        }
      },
      {
        id: "poetry_18",
        worldId: WorldId.TangPoetry,
        name: "第 18 关",
        title: "绝句",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《绝句》· 杜甫\n两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。",
        hint: "春天的景致：黄鹂鸟在翠绿的柳枝上唱歌，一排白鹭鸟飞上了蓝天，窗外是高山积雪，门前停泊着小船。",
        explanation: "《绝句》是唐代诗圣杜甫在成都草堂写下的即景小诗。全诗色彩鲜明，动静结合，勾勒出一幅开阔舒畅、生机盎然的初春画卷。",
        correctAnswer: "两个黄鹂鸣翠柳一行白鹭上青天窗含西岭千秋雪门泊东吴万里船",
        data: {
          title: "绝句",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "两个黄鹂鸣翠柳，",
            "一行白鹭上青天。",
            "窗含西岭千秋雪，",
            "门泊东吴万里船。"
          ],
          pinyin: [
            "liǎng gè huáng lí míng cuì liǔ",
            "yī háng bái lù shàng qīng tiān",
            "chuāng hán xī lǐng qiān qiū xuě",
            "mén bó dōng wú wàn lǐ chuán"
          ],
          keywords: ["两个黄鹂鸣翠柳", "一行白鹭上青天", "窗含西岭千秋雪", "门泊东吴万里船"],
          cleanWords: "两个黄鹂鸣翠柳一行白鹭上青天窗含西岭千秋雪门泊东吴万里船",
          translation: "两只活泼的黄鹂鸟在翠绿的柳树间婉转啼鸣，一队整齐的白鹭展翅飞上了青天。窗框里好像镶嵌着西岭山顶千万年不化的积雪，大门前停泊着要航行到万里之外东吴的客船。"
        }
      },
      {
        id: "poetry_19",
        worldId: WorldId.TangPoetry,
        name: "第 19 关",
        title: "春夜喜雨",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《春夜喜雨》· 杜甫\n好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。",
        hint: "春雨在夜里随着微风悄悄来到，细细地下着，滋润着大地上所有的植物，一点声音也没有。",
        explanation: "《春夜喜雨》是杜甫在成都草堂期间创作的名作。全诗巧妙运用拟人化手法，极为细致地描绘了夜雨的神态，表达了对春雨无私奉献的喜悦和赞美之情。",
        correctAnswer: "好雨知时节当春乃发生随风潜入夜润物细无声",
        data: {
          title: "春夜喜雨",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "好雨知时节，",
            "当春乃发生。",
            "随风潜入夜，",
            "润物细无声。"
          ],
          pinyin: [
            "hǎo yǔ zhī shí jié",
            "dāng chūn nǎi fā shēng",
            "suí fēng qián rù yè",
            "rùn wù xì wú shēng"
          ],
          keywords: ["好雨知时节", "当春乃发生", "随风潜入夜", "润物细无声"],
          cleanWords: "好雨知时节当春乃发生随风潜入夜润物细无声",
          translation: "好雨似乎懂得适应时节，一到春天它就适时降临、开始滋润。伴随着微风它在夜里悄悄地落下来，轻柔细密，无声无息地滋润着世间万物。"
        }
      },
      {
        id: "poetry_20",
        worldId: WorldId.TangPoetry,
        name: "第 20 关",
        title: "游子吟",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《游子吟》· 孟郊\n慈母手中线，游子身上衣。\n临行密密缝，意恐迟迟归。\n谁言寸草心，报得三春晖。",
        hint: "母爱最伟大！谁说像小草一样的儿女孝心，能报答得了像春天的阳光一样温暖而广博的母爱呢？",
        explanation: "《游子吟》是唐代诗人孟郊创作的一首著名的五言古诗。全诗通过细腻温馨的日常细节，歌颂了伟大无私的母爱，千百年来感动了无数人。",
        correctAnswer: "慈母手中线游子身上衣临行密密缝意恐迟迟归谁言寸草心报得三春晖",
        data: {
          title: "游子吟",
          author: "孟郊",
          dynasty: "唐",
          content: [
            "慈母手中线，",
            "游子身上衣。",
            "临行密密缝，",
            "意恐迟迟归。",
            "谁言寸草心，",
            "报得三春晖。"
          ],
          pinyin: [
            "cí mǔ shǒu zhōng xiàn",
            "yóu zǐ shēn shàng yī",
            "lín xíng mì mì féng",
            "yì kǒng chí chí guī",
            "shuí yán cùn cǎo xīn",
            "bào dé sān chūn huī"
          ],
          keywords: ["慈母手中线", "游子身上衣", "临行密密缝", "意恐迟迟归", "谁言寸草心", "报得三春晖"],
          cleanWords: "慈母手中线游子身上衣临行密密缝意恐迟迟归谁言寸草心报得三春晖",
          translation: "慈祥的母亲手里拿着针线，在为即将远行的儿子缝制身上的衣服。临行前她一针一针细密地缝补，心里只担心儿子出门在外面会耽搁很久、迟迟不能回家。谁说像小草一样微弱的儿女孝心，能够报答得了像春天太阳光辉一样深厚广大的母爱呢？"
        }
      },
      {
        id: "poetry_21",
        worldId: WorldId.TangPoetry,
        name: "第 21 关",
        title: "清明",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《清明》· 杜牧\n清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有，牧童遥指杏花村。",
        hint: "清明时节下起了纷纷细雨。诗人问哪儿有歇脚喝酒的地方？放牛的牧童远远地指向了美丽的杏花村。",
        explanation: "《清明》是唐代诗人杜牧的作品。诗中通过生动的对话和情景交融的手法，描绘出了一幅清明春雨图，千古流传，韵味悠长。",
        correctAnswer: "清明时节雨纷纷路上行人欲断魂借问酒家何处有牧童遥指杏花村",
        data: {
          title: "清明",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "清明时节雨纷纷，",
            "路上行人欲断魂。",
            "借问酒家何处有？",
            "牧童遥指杏花村。"
          ],
          pinyin: [
            "qīng míng shí jié yǔ fēn fēn",
            "lù shàng xíng rén yù duàn hún",
            "jiè wèn jiǔ jiā hé chù yǒu",
            "mù tóng yáo zhǐ xìng huā cūn"
          ],
          keywords: ["清明时节雨纷纷", "路上行人欲断魂", "借问酒家何处有", "牧童遥指杏花村"],
          cleanWords: "清明时节雨纷纷路上行人欲断魂借问酒家何处有牧童遥指杏花村",
          translation: "清明时节春雨连绵不断，路上的行人在细雨中行走，心情显得凄迷而忧伤。借问一下附近哪里有歇息的酒家呢？放牛的牧童面带微笑，远远地指向了开满杏花的村庄。"
        }
      },
      {
        id: "poetry_22",
        worldId: WorldId.TangPoetry,
        name: "第 22 关",
        title: "山行",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《山行》· 杜牧\n远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。",
        hint: "深秋时节，枫叶红得比二月的春花还要鲜艳、还要美丽！让人忍不住停下马车来观赏。",
        explanation: "《山行》是杜牧的著名山水写景诗。全诗通过对寒山、石径、白云、枫林的生动刻画，展现了秋天生机勃勃、火红明丽的美丽风光。",
        correctAnswer: "远上寒山石径斜白云生处有人家停车坐爱枫林晚霜叶红于二月花",
        data: {
          title: "山行",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "远上寒山石径斜，",
            "白云生处有人家。",
            "停车坐爱枫林晚，",
            "霜叶红于二月花。"
          ],
          pinyin: [
            "yuǎn shàng hán shān shí jìng xié",
            "bái yún shēng chù yǒu rén jiā",
            "tíng chē zuò ài fēng lín wǎn",
            "shuāng yè hóng yú èr yuè huā"
          ],
          keywords: ["远上寒山石径斜", "白云生处有人家", "停车坐爱枫林晚", "霜叶红于二月花"],
          cleanWords: "远上寒山石径斜白云生处有人家停车坐爱枫林晚霜叶红于二月花",
          translation: "一条弯弯曲曲的石头小路远远地向秋天的寒山深处延伸，在那白云翻滚升腾的地方隐隐约约有几户人家。我不由得停下车来，是因为喜爱这傍晚时分美丽的红枫林，经霜的枫叶比二月的春花还要鲜红娇艳。"
        }
      },
      {
        id: "poetry_23",
        worldId: WorldId.TangPoetry,
        name: "第 23 关",
        title: "九月九日忆山东兄弟",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《九月九日忆山东兄弟》· 王维\n独在异乡为异客，每逢佳节倍思亲。\n遥知兄弟登高处，遍插茱萸少一人。",
        hint: "每当遇到美好的节日，就会更加思念家乡的亲人。这就是‘每逢佳节倍思亲’哦！",
        explanation: "《九月九日忆山东兄弟》是唐代诗人王维在重阳节思念家人时写的。其中的‘每逢佳节倍思亲’已经成为中国人思乡念亲最经典的诗句。",
        correctAnswer: "独在异乡为异客每逢佳节倍思亲遥知兄弟登高处遍插茱萸少一人",
        data: {
          title: "九月九日忆山东兄弟",
          author: "王维",
          dynasty: "唐",
          content: [
            "独在异乡为异客，",
            "每逢佳节倍思亲。",
            "遥知兄弟登高处，",
            "遍插茱萸少一人。"
          ],
          pinyin: [
            "dú zài yì xiāng wéi yì kè",
            "měi féng jiā jié bèi sī qīn",
            "yáo zhī xiōng dì dēng gāo chù",
            "biàn chā zhū yú shǎo yī rén"
          ],
          keywords: ["独在异乡为异客", "每逢佳节倍思亲", "遥知兄弟登高处", "遍插茱萸少一人"],
          cleanWords: "独在异乡为异客每逢佳节倍思亲遥知兄弟登高处遍插茱萸少一人",
          translation: "我独自一人在他乡做客，每当遇到重阳这样的传统佳节时，就更加百倍地思念起远方的亲人。远远地想到兄弟们今天一定在登高祈福，大家都插上了茱萸，可惜就只少了我一个人。"
        }
      },
      {
        id: "poetry_24",
        worldId: WorldId.TangPoetry,
        name: "第 24 关",
        title: "江南春",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《江南春》· 杜牧\n千里莺啼绿映红，水村山郭酒旗风。\n南朝四百八十寺，多少楼台烟雨中。",
        hint: "江南美丽的春天：到处都有黄莺唱歌，红花绿树相映。依水而建的村庄和依山而筑的城郭，酒旗在春风中飘扬。",
        explanation: "《江南春》是唐代诗人杜牧创作的一首七言绝句。全诗不仅描绘了江南春光的明媚秀丽，也流露出了对历史沧桑的深沉感慨。",
        correctAnswer: "千里莺啼绿映红水村山郭酒旗风南朝四百八十寺多少楼台烟雨中",
        data: {
          title: "江南春",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "千里莺啼绿映红，",
            "水村山郭酒旗风。",
            "南朝四百八十寺，",
            "多少楼台烟雨中。"
          ],
          pinyin: [
            "qiān lǐ yīng tí lǜ yìng hóng",
            "shuǐ cūn shān guō jiǔ qí fēng",
            "nán cháo sì bǎi bā shí sì",
            "duō shǎo lóu tái yān yǔ zhōng"
          ],
          keywords: ["千里莺啼绿映红", "水村山郭酒旗风", "南朝四百八十寺", "多少楼台烟雨中"],
          cleanWords: "千里莺啼绿映红水村山郭酒旗风南朝四百八十寺多少楼台烟雨中",
          translation: "辽阔的江南到处是一片莺歌燕舞、绿叶映衬红花的春意。临水的村庄、依山的城郭，酒家的旗子在春风中迎风招展。南朝遗留下来数以百计的古老寺庙，如今有多少楼台楼阁，正静静地矗立在朦胧迷茫的细雨之中。"
        }
      },
      {
        id: "poetry_25",
        worldId: WorldId.TangPoetry,
        name: "第 25 关",
        title: "枫桥夜泊",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《枫桥夜泊》· 张继\n月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。",
        hint: "夜晚降临，月亮落下，乌鸦啼叫。在这寂静冰凉的夜里，寒山寺悠扬的钟声传到了客船上。",
        explanation: "《枫桥夜泊》是唐代诗人张继的名篇。诗歌通过描绘月落、乌啼、寒霜、江枫、渔火、古寺与钟声等一系列意象，将江南水乡的秋夜幽寂展现得淋漓尽致。",
        correctAnswer: "月落乌啼霜满天江枫渔火对愁眠姑苏城外寒山寺夜半钟声到客船",
        data: {
          title: "枫桥夜泊",
          author: "张继",
          dynasty: "唐",
          content: [
            "月落乌啼霜满天，",
            "江枫渔火对愁眠。",
            "姑苏城外寒山寺，",
            "夜半钟声到客船。"
          ],
          pinyin: [
            "yuè luò wū tí shuāng mǎn tiān",
            "jiāng fēng yú huǒ duì chóu mián",
            "gū sū chéng wài hán shān sì",
            "yè bàn zhōng shēng dào kè chuán"
          ],
          keywords: ["月落乌啼霜满天", "江枫渔火对愁眠", "姑苏城外寒山寺", "夜半钟声到客船"],
          cleanWords: "月落乌啼霜满天江枫渔火对愁眠姑苏城外寒山寺夜半钟声到客船",
          translation: "月亮已经落下，乌鸦不时啼叫，天空中弥漫着冰冷的秋霜。面对着江边的枫树和渔船上的点点灯火，我满怀旅途的忧愁，久久不能入眠。姑苏城外静静矗立的寒山古寺中，半夜里悠扬的钟声，一下一下地传到了我这系泊在岸边的客船上。"
        }
      },
      {
        id: "poetry_26",
        worldId: WorldId.TangPoetry,
        name: "第 26 关",
        title: "江畔独步寻花",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《江畔独步寻花》· 杜甫\n黄四娘家花满蹊，千朵万朵压枝低。\n留连戏蝶时时舞，自在娇莺恰恰啼。",
        hint: "描写春天繁花盛开、莺歌燕舞的美景。快来和美丽的戏蝶与娇莺一起朗读吧！",
        explanation: "《江畔独步寻花》是唐代大诗人杜甫在成都草堂期间写的组诗作品。此诗描绘了春暖花开、春意盎然的生机景象。",
        correctAnswer: "黄四娘家花满蹊千朵万朵压枝低留连戏蝶时时舞自在娇莺恰恰啼",
        data: {
          title: "江畔独步寻花",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "黄四娘家花满蹊，",
            "千朵万朵压枝低。",
            "留连戏蝶时时舞，",
            "自在娇莺恰恰啼。"
          ],
          pinyin: [
            "huáng sì niáng jiā huā mǎn qī",
            "qiān duǒ wàn duǒ yā zhī dī",
            "liú lián xì dié shí shí wǔ",
            "zì zài jiāo yīng qià qià tí"
          ],
          keywords: ["黄四娘家花满蹊", "千朵万朵压枝低", "留连戏蝶时时舞", "自在娇莺恰恰啼"],
          cleanWords: "黄四娘家花满蹊千朵万朵压枝低留连戏蝶时时舞自在娇莺恰恰啼",
          translation: "黄四娘家的小路上开满了鲜花，千朵万朵鲜花把枝条都压得低垂下来。嬉戏的蝴蝶依恋不舍地在花间时时起舞，自由自在的小黄莺在枝头发出动听的啼鸣。"
        }
      },
      {
        id: "poetry_27",
        worldId: WorldId.TangPoetry,
        name: "第 27 关",
        title: "古朗月行",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《古朗月行》(节选) · 李白\n小时不识月，呼作白玉盘。\n又疑瑶台镜，飞在青云端。",
        hint: "把月亮比喻成‘白玉盘’和‘瑶台镜’，这是李白童年时对月亮充满童趣的想象哦！",
        explanation: "《古朗月行》是李白借乐府旧题创作的名篇。这四句节选极为出名，生动活泼地写出了儿童对明月的天然直觉和天真想象。",
        correctAnswer: "小时不识月呼作白玉盘又疑瑶台镜飞在青云端",
        data: {
          title: "古朗月行",
          author: "李白",
          dynasty: "唐",
          content: [
            "小时不识月，",
            "呼作白玉盘。",
            "又疑瑶台镜，",
            "飞在青云端。"
          ],
          pinyin: [
            "xiǎo shí bù shí yuè",
            "hū zuò bái yù pán",
            "yòu yí yáo tái jìng",
            "fēi zài qīng yún duān"
          ],
          keywords: ["小时不识月", "呼作白玉盘", "又疑瑶台镜", "飞在青云端"],
          cleanWords: "小时不识月呼作白玉盘又疑瑶台镜飞在青云端",
          translation: "小时候不认识月亮，把它叫作白玉雕琢的盘子。又怀疑它是仙人瑶台上的镜子，飞到了青色的云彩中。"
        }
      },
      {
        id: "poetry_28",
        worldId: WorldId.TangPoetry,
        name: "第 28 关",
        title: "池上",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《池上》· 白居易\n小娃撑小艇，偷采白莲回。\n不解藏踪迹，浮萍一道开。",
        hint: "小娃娃撑着船采了白莲花，却不知道隐藏踪迹，小船在水面的浮萍上划开了一道绿色的水路，太好玩了！",
        explanation: "《池上》是唐代诗人白居易创作的经典诗作。全诗语言质朴，极为传神地刻画了一个天真烂漫、活泼可爱的孩童形象。",
        correctAnswer: "小娃撑小艇偷采白莲回不解藏踪迹浮萍一道开",
        data: {
          title: "池上",
          author: "白居易",
          dynasty: "唐",
          content: [
            "小娃撑小艇，",
            "偷采白莲回。",
            "不解藏踪迹，",
            "浮萍一道开。"
          ],
          pinyin: [
            "xiǎo wá chēng xiǎo tǐng",
            "tōu cǎi bái lián huí",
            "bù jiě cáng zōng jì",
            "fú píng yī dào kāi"
          ],
          keywords: ["小娃撑小艇", "偷采白莲回", "不解藏踪迹", "浮萍一道开"],
          cleanWords: "小娃撑小艇偷采白莲回不解藏踪迹浮萍一道开",
          translation: "一个小娃娃撑着小船，偷偷地去采摘白色的莲花。他不懂得怎么隐藏自己的踪迹，小船划过之处，绿色的浮萍被劈开，留下了一道长长的水路。"
        }
      },
      {
        id: "poetry_29",
        worldId: WorldId.TangPoetry,
        name: "第 29 关",
        title: "小儿垂钓",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《小儿垂钓》· 胡令能\n蓬头稚子学垂纶，侧坐莓苔草映身。\n路人借问遥招手，怕得鱼惊不应人。",
        hint: "小孩在专心地学钓鱼。路人向他问路，他老远就摆摆手，因为怕声音把鱼儿吓跑，真是一个专注的小钓手！",
        explanation: "《小儿垂钓》是唐代诗人胡令能创作的一首脍炙人口的五言绝句。诗中刻画了一个专心致志、稚气可爱的垂钓儿童形象。",
        correctAnswer: "蓬头稚子学垂纶侧坐莓苔草映身路人借问遥招手怕得鱼惊不应人",
        data: {
          title: "小儿垂钓",
          author: "胡令能",
          dynasty: "唐",
          content: [
            "蓬头稚子学垂纶，",
            "侧坐莓苔草映身。",
            "路人借问遥招手，",
            "怕得鱼惊不应人。"
          ],
          pinyin: [
            "péng tóu zhì zǐ xué chuí lún",
            "cè zuò méi tái cǎo yìng shēn",
            "lù rén jiè wèn yáo zhāo shǒu",
            "pà dé yú jīng bù yìng rén"
          ],
          keywords: ["蓬头稚子学垂纶", "侧坐莓苔草映身", "路人借问遥招手", "怕得鱼惊不应人"],
          cleanWords: "蓬头稚子学垂纶侧坐莓苔草映身路人借问遥招手怕得鱼惊不应人",
          translation: "一个头发乱蓬蓬的小孩在学着钓鱼，他侧身坐在青苔上，身子掩映在野草丛中。听到过路人向他问路，他远远地招招手，因为害怕惊动了水里的鱼儿，不敢出声答应。"
        }
      },
      {
        id: "poetry_30",
        worldId: WorldId.TangPoetry,
        name: "第 30 关",
        title: "塞下曲",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《塞下曲》· 卢纶\n月黑雁飞高，单于夜遁逃。\n欲将轻骑逐，大雪满弓刀。",
        hint: "边防将士英勇无畏！在昏暗冰冷的大雪天里，他们拿起洒满飞雪的弓和刀，威武地追击敌人！",
        explanation: "《塞下曲》是唐代边塞诗人卢纶组诗作品中的第三首。描写边防将士们在严寒的漫天大雪中，奋勇直追遁逃之敌的无畏英雄气概。",
        correctAnswer: "月黑雁飞高单于夜遁逃欲将轻骑逐大雪满弓刀",
        data: {
          title: "塞下曲",
          author: "卢纶",
          dynasty: "唐",
          content: [
            "月黑雁飞高，",
            "单于夜遁逃。",
            "欲将轻骑逐，",
            "大雪满弓刀。"
          ],
          pinyin: [
            "yuè hēi yàn fēi gāo",
            "chán yú yè dùn táo",
            "yù jiāng qīng qí zhú",
            "dà xuě mǎn gōng dāo"
          ],
          keywords: ["月黑雁飞高", "单于夜遁逃", "欲将轻骑逐", "大雪满弓刀"],
          cleanWords: "月黑雁飞高单于夜遁逃欲将轻骑逐大雪满弓刀",
          translation: "夜色漆黑一片，大雁飞得很高，敌军的首领趁着夜色仓皇逃跑。将军正准备率领轻装骑兵向前追击，漫天大雪飘落，已经洒满了行军将士的弓和刀。"
        }
      },
      {
        id: "poetry_31",
        worldId: WorldId.TangPoetry,
        name: "第 31 关",
        title: "赤壁",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赤壁》· 杜牧\n折戟沉沙铁未销，自将磨洗认前朝。\n东风不与周郎便，铜雀春深锁二乔。",
        hint: "‘东风不与周郎便，铜雀春深锁二乔’。如果当年的东风不给周瑜方便，大乔和小乔恐怕就要被曹操锁在铜雀台了。",
        explanation: "《赤壁》是唐代诗人杜牧创作的一首七言绝句。此诗借一件古兵器，折射出三国时期的赤壁大战，进而抒发自己对历史盛衰的慨叹，以及对机遇的哲理反思。",
        correctAnswer: "折戟沉沙铁未销自将磨洗认前朝东风不与周郎便铜雀春深锁二乔",
        data: {
          title: "赤壁",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "折戟沉沙铁未销，",
            "自将磨洗认前朝。",
            "东风不与周郎便，",
            "铜雀春深锁二乔。"
          ],
          pinyin: [
            "zhé jǐ chén shā tiě wèi xiāo",
            "zì jiāng mó xǐ rèn qián cháo",
            "dōng fēng bù yǔ zhōu láng biàn",
            "tóng qiè chūn shēn suǒ èr qiáo"
          ],
          keywords: ["折戟沉沙铁未销", "自将磨洗认前朝", "东风不与周郎便", "铜雀春深锁二乔"],
          cleanWords: "折戟沉沙铁未销自将磨洗认前朝东风不与周郎便铜雀春深锁二乔",
          translation: "一折断的铁戟沉没在泥沙中、至今铁质还没有完全锈烂，我把它拿起来磨洗干净，认出它是前朝赤壁大战时的遗物。假若当年东风不给周瑜方便、借他大火，曹操夺取了江南，那东吴的大乔和小乔，恐怕早就被锁在铜雀台深处、供人取乐了。"
        }
      },
      {
        id: "poetry_32",
        worldId: WorldId.TangPoetry,
        name: "第 32 关",
        title: "八阵图",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《八阵图》· 杜甫\n功盖三分国，名成八阵图。\n江流石不转，遗恨失吞吴。",
        hint: "‘功盖三分国，名成八阵图’！这是杜甫赞美三国蜀相诸葛亮丰功伟绩和经天纬地才华的名作。",
        explanation: "《八阵图》是杜甫游历夔州时瞻仰武侯八阵图遗址后写下的怀古诗。通过对八阵图奇特遗迹的咏叹，高度赞扬了诸葛亮的盖世功勋和政治军事才能，寄托了深沉的惋惜之情。",
        correctAnswer: "功盖三分国名成八阵图江流石不转遗恨失吞吴",
        data: {
          title: "八阵图",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "功盖三分国，",
            "名成八阵图。",
            "江流石不转，",
            "遗恨失吞吴。"
          ],
          pinyin: [
            "gōng gài sān fēn guó",
            "míng chéng bā zhèn tú",
            "jiāng liú shí bù zhuǎn",
            "yí hèn shī tūn wú"
          ],
          keywords: ["功盖三分国", "名成八阵图", "江流石不转", "遗恨失吞吴"],
          cleanWords: "功盖三分国名成八阵图江流石不转遗恨失吞吴",
          translation: "诸葛亮的丰功伟绩冠绝三国时代，创立了神奇的名垂千古的八阵图。即使江水滚滚流逝、阵图上的石头也依然屹立不转；最让人深感遗憾和遗恨的，就是当年蜀汉失策、出兵吞并东吴导致元气大伤、未能一统天下。"
        }
      },
      {
        id: "poetry_33",
        worldId: WorldId.TangPoetry,
        name: "第 33 关",
        title: "终南望余雪",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《终南望余雪》· 祖咏\n终南阴岭秀，积雪浮云端。\n林表明霁色，城中增暮寒。",
        hint: "‘林表明霁色，城中增暮寒’。夕阳照耀在终南山的皑皑积雪上，折射出雨过天晴的美丽景色，然而长安城里的人们却感受到了傍晚的丝丝寒意。",
        explanation: "《终南望余雪》是一首经典的咏雪诗。据传是作者参加科举考试时，只写了这四句便交卷了，认为意境已尽，成为科场与文学史上的佳话。",
        correctAnswer: "终南阴岭秀积雪浮云端林表明霁色城中增暮寒",
        data: {
          title: "终南望余雪",
          author: "祖咏",
          dynasty: "唐",
          content: [
            "终南阴岭秀，",
            "积雪浮云端。",
            "林表明霁色，",
            "城中增暮寒。"
          ],
          pinyin: [
            "zhōng nán yīn lǐng xiù",
            "jī xuě fú yún duān",
            "lín biǎo míng jì sè",
            "chéng zhōng zēng mù hán"
          ],
          keywords: ["终南阴岭秀", "积雪浮云端", "林表明霁色", "城中增暮寒"],
          cleanWords: "终南阴岭秀积雪浮云端林表明霁色城中增暮寒",
          translation: "终南山北坡的景致清幽秀丽，山顶洁白的积雪好像漂浮在云端。天晴后夕阳将余晖洒在林梢树顶，显得格外的明亮；长安城里的人们却能感觉到傍晚的寒气更加逼人。"
        }
      },
      {
        id: "poetry_34",
        worldId: WorldId.TangPoetry,
        name: "第 34 关",
        title: "听弹琴",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《听弹琴》· 刘长卿\n泠泠七弦上，静听松风寒。\n古调虽自爱，今人多不弹。",
        hint: "‘古调虽自爱，今人多不弹’。高雅古朴的琴声！感叹知音难寻、古朴典雅的传统事物日渐被世人冷落的落寞心情。",
        explanation: "《听弹琴》是唐代诗人刘长卿的作品。通过写听琴声时产生的凄清寒冷之感，以及对古调不为人弹的叹息，表达了诗人孤芳自赏、渴望知音的心境。",
        correctAnswer: "泠泠七弦上静听松风寒古调虽自爱今人多不弹",
        data: {
          title: "听弹琴",
          author: "刘长卿",
          dynasty: "唐",
          content: [
            "泠泠七弦上，",
            "静听松风寒。",
            "古调虽自爱，",
            "今人多不弹。"
          ],
          pinyin: [
            "líng líng qī xián shàng",
            "jìng tīng sōng fēng hán",
            "gǔ diào suī zì ài",
            "jīn rén duō bù tán"
          ],
          keywords: ["泠泠七弦上", "静听松风寒", "古调虽自爱", "今人多不弹"],
          cleanWords: "泠泠七弦上静听松风寒古调虽自爱今人多不弹",
          translation: "悠扬、清脆的琴声从七弦琴上缓缓流淌出来，静静聆听，琴声仿佛带着松林古风般清冷凄寒的意境。虽然我自己非常喜爱这高雅古朴的曲调，可惜现在的世俗之人已经大多不会去弹奏它了。"
        }
      },
      {
        id: "poetry_35",
        worldId: WorldId.TangPoetry,
        name: "第 35 关",
        title: "马诗二十三首·其五",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《马诗二十三首·其五》· 李贺\n大漠沙如雪，燕山月似钩。\n何当金络脑，快走踏清秋。",
        hint: "‘何当金络脑，快走踏清秋’！大漠如雪，新月如钩。抒发了诗人渴望早日建功立业、报效国家的远大理想和雄心壮志。",
        explanation: "《马诗二三首》是‘诗鬼’李贺的杰作。诗中借一匹渴望系上金络脑、在秋风原野上尽情奔驰的骏马，含蓄表达了诗人渴望一展宏图、报国无门的感伤与期望。",
        correctAnswer: "大漠沙如雪燕山月似钩何当金络脑快走踏清秋",
        data: {
          title: "马诗二十三首·其五",
          author: "李贺",
          dynasty: "唐",
          content: [
            "大漠沙如雪，",
            "燕山月似钩。",
            "何当金络脑，",
            "快走踏清秋。"
          ],
          pinyin: [
            "dà mò shā rú xuě",
            "yàn shān yuè sì gōu",
            "hé dāng jīn luò nǎo",
            "kuài zǒu tà qīng qiū"
          ],
          keywords: ["大漠沙如雪", "燕山月似钩", "何当金络脑", "快走踏清秋"],
          cleanWords: "大漠沙如雪燕山月似钩何当金络脑快走踏清秋",
          translation: "无边无际的广阔大漠里，沙尘白茫茫得就像是霜雪；巍巍燕山之上，一弯新月斜斜高挂、晶莹如银钩。什么时候这匹骏马才能够戴上贵重的黄金辔头，在清爽的秋风原野里肆意、畅快地飞速奔驰呢？"
        }
      },
      {
        id: "poetry_36",
        worldId: WorldId.TangPoetry,
        name: "第 36 关",
        title: "春怨",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《春怨》· 金昌绪\n打起黄莺儿，莫教枝上啼。\n啼时惊妾梦，不得到辽西。",
        hint: "‘啼时惊妾梦，不得到辽西’。把树枝上唱歌的黄莺赶走，因为它吵醒了我在梦中前往辽西边关陪伴丈夫的好梦。",
        explanation: "《春怨》是唐代诗人金昌绪的一首闺怨诗。全诗通过打起黄莺、不让其啼鸣等一连串的细微动作与心理描写，极其生动地表达了妻子对在辽西戍边丈夫的无尽思念。",
        correctAnswer: "打起黄莺儿莫教枝上啼啼时惊妾梦不得到辽西",
        data: {
          title: "春怨",
          author: "金昌绪",
          dynasty: "唐",
          content: [
            "打起黄莺儿，",
            "莫教枝上啼。",
            "啼时惊妾梦，",
            "不得到辽西。"
          ],
          pinyin: [
            "dǎ qǐ huáng yīng ér",
            "mò jiào zhī shàng tí",
            "tí shí jīng qiè mèng",
            "bù dé dào liáo xī"
          ],
          keywords: ["打起黄莺儿", "莫教枝上啼", "啼时惊妾梦", "不得到辽西"],
          cleanWords: "打起黄莺儿莫教枝上啼啼时惊妾梦不得到辽西",
          translation: "拿起小木棒赶走正在树枝上欢快唱歌的黄莺鸟，千万不要让它在树枝上不停啼叫。它叫起来的时候会惊醒我的甜美梦境，让我无法在梦中飞到遥远的辽西战场去陪伴我心爱的丈夫了。"
        }
      },
      {
        id: "poetry_37",
        worldId: WorldId.TangPoetry,
        name: "第 37 关",
        title: "九月九日忆山东兄弟",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《九月九日忆山东兄弟》· 王维\n独在异乡为异客，每逢佳节倍思亲。\n遥知兄弟登高处，遍插茱萸少一人。",
        hint: "‘每逢佳节倍思亲’是千古名句。表达了重阳佳节里，漂泊在外的游子对亲人的深深思念。",
        explanation: "《九月九日忆山东兄弟》是王维年仅十七岁时创作的名篇。描绘了自己在重阳节这天独居异乡，因怀念家乡兄弟而写下的真挚诗句。",
        correctAnswer: "独在异乡为异客每逢佳节倍思亲遥知兄弟登高处遍插茱萸少一人",
        data: {
          title: "九月九日忆山东兄弟",
          author: "王维",
          dynasty: "唐",
          content: [
            "独在异乡为异客，",
            "每逢佳节倍思亲。",
            "遥知兄弟登高处，",
            "遍插茱萸少一人。"
          ],
          pinyin: [
            "dú zài yì xiāng wéi yì kè",
            "měi féng jiā jié bèi sī qīn",
            "yáo zhī xiōng dì dēng gāo chù",
            "biàn chā zhū yú shǎo yī rén"
          ],
          keywords: ["独在异乡为异客", "每逢佳节倍思亲", "遥知兄弟登高处", "遍插茱萸少一人"],
          cleanWords: "独在异乡为异客每逢佳节倍思亲遥知兄弟登高处遍插茱萸少一人",
          translation: "独自一人漂泊在奇异的他乡做着异客，每当遇到美好的佳节就加倍地思念亲人。在遥远的地方料想兄弟们今天登高望远，身上都插满了茱萸，却发现只缺少了我一个人。"
        }
      },
      {
        id: "poetry_38",
        worldId: WorldId.TangPoetry,
        name: "第 38 关",
        title: "望庐山瀑布",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《望庐山瀑布》· 李白\n日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。",
        hint: "‘飞流直下三千尺，疑是银河落九天’，让我们跟随着诗仙李白一起领略大瀑布排山倒海般的神奇气势吧！",
        explanation: "《望庐山瀑布》是唐代伟大诗人李白的代表作。这首诗将大自然中的庐山瀑布描绘得极其壮丽奇伟，展现了诗人非凡的浪漫主义想象力。",
        correctAnswer: "日照香炉生紫烟遥看瀑布挂前川飞流直下三千尺疑是银河落九天",
        data: {
          title: "望庐山瀑布",
          author: "李白",
          dynasty: "唐",
          content: [
            "日照香炉生紫烟，",
            "遥看瀑布挂前川。",
            "飞流直下三千尺，",
            "疑是银河落九天。"
          ],
          pinyin: [
            "rì zhào xiāng lú shēng zǐ yān",
            "yáo kàn pù bù guà qián chuān",
            "fēi liú zhí xià sān qiān chǐ",
            "yí shì yín hé luò jiǔ tiān"
          ],
          keywords: ["日照香炉生紫烟", "遥看瀑布挂前川", "飞流直下三千尺", "疑是银河落九天"],
          cleanWords: "日照香炉生紫烟遥看瀑布挂前川飞流直下三千尺疑是银河落九天",
          translation: "太阳照耀着香炉峰，激起一团团紫色的云烟。远远望去，瀑布就像是一条巨大的河流悬挂在山川前方。急流飞快地向下直泻三千多尺，让人禁不住怀疑是那灿烂的银河从九重天外落入人间。"
        }
      },
      {
        id: "poetry_39",
        worldId: WorldId.TangPoetry,
        name: "第 39 关",
        title: "黄鹤楼送孟浩然之广陵",
        question: "请听写 or 跟读背诵这首著名的唐诗：\n\n《黄鹤楼送孟浩然之广陵》· 李白\n故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。",
        hint: "三月阳春，李白在黄鹤楼送别好友。孤帆渐渐远去，唯有滚滚长江流向天际。",
        explanation: "《黄鹤楼送孟浩然之广陵》是一首经典的送别诗。描绘了阳春三月李白送别好友孟浩然的情景，寓深情于秀丽的江景之中。",
        correctAnswer: "故人西辞黄鹤楼烟花三月下扬州孤帆远影碧空尽唯见长江天际流",
        data: {
          title: "黄鹤楼送孟浩然之广陵",
          author: "李白",
          dynasty: "唐",
          content: [
            "故人西辞黄鹤楼，",
            "烟花三月下扬州。",
            "孤帆远影碧空尽，",
            "唯见长江天际流。"
          ],
          pinyin: [
            "gù rén xī cí huáng hè lóu",
            "yān huā sān yuè xià yáng zhōu",
            "gū fān yuǎn yǐng bì kōng jìn",
            "wéi jiàn cháng jiāng tiān jì liú"
          ],
          keywords: ["故人西辞黄鹤楼", "烟花三月下扬州", "孤帆远影碧空尽", "唯见长江天际流"],
          cleanWords: "故人西辞黄鹤楼烟花三月下扬州孤帆远影碧空尽唯见长江天际流",
          translation: "老朋友告别了西边的黄鹤楼，在柳絮如烟、繁花似锦的三月，乘船东下去往扬州。孤单的船影伴随着远方的帆，慢慢消失在蔚蓝晴空的尽头，只看见浩瀚的长江之水向着天边奔流不息。"
        }
      },
      {
        id: "poetry_40",
        worldId: WorldId.TangPoetry,
        name: "第 40 关",
        title: "早发白帝城",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《早发白帝城》· 李白\n朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。",
        hint: "‘两岸猿声啼不住，轻舟已过万重山’！感受到诗人遇赦东归时极其欢快、轻盈的心情了吗？",
        explanation: "《早发白帝城》是李白在流放途中遇赦东归时创作的七言绝句。全诗节奏明快，气势豪爽，表达了诗人遇赦后轻松欢愉的心情。",
        correctAnswer: "朝辞白帝彩云间千里江陵一日还两岸猿声啼不住轻舟已过万重山",
        data: {
          title: "早发白帝城",
          author: "李白",
          dynasty: "唐",
          content: [
            "朝辞白帝彩云间，",
            "千里江陵一日还。",
            "两岸猿声啼不住，",
            "轻舟已过万重山。"
          ],
          pinyin: [
            "zhāo cí bái dì cǎi yún jiān",
            "qiān lǐ jiāng líng yī rì hái",
            "liǎng àn yuán shēng tí bú zhù",
            "qīng zhōu yǐ guò wàn zhòng shān"
          ],
          keywords: ["朝辞白帝彩云间", "千里江陵一日还", "两岸猿声啼不住", "轻舟已过万重山"],
          cleanWords: "朝辞白帝彩云间千里江陵一日还两岸猿声啼不住轻舟已过万重山",
          translation: "清晨告别了仿佛置身于彩云之中的白帝城，千里之外的江陵只要一天的时间就能返回。长江两岸猿猴的啼叫声还在耳边不停回荡，轻快的小船早已飞速驶过了万重巍峨的大山。"
        }
      },
      {
        id: "poetry_41",
        worldId: WorldId.TangPoetry,
        name: "第 41 关",
        title: "枫桥夜泊",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《枫桥夜泊》· 张继\n月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。",
        hint: "深秋的江南夜色！伴着清冷的月光、啼叫的乌鸦与寒山寺的半夜钟声，感受旅人的淡淡愁绪。",
        explanation: "《枫桥夜泊》是唐代诗人张继的代表作。全诗精确而细腻地勾勒了江南水乡的秋夜幽寂景色，抒发了旅途客子的羁旅之思与忧愁。",
        correctAnswer: "月落乌啼霜满天江枫渔火对愁眠姑苏城外寒山寺夜半钟声到客船",
        data: {
          title: "枫桥夜泊",
          author: "张继",
          dynasty: "唐",
          content: [
            "月落乌啼霜满天，",
            "江枫渔火对愁眠。",
            "姑苏城外寒山寺，",
            "夜半钟声到客船。"
          ],
          pinyin: [
            "yuè luò wū tí shuāng mǎn tiān",
            "jiāng fēng yú huǒ duì chóu mián",
            "gū sū chéng wài hán shān sì",
            "yè bàn zhōng shēng dào kè chuán"
          ],
          keywords: ["月落乌啼霜满天", "江枫渔火对愁眠", "姑苏城外寒山寺", "夜半钟声到客船"],
          cleanWords: "月落乌啼霜满天江枫渔火对愁眠姑苏城外寒山寺夜半钟声到客船",
          translation: "明月已经西沉，乌鸦在不停啼叫，漫天洒满了寒霜；江边的枫树、渔船上的灯火，正伴着满怀旅愁的游子难以入眠。那姑苏城外的寒山寺，在夜半时分敲响的悠扬钟声，缓缓传到了我乘坐的客船上。"
        }
      },
      {
        id: "poetry_42",
        worldId: WorldId.TangPoetry,
        name: "第 42 关",
        title: "凉州词二首·其一",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《凉州词二首·其一》· 王翰\n葡萄美酒夜光杯，欲饮琵琶马上催。\n醉卧沙场君莫笑，古来征战几人回？",
        hint: "‘古来征战几人回’！描写了边防战士们在军营宴会上的酣畅豪饮以及视死如归的豪迈气概。",
        explanation: "《凉州词》是唐代诗人王翰的边塞诗名篇。展现了边疆将士出征前的豪情宴饮，格调慷慨悲壮，充满了激昂的爱国豪情与对战争的豁达情怀。",
        correctAnswer: "葡萄美酒夜光杯欲饮琵琶马上催醉卧沙场君莫笑古来征战几人回",
        data: {
          title: "凉州词二首·其一",
          author: "王翰",
          dynasty: "唐",
          content: [
            "葡萄美酒夜光杯，",
            "欲饮琵琶马上催。",
            "醉卧沙场君莫笑，",
            "古来征战几人回？"
          ],
          pinyin: [
            "pú tao měi jiǔ yè guāng bēi",
            "yù yǐn pí pa mǎ shàng cuī",
            "zuì wò shā chǎng jūn mò xiào",
            "gǔ lái zhēng zhàn jǐ rén huí"
          ],
          keywords: ["葡萄美酒夜光杯", "欲饮琵琶马上催", "醉卧沙场君莫笑", "古来征战几人回"],
          cleanWords: "葡萄美酒夜光杯欲饮琵琶马上催醉卧沙场君莫笑古来征战几人回",
          translation: "精美的夜光杯中盛满了醇香的葡萄美酒，正想要痛快畅饮，马上的乐工已经弹奏起琵琶声急促地催促着出发。如果我喝醉了躺在沙场上，请您千万不要见笑，自古以来奔赴战场英勇征战，又有几个人能够平安地回来呢？"
        }
      },
      {
        id: "poetry_43",
        worldId: WorldId.TangPoetry,
        name: "第 43 关",
        title: "登幽州台歌",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《登幽州台歌》· 陈子昂\n前不见古人，后不见来者。\n念天地之悠悠，独怆然而涕下！",
        hint: "极度孤独与苍凉！站在高台上，感叹浩瀚时空中自己的渺小和无尽的孤独。",
        explanation: "《登幽州台歌》是初唐诗人陈子昂的千古绝唱。全诗慷慨悲凉，通过对时空无限性的思索，抒发了诗人怀才不遇、寂寞孤单的深沉叹息。",
        correctAnswer: "前不见古人后不见来者念天地之悠悠独怆然而涕下",
        data: {
          title: "登幽州台歌",
          author: "陈子昂",
          dynasty: "唐",
          content: [
            "前不见古人，",
            "后不见来者。",
            "念天地之悠悠，",
            "独怆然而涕下！"
          ],
          pinyin: [
            "qián bú jiàn gǔ rén",
            "hòu bú jiàn lái zhě",
            "niàn tiān dì zhī yōu yōu",
            "dú chuàng rán ér tì xià"
          ],
          keywords: ["前不见古人", "后不见来者", "念天地之悠悠", "独怆然而涕下"],
          cleanWords: "前不见古人后不见来者念天地之悠悠独怆然而涕下",
          translation: "往前看，看不见古代那些贤明的君主与先哲；往后看，也看不见未来的有志之士。想到天地的辽阔悠远、无始无终，我独自感到无比悲伤，禁不住流下了孤独的眼泪。"
        }
      },
      {
        id: "poetry_44",
        worldId: WorldId.TangPoetry,
        name: "第 44 关",
        title: "乌衣巷",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《乌衣巷》· 刘禹锡\n朱雀桥边野草花，乌衣巷口夕阳斜。\n旧时王谢堂前燕，飞入寻常百姓家。",
        hint: "‘旧时王谢堂前燕，飞入寻常百姓家’！感叹历史沧桑变迁，曾经的显赫门第如今已是寻常百姓的生活场所。",
        explanation: "《乌衣巷》是中唐诗人刘禹锡的怀古佳作。诗人借燕子的飞来飞去，含蓄而深沉地表达了对历史盛衰、人事沧桑的哲理反思。",
        correctAnswer: "朱雀桥边野草花乌衣巷口夕阳斜旧时王谢堂前燕飞入寻常百姓家",
        data: {
          title: "乌衣巷",
          author: "刘禹锡",
          dynasty: "唐",
          content: [
            "朱雀桥边野草花，",
            "乌衣巷口夕阳斜。",
            "旧时王谢堂前燕，",
            "飞入寻常百姓家。"
          ],
          pinyin: [
            "zhū què qiáo biān yě cǎo huā",
            "wū yī xiàng kǒu xī yáng xié",
            "jiù shí wáng xiè táng qián yàn",
            "fēi rù xún cháng bǎi xìng jiā"
          ],
          keywords: ["朱雀桥边野草花", "乌衣巷口夕阳斜", "旧时王谢堂前燕", "飞入寻常百姓家"],
          cleanWords: "朱雀桥边野草花乌衣巷口夕阳斜旧时王谢堂前燕飞入寻常百姓家",
          translation: "朱雀桥边现在开满了野草杂花，乌衣巷口夕阳正斜斜地照射着。过去王导、谢安两大家族豪华殿堂前的燕子，如今不知不觉已经飞进了普通老百姓的家中筑巢。"
        }
      },
      {
        id: "poetry_45",
        worldId: WorldId.TangPoetry,
        name: "第 45 关",
        title: "凉州词",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《凉州词》· 王之涣\n黄河远上白云间，一片孤城万仞山。\n羌笛何须怨杨柳，春风不度玉门关。",
        hint: "‘羌笛何须怨杨柳，春风不度玉门关’。在寂寞的边疆，连春风都吹不到，羌笛又何必吹奏《折杨柳》这种幽怨的曲调呢？表达了边防战士的豪迈与苍凉心情。",
        explanation: "《凉州词》是盛唐诗人王之涣的边塞诗名篇。全诗画面开阔，格调雄浑，既写出了边疆景物的壮丽，也展现了将士们的寂寞与豁达。",
        correctAnswer: "黄河远上白云间一片孤城万仞山羌笛何须怨杨柳春风不度玉门关",
        data: {
          title: "凉州词",
          author: "王之涣",
          dynasty: "唐",
          content: [
            "黄河远上白云间，",
            "一片孤城万仞山。",
            "羌笛何须怨杨柳，",
            "春风不度玉门关。"
          ],
          pinyin: [
            "huáng hé yuǎn shàng bái yún jiān",
            "yī piàn gū chéng wàn rèn shān",
            "qiāng dí hé xū yuàn yáng liǔ",
            "chūn fēng bú dù yù mén guān"
          ],
          keywords: ["黄河远上白云间", "一片孤城万仞山", "羌笛何须怨杨柳", "春风不度玉门关"],
          cleanWords: "黄河远上白云间一片孤城万仞山羌笛何须怨杨柳春风不度玉门关",
          translation: "滔滔黄河远远向上流去，仿佛一直奔流到那白云之上；在无边无际的群山之中，只有一座孤独的小城屹立在万仞高山之间。羌笛何必吹奏那哀怨的《折杨柳》曲子呢？要知道，那温暖的春风是根本吹不过玉门关去的呀。"
        }
      },
      {
        id: "poetry_46",
        worldId: WorldId.TangPoetry,
        name: "第 46 关",
        title: "出塞",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《出塞》· 王昌龄\n秦时明月汉时关，万里长征人未还。\n但使龙城飞将在，不教胡马度阴山。",
        hint: "‘秦时明月汉时关’，感受边塞的苍茫壮阔和保家卫国的雄心壮志吧！",
        explanation: "《出塞》是唐代诗人王昌龄的边塞诗杰作。全诗通过对秦汉边关月色的描写，抒发了对长征战士的同情，以及对良将御敌、早日平息战争的渴望。",
        correctAnswer: "秦时明月汉时关万里长征人未还但使龙城飞将在不教胡马度阴山",
        data: {
          title: "出塞",
          author: "王昌龄",
          dynasty: "唐",
          content: [
            "秦时明月汉时关，",
            "万里长征人未还。",
            "但使龙城飞将在，",
            "不教胡马度阴山。"
          ],
          pinyin: [
            "qín shí míng yuè hàn shí guān",
            "wàn lǐ cháng zhēng rén wèi hái",
            "dàn shǐ lóng chéng fēi jiāng zài",
            "bù jiào hú mǎ dù yīn shān"
          ],
          keywords: ["秦时明月汉时关", "万里长征人未还", "防守龙城飞将在", "不教胡马度阴山"],
          cleanWords: "秦时明月汉时关万里长征人未还但使龙城飞将在不教胡马度阴山",
          translation: "依旧是秦汉时期的明月和雄关，然而出征万里前去守边的将士们至今未能归还。倘若龙城的飞将军李广如今依然健在，绝不会让凶悍的匈奴骑兵跨越阴山半步！"
        }
      },
      {
        id: "poetry_47",
        worldId: WorldId.TangPoetry,
        name: "第 47 关",
        title: "江南逢李龟年",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《江南逢李龟年》· 杜甫\n岐王宅里寻常见，崔九堂前几度闻。\n正是江南好风景，落花时节又逢君。",
        hint: "‘落花时节又逢君’，江南美丽的风景和落花时节，重逢故人的无限感慨中，透着历史沧桑。",
        explanation: "《江南逢李龟年》是唐代伟大诗人杜甫的晚年杰作。诗中通过与昔日红极一时的乐师李龟年在江南的重逢，抒发了个人身世的飘零之感和对唐帝国繁华岁月的怀念。",
        correctAnswer: "岐王宅里寻常见崔九堂前几度闻正是江南好风景落花时节又逢君",
        data: {
          title: "江南逢李龟年",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "岐王宅里寻常见，",
            "崔九堂前几度闻。",
            "正是江南好风景，",
            "落花时节又逢君。"
          ],
          pinyin: [
            "qí wáng zhái lǐ xún cháng jiàn",
            "cuī jiǔ táng qián jǐ dù wén",
            "zhèng shì jiāng nán hǎo fēng jǐng",
            "luò huā shí jié yòu féng jūn"
          ],
          keywords: ["岐王宅里寻常见", "崔九堂前几度闻", "正是江南好风景", "落花时节又逢君"],
          cleanWords: "岐王宅里寻常见崔九堂前几度闻正是江南好风景落花时节又逢君",
          translation: "当年的岐王府邸里我曾经常常见到你，崔九的堂前我也曾多次听闻你的美妙歌声。现在正好是江南风景优美、风光无限的大好时节，没想到在这落花纷纷、飘零衰败的岁月里，又与你在此重逢了。"
        }
      },
      {
        id: "poetry_48",
        worldId: WorldId.TangPoetry,
        name: "第 48 关",
        title: "夜雨寄北",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《夜雨寄北》· 李商隐\n君问归期未有期，巴山夜雨涨秋池。\n何当共剪西窗烛，却话巴山夜雨时。",
        hint: "‘何当共剪西窗烛’！远在巴山的夜雨中，思念着远方的亲人，想象着未来重逢时的温馨场景。",
        explanation: "《夜雨寄北》是唐代诗人李商隐的抒情名作。全诗巧妙地在眼前孤寂的‘巴山夜雨’与未来重逢的‘共剪西窗烛’之间穿梭，将思念之情写得极其委婉动人。",
        correctAnswer: "君问归期未有期巴山夜雨涨秋池何当共剪西窗烛却话巴山夜雨时",
        data: {
          title: "夜雨寄北",
          author: "李商隐",
          dynasty: "唐",
          content: [
            "君问归期未有期，",
            "巴山夜雨涨秋池。",
            "何当共剪西窗烛，",
            "却话巴山夜雨时。"
          ],
          pinyin: [
            "jūn wèn guī qī wèi yǒu qī",
            "bā shān yè yǔ zhǎng qiū chí",
            "hé dāng gòng jiǎn xī chuāng zhú",
            "què huà bā shān yè yǔ shí"
          ],
          keywords: ["君问归期未有期", "巴山夜雨涨秋池", "何当共剪西窗烛", "却话巴山夜雨时"],
          cleanWords: "君问归期未有期巴山夜雨涨秋池何当共剪西窗烛却话巴山夜雨时",
          translation: "您询问我回家的日期，可是直到现在还没有准确的归期；此时巴山的夜雨正不停地下着，涨满了秋天的池塘。什么时候我们才能坐在一起共同修剪西窗下的蜡烛，再回头畅谈今晚在巴山听夜雨时的深切思念呢？"
        }
      },
      {
        id: "poetry_49",
        worldId: WorldId.TangPoetry,
        name: "第 49 关",
        title: "问刘十九",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《问刘十九》· 白居易\n绿蚁新醅酒，红泥小火炉。\n晚来天欲雪，能饮一杯无？",
        hint: "‘能饮一杯无’？在风雪将至的寒冷黄昏，邀请好朋友围坐在暖洋洋的红泥小火炉旁，痛快地喝上一杯新酿的美酒吧！",
        explanation: "《问刘十九》是唐代诗人白居易的一首极具生活情趣的五言绝句。诗歌展现了冬日里温馨的小景，洋溢着真挚、淳朴而又深厚的朋友情谊。",
        correctAnswer: "绿蚁新醅酒红泥小火炉晚来天欲雪能饮一杯无",
        data: {
          title: "问刘十九",
          author: "白居易",
          dynasty: "唐",
          content: [
            "绿蚁新醅酒，",
            "红泥小火炉。",
            "晚来天欲雪，",
            "能饮一杯无？"
          ],
          pinyin: [
            "lǜ yǐ xīn pēi jiǔ",
            "hóng ní xiǎo huǒ lú",
            "wǎn lái tiān yù xuě",
            "néng yǐn yī bēi wú"
          ],
          keywords: ["绿蚁新醅酒", "红泥小火炉", "晚来天欲雪", "能饮一杯无"],
          cleanWords: "绿蚁新醅酒红泥小火炉晚来天欲雪能饮一杯无",
          translation: "新酿好、还没过滤的米酒上漂浮着一层绿色酒糟，像小蚂蚁一样，家里已经准备好了精致的红泥小火炉。天色渐渐暗了，看起来马上就要下一场大雪，你愿意来和我一起喝上一杯暖和的热酒吗？"
        }
      },
      {
        id: "poetry_50",
        worldId: WorldId.TangPoetry,
        name: "第 50 关",
        title: "芙蓉楼送辛渐",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《芙蓉楼送辛渐》· 王昌龄\n寒雨连江夜入吴，平明送客楚山孤。\n洛阳亲友如相问，一片冰心在玉壶。",
        hint: "‘一片冰心在玉壶’！这是最光明磊落的告白，用冰心和玉壶象征自己纯洁高尚、不畏权贵的气节和品格。",
        explanation: "《芙蓉楼送辛渐》是王昌龄的一首送别名作。诗的最后两句借‘冰心在玉壶’自喻，表明了诗人虽然遭受贬谪，却依然坚守高洁清白操守的坚定决心。",
        correctAnswer: "寒雨连江夜入吴平明送客楚山孤洛阳亲友如相问一片冰心在玉壶",
        data: {
          title: "芙蓉楼送辛渐",
          author: "王昌龄",
          dynasty: "唐",
          content: [
            "寒雨连江夜入吴，",
            "平明送客楚山孤。",
            "洛阳亲友如相问，",
            "一片冰心在玉壶。"
          ],
          pinyin: [
            "hán yǔ lián jiāng yè rù wú",
            "píng míng sòng kè chǔ shān gū",
            "luò yáng qīn yǒu rú xiāng wèn",
            "yī piàn bīng xīn zài yù hú"
          ],
          keywords: ["寒雨连江夜入吴", "平明送客楚山孤", "洛阳亲友如相问", "一片冰心在玉壶"],
          cleanWords: "寒雨连江夜入吴平明送客楚山孤洛阳亲友如相问一片冰心在玉壶",
          translation: "冰冷的秋雨在夜里连绵不断地下着，流入了吴地；天刚蒙蒙亮送别好友辛渐，只见远处的楚山孤零零地耸立在水边。如果洛阳的亲朋好友向你打听我的近况，请替我转告他们：我王昌龄的心就像那玉壶里的冰块一样，高洁清白、始终没有改变。"
        }
      },
      {
        id: "poetry_51",
        worldId: WorldId.TangPoetry,
        name: "第 51 关",
        title: "逢雪宿芙蓉山主人",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《逢雪宿芙蓉山主人》· 刘长卿\n日暮苍山远，天寒白屋贫。\n柴门闻犬吠，风雪夜归人。",
        hint: "白茫茫的风雪之夜里，听到柴门外的狗叫声，那是风雪中赶路回家的人终于归来了！",
        explanation: "《逢雪宿芙蓉山主人》是唐代诗人刘长卿的经典之作。诗中描绘了一幅极其简练、却充满生机与温暖的冬夜宿山图，表现了隐士及下层人民朴素的生活状态。",
        correctAnswer: "日暮苍山远天寒白屋贫柴门闻犬吠风雪夜归人",
        data: {
          title: "逢雪宿芙蓉山主人",
          author: "刘长卿",
          dynasty: "唐",
          content: [
            "日暮苍山远，",
            "天寒白屋贫。",
            "柴门闻犬吠，",
            "风雪夜归人。"
          ],
          pinyin: [
            "rì mù cáng shān yuǎn",
            "tiān hán bái wū pín",
            "chái mén wén quǎn fèi",
            "fēng xuě yè guī rén"
          ],
          keywords: ["日暮苍山远", "天寒白屋贫", "柴门闻犬吠", "风雪夜归人"],
          cleanWords: "日暮苍山远天寒白屋贫柴门闻犬吠风雪夜归人",
          translation: "太阳已经落山了，前方笼罩在夜色中的山路显得非常遥远，天气非常寒冷，只有一间简陋的、覆盖着白雪的小屋。寂静中突然听到柴门外传来了阵阵狗叫声，原来是有人在风雪连绵的黑夜里终于赶路回家了。"
        }
      },
      {
        id: "poetry_52",
        worldId: WorldId.TangPoetry,
        name: "第 52 关",
        title: "独坐敬亭山",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《独坐敬亭山》· 李白\n众鸟高飞尽，孤云独去闲。\n相看两不厌，只有敬亭山。",
        hint: "‘相看两不厌，只有敬亭山’！鸟儿和云儿都离开了，只有诗人和敬亭山默默地相对凝视，感受心灵的宁静。",
        explanation: "《独坐敬亭山》是唐代伟大诗人李白的一首代表作。此诗表现了诗人在经历了人情冷暖后、独处大自然中寻找心灵寄托和精神慰藉的闲适与豁达情怀。",
        correctAnswer: "众鸟高飞尽孤云独去闲相看两不厌只有敬亭山",
        data: {
          title: "独坐敬亭山",
          author: "李白",
          dynasty: "唐",
          content: [
            "众鸟高飞尽，",
            "孤云独去闲。",
            "相看两不厌，",
            "只有敬亭山。"
          ],
          pinyin: [
            "zhòng niǎo gāo fēi jìn",
            "gū yún dú qù xián",
            "xiāng kàn liǎng bú yàn",
            "zhǐ yǒu jìng tíng shān"
          ],
          keywords: ["众鸟高飞尽", "孤云独去闲", "相看两不厌", "只有敬亭山"],
          cleanWords: "众鸟高飞尽孤云独去闲相看两不厌只有敬亭山",
          translation: "成群的鸟儿已经高高地飞得看不见踪影，天空中唯一的一朵孤云也优闲自在地慢慢飘走。此时此刻，相互看着却怎么也不会感到厌烦的，只有眼前这巍峨宁静的敬亭山了。"
        }
      },
      {
        id: "poetry_53",
        worldId: WorldId.TangPoetry,
        name: "第 53 关",
        title: "寒食",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《寒食》· 韩翃\n春城无处不飞花，寒食东风御柳斜。\n日暮汉宫传蜡烛，轻烟散入五侯家。",
        hint: "‘春城无处不飞花’！暮春时分，整个长安城都沉浸在柳絮和落花飞舞的迷人春色之中。",
        explanation: "《寒食》是唐代诗人韩翃的代表作。全诗语言优美，画面感极强，通过描写寒食节这天长安城内落花飞舞、宫廷向权贵传赐蜡烛的场景，生动展现了唐代上层社会的风尚。",
        correctAnswer: "春城无处不飞花寒食东风御柳斜日暮汉宫传蜡烛轻烟散入五侯家",
        data: {
          title: "寒食",
          author: "韩翃",
          dynasty: "唐",
          content: [
            "春城无处不飞花，",
            "寒食东风御柳斜。",
            "日暮汉宫传蜡烛，",
            "轻烟散入五侯家。"
          ],
          pinyin: [
            "chūn chéng wú chù bù fēi huā",
            "hán shí dōng fēng yù liǔ xié",
            "rì mù hàn gōng chuán là zhú",
            "qīng yān sàn rù wǔ hóu jiā"
          ],
          keywords: ["春城无处不飞花", "寒食东风御柳斜", "日暮汉宫传蜡烛", "轻烟散入五侯家"],
          cleanWords: "春城无处不飞花寒食东风御柳斜日暮汉宫传蜡烛轻烟散入五侯家",
          translation: "暮春的长安城里到处都飘舞着柳絮和落花，寒食节的东风吹拂着宫廷里的柳枝微微倾斜。傍晚时分，皇宫里开始忙碌着传送特赐的蜡烛，点燃后产生的袅袅轻烟，慢慢散入了那些显贵豪门之中。"
        }
      },
      {
        id: "poetry_54",
        worldId: WorldId.TangPoetry,
        name: "第 54 关",
        title: "春夜洛城闻笛",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《春夜洛城闻笛》· 李白\n谁家玉笛暗飞声，散入春风满洛城。\n此夜曲中闻折柳，何人不起故园情。",
        hint: "‘何人不起故园情’！春天的夜里，听到远处悠扬的笛声演奏着代表送别的折杨柳曲，让每一个漂泊在外的人都勾起了浓浓的思乡之情。",
        explanation: "《春夜洛城闻笛》是李白客居洛阳时创作的著名抒怀诗。全诗紧扣一个‘闻’字，通过对春夜笛声的描绘，自然而然地传达出诗人深沉的客旅思乡之情。",
        correctAnswer: "谁家玉笛暗飞声散入春风满洛城此夜曲中闻折柳何人不起故园情",
        data: {
          title: "春夜洛城闻笛",
          author: "李白",
          dynasty: "唐",
          content: [
            "谁家玉笛暗飞声，",
            "散入春风满洛城。",
            "此夜曲中闻折柳，",
            "何人不起故园情。"
          ],
          pinyin: [
            "shéi jiā yù dí àn fēi shēng",
            "sàn rù chūn fēng mǎn luò chéng",
            "cǐ yè qǔ zhōng wén zhé liǔ",
            "hé rén bù qǐ gù yuán qíng"
          ],
          keywords: ["谁家玉笛暗飞声", "散入春风满洛城", "此夜曲中闻折柳", "何人不起故园情"],
          cleanWords: "谁家玉笛暗飞声散入春风满洛城此夜曲中闻折柳何人不起故园情",
          translation: "不知道是谁家的玉笛在暗暗地吹奏出美妙的声音，这悦耳的笛声随着温暖的春风飘散，传满了整个洛阳城。就在今天晚上，听着笛声中传来的《折杨柳》曲调，又有哪一个漂泊在外的游子不会激起深切的思念家乡之情呢？"
        }
      },
      {
        id: "poetry_55",
        worldId: WorldId.TangPoetry,
        name: "第 55 关",
        title: "竹里馆",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《竹里馆》· 王维\n独坐幽篁里，弹琴复长啸。\n深林人不知，明月来相照。",
        hint: "‘深林人不知，明月来相照’，多么悠闲宁静的隐居境界。在幽静的竹林里弹琴、吹口哨，只有清凉的月光伴随着我。",
        explanation: "《竹里馆》是王维晚年隐居辋川时写的经典五言绝句。诗中通过对独坐弹琴、明月相照等生活细节的白描，创造了一个清幽宁静、高雅豁达的意境。",
        correctAnswer: "独坐幽篁里弹琴复长啸深林人不知明月来相照",
        data: {
          title: "竹里馆",
          author: "王维",
          dynasty: "唐",
          content: [
            "独坐幽篁里，",
            "弹琴复长啸。",
            "深林人不知，",
            "明月来相照。"
          ],
          pinyin: [
            "dú zài yōu huáng lǐ",
            "tán qín fù cháng xiào",
            "shēn lín rén bù zhī",
            "míng yuè lái xiāng zhào"
          ],
          keywords: ["独坐幽篁里", "弹琴复长啸", "深林人不知", "明月来相照"],
          cleanWords: "独坐幽篁里弹琴复长啸深林人不知明月来相照",
          translation: "我独自坐在幽静碧绿的竹林深处，一边尽情地弹琴，一边又放声地大声呼啸。茂密的竹林里没有人知道我在这里，只有天上那皎洁的明月拨开云雾洒下清辉、默默地陪伴着我。"
        }
      },
      {
        id: "poetry_56",
        worldId: WorldId.TangPoetry,
        name: "第 56 关",
        title: "宿建德江",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《宿建德江》· 孟浩然\n移舟泊烟渚，日暮客愁新。\n野旷天低树，江清月近人。",
        hint: "‘野旷天低树，江清月近人’，好一幅空旷高远的秋江夜色图！在暮色沉沉的江边，唯有倒映在清澈江水里的月亮显得和人那么亲近。",
        explanation: "《宿建德江》是唐代山水田园诗人孟浩然的行旅代表作。全诗通过对空旷旷的原野、清凉凉的江水的精妙白描，把羁旅途中的孤单和落寞写得极其含蓄而深情。",
        correctAnswer: "移舟泊烟渚日暮客愁新野旷天低树江清月近人",
        data: {
          title: "宿建德江",
          author: "孟浩然",
          dynasty: "唐",
          content: [
            "移舟泊烟渚，",
            "日暮客愁新。",
            "野旷天低树，",
            "江清月近人。"
          ],
          pinyin: [
            "yí zhōu bó yān zhǔ",
            "rì mù kè chóu xīn",
            "yě kuàng tiān dī shù",
            "jiāng qīng yuè jìn rén"
          ],
          keywords: ["移舟泊烟渚", "日暮客愁新", "野旷天低树", "江清月近人"],
          cleanWords: "移舟泊烟渚日暮客愁新野旷天低树江清月近人",
          translation: "把小船划动、停靠在烟雾弥漫的沙洲旁，在这夕阳西下的傍晚时分，旅人的思乡愁绪不禁又重新涌上心头。远处的原野无比辽阔空旷，仿佛天幕比树木还要低；近处的江水清澈见底，倒映在水中的月影好像正贴心、亲近地陪伴着我。"
        }
      },
      {
        id: "poetry_57",
        worldId: WorldId.TangPoetry,
        name: "第 57 关",
        title: "遗爱寺",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《遗爱寺》· 白居易\n弄石临溪坐，寻花绕寺行。\n时时闻鸟语，处处是泉声。",
        hint: "‘时时闻鸟语，处处是泉声’，跟随着白居易在幽静的寺庙周围玩玩石头、赏赏鲜花、听听鸟鸣和泉水流淌的声音吧！",
        explanation: "《遗爱寺》是唐代诗人白居易的一首极具闲适、清幽自然气息的小诗。诗歌通过玩弄溪边石头、环绕寺院寻找花朵等举动，真切表达了诗人对大自然的满腔热爱之情。",
        correctAnswer: "弄石临溪坐寻花绕寺行时时闻鸟语处处是泉声",
        data: {
          title: "遗爱寺",
          author: "白居易",
          dynasty: "唐",
          content: [
            "弄石临溪坐，",
            "寻花绕寺行。",
            "时时闻鸟语，",
            "处处是泉声。"
          ],
          pinyin: [
            "nòng shí lín xī zuò",
            "xún huā rào sì xíng",
            "shí shí wén niǎo yǔ",
            "chù chù shì quán shēng"
          ],
          keywords: ["弄石临溪坐", "寻花绕寺行", "时时闻鸟语", "处处是泉声"],
          cleanWords: "弄石临溪坐寻花绕寺行时时闻鸟语处处是泉声",
          translation: "喜爱玩弄小石头于是紧挨着清澈的溪水坐下，为了寻找绽放的花朵我绕着幽静的寺庙缓缓行走。耳边不时能够听到鸟儿清脆欢快的啼叫声，周围到处都在回响着叮咚叮咚、悦耳动听的泉水流动声。"
        }
      },
      {
        id: "poetry_58",
        worldId: WorldId.TangPoetry,
        name: "第 58 关",
        title: "金缕衣",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《金缕衣》· 无名氏\n劝君莫惜金缕衣，劝君惜取少年时。\n花开堪折直须折，莫待无花空折枝。",
        hint: "‘花开堪折直须折，莫待无花空折枝’！告诫我们要珍惜宝贵的青春年华，勤奋努力，不要等到失去了才去后悔哦。",
        explanation: "《金缕衣》是一首富有哲理和劝勉意义的唐代乐府诗。全诗通过借折花作为比喻，深情而诚挚地劝导人们要珍惜大好的青春少年时光、积极进取，莫让光阴虚度。",
        correctAnswer: "劝君莫惜金缕衣劝君惜取少年时花开堪折直须折莫待无花空折枝",
        data: {
          title: "金缕衣",
          author: "无名氏",
          dynasty: "唐",
          content: [
            "劝君莫惜金缕衣，",
            "劝君惜取少年时。",
            "花开堪折直须折，",
            "莫待无花空折枝。"
          ],
          pinyin: [
            "quàn jūn mò xī jīn lǚ yī",
            "quàn jūn xī qǔ shào nián shí",
            "huā kāi kān zhé zhí xū zhé",
            "mò dài wú huā kōng zhé zhī"
          ],
          keywords: ["劝君莫惜金缕衣", "劝君惜取少年时", "花开堪折直须折", "莫待无花空折枝"],
          cleanWords: "劝君莫惜金缕衣劝君惜取少年时花开堪折直须折莫待无花空折枝",
          translation: "真诚地劝您不要过分去爱惜那华贵珍贵的金缕衣，更应该去好好珍惜那转瞬即逝的少年青春时光。花朵盛开、可以折取的时候就应该直接把它折下来，千万不要等到花朵完全凋谢落空，才面对着空空的树枝暗自叹息。"
        }
      },
      {
        id: "poetry_59",
        worldId: WorldId.TangPoetry,
        name: "第 59 关",
        title: "赠花卿",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赠花卿》· 杜甫\n锦城丝管日纷纷，半入江风半入云。\n此曲只应天上有，人间能得几回闻。",
        hint: "‘此曲只应天上有，人间能得几回闻’！用来赞美美妙动听、无与伦比的音乐，已经成为千古赞歌的名句。",
        explanation: "《赠花卿》是唐代伟大诗圣杜甫的作品。全诗通过对天籁之音的夸张描写，表面上赞美了音乐的美妙动听，暗地里也委婉含蓄地劝解、规劝了花敬定不可过度奢侈逾越礼制。",
        correctAnswer: "锦城丝管日纷纷半入江风半入云此曲只应天上有人间能得几回闻",
        data: {
          title: "赠花卿",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "锦城丝管日纷纷，",
            "半入江风半入云。",
            "此曲只应天上有，",
            "人间能得几回闻。"
          ],
          pinyin: [
            "jǐn chéng sī guǎn rì fēn fēn",
            "bàn rù jiāng fēng bàn rù yún",
            "cǐ qǔ zhǐ yīng tiān shàng yǒu",
            "rén jiān néng dé jǐ huí wén"
          ],
          keywords: ["锦城丝管日纷纷", "半入江风半入云", "此曲只应天上有", "人间能得几回闻"],
          cleanWords: "锦城丝管日纷纷半入江风半入云此曲只应天上有人间能得几回闻",
          translation: "锦官城里每天都在演奏着优美、繁华的丝竹管弦乐曲，声音一半随着江风在水面上荡漾，一半随着悠悠白云直上高空。这样美妙非凡的乐曲恐怕只应该天上仙境里才有，我们凡俗的人间又有几回能够有幸亲耳听到呢？"
        }
      },
      {
        id: "poetry_60",
        worldId: WorldId.TangPoetry,
        name: "第 60 关",
        title: "秋夜寄邱员外",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《秋夜寄邱员外》· 韦应物\n怀君属秋夜，散步咏凉天。\n空山松子落，幽人应未眠。",
        hint: "‘空山松子落，幽人应未眠’！在落着松子、寂静空旷的秋天夜里，思念着远方的挚友，感到一种高雅脱俗的心灵契合。",
        explanation: "《秋夜寄邱员外》是中唐诗人韦应物的抒情佳作。此诗没有用任何华丽的词藻，仅凭‘散步咏凉天’、‘松子落’等极其朴素自然的景象，就把深厚、高雅的朋友深情描绘得超凡脱俗、意境空灵。",
        correctAnswer: "怀君属秋夜散步咏凉天空山松子落幽人应未眠",
        data: {
          title: "秋夜寄邱员外",
          author: "韦应物",
          dynasty: "唐",
          content: [
            "怀君属秋夜，",
            "散步咏凉天。",
            "空山松子落，",
            "幽人应未眠。"
          ],
          pinyin: [
            "huái jūn zhǔ qiū yè",
            "sǎn bù yǒng liáng tiān",
            "kōng shān sōng zǐ luò",
            "yōu rén yīng wèi mián"
          ],
          keywords: ["怀君属秋夜", "散步咏凉天", "空山松子落", "幽人应未眠"],
          cleanWords: "怀君属秋夜散步咏凉天空山松子落幽人应未眠",
          translation: "在这清凉、孤寂的秋夜里我正深深地怀念着你，独自在庭院中散步、轻声吟咏、赞美着这凉爽的天气。寂静中可以听到空旷的深山里松子成熟、轻轻掉落的声音，我想此时此刻，你这位超凡脱俗的隐士应该也还没有入睡吧。"
        }
      },
      {
        id: "poetry_61",
        worldId: WorldId.TangPoetry,
        name: "第 61 关",
        title: "滁州西涧",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《滁州西涧》· 韦应物\n独怜幽草涧边生，上有黄鹂深树鸣。\n春潮带雨晚来急，野渡无人舟自横。",
        hint: "‘春潮带雨晚来急，野渡无人舟自横’。傍晚时分，春潮挟带着风雨急急而来，荒野的渡口空无一人，只有一只无人看管的小船横在江面上。",
        explanation: "《滁州西涧》是韦应物任滁州刺史时写的一首写景名作。诗中描绘了清幽的涧边草木、黄鹂鸣叫、暮雨潮急以及野渡孤舟的迷人春景，意境深邃悠闲，寄托了诗人随遇而安的淡泊情怀。",
        correctAnswer: "独怜幽草涧边生上有黄鹂深树鸣春潮带雨晚来急野渡无人舟自横",
        data: {
          title: "滁州西涧",
          author: "韦应物",
          dynasty: "唐",
          content: [
            "独怜幽草涧边生，",
            "上有黄鹂深树鸣。",
            "春潮带雨晚来急，",
            "野渡无人舟自横。"
          ],
          pinyin: [
            "dú lián yōu cǎo jiàn biān shēng",
            "shàng yǒu huáng lí shēn shù míng",
            "chūn cháo dài yǔ wǎn lái jí",
            "yě dù wú rén zhōu zì héng"
          ],
          keywords: ["独怜幽草涧边生", "上有黄鹂深树鸣", "春潮带雨晚来急", "野渡无人舟自横"],
          cleanWords: "独怜幽草涧边生上有黄鹂深树鸣春潮带雨晚来急野渡无人舟自横",
          translation: "我唯独喜爱那在清幽涧水边生长的茂密青草，树荫深处还有黄莺在婉转啼鸣。傍晚时分，春潮挟带着风雨急急而来，荒野的渡口空无一人，只有一只无人看管的小船在水面上随风漂泊，静静地打横。"
        }
      },
      {
        id: "poetry_62",
        worldId: WorldId.TangPoetry,
        name: "第 62 关",
        title: "鸟鸣涧",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《鸟鸣涧》· 王维\n人闲桂花落，夜静春山空。\n月出惊山鸟，时鸣春涧中。",
        hint: "‘人闲桂花落，夜静春山空’。月光洒落在春夜的幽静深山里，鸟儿受惊飞起，在清澈的溪涧中发出阵阵啼鸣。",
        explanation: "《鸟鸣涧》是唐代山水田园派大师王维的经典代表作。全诗通过描绘桂花飘落、春山寂静、明月惊鸟、溪涧鸟鸣等极其细致的自然动态，极其高妙地运用以动衬静的手法，表现了春夜山中的宁静与空灵。",
        correctAnswer: "人闲桂花落夜静春山空月出惊山鸟时鸣春涧中",
        data: {
          title: "鸟鸣涧",
          author: "王维",
          dynasty: "唐",
          content: [
            "人闲桂花落，",
            "夜静春山空。",
            "月出惊山鸟，",
            "时鸣春涧中。"
          ],
          pinyin: [
            "rén xián guì huā luò",
            "yè jìng chūn shān kōng",
            "yuè chū jīng shān niǎo",
            "shí míng chūn jiàn zhōng"
          ],
          keywords: ["人闲桂花落", "夜静春山空", "月出惊山鸟", "时鸣春涧中"],
          cleanWords: "人闲桂花落夜静春山空月出惊山鸟时鸣春涧中",
          translation: "在这闲适寂静之中，细碎的桂花在无声无息中轻轻飘落，深夜里的春山显得格外的空旷幽静。明月忽然从云端探出头来，皎洁的光芒惊醒了山中的飞鸟，鸟儿时不时在春天的溪涧中发出清脆的鸣叫声。"
        }
      },
      {
        id: "poetry_63",
        worldId: WorldId.TangPoetry,
        name: "第 63 关",
        title: "大林寺桃花",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《大林寺桃花》· 白居易\n人间四月芳菲尽，山寺桃花始盛开。\n长恨春归无觅处，不知转入此中来。",
        hint: "‘人间四月芳菲尽，山寺桃花始盛开’。农历四月的平地百花已经凋谢，深山古寺里的桃花却刚刚盛开，充满了春天的生机。",
        explanation: "《大林寺桃花》是白居易游览庐山大林寺时所作。此诗描写了诗人登山时发现的高山与平地气候差异带来的奇妙景观，表达了诗人意外发现春天踪迹时的惊喜、欣慰与赞叹之情。",
        correctAnswer: "人间四月芳菲尽山寺桃花始盛开长恨春归无觅处不知转入此中来",
        data: {
          title: "大林寺桃花",
          author: "白居易",
          dynasty: "唐",
          content: [
            "人间四月芳菲尽，",
            "山寺桃花始盛开。",
            "长恨春归无觅处，",
            "不知转入此中来。"
          ],
          pinyin: [
            "rén jiān sì yuè fāng fēi jìn",
            "shān sì táo huā shǐ shèng kāi",
            "cháng hèn chūn guī wú mì chù",
            "bù zhī zhuǎn rù cǐ zhōng lái"
          ],
          keywords: ["人间四月芳菲尽", "山寺桃花始盛开", "长恨春归无觅处", "不知转入此中来"],
          cleanWords: "人间四月芳菲尽山寺桃花始盛开长恨春归无觅处不知转入此中来",
          translation: "农历四月的时候，平原人间的百花早已凋谢殆尽，然而高山古寺里的桃花却刚刚才竞相盛开。我常常惋惜春天逝去后无处寻找它的踪影，却没想到它竟然悄悄转入到这高山古寺之中来了。"
        }
      },
      {
        id: "poetry_64",
        worldId: WorldId.TangPoetry,
        name: "第 64 关",
        title: "望天门山",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《望天门山》· 李白\n天门中断楚江开，碧水东流至此回。\n两岸青山相对出，孤帆一片日边来。",
        hint: "‘两岸青山相对出，孤帆一片日边来’。李白乘着轻舟顺流而下，望见两岸的青山扑面而来，一叶孤舟在夕阳和朝霞中迎风驶向天际。",
        explanation: "《望天门山》是李白二十五岁时写下的雄浑山水诗。全诗通过对天门山 and 滚滚长江江水的动感描绘，展示了天门山神奇而雄伟的气势，也抒发了诗人自由奔放、乐观豪迈的胸怀。",
        correctAnswer: "天门中断楚江开碧水东流至此回两岸青山相对出孤帆一片日边来",
        data: {
          title: "望天门山",
          author: "李白",
          dynasty: "唐",
          content: [
            "天门中断楚江开，",
            "碧水东流至此回。",
            "两岸青山相对出，",
            "孤帆一片日边来。"
          ],
          pinyin: [
            "tiān mén zhōng duàn chǔ jiāng kāi",
            "bì shuǐ dōng liú zhì cǐ huí",
            "liǎng àn qīng shān xiāng duì chū",
            "gū fān yī piàn rì biān lái"
          ],
          keywords: ["天门中断楚江开", "碧水东流至此回", "两岸青山相对出", "孤帆一片日边来"],
          cleanWords: "天门中断楚江开碧水东流至此回两岸青山相对出孤帆一片日边来",
          translation: "雄伟的天门山仿佛从中间断裂开来，给滚滚而下的楚江让出一条通道；碧绿的江水奔腾向东，撞击在山崖上卷起回旋的浪花。两岸连绵的青山随着船只的前进在视线中相对扑面而来，一叶轻快的孤舟仿佛乘风破浪、从太阳落下的天边缓缓驶来。"
        }
      },
      {
        id: "poetry_65",
        worldId: WorldId.TangPoetry,
        name: "第 65 关",
        title: "秋夕",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《秋夕》· 杜牧\n银烛秋光冷画屏，轻罗小扇扑流萤。\n天阶夜色凉如水，卧看牵牛织女星。",
        hint: "‘天阶夜色凉如水，卧看牵牛织女星’。深秋的夜色冰凉如水，宫女们百无聊赖地扑打着萤火虫，躺在石阶上静静地凝望着天上的牵牛星和织女星。",
        explanation: "《秋夕》是晚唐诗人杜牧写的一首经典的闺怨诗。通过对秋夜银烛、冷屏、扑流萤、看牵牛织女星等细节描写，委婉含蓄地刻画了失宠宫女孤独、冷清以及对真挚爱情的向往和寂寞心境。",
        correctAnswer: "银烛秋光冷画屏轻罗小扇扑流萤天阶夜色凉如水卧看牵牛织女星",
        data: {
          title: "秋夕",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "银烛秋光冷画屏，",
            "轻罗小扇扑流萤。",
            "天阶夜色凉如水，",
            "卧看牵牛织女星。"
          ],
          pinyin: [
            "yín zhú qiū guāng lěng huà píng",
            "qīng luó xiǎo shàn pū liú yíng",
            "tiān jiē yè sè liáng rú shuǐ",
            "wò kàn qiān niú zhī nǚ xīng"
          ],
          keywords: ["银烛秋光冷画屏", "轻罗小扇扑流萤", "天阶夜色凉如水", "卧看牵牛织女星"],
          cleanWords: "银烛秋光冷画屏轻罗小扇扑流萤天阶夜色凉如水卧看牵牛织女星",
          translation: "银白色的蜡烛在秋风中闪烁着清冷的光芒，照亮了画有精美图案的屏风。手执轻便的绢质小扇，独自扑打着飞舞的萤火虫。石阶上的夜色像冷水一样冰凉，百无聊赖地躺着，痴痴地仰望着夜空里遥遥相对的牵牛星和织女星。"
        }
      },
      {
        id: "poetry_66",
        worldId: WorldId.TangPoetry,
        name: "第 66 关",
        title: "送别",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《送别》· 王维\n山中相送罢，日暮掩柴扉。\n春草年年绿，王孙归不归？",
        hint: "‘春草年年绿，王孙归不归’。在山中告别了好友，傍晚时分默默地关上柴门。春天的野草每年都会变绿，我的朋友你什么时候才能回来呢？",
        explanation: "《送别》是王维写的一首抒情绝句。此诗不同于一般的送别诗只着重于离别当下的场景，而是写送别友人后的那种怅惘、寂寞以及对友人归期的期盼，笔法深情细腻，令人回味无穷。",
        correctAnswer: "山中相送罢日暮掩柴扉春草年年绿王孙归不归",
        data: {
          title: "送别",
          author: "王维",
          dynasty: "唐",
          content: [
            "山中相送罢，",
            "日暮掩柴扉。",
            "春草年年绿，",
            "王孙归不归？"
          ],
          pinyin: [
            "shān zhōng xiāng sòng bà",
            "rì mù yǎn chái fēi",
            "chūn cǎo nián nián lǜ",
            "wáng sūn guī bù guī"
          ],
          keywords: ["山中相送罢", "日暮掩柴扉", "春草年年绿", "王孙归不归"],
          cleanWords: "山中相送罢日暮掩柴扉春草年年绿王孙归不归",
          translation: "在深山中把我的挚友相送作别之后，在夕阳西下的傍晚我默默地关上了这柴木小门。春天的野草每年都会绿意葱茏，亲爱的朋友啊，当明年春草再次变绿的时候，你究竟能不能平安回来呢？"
        }
      },
      {
        id: "poetry_67",
        worldId: WorldId.TangPoetry,
        name: "第 67 关",
        title: "闺怨",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《闺怨》· 王昌龄\n闺中少妇不知愁，春日凝妆上翠楼。\n忽见陌头杨柳色，悔教夫婿觅封侯。",
        hint: "‘忽见陌头杨柳色，悔教夫婿觅封侯’。看到田野边那翠绿欲滴的杨柳，突然惊觉春天的美好，从而后悔让丈夫去边关建功立业而忍受离别之苦。",
        explanation: "《闺怨》是唐代边塞诗人王昌龄的名作。全诗通过细腻生动的心理变化描写，写少妇原本毫无忧虑，却在登楼赏春时因为一抹柳色而勾起无限的相思和闺怨之情，情感真挚，构思精巧。",
        correctAnswer: "闺中少妇不知愁春日凝妆上翠楼忽见陌头杨柳色悔教夫婿觅封侯",
        data: {
          title: "闺怨",
          author: "王昌龄",
          dynasty: "唐",
          content: [
            "闺中少妇不知愁，",
            "春日凝妆上翠楼。",
            "忽见陌头杨柳色，",
            "悔教夫婿觅封侯。"
          ],
          pinyin: [
            "guī zhōng shào fù bù zhī chóu",
            "chūn rì níng zhuāng shàng cuì lóu",
            "hū jiàn mò tóu yáng liǔ sè",
            "huǐ jiào fū xù mì fēng hóu"
          ],
          keywords: ["闺中少妇不知愁", "春日凝妆上翠楼", "忽见陌头杨柳色", "悔教夫婿觅封侯"],
          cleanWords: "闺中少妇不知愁春日凝妆上翠楼忽见陌头杨柳色悔教夫婿觅封侯",
          translation: "深闺里的少妇原本过着无忧无虑的生活、不知道什么是愁苦，在晴朗的春日里她精心打扮、梳妆整齐后登上高高的翠楼观赏春光。忽然间看见田野路边那嫩绿、充满生机的杨柳美景，心中猛然一震，深深后悔当初怎么就让丈夫远赴边疆去寻求什么建功立业、求取封侯呢。"
        }
      },
      {
        id: "poetry_68",
        worldId: WorldId.TangPoetry,
        name: "第 68 关",
        title: "赠荷花",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赠荷花》· 李商隐\n世间花叶不相伦，花入金盆叶作尘。\n惟有绿荷红菡萏，卷舒开合任天真。",
        hint: "‘惟有绿荷红菡萏，卷舒开合任天真’。世人都重花轻叶，唯独荷花与荷叶互相衬托、在大自然中自由自在、无拘无束地舒展绽放。",
        explanation: "《赠荷花》是晚唐著名诗人李商隐的咏物诗。诗人通过对比世俗对花与叶的偏见，赞美了荷花与荷叶之间自然和谐、亲密无间的美好关系，寄托了诗人对天真、纯真、不媚俗的人生态度的追求。",
        correctAnswer: "世间花叶不相伦花入金盆叶作尘惟有绿荷红菡萏卷舒开合任天真",
        data: {
          title: "赠荷花",
          author: "李商隐",
          dynasty: "唐",
          content: [
            "世间花叶不相伦，",
            "花入金盆叶作尘。",
            "惟有绿荷红菡萏，",
            "卷舒开合任天真。"
          ],
          pinyin: [
            "shì jiān huā yè bù xiāng lún",
            "huā rù jīn pén yè zuò chén",
            "wéi yǒu lǜ hé hóng hàn dàn",
            "juǎn shū kāi hé rèn tiān zhēn"
          ],
          keywords: ["世间花叶不相伦", "花入金盆叶作尘", "惟有绿荷红菡萏", "卷舒开合任天真"],
          cleanWords: "世间花叶不相伦花入金盆叶作尘惟有绿荷红菡萏卷舒开合任天真",
          translation: "世间的人们对待花和叶总是厚此薄彼、不能同等看待，美丽的鲜花被移植供养在富贵的金盆里，而绿叶却只能零落成泥、化作尘土。唯有那绿色的荷叶与红色的荷花紧紧相依、互相衬托，它们在清风中或卷或舒、或开或合，任由大自然去展现天真无邪的动人姿态。"
        }
      },
      {
        id: "poetry_69",
        worldId: WorldId.TangPoetry,
        name: "第 69 关",
        title: "江畔独步寻花·其六",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《江畔独步寻花·其六》· 杜甫\n黄四娘家花满蹊，千朵万朵压枝低。\n留连戏蝶时时舞，自在娇莺恰恰啼。",
        hint: "‘留连戏蝶时时舞，自在娇莺恰恰啼’。彩蝶在缤纷的花丛中翩翩起舞，黄莺在一旁发出清脆悦耳的鸣叫，真是一个美丽的春日！",
        explanation: "《江畔独步寻花七首·其六》是杜甫在成都草堂期间写的组诗之一。通过对黄四娘家花繁叶茂、彩蝶翩跹、娇莺啼鸣的生动描绘，生机勃勃地传达了诗人对大自然春天生机的由衷喜爱以及闲适自得的心情。",
        correctAnswer: "黄四娘家花满蹊千朵万朵压枝低留连戏蝶时时舞自在娇莺恰恰啼",
        data: {
          title: "江畔独步寻花·其六",
          author: "杜甫",
          dynasty: "唐",
          content: [
            "黄四娘家花满蹊，",
            "千朵万朵压枝低。",
            "留连戏蝶时时舞，",
            "自在娇莺恰恰啼。"
          ],
          pinyin: [
            "huáng sì niáng jiā huā mǎn qī",
            "qiān duǒ wàn duǒ yā zhī dī",
            "liú lián xì dié shí shí wǔ",
            "zì zài jiāo yīng qià qià tí"
          ],
          keywords: ["黄四娘家花满蹊", "千朵万朵压枝低", "留连戏蝶时时舞", "自在娇莺恰恰啼"],
          cleanWords: "黄四娘家花满蹊千朵万朵压枝低留连戏蝶时时舞自在娇莺恰恰啼",
          translation: "邻居黄四娘家的小路上开满了五彩缤纷的花朵，千朵万朵鲜花压得树枝都沉甸甸地垂了下来。流连忘返的彩蝶在花丛中时时翩翩起舞、互相嬉戏，自由自在的娇媚黄莺也正在发出‘恰恰’清脆动听的鸣叫声。"
        }
      },
      {
        id: "poetry_70",
        worldId: WorldId.TangPoetry,
        name: "第 70 关",
        title: "金陵图",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《金陵图》· 韦庄\n江雨霏霏江草齐，六朝如梦鸟空啼。\n无情最是台城柳，依旧烟笼十里堤。",
        hint: "‘六朝如梦鸟空啼’。昔日繁华的六朝古都如今已经像梦境一样消逝，空余鸟儿在细雨蒙蒙中悲啼。台城的柳树依旧在江堤旁如烟笼罩。",
        explanation: "《金陵图》是晚唐诗人韦庄瞻仰南京古画《金陵图》并结合实景所作的一首怀古伤今名作。此诗借江南烟雨和台城春柳，感叹历史兴衰以及唐朝晚期日薄西山的衰落，意境凄美而深沉。",
        correctAnswer: "江雨霏霏江草齐六朝如梦鸟空啼无情最是台城柳依旧烟笼十里堤",
        data: {
          title: "金陵图",
          author: "韦庄",
          dynasty: "唐",
          content: [
            "江雨霏霏江草齐，",
            "六朝如梦鸟空啼。",
            "无情最是台城柳，",
            "依旧烟笼十里堤。"
          ],
          pinyin: [
            "jiāng yǔ fēi fēi jiāng cǎo qí",
            "liù cháo rú mèng niǎo kōng tí",
            "wú qíng zuì shì tái chéng liǔ",
            "yī jiù yān lóng shí lǐ dī"
          ],
          keywords: ["江雨霏霏江草齐", "六朝如梦鸟空啼", "无情最是台城柳", "依旧烟笼十里堤"],
          cleanWords: "江雨霏霏江草齐六朝如梦鸟空啼无情最是台城柳依旧烟笼十里堤",
          translation: "江面上细雨霏霏、如烟如雾，江岸边的春草已经长得整整齐齐。金陵城过去的六朝繁华已经像一场春梦般消逝无踪，只有鸟儿在空旷中白白地啼叫着。最显得冷酷无情的就是那台城旧址上的翠柳，它们不顾人世的沧桑，依旧像往常一样，用如丝的烟雾笼罩着这十里长堤。"
        }
      },
      {
        id: "poetry_71",
        worldId: WorldId.TangPoetry,
        name: "第 71 关",
        title: "暮江吟",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《暮江吟》· 白居易\n一道残阳铺水中，半江瑟瑟半江红。\n可怜九月初三夜，露似真珠月似弓。",
        hint: "‘露似真珠月似弓’！多么迷人的江边秋夜，闪烁的露珠就像晶莹剔透的珍珠，夜空中高挂着一弯如银弓般的新月。",
        explanation: "《暮江吟》是白居易的名作。全诗通过对深秋夕阳西下以及夜晚江边景色的精妙描绘，借江水红绿交错、露如珍珠、月如银弓的瑰丽景象，表达了诗人远离朝廷纷争、置身大自然时的轻松愉悦与由衷赞美之情。",
        correctAnswer: "一道残阳铺水中半江瑟瑟半江红可怜九月初三夜露似真珠月似弓",
        data: {
          title: "暮江吟",
          author: "白居易",
          dynasty: "唐",
          content: [
            "一道残阳铺水中，",
            "半江瑟瑟半江红。",
            "可怜九月初三夜，",
            "露似真珠月似弓。"
          ],
          pinyin: [
            "yī dào cán yáng pū shuǐ zhōng",
            "bàn jiāng sè sè bàn jiāng hóng",
            "kě lián jiǔ yuè chū sān yè",
            "lù sì zhēn zhū yuè sì gōng"
          ],
          keywords: ["一道残阳铺水中", "半江瑟瑟半江红", "可怜九月初三夜", "露似真珠月似弓"],
          cleanWords: "一道残阳铺水中半江瑟瑟半江红可怜九月初三夜露似真珠月似弓",
          translation: "夕阳西下，一道柔和的残阳夕照斜铺在宽阔的江面上，在阳光的折射下，大江的水面呈现出半江碧绿、半江艳红的绚丽画面。最让人感到怜爱和陶醉的，就是这九月初三的美妙夜晚，草叶上的露珠闪烁着像珍珠般的光芒，夜空中高挂着一弯如银弓般明亮、美丽的新月。"
        }
      },
      {
        id: "poetry_72",
        worldId: WorldId.TangPoetry,
        name: "第 72 关",
        title: "浪淘沙·其一",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《浪淘沙·其一》· 刘禹锡\n九曲黄河万里沙，浪淘风簸自天涯。\n如今直上银河去，同到牵牛织女家。",
        hint: "‘九曲黄河万里沙，浪淘风簸自天涯’。黄河弯弯曲曲挟带着万里泥沙，狂风巨浪仿佛将泥沙从天边淘洗、簸荡而来，气势磅礴！",
        explanation: "《浪淘沙·其一》是唐代诗人刘禹锡的作品。全诗通过极具张力的艺术想象，描绘了黄河奔腾咆哮、万里泥沙的雄伟景观，并将神话传说（张骞乘槎寻银河）融入其中，表现了诗人百折不挠、豁达豪迈的英雄气概。",
        correctAnswer: "九曲黄河万里沙浪淘风簸自天涯如今直上银河去同到牵牛织女家",
        data: {
          title: "浪淘沙·其一",
          author: "刘禹锡",
          dynasty: "唐",
          content: [
            "九曲黄河万里沙，",
            "浪淘风簸自天涯。",
            "如今直上银河去，",
            "同到牵牛织女家。"
          ],
          pinyin: [
            "jiǔ qū huáng hé wàn lǐ shā",
            "làng táo fēng bǒ zì tiān yá",
            "rú jīn zhí shàng yín hé qù",
            "tóng dào qiān niú zhī nǚ jiā"
          ],
          keywords: ["九曲黄河万里沙", "浪淘风簸自天涯", "如今直上银河去", "同到牵牛织女家"],
          cleanWords: "九曲黄河万里沙浪淘风簸自天涯如今直上银河去同到牵牛织女家",
          translation: "黄河弯弯曲曲，一路上裹挟着万里大沙，在狂风和波涛巨浪的推簸下自天边滚滚奔腾而来。今天让我们乘着这汹涌澎湃的黄河浪涛一直冲上九霄的浩瀚银河去，一同到那神话里的牛郎、织女家里去做客吧。"
        }
      },
      {
        id: "poetry_73",
        worldId: WorldId.TangPoetry,
        name: "第 73 关",
        title: "小松",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《小松》· 杜荀鹤\n自小刺头深草里，而今渐觉出蓬蒿。\n时人不识凌云木，直待凌云始道高。",
        hint: "‘时人不识凌云木，直待凌云始道高’。小松树一开始隐藏在深草丛里，人们都看不起它。等到它长成参天大树、直插云霄时，大家才惊叹它的高大。",
        explanation: "《小松》是晚唐诗人杜荀鹤的一首哲理喻世诗。此诗借一棵从小草丛中艰难生长、最终长成参天大树的小松树，讽刺了世俗之人眼光短浅、不识少年英才，同时也勉励人们要坚韧不拔，早晚能一展宏图。",
        correctAnswer: "自小刺头深草里而今渐觉出蓬蒿时人不识凌云木直待凌云始道高",
        data: {
          title: "小松",
          author: "杜荀鹤",
          dynasty: "唐",
          content: [
            "自小刺头深草里，",
            "而今渐觉出蓬蒿。",
            "时人不识凌云木，",
            "直待凌云始道高。"
          ],
          pinyin: [
            "zì xiǎo cì tóu shēn cǎo lǐ",
            "ér jīn jiàn jué chū péng hāo",
            "shí rén bù shí líng yún mù",
            "zhí dài líng yún sǐ dào gāo"
          ],
          keywords: ["自小刺头深草里", "而今渐觉出蓬蒿", "时人不识凌云木", "直待凌云始道高"],
          cleanWords: "自小刺头深草里而今渐觉出蓬蒿时人不识凌云木直待凌云始道高",
          translation: "小松树从小就在深草乱石堆里露出了尖尖的刺角，如今它已经渐渐生长出来、高出了周围杂乱的蓬蒿。世俗的人们平时认不出它是一棵能够直刺云天的凌云大树，非要等到它真的耸立云霄、耸入天空的时候，大家才会齐声夸奖它高大伟岸。"
        }
      },
      {
        id: "poetry_74",
        worldId: WorldId.TangPoetry,
        name: "第 74 关",
        title: "蜂",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《蜂》· 罗隐\n不论平地与山尖，无限风光尽被占。\n采得百花成蜜后，为谁辛苦为谁甜？",
        hint: "‘采得百花成蜜后，为谁辛苦为谁甜’。蜜蜂飞遍平原与高山，辛勤地采集百花酿成了甜美的蜂蜜，然而这辛苦酿造的甜美究竟是为谁而忙碌呢？",
        explanation: "《蜂》是唐代诗人罗隐写的一首充满讽喻哲理的诗。此诗通过对蜜蜂辛勤采集百花、酿造甜蜜却不占有成果的生动描写，赞美了劳动者的无私奉献，同时也委婉、辛辣地讽刺了封建社会统治阶级不劳而获的现象。",
        correctAnswer: "不论平地与山尖无限风光尽被占采得百花成蜜后为谁辛苦为谁甜",
        data: {
          title: "蜂",
          author: "罗隐",
          dynasty: "唐",
          content: [
            "不论平地与山尖，",
            "无限风光尽被占。",
            "采得百花成蜜后，",
            "为谁辛苦为谁甜？"
          ],
          pinyin: [
            "bù lùn píng dì yǔ shān jiān",
            "wú xiàn fēng guāng jìn bèi zhàn",
            "cǎi dé bǎi huā chéng mì hòu",
            "wèi shéi xīn kǔ wèi shéi tián"
          ],
          keywords: ["不论平地与山尖", "无限风光尽被占", "采得百花成蜜后", "为谁辛苦为谁甜"],
          cleanWords: "不论平地与山尖无限风光尽被占采得百花成蜜后为谁辛苦为谁甜",
          translation: "不论是在平坦的原野还是在险峻的高山顶端，只要是鲜花盛开的无限美好风光，全都有蜜蜂辛勤忙碌的身影。当它们千辛万苦采集百花酿造成甜美的蜂蜜之后，这无私而沉重的劳动究竟是为谁而辛苦，又究竟是在让谁享受这甘甜呢？"
        }
      },
      {
        id: "poetry_75",
        worldId: WorldId.TangPoetry,
        name: "第 75 关",
        title: "淮上喜会梁川故人",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《淮上喜会梁川故人》· 韦应物\n江汉曾为客，相逢每醉还。\n浮云一别后，流水十年间。",
        hint: "‘浮云一别后，流水十年间’。我们像天空的浮云一样一别之后，十年时光竟然像流水一样悄悄流逝，让人无限感慨。",
        explanation: "《淮上喜会梁川故人》是韦应物写的一首非常感人的老友重逢诗。通过回忆昔日的豪饮相逢，再对比离别后如‘浮云流水’般飞逝的十年岁月，真挚深沉地表达了人生聚散无常、沧海沧田的慨叹。",
        correctAnswer: "江汉曾为客相逢每醉还浮云一别后流水十年间",
        data: {
          title: "淮上喜会梁川故人",
          author: "韦应物",
          dynasty: "唐",
          content: [
            "江汉曾为客，",
            "相逢每醉还。",
            "浮云一别后，",
            "流水十年间。"
          ],
          pinyin: [
            "jiāng hàn céng wéi kè",
            "xiāng féng měi zuì huán",
            "fú yún yī bié hòu",
            "liú shuǐ shí nián jiān"
          ],
          keywords: ["江汉曾为客", "相逢每醉还", "浮云一别后", "流水十年间"],
          cleanWords: "江汉曾为客相逢每醉还浮云一别后流水十年间",
          translation: "当年在长江汉水一带我们都曾是客居他乡的旅人，每次相逢都必然会开怀大笑、痛快畅饮，直喝得酩酊大醉才肯回去。谁能想到像天空中漂浮的游云一样匆匆一别之后，那滚滚向东的流水中已经度过了整整十年的漫长时光啊。"
        }
      },
      {
        id: "poetry_76",
        worldId: WorldId.TangPoetry,
        name: "第 76 关",
        title: "蝉",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《蝉》· 虞世南\n垂緌饮清露，流响出疏桐。\n居高声自远，非是藉秋风。",
        hint: "‘居高声自远，非是藉秋风’。高蝉在大树的高处发出清脆的叫声，声音自然能够传到很远的地方，并不是凭借了秋风的力量，比喻品德高尚的人名声自然会远扬。",
        explanation: "《蝉》是唐代初期名臣虞世南的咏物名篇。诗人借高居梧桐之巅、饮用清莹露水、鸣声悠远的蝉，寄托了自己对高洁品质、孤傲人格的执着追求，阐释了‘高尚品格不需要依附外力提携便自然受人敬仰’的深刻哲理。",
        correctAnswer: "垂緌饮清露流响出疏桐居高声自远非是藉秋风",
        data: {
          title: "蝉",
          author: "虞世南",
          dynasty: "唐",
          content: [
            "垂緌饮清露，",
            "流响出疏桐。",
            "居高声自远，",
            "非是藉秋风。"
          ],
          pinyin: [
            "chuí ruí yǐn qīng lù",
            "liú xiǎng chū shū tóng",
            "jū gāo shēng zì yuǎn",
            "fēi shì jiè qiū fēng"
          ],
          keywords: ["垂緌饮清露", "流响出疏桐", "居高声自远", "非是藉秋风"],
          cleanWords: "垂緌饮清露流响出疏桐居高声自远非是藉秋风",
          translation: "树上的高蝉垂下触角、欢快地饮用着晶莹、纯洁的秋露，它那清脆、响亮的鸣叫声从稀疏的梧桐树枝叶间远远地传扬开来。正因为它身居高处，声音自然能够传播得悠远开阔，这绝不是凭借或者依赖了深秋的瑟瑟秋风。"
        }
      },
      {
        id: "poetry_77",
        worldId: WorldId.TangPoetry,
        name: "第 77 关",
        title: "题都城南庄",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《题都城南庄》· 崔护\n去年今日此门中，人面桃花相映红。\n人面不知何处去，桃花依旧笑春风。",
        hint: "‘人面不知何处去，桃花依旧笑春风’。去年的今天在这个院子里，美丽姑娘红润的脸庞与绽放的桃花互相映衬。今年姑娘已经不知道去哪了，只有桃花依旧在春风中盛开。",
        explanation: "《题都城南庄》是唐代诗人崔护创作的一首传奇般的抒情诗。全诗通过‘去年今日’与‘今年今日’相同背景下截然不同的人事对比，生动形象地流露出了因时光流逝、人事已非、缘分错失而产生的惆怅与无限惋惜之情。",
        correctAnswer: "去年今日此门中人面桃花相映红人面不知何处去桃花依旧笑春风",
        data: {
          title: "题都城南庄",
          author: "崔护",
          dynasty: "唐",
          content: [
            "去年今日此门中，",
            "人面桃花相映红。",
            "人面不知何处去，",
            "桃花依旧笑春风。"
          ],
          pinyin: [
            "qù nián jīn rì cǐ mén zhōng",
            "rén miàn táo huā xiāng yìng hóng",
            "rén miàn bù zhī hé chù qù",
            "táo huā yī jiù xiào chūn fēng"
          ],
          keywords: ["去年今日此门中", "人面桃花相映红", "人面不知何处去", "桃花依旧笑春风"],
          cleanWords: "去年今日此门中人面桃花相映红人面不知何处去桃花依旧笑春风",
          translation: "去年的今天，就在这户静谧的人家门前，那位美丽的姑娘红润、娇羞的脸庞与满树粉嫩的桃花交相辉映、显得格外娇艳。如今重访，那美丽的脸庞已经不知道去往了何处，只留下这满树绚烂的桃花，依然一如既往地在柔和的春风中绽放、欢笑。"
        }
      },
      {
        id: "poetry_78",
        worldId: WorldId.TangPoetry,
        name: "第 78 关",
        title: "春雪",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《春雪》· 韩愈\n新年都未有芳华，二月初惊见草芽。\n白雪却嫌春色晚，故穿庭树作飞花。",
        hint: "‘白雪却嫌春色晚，故穿庭树作飞花’。春回大地，可是二月里连一朵花都没开。白雪似乎嫌春姑娘来得太迟，故意变成漫天飞花在庭院的大树间穿行飞舞。",
        explanation: "《春雪》是唐代文学家韩愈的名作。此诗将寒冬白雪赋予了极富人情味的灵性，写白雪不甘春色迟到，故意装扮成花朵在树林间飞舞，构思极其独特新奇，语言生动俏皮，充满了对春天的无限向往。",
        correctAnswer: "新年都未有芳华二月初惊见草芽白雪却嫌春色晚故穿庭树作飞花",
        data: {
          title: "春雪",
          author: "韩愈",
          dynasty: "唐",
          content: [
            "新年都未有芳华，",
            "二月初惊见草芽。",
            "白雪却嫌春色晚，",
            "故穿庭树作飞花。"
          ],
          pinyin: [
            "xīn nián dōu wèi yǒu fāng huá",
            "èr yuè chū jīng jiàn cǎo yá",
            "bái xuě què xián chūn sè wǎn",
            "gù chuān tíng shù zuò fēi huā"
          ],
          keywords: ["新年都未有芳华", "二月初惊见草芽", "白雪却嫌春色晚", "故穿庭树作飞花"],
          cleanWords: "新年都未有芳华二月初惊见草芽白雪却嫌春色晚故穿庭树作飞花",
          translation: "新年都已经来到了却依然看不见任何花朵绽放的芬芳，直到农历二月初，才在惊喜之中发现泥土里刚刚萌发出的嫩绿草芽。洁白、飘落的白雪似乎嫌春天的脚步来得太晚了，于是在天空中故意穿行于庭院的树木枝叶之间，装扮成一片片漫天飞舞的洁白春花。"
        }
      },
      {
        id: "poetry_79",
        worldId: WorldId.TangPoetry,
        name: "第 79 关",
        title: "晚春",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《晚春》· 韩愈\n草树知春不久归，百般红紫斗芳菲。\n杨花榆荚无才思，惟解漫天作雪飞。",
        hint: "‘草树知春不久归，百般红紫斗芳菲’。花草树木也知道春天马上就要结束了，于是使出浑身解数、万紫千红地竞相绽放，展示出春天最后的生机。",
        explanation: "《晚春》是韩愈写的一首极具理趣与童心的咏物诗。诗人通过拟人化手法写暮春时节百花‘争奇斗艳’以及杨花榆荚不甘平庸、‘化雪漫天’的蓬勃景象，勉励人们要珍惜青春，即使资质平平也要积极进取、绽放光芒。",
        correctAnswer: "草树知春不久归百般红紫斗芳菲杨花榆荚无才思惟解漫天作雪飞",
        data: {
          title: "晚春",
          author: "韩愈",
          dynasty: "唐",
          content: [
            "草树知春不久归，",
            "百般红紫斗芳菲。",
            "杨花榆荚无才思，",
            "惟解漫天作雪飞。"
          ],
          pinyin: [
            "cǎo shù zhī chūn bù jiǔ guī",
            "bǎi bān hóng zǐ dòu fāng fēi",
            "yáng huā yú jiá wú cái sī",
            "wéi jiě màn tiān zuò xuě fēi"
          ],
          keywords: ["草树知春不久归", "百般红紫斗芳菲", "杨花榆荚无才思", "惟解漫天作雪飞"],
          cleanWords: "草树知春不久归百般红紫斗芳菲杨花榆荚无才思惟解漫天作雪飞",
          translation: "大自然的花草树木仿佛也知道温暖的春天马上就要归去了，于是大家都争先恐后地拿出千姿百态的红、紫娇艳，在大地上竞相斗艳、展示着最后的芬芳。而那些资质平凡、没有才华的杨花和榆荚，虽然开不出名贵夺目的鲜花，却也不甘寂寞，只懂得变成漫天的白色柳絮和雪花一样，在春风里洋洋洒洒、自由飞舞。"
        }
      },
      {
        id: "poetry_80",
        worldId: WorldId.TangPoetry,
        name: "第 80 关",
        title: "逢入京使",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《逢入京使》· 岑参\n故园东望路漫漫，双袖龙钟泪不干。\n马上相逢无纸笔，凭君传语报平安。",
        hint: "‘马上相逢无纸笔，凭君传语报平安’。在前往西域的漫长旅途中，恰逢要回长安的使者，马背上相逢没有纸和笔，只能拜托你捎一句话，向我的家人报个平安。",
        explanation: "《逢入京使》是唐代杰出边塞诗人岑参的名篇。此诗写诗人在奔赴安西都护府行役途中，与要回京城的使者相遇时的场景。全诗没有堆砌词藻，纯用白描手法，写无纸笔下的‘传语平安’，极具人间温情和深切的思乡游子之情。",
        correctAnswer: "故园东望路漫漫双袖龙钟泪不干马上相逢无纸笔凭君传语报平安",
        data: {
          title: "逢入京使",
          author: "岑参",
          dynasty: "唐",
          content: [
            "故园东望路漫漫，",
            "双袖龙钟泪不干。",
            "马上相逢无纸笔，",
            "凭君传语报平安。"
          ],
          pinyin: [
            "gù yuán dōng wàng lù màn màn",
            "shuāng xiù lóng zhōng lèi bù gān",
            "mǎ shàng xiāng féng wú zhǐ bǐ",
            "píng jūn chuán yǔ bào píng ān"
          ],
          keywords: ["故园东望路漫漫", "双袖龙钟泪不干", "马上相逢无纸笔", "凭君传语报平安"],
          cleanWords: "故园东望路漫漫双袖龙钟泪不干马上相逢无纸笔凭君传语报平安",
          translation: "向东凝望着遥远的故乡，道路是那样地修远和漫长，一路上止不住落下的游子热泪，早已将两只衣袖打得湿漉漉的，怎么也擦不干。在这荒凉的丝绸之路上，马背上相逢却偏偏没有纸墨笔迹，只能拜托你这一位要回京的使者捎口信回去，向我的老母亲和家人报个平安。"
        }
      },
      {
        id: "poetry_81",
        worldId: WorldId.TangPoetry,
        name: "第 81 关",
        title: "早春呈水部张十八员外",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《早春呈水部张十八员外》· 韩愈\n天街小雨润如酥，草色遥看近却无。\n最是一年春好处，绝胜烟柳满皇都。",
        hint: "‘天街小雨润如酥，草色遥看近却无’。长安城的大街上，早春的小雨滋润得像酥油一样细腻。小草刚刚探出泥土，远远望去有一片浅绿，走近一看却又不见了，意境极美！",
        explanation: "《早春呈水部张十八员外》是韩愈最著名的七言绝句之一。此诗极其精妙、传神地捕捉到了初春长安小雨初霁、野草若隐若现的初春生机，并高度赞赏这种极其清新、充满生机与生命萌芽力量的时刻，赞美其胜过暮春那种烟柳满城的喧闹景色。",
        correctAnswer: "天街小雨润如酥草色遥看近却无最是一年春好处绝胜烟柳满皇都",
        data: {
          title: "早春呈水部张十八员外",
          author: "韩愈",
          dynasty: "唐",
          content: [
            "天街小雨润如酥，",
            "草色遥看近却无。",
            "最是一年春好处，",
            "绝胜烟柳满皇都。"
          ],
          pinyin: [
            "tiān jiē xiǎo yǔ rùn rú sū",
            "cǎo sè yáo kàn jìn què wú",
            "zuì shì yī nián chūn hǎo chù",
            "jué shèng yān liǔ mǎn huáng dū"
          ],
          keywords: ["天街小雨润如酥", "草色遥看近却无", "最是一年春好处", "绝胜烟柳满皇都"],
          cleanWords: "天街小雨润如酥草色遥看近却无最是一年春好处绝胜烟柳满皇都",
          translation: "长安的大街上飘洒着如酥油般细腻、温润的早春细雨，柔和地滋润着万物。刚刚发芽的草色远远望去隐隐约约有一抹朦胧的浅绿，然而走近了细看却又稀稀落落、不复存在。这初春时刻是一年里春光最美好、最富有希望的时候，远远胜过那晚春时节柳絮如烟、笼罩满城的暮春喧闹景色。"
        }
      },
      {
        id: "poetry_82",
        worldId: WorldId.TangPoetry,
        name: "第 82 关",
        title: "峨眉山月歌",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《峨眉山月歌》· 李白\n峨眉山月半轮秋，影入平羌江水流。\n夜发清溪向三峡，思君不见下渝州。",
        hint: "‘峨眉山月半轮秋，影入平羌江水流’。秋夜，半轮明月斜挂在清幽的峨眉山头，月光的倒影落在清澈的平羌江水中，随着江水奔腾流逝，抒发了诗人初出巴蜀、思念故友的深情。",
        explanation: "《峨眉山月歌》是李白二十四岁时初离蜀地、顺江东下时写的抒情佳作。全诗通过描绘秋月、江水、清溪、三峡、渝州等一连串变幻的动感风光，连贯、轻快地抒发了诗人的壮志豪情以及对蜀中故乡老友的依依眷恋之情。",
        correctAnswer: "峨眉山月半轮秋影入平羌江水流夜发清溪向三峡思君不见下渝州",
        data: {
          title: "峨眉山月歌",
          author: "李白",
          dynasty: "唐",
          content: [
            "峨眉山月半轮秋，",
            "影入平羌江水流。",
            "夜发清溪向三峡，",
            "思君不见下渝州。"
          ],
          pinyin: [
            "é méi shān yuè bàn lún qiū",
            "yǐng rù píng qiāng jiāng shuǐ liú",
            "yè fā qīng xī xiàng sān xiá",
            "sī jūn bù jiàn xià yú zhōu"
          ],
          keywords: ["峨眉山月半轮秋", "影入平羌江水流", "夜发清溪向三峡", "思君不见下渝州"],
          cleanWords: "峨眉山月半轮秋影入平羌江水流夜发清溪向三峡思君不见下渝州",
          translation: "高耸的峨眉山上升起了一弯秋天的半轮明月，清皎的月影倒映在平羌江水中，跟随着奔腾的秋江之水一同东流而去。在漆黑的夜色里我驾着轻舟从清溪驿出发、迎风斩浪驶向三峡，思念着你这位挚友，然而明月和船只走得太快，让我无法再看见你，只能带着一腔深情孤零零地下行到渝州了。"
        }
      },
      {
        id: "poetry_83",
        worldId: WorldId.TangPoetry,
        name: "第 83 关",
        title: "秋风引",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《秋风引》· 刘禹锡\n何处秋风至？萧萧送雁群。\n朝来入庭树，孤客最先闻。",
        hint: "‘何处秋风至？萧萧送雁群’。瑟瑟的秋风不知道从何处吹来，在空中伴随着萧萧落叶送走了南飞的雁群。清晨秋风吹入庭院的树木，最先听到的，是寄居在外的孤独游子。",
        explanation: "《秋风引》是唐代诗人刘禹锡的作品。这是一首非常婉转、含蓄的思乡诗。诗人通过对‘秋风萧萧’、‘雁群南飞’以及‘孤客先闻庭树风声’等极其微细的感官描写，极其深刻地勾勒出寄人篱下、孤独在外之人的敏感和浓郁的思乡之情。",
        correctAnswer: "何处秋风至萧萧送雁群朝来入庭树孤客最先闻",
        data: {
          title: "秋风引",
          author: "刘禹锡",
          dynasty: "唐",
          content: [
            "何处秋风至？",
            "萧萧送雁群。",
            "朝来入庭树，",
            "孤客最先闻。"
          ],
          pinyin: [
            "hé chù qiū fēng zhì",
            "xiāo xiāo sòng yàn qún",
            "zhāo lái rù tíng shù",
            "gū kè zuì xiān wén"
          ],
          keywords: ["何处秋风至", "萧萧送雁群", "朝来入庭树", "孤客最先闻"],
          cleanWords: "何处秋风至萧萧送雁群朝来入庭树孤客最先闻",
          translation: "瑟瑟的凉意袭来，这秋风究竟是从哪里开始吹拂的呢？在秋天辽阔的天空里，它正伴随着沙沙的落叶声，把一队队飞向南方过冬的鸿雁群送出视野。清晨时分它呼呼吹入庭院的大树树枝间、吹落了满地的枯叶，在繁杂的人世间，只有那个羁旅他乡、夜不能寐的孤独游客，才是最先敏锐地听到这凄凉风声的人啊。"
        }
      },
      {
        id: "poetry_84",
        worldId: WorldId.TangPoetry,
        name: "第 84 关",
        title: "望洞庭",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《望洞庭》· 刘禹锡\n湖光秋月两相和，潭面无风镜未磨。\n遥望洞庭山水翠，白银盘里一青螺。",
        hint: "‘遥望洞庭山水翠，白银盘里一青螺’！刘禹锡用奇妙的想象，把月光下水平如镜、浩瀚的洞庭湖比作一只晶莹如雪的白银盘，而把湖中青翠的君山比作白银盘里的一只玲珑青螺，极其富有诗情画意！",
        explanation: "《望洞庭》是刘禹锡贬任夔州刺史途中经过洞庭湖时创作的杰出山水名篇。全诗放弃了悲秋的陈腐俗套，而是以清新、奇妙、博大的想象，将洞庭湖的秋月、湖水、君山完美勾勒在一起，意境极其开阔、柔美而祥和。",
        correctAnswer: "湖光秋月两相和潭面无风镜未磨遥望洞庭山水翠白银盘里一青螺",
        data: {
          title: "望洞庭",
          author: "刘禹锡",
          dynasty: "唐",
          content: [
            "湖光秋月两相和，",
            "潭面无风镜未磨。",
            "遥望洞庭山水翠，",
            "白银盘里一青螺。"
          ],
          pinyin: [
            "hú guāng qiū yuè liǎng xiāng hé",
            "tán miàn wú fēng jìng wèi mó",
            "yáo wàng dòng tíng shān shuǐ cuì",
            "bái yín pán lǐ yī qīng luó"
          ],
          keywords: ["湖光秋月两相和", "潭面无风镜未磨", "遥望洞庭山水翠", "白银盘里一青螺"],
          cleanWords: "湖光秋月两相和潭面无风镜未磨遥望洞庭山水翠白银盘里一青螺",
          translation: "清澈的洞庭湖水色在朦胧、皎洁的秋夜月光下交相辉映、显得无比的安详与柔和，湖面上风平浪静，浩瀚的湖水就像一面尚未磨拭擦亮的巨大铜镜。从远处遥望，那倒映在波光里的洞庭山水翠绿欲滴，就仿佛是一只晶莹、高贵的白银盘子里，精致地摆放着一颗小巧玲珑、泛着青翠光泽的青螺。"
        }
      },
      {
        id: "poetry_85",
        worldId: WorldId.TangPoetry,
        name: "第 85 关",
        title: "寄扬州韩绰判官",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《寄扬州韩绰判官》· 杜牧\n青山隐隐水迢迢，秋尽江南草未凋。\n二十四桥明月夜，玉人何处教吹箫？",
        hint: "‘二十四桥明月夜，玉人何处教吹箫’。江南的青山隐约起伏，江水遥远流逝。在明月高挂、如诗如画的二十四桥之上，我的好朋友，你究竟在哪里悠闲地教美女吹箫呢？",
        explanation: "《寄扬州韩绰判官》是杜牧的一首写景怀人佳作。此诗通过对扬州如画山水和秀美夜色的细腻描绘，借调侃、询问友人韩绰生活惬意的口吻，表达了诗人对繁华旧地扬州的深切怀念和对老友的无限思念之情，语意闲适、韵味悠长。",
        correctAnswer: "青山隐隐水迢迢秋尽江南草未凋二十四桥明月夜玉人何处教吹箫",
        data: {
          title: "寄扬州韩绰判官",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "青山隐隐水迢迢，",
            "秋尽江南草未凋。",
            "二十四桥明月夜，",
            "玉人何处教吹箫？"
          ],
          pinyin: [
            "qīng shān yǐn yǐn shuǐ tiáo tiáo",
            "qiū jìn jiāng nán cǎo wèi diāo",
            "èr shí sì qiáo míng yuè yè",
            "yù rén hé chù jiāo chuī xiāo"
          ],
          keywords: ["青山隐隐水迢迢", "秋尽江南草未凋", "二十四桥明月夜", "玉人何处教吹箫"],
          cleanWords: "青山隐隐水迢迢秋尽江南草未凋二十四桥明月夜玉人何处教吹箫",
          translation: "连绵起伏的青山在远方隐隐约约，清澈的江水在视线中源远流长、无边无际，江南的深秋已经快要结束了，可是由于气候温暖，百草竟然还没有凋零。在这皎洁、柔和的明月照耀在扬州古老、著名的二十四桥之上的静谧夜晚，你这位风流潇洒的朋友究竟正在哪一处美景里，安逸、闲适地教着佳人吹奏着箫曲呢？"
        }
      },
      {
        id: "poetry_86",
        worldId: WorldId.TangPoetry,
        name: "第 86 关",
        title: "赠别·其一",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赠别·其一》· 杜牧\n娉娉袅袅十三余，豆蔻梢头二月初。\n春风十里扬州路，卷上珠帘总不如。",
        hint: "‘娉娉袅袅十三余，豆蔻梢头二月初’。用早春二月梢头含苞待放的豆蔻花，来形容十三岁少女的轻盈身姿与纯真美好，是文学史上的千古绝唱。",
        explanation: "《赠别二首·其一》是杜牧离任扬州时写给一位年轻歌女的赠别诗。诗人高度赞美了少女天真无邪、轻盈娇媚的绰约风姿，感叹即使阅尽扬州繁华无数，但在他眼中都没有人能比得上她，情深意切、格调高雅不俗。",
        correctAnswer: "娉娉袅袅十三余豆蔻梢头二月初春风十里扬州路卷上珠帘总不如",
        data: {
          title: "赠别·其一",
          author: "杜牧",
          dynasty: "唐",
          content: [
            "娉娉袅袅十三余，",
            "豆蔻梢头二月初。",
            "春风十里扬州路，",
            "卷上珠帘总不如。"
          ],
          pinyin: [
            "pīng pīng niǎo niǎo shí sān yú",
            "dòu kòu shāo tóu èr yuè chū",
            "chūn fēng shí lǐ yáng zhōu lù",
            "juǎn shàng zhū lián zǒng bù rú"
          ],
          keywords: ["娉娉袅袅十三余", "豆蔻梢头二月初", "春风十里扬州路", "卷上珠帘总不如"],
          cleanWords: "娉娉袅袅十三余豆蔻梢头二月初春风十里扬州路卷上珠帘总不如",
          translation: "姿态轻盈、体态娇美的十三多岁少女，就好像是早春二月初挂在树梢枝头、刚刚含苞欲放的豆蔻花，充满了纯真与稚气。尽管扬州街道十里繁华、充满了无数倾国倾城的佳丽，但在卷起珍珠窗帘的无数闺秀之中，大家谁也比不上她的那份纯洁和天真烂漫。"
        }
      },
      {
        id: "poetry_87",
        worldId: WorldId.TangPoetry,
        name: "第 87 关",
        title: "菊花",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《菊花》· 元稹\n秋丛绕舍似陶家，遍绕篱边日渐斜。\n不是花中偏爱菊，此花开尽更无花。",
        hint: "‘不是花中偏爱菊，此花开尽更无花’。我并不是在世间的百花中单单偏心、喜爱菊花，而是因为当菊花在这个秋天完全凋谢之后，天地间就再也没有其他的花朵可以绽放和观赏了。",
        explanation: "《菊花》是唐代诗人元稹的一首经典的咏菊佳作。此诗没有像一般咏菊诗一样去孤傲地堆砌词藻，而是以一句‘此花开尽更无花’的平易近人、充满深情的生活化感叹，含蓄地表达了对菊花坚韧不拔、傲霜耐寒、执着操守品质的极高赞美，耐人寻味。",
        correctAnswer: "秋丛绕舍似陶家遍绕篱边日渐斜不是花中偏爱菊此花开尽更无花",
        data: {
          title: "菊花",
          author: "元稹",
          dynasty: "唐",
          content: [
            "秋丛绕舍似陶家，",
            "遍绕篱边日渐斜。",
            "不是花中偏爱菊，",
            "此花开尽更无花。"
          ],
          pinyin: [
            "qiū cóng rào shè sì táo jiā",
            "biàn rào lí biān rì jiàn xié",
            "bú shì huā zhōng piān ài jú",
            "cǐ huā kāi jìn gèng wú huā"
          ],
          keywords: ["秋丛绕舍似陶家", "遍绕篱边日渐斜", "不是花中偏爱菊", "此花开尽更无花"],
          cleanWords: "秋丛绕舍似陶家遍绕篱边日渐斜不是花中偏爱菊此花开尽更无花",
          translation: "一丛丛缤纷绽放的秋菊围绕着我简陋的房舍，这里仿佛成了陶渊明隐居的那片清幽家园；我不知不觉地在篱笆边绕着走，久久留连、观赏，连夕阳已经不知不觉地偏斜下山都未曾惊觉。我真的不是在世间这大好的万花丛中单单偏心、溺爱菊花，而是因为在深秋里，当这坚强的菊花都完全凋谢之后，天地间就再也没有任何其他花朵可以在这寒冷中开放和观赏了。"
        }
      },
      {
        id: "poetry_88",
        worldId: WorldId.TangPoetry,
        name: "第 88 关",
        title: "从军行七首·其四",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《从军行七首·其四》· 王昌龄\n青海长云暗雪山，孤城遥望玉门关。\n黄沙百战穿金甲，不破楼兰终不还。",
        hint: "‘黄沙百战穿金甲，不破楼兰终不还’！在荒凉的茫茫大漠里历经了上百次残酷的激战，连身上的黄金战甲都被漫天的风沙和锋利的武器磨穿，但只要不彻底击败来犯之敌，不保家卫国，战士们就誓死不回乡！",
        explanation: "《从军行七首·其四》是王昌龄边塞诗的巅峰之作。全诗前半段通过描绘青海湖云雾遮天蔽日、祁连雪山暗淡、孤城玉门关遥遥相对的宏大背景，勾勒出边关荒凉艰苦的环境，后半段则以慷慨激昂、铿锵有力的语言，吐露了守边将士百折不挠、誓死报国、视死如归的爱国豪情。",
        correctAnswer: "青海长云暗雪山孤城遥望玉门关黄沙百战穿金甲不破楼兰终不还",
        data: {
          title: "从军行七首·其四",
          author: "王昌龄",
          dynasty: "唐",
          content: [
            "青海长云暗雪山，",
            "孤城遥望玉门关。",
            "黄沙百战穿金甲，",
            "不破楼兰终不还。"
          ],
          pinyin: [
            "qīng hǎi cháng yún àn xuě shān",
            "gū chéng yáo wàng yù mén guān",
            "huáng shā bǎi zhàn chuān jīn jiǎ",
            "bú pò lóu lán zhōng bù hái"
          ],
          keywords: ["青海长云暗雪山", "孤城遥望玉门关", "黄沙百战穿金甲", "不破楼兰终不还"],
          cleanWords: "青海长云暗雪山孤城遥望玉门关黄沙百战穿金甲不破楼兰终不还",
          translation: "青海湖上空漫天弥漫的阴云将巍巍的祁连雪山也遮盖得暗淡无光，守城的将士们登高遥望着那远在万里、苍茫关隘玉门关。守边将士在广袤的黄沙战场里经历了成百上千次的残酷血战，连身上坚固的黄金铠甲都被磨穿击碎，但我们心中的誓言无比坚定：只要不打败敌人、彻底攻破敌寇的楼兰防线、不保全家国的太平安宁，我们就绝对不回故乡！"
        }
      },
      {
        id: "poetry_89",
        worldId: WorldId.TangPoetry,
        name: "第 89 关",
        title: "凉州词",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《凉州词》· 王翰\n葡萄美酒夜光杯，欲饮琵琶马上催。\n醉卧沙场君莫笑，古来征战几人回。",
        hint: "‘醉卧沙场君莫笑，古来征战几人回’。在精美的玉杯里斟满了西域葡萄美酒，正想要痛快畅饮，马背上悠扬、急促的琵琶声便催促着将士们出征。即使醉倒在沙场上请你也不要笑话，自古以来奔赴战场打仗的人，又有几人能够平安回来呢？",
        explanation: "《凉州词》是王翰流传千古的边塞名篇。全诗以极其绚丽而欢快的豪饮场景开始（葡萄美酒、夜光玉杯、急促琵琶），却以一句看透生死、视死如归、悲壮而豪迈的‘古来征战几人回’收尾，将边防战士的生死豪情、视死如归的欢歌与旷达展现得淋漓尽致，具有极强的艺术感染力。",
        correctAnswer: "葡萄美酒夜光杯欲饮琵琶马上催醉卧沙场君莫笑古来征战几人回",
        data: {
          title: "凉州词",
          author: "王翰",
          dynasty: "唐",
          content: [
            "葡萄美酒夜光杯，",
            "欲饮琵琶马上催。",
            "醉卧沙场君莫笑，",
            "古来征战几人回。"
          ],
          pinyin: [
            "pú táo měi jiǔ yè guāng bēi",
            "yù yǐn pí pá mǎ shàng cuī",
            "zuì wò shā chǎng jūn mò xiào",
            "gǔ lái zhēng zhàn jǐ rén huí"
          ],
          keywords: ["葡萄美酒夜光杯", "欲饮琵琶马上催", "醉卧沙场君莫笑", "古来征战几人回"],
          cleanWords: "葡萄美酒夜光杯欲饮琵琶马上催醉卧沙场君莫笑古来征战几人回",
          translation: "晶莹剔透、奢华的夜光玉杯中斟满了甘甜、香醇的西域葡萄酒，刚想要举杯痛快饮用，那马背上悠扬、急促的琵琶声便阵阵响起，催促着战马与士兵奔赴前线。今天如果喝个酩酊大醉、醉倒在漫漫的沙场上，请你千万不要笑话，自古以来奔赴边疆抗敌征战的将士，究竟又有几个人能够平安回到可爱的故乡呢？"
        }
      },
      {
        id: "poetry_90",
        worldId: WorldId.TangPoetry,
        name: "第 90 关",
        title: "赋得古原草送别",
        question: "请听写或跟读背诵这首著名的唐诗：\n\n《赋得古原草送别》· 白居易\n离离原上草，一岁一枯荣。\n野火烧不尽，春风吹又生。",
        hint: "‘野火烧不尽，春风吹又生’！在辽阔的古原上，青草每年都经历了繁茂和枯萎。即使残酷无情的野火把野草烧得精光，当温暖的春风再次吹拂大地时，它又会坚强、生机勃勃地破土而出，展现了无穷无尽的生命力！",
        explanation: "《赋得古原草送别》是唐代大诗人白居易十六岁时写的惊世成名之作。此诗虽然是命题送别诗，但诗人借古原野草顽强、坚韧不拔的生命周期（一岁一枯荣、野火烧不尽、春风吹又生），写出了生命力的执着与伟大。‘野火烧不尽，春风吹又生’早已成为中华文化中歌颂坚韧生命、自强不息品质的最高赞歌。",
        correctAnswer: "离离原上草一岁一枯荣野火烧不尽春风吹又生",
        data: {
          title: "赋得古原草送别",
          author: "白居易",
          dynasty: "唐",
          content: [
            "离离原上草，",
            "一岁一枯荣。",
            "野火烧不尽，",
            "春风吹又生。"
          ],
          pinyin: [
            "lí lí yuán shàng cǎo",
            "yī suì yī kū róng",
            "yě huǒ shāo bú jìn",
            "chūn fēng chuī yòu shēng"
          ],
          keywords: ["离离原上草", "一岁一枯荣", "野火烧不尽", "春风吹又生"],
          cleanWords: "离离原上草一岁一枯荣野火烧不尽春风吹又生",
          translation: "古老辽阔的原野上野草长得葱葱茏茏、无比茂盛，每年它们都要经历一次繁盛和枯萎的生命循环。即使残酷无情的熊熊野火也无法将野草彻底烧尽，只要地下的根还在，当温暖的春风再次吹拂大地时，漫山遍野的野草又会坚强地破土而出、焕发出无限蓬勃的新生命。"
        }
      }
    ]
  }
];


