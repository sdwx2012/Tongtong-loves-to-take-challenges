import { Level, WorldId } from "../types";

// Helper to choose a random item from array
const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomizedLevel = (level: Level): Level => {
  const cloned = JSON.parse(JSON.stringify(level)) as Level;
  const levelNum = parseInt(cloned.id.split("_")[1], 10) || 1;

  switch (cloned.worldId) {
    case WorldId.ChickenRabbit: {
      // Scale difficulty with levelNum
      const heads = 5 + levelNum + randomChoice([0, 1, 2]);
      const rabbits = 1 + Math.floor(levelNum / 2) + randomChoice([0, 1]);
      const chickens = heads - rabbits;
      const legs = chickens * 2 + rabbits * 4;

      cloned.question = `农场笼子里关着一些鸡和兔子。从上面数一共有 ${heads} 个头，从下面数一共有 ${legs} 只脚。请问笼子里关着几只鸡和几只兔子？`;
      cloned.hint = `试试‘假设全是鸡’：如果有 ${heads} 只鸡，就应该有 ${heads * 2} 只脚。可现在有 ${legs} 只脚，多出来的 ${legs - heads * 2} 只脚是谁的呢？`;
      cloned.explanation = `假设全是鸡：${heads} 个头应该有 ${heads * 2} 只脚。但实际有 ${legs} 只脚，多出了 ${legs - heads * 2} 只脚。每把一只鸡换成兔子，就会多出 2 只脚。所以兔子有：(${legs} - ${heads * 2}) ÷ 2 = ${rabbits} 只，鸡有：${heads} - ${rabbits} = ${chickens} 只。`;
      cloned.correctAnswer = legs;
      cloned.data = {
        heads,
        legs,
        correctAnswer: { chickens, rabbits }
      };
      break;
    }

    case WorldId.Matchstick: {
      // Each level has a specific pre-defined equation with custom visual feedback
      interface MatchstickPuzzle {
        initialEquation: string;
        targetEquation: string;
        hint: string;
        explanation: string;
      }

      const matchsticksPool: Record<number, MatchstickPuzzle[]> = {
        1: [
          { initialEquation: "6 + 4 = 4", targetEquation: "0 + 4 = 4", hint: "把数字 6 变成数字 0 吧！", explanation: "拿掉数字‘6’中间的火柴，让‘6’变成‘0’，等式变为：0 + 4 = 4。" },
          { initialEquation: "0 + 3 = 3", targetEquation: "6 - 3 = 3", hint: "把数字 0 变成数字 6，并且加号变成减号！", explanation: "移动加号的一根火柴使它变成减号，放到‘0’的中间，使‘0’变成‘6’，等式变为：6 - 3 = 3。" }
        ],
        2: [
          { initialEquation: "3 + 5 = 4", targetEquation: "9 - 5 = 4", hint: "把加号 '+' 移一根变成减号 '-'，并让 3 变成 9 吧！", explanation: "移动加号的一根放到 3 身上变成 9，等式变成 9 - 5 = 4。" }
        ],
        3: [
          { initialEquation: "9 - 5 = 5", targetEquation: "8 - 3 = 5", hint: "把第二个 5 拿走一根变成 3，放到 9 身上变成 8", explanation: "把 5 移动一根变成 3，这根火柴补到 9 的左下角变成 8，等式变成 8 - 3 = 5。" }
        ],
        4: [
          { initialEquation: "5 + 7 = 2", targetEquation: "9 - 7 = 2", hint: "移动加号 '+' 变成减号 '-'，让 5 变成 9 吧！", explanation: "加号横折一根加在 5 的右上角，使之变成 9，等式变成 9 - 7 = 2。" }
        ],
        5: [
          { initialEquation: "8 - 3 = 6", targetEquation: "8 - 2 = 6", hint: "把数字 3 的一根火柴移到左下方，让它变成数字 2", explanation: "把 3 移一根变成 2，等式变成 8 - 2 = 6。" }
        ],
        6: [
          { initialEquation: "9 + 5 = 9", targetEquation: "9 - 5 = 4", hint: "把加号移走一根变成减号，让得数 9 变成 4 吧！", explanation: "移动加号变成减号，富余的一根火柴将得数的 9 变成 4，即 9 - 5 = 4。" }
        ],
        7: [
          { initialEquation: "3 - 3 = 8", targetEquation: "9 - 3 = 6", hint: "把前面的 3 变成 9，后面的 8 变成 6", explanation: "把 8 左下角的火柴移动到 3 的左上角，变成 9 - 3 = 6。" }
        ],
        8: [
          { initialEquation: "5 + 5 = 8", targetEquation: "3 + 5 = 8", hint: "把第一个 5 移走一根变成 3 吧！", explanation: "把第一个 5 的左上角火柴移到右上角变成 3，等式变成 3 + 5 = 8。" }
        ],
        9: [
          { initialEquation: "6 + 1 = 5", targetEquation: "5 + 1 = 6", hint: "把 6 变成 5，得数 5 变成 6", explanation: "把 6 左下角的火柴移到右边 5 的左下角，变成 5 + 1 = 6。" }
        ],
        10: [
          { initialEquation: "0 + 4 = 9", targetEquation: "8 - 4 = 4", hint: "把 0 变成 8，加号变成减号，得数 9 变成 4", explanation: "拿掉加号的一根火柴变成减号，补到 0 的中间变成 8，把 9 移一根变成 4，即 8 - 4 = 4。" }
        ]
      };

      const selectedList = matchsticksPool[levelNum] || matchsticksPool[1];
      const puzzle = randomChoice(selectedList);

      cloned.question = `移动正好一根火柴，使得下面的算式成立：\n ${puzzle.initialEquation}`;
      cloned.hint = puzzle.hint;
      cloned.explanation = puzzle.explanation;
      cloned.correctAnswer = puzzle.targetEquation;
      cloned.data = {
        initialEquation: puzzle.initialEquation,
        targetEquation: puzzle.targetEquation,
        hint: puzzle.hint
      };
      break;
    }

    case WorldId.TreePlanting: {
      const types: ("both" | "one" | "neither")[] = ["both", "one", "neither"];
      const type = types[(levelNum - 1) % 3];
      const interval = randomChoice([3, 4, 5]);
      const intervals = 4 + levelNum + randomChoice([0, 1, 2]);
      const length = interval * intervals;
      const ans = type === "both" ? intervals + 1 : type === "neither" ? intervals - 1 : intervals;

      const nameMap = { both: "两端都种", one: "一端种（一端不种）", neither: "两端都不种" };

      cloned.question = `一条道路长 ${length} 米，每隔 ${interval} 米需要安装或种植（方式：${nameMap[type]}）。请问一共需要多少？快来点亮或种满它们吧！`;
      cloned.hint = `当前种植模式是【${nameMap[type]}】！先求间隔数：${length} ÷ ${interval} = ${intervals}。想想是加 1、减 1 还是不变？`;
      cloned.explanation = `间隔数 = ${length} ÷ ${interval} = ${intervals}。根据模式【${nameMap[type]}】，结果为 ${ans}。`;
      cloned.correctAnswer = ans;
      cloned.data = {
        length,
        interval,
        type,
        correctAnswer: ans,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.QueueMath: {
      const qTypes: ("front_back" | "ordinal_both" | "between")[] = ["front_back", "ordinal_both", "between"];
      const qt = qTypes[(levelNum - 1) % 3];
      let ans = 0;
      let question = "";
      let hint = "";
      let extraData: any = {};

      if (qt === "front_back") {
        const front = 2 + levelNum + randomChoice([0, 1]);
        const back = 3 + levelNum + randomChoice([0, 1]);
        ans = front + 1 + back;
        question = `小猫排在一列队伍里。它的前面有 ${front} 只小动物，后面有 ${back} 只小动物。请问这一列队伍一共有多少只动物？`;
        hint = `别忘了算上小猫自己（1人）哦！公式：前面人数 + 后面人数 + 自己。`;
        extraData = { questionType: "front_back", frontCount: front, backCount: back, targetAnimal: "kitty", correctAnswer: ans, hint };
      } else if (qt === "ordinal_both") {
        const front = 3 + levelNum + randomChoice([0, 1]);
        const back = 2 + levelNum + randomChoice([0, 1]);
        ans = front + back - 1;
        question = `小兔排在队伍中。从前面数，它是第 ${front} 个；从后面数，它是第 ${back} 个。请问这队一共有多少只动物？`;
        hint = `小兔被前后分别数了一次，所以它被多算了一次！公式：前数位置 + 后数位置 - 1。`;
        extraData = { questionType: "ordinal_both", fromFront: front, fromBack: back, targetAnimal: "bunny", correctAnswer: ans, hint };
      } else {
        const start = 1 + Math.floor(levelNum / 2);
        const end = start + 3 + levelNum + randomChoice([0, 1]);
        ans = end - start - 1;
        question = `小兔排在第 ${start} 个，熊猫排在第 ${end} 个。请问小兔和熊猫“之间”一共有多少只动物？`;
        hint = `“之间”指的是夹在中间的动物，不包括前后的这两个动物！公式：大位置 - 小位置 - 1。`;
        extraData = { questionType: "between", betweenPos: { start, end }, targetAnimal: "panda", correctAnswer: ans, hint };
      }

      cloned.question = question;
      cloned.hint = hint;
      cloned.explanation = `经推算，总计有 ${ans} 只动物。`;
      cloned.correctAnswer = ans;
      cloned.data = extraData;
      break;
    }

    case WorldId.SumDiff: {
      let total = 10 + levelNum * 3 + randomChoice([0, 2]);
      const diff = 2 + (levelNum % 3) * 2;
      // Ensure (total - diff) is even
      if ((total - diff) % 2 !== 0) {
        total += 1;
      }
      const larger = (total + diff) / 2;
      const smaller = (total - diff) / 2;

      cloned.question = `红篮子和绿篮子一共有 ${total} 个苹果。红篮子里的苹果比绿篮子多 ${diff} 个。请问红篮子一共有多少个苹果？`;
      cloned.hint = `和差公式：较大数 = (和 + 差) ÷ 2；较小数 = (和 - 差) ÷ 2。这道题让我们求红篮子（较多的那一个）！`;
      cloned.explanation = `红篮子(较大数) = (${total} + ${diff}) ÷ 2 = ${larger} 个。绿篮子(较小数) = (${total} - ${diff}) ÷ 2 = ${smaller} 个。`;
      cloned.correctAnswer = total;
      cloned.data = {
        total,
        difference: diff,
        largerLabel: "红苹果",
        smallerLabel: "绿苹果",
        correctAnswer: { larger, smaller },
        hint: cloned.hint
      };
      break;
    }

    case WorldId.PatternSequence: {
      const templates = [
        { seq: ["candy_red", "candy_blue"], choices: ["candy_red", "candy_blue"], labels: ["红硬糖 🔴", "蓝硬糖 🔵"] },
        { seq: ["candy_red", "candy_blue", "candy_yellow"], choices: ["candy_red", "candy_blue", "candy_yellow"], labels: ["红硬糖 🔴", "蓝硬糖 🔵", "黄硬糖 🟡"] },
        { seq: ["apple", "apple", "banana"], choices: ["apple", "banana"], labels: ["红苹果 🍎", "红苹果 🍎", "香蕉 🍌"] },
        { seq: ["apple", "banana", "orange", "orange"], choices: ["apple", "banana", "orange"], labels: ["红苹果 🍎", "香蕉 🍌", "橙子 🍊", "橙子 🍊"] }
      ];

      const template = templates[(levelNum - 1) % templates.length];
      const targetIndex = 12 + levelNum * 2 + randomChoice([0, 1, 2, 3]);
      const period = template.seq.length;
      const remainder = targetIndex % period;
      const correctChoiceId = template.seq[remainder === 0 ? period - 1 : remainder - 1];

      cloned.question = `传送带不断吐出水果/糖果，规律是：${template.labels.join("、")}。请问第 ${targetIndex} 个落下的是什么？`;
      cloned.hint = `周期长度为 ${period}。计算余数：${targetIndex} ÷ ${period}。余数是多少，就是对应这一组里的第几项哦！如果余数是 0，代表是最后一个。`;
      cloned.explanation = `周期 = ${period}。${targetIndex} ÷ ${period} = ${Math.floor(targetIndex / period)} 组……余数是 ${remainder === 0 ? period : remainder}。所以第 ${targetIndex} 个是目标图案。`;
      cloned.correctAnswer = correctChoiceId;
      cloned.data = {
        sequence: template.seq,
        targetIndex,
        choices: template.choices,
        correctAnswer: correctChoiceId,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.AgePuzzle: {
      const d = 16 + levelNum * 2 + randomChoice([0, 2]); // diff
      const mult = levelNum % 2 === 0 ? 3 : 4; // multiple
      const kidsFinal = d / (mult - 1);
      const kidCurrent = Math.max(2, Math.floor(kidsFinal - 2 - randomChoice([0, 1])));
      const dadCurrent = kidCurrent + d;
      const yearsNeeded = kidsFinal - kidCurrent;

      cloned.question = `小明今年 ${kidCurrent} 岁，爸爸今年 ${dadCurrent} 岁。请问再过几年，爸爸的年龄正好是小明的 ${mult} 倍？`;
      cloned.hint = `无论过去还是未来，两人的年龄差保持不变：${d} 岁！当爸爸是 ${mult} 倍时，多出的 ${mult - 1} 倍正好就是差值 ${d} 岁。求出那时小明的年龄，再减去现在的年龄就是答案！`;
      cloned.explanation = `年龄差 = ${dadCurrent} - ${kidCurrent} = ${d} 岁不变。倍数差为 ${mult} - 1 = ${mult - 1} 倍。那时小明为：${d} ÷ ${mult - 1} = ${kidsFinal} 岁。需经过：${kidsFinal} - ${kidCurrent} = ${yearsNeeded} 年。`;
      cloned.correctAnswer = yearsNeeded;
      cloned.data = {
        kidAge: kidCurrent,
        parentAge: dadCurrent,
        difference: d,
        multiple: mult,
        correctAnswer: yearsNeeded,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.Overlapping: {
      const isRibbon = levelNum % 2 === 1;
      if (isRibbon) {
        const L1 = 10 + levelNum;
        const L2 = 12 + levelNum;
        const over = 2 + (levelNum % 3);
        const total = L1 + L2 - over;

        cloned.question = `黄丝带长 ${L1} 厘米，蓝丝带长 ${L2} 厘米。重叠部分粘在一起后，总共长 ${total} 厘米。请问重叠部分长多少厘米？`;
        cloned.hint = `如果两根完全不重叠，总长度应该是 ${L1} + ${L2} = ${L1 + L2} 厘米。比实际拼接长出来的部分，就是重叠被算了两次的长度！`;
        cloned.explanation = `不重叠总长为 ${L1} + ${L2} = ${L1 + L2} 厘米。实际总长为 ${total} 厘米。所以重叠长度为：${L1 + L2} - ${total} = ${over} 厘米。`;
        cloned.correctAnswer = over;
        cloned.data = {
          length1: L1,
          length2: L2,
          totalLength: total,
          correctAnswer: over,
          hint: cloned.hint
        };
      } else {
        const total = 20 + levelNum;
        const both = 3 + (levelNum % 3);
        const onlyA = 5 + (levelNum % 2);
        const onlyB = total - both - onlyA - 3;
        const A = onlyA + both;
        const B = onlyB + both;
        const neither = total - (onlyA + onlyB + both);

        cloned.question = `画画班一共有 ${total} 只小精灵。其中喜欢画红苹果的有 ${A} 只，喜欢画绿草地的有 ${B} 只，两样都喜欢的有 ${both} 只。请问两样都不喜欢的小精灵有几只？`;
        cloned.hint = `先算出会使用或者喜欢其中一种的精灵数：画红苹果的 + 画草地的 - 两样都喜欢的 (${A} + ${B} - ${both})。然后用总人数减去他们即可！`;
        cloned.explanation = `至少喜欢一种的精灵 = ${A} + ${B} - ${both} = ${total - neither} 只。两样都不喜欢的 = ${total} - ${total - neither} = ${neither} 只。`;
        cloned.correctAnswer = neither;
        cloned.data = {
          totalCount: total,
          countA: A,
          countB: B,
          bothCount: both,
          correctAnswer: neither,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.ReverseSolve: {
      const startVal = 4 + levelNum * 2;
      const op1 = levelNum % 2 === 0 ? "+" : "-";
      const val1 = 2 + (levelNum % 3);
      const temp1 = op1 === "+" ? startVal + val1 : startVal - val1;

      const op2 = levelNum % 3 === 0 ? "*" : "-";
      const val2 = op2 === "*" ? 2 : 4;
      const endVal = op2 === "*" ? temp1 * val2 : temp1 - val2;

      const steps = [
        {
          op: op1 as "+" | "-",
          val: val1,
          label: op1 === "+" ? `在果园里又捡到了 ${val1} 个神奇苹果` : `在路上吃掉了 ${val1} 个红苹果`
        },
        {
          op: op2 as "*" | "-",
          val: val2,
          label: op2 === "*" ? `魔法喷泉让拥有的苹果瞬间翻了 ${val2} 倍` : `慷慨地赠送给小松鼠 ${val2} 个大苹果`
        }
      ];

      cloned.question = `小兔原本有一些苹果。它的苹果经历了这两个变化：首先“${steps[0].label}”，接着“${steps[1].label}”。最后，小兔手里还剩下 ${endVal} 个苹果。请问小兔最初有多少个苹果？`;
      cloned.hint = `时光倒流！从最后的终点结果 ${endVal} 出发，每一步逆向运算：${op2 === "*" ? "除以" : "加上"} ${val2}，然后再 ${op1 === "+" ? "减去" : "加上"} ${val1} 就能找到初始数量！`;
      cloned.explanation = `逆向倒推：从最后 ${endVal} 往前。倒数第一步：逆运算得到 ${temp1}；第二步：逆运算得到最初的数量为 ${startVal}。`;
      cloned.correctAnswer = startVal;
      cloned.data = {
        steps,
        endVal,
        correctAnswer: startVal,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.LogicGrid: {
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

      const chars = charPools[levelNum % 3];
      const itms = itemPools[levelNum % 3];

      let clues: string[] = [];
      let correctAnswer: Record<string, string> = {};

      if (levelNum % 3 === 0) {
        correctAnswer = {
          [chars[0]]: itms[0].id,
          [chars[1]]: itms[1].id,
          [chars[2]]: itms[2].id
        };
        clues = [
          `${chars[2]}最爱吃${itms[2].label}，所以它开心地拿走了。`,
          `${chars[0]}对黄黄的${itms[1].label}不感兴趣，绝对没有拿它。`,
          `所有的物品刚好被小动物分完，没有剩下。`
        ];
      } else if (levelNum % 3 === 1) {
        correctAnswer = {
          [chars[0]]: itms[1].id,
          [chars[1]]: itms[2].id,
          [chars[2]]: itms[0].id
        };
        clues = [
          `${chars[1]}是一个超级吃货，第一眼就抱走了香喷喷的${itms[2].label}。`,
          `${chars[0]}从来不吃绿色的${itms[0].label}，觉得只有吃${itms[1].label}才过瘾。`,
          `每个小动物刚好匹配到一样最喜欢的专属宝物！`
        ];
      } else {
        correctAnswer = {
          [chars[0]]: itms[2].id,
          [chars[1]]: itms[0].id,
          [chars[2]]: itms[1].id
        };
        clues = [
          `${chars[1]}觉得只有国宝最适合吃鲜嫩绿油油的${itms[0].label}。`,
          `${chars[2]}尾巴大，喜欢攒果子，所以它只抱走了${itms[1].label}。`,
          `剩下的一个${itms[2].label}，被分给了排在前面的${chars[0]}。`
        ];
      }

      cloned.question = `根据线索破案推理：${chars.join("、")}各分到了什么物品？`;
      cloned.hint = `找到绝对确定的一对（例如“小猫最爱吃小鱼”），填在表格中，然后再用排除法推断其他动物的物品。`;
      cloned.explanation = `线索极为清晰，小猫对应${correctAnswer[chars[2]]}，排除后，可以得到完整匹配答案。`;
      cloned.correctAnswer = "detective_solved";
      cloned.data = {
        characters: chars,
        items: itms,
        clues,
        correctAnswer,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.ProfitLoss: {
      const children = 4 + levelNum + randomChoice([0, 1]);
      const each1 = 3 + (levelNum % 3);
      const surplus1 = 2 + (levelNum % 2);
      const total = children * each1 + surplus1;
      const each2 = each1 + 1;
      const surplus2 = total - children * each2;

      cloned.question = `要把糖果分给一群小朋友。方案一：每人分 ${each1} 个，结果多出 ${surplus1} 个；方案二：每人分 ${each2} 个，结果缺少 ${Math.abs(surplus2)} 个。请问一共有多少个小朋友，糖果一共有多少个？`;
      cloned.hint = `盈亏总额之和代表两次分糖果的差额！分配差为每人差 ${each2 - each1} 个。公式：小朋友数 = (盈数 + 亏数) ÷ 两次每人分配数之差。`;
      cloned.explanation = `盈亏总差额 = ${surplus1} + ${Math.abs(surplus2)} = ${surplus1 + Math.abs(surplus2)} 个。每人分配差 = ${each2} - ${each1} = 1 个。因此小朋友数 = ${surplus1 + Math.abs(surplus2)} ÷ 1 = ${children} 人。糖果总数 = ${children} * ${each1} + ${surplus1} = ${total} 个。`;
      cloned.correctAnswer = total;
      cloned.data = {
        each1,
        surplus1,
        each2,
        surplus2,
        correctAnswer: { children, total },
        hint: cloned.hint
      };
      break;
    }

    case WorldId.MeetingChase: {
      const isMeet = levelNum % 2 === 1;
      if (isMeet) {
        const speed_sum = 5 + levelNum + randomChoice([0, 1]);
        const time = 8 + levelNum * 2;
        const distance = speed_sum * time;
        const speed1 = Math.floor(speed_sum / 2) + 1;
        const speed2 = speed_sum - speed1;

        cloned.question = `两只小动物相距 ${distance} 米，它们相对而行。一只的速度是每秒 ${speed1} 米，另一只的速度是每秒 ${speed2} 米。请问经过多少秒后它们在途中相遇？`;
        cloned.hint = `相遇公式：相遇时间 = 初始路程 ÷ 速度之和。在这里，速度之和是 ${speed1} + ${speed2} = ${speed_sum} 米每秒！`;
        cloned.explanation = `相遇时间 = 路程 ${distance} ÷ 速度和 (${speed1} + ${speed2}) = ${time} 秒。`;
        cloned.correctAnswer = time;
        cloned.data = {
          type: "meet",
          distance,
          speed1,
          speed2,
          correctAnswer: time,
          hint: cloned.hint
        };
      } else {
        const speed_diff = 2 + (levelNum % 3);
        const time = 10 + levelNum * 3;
        const distance = speed_diff * time;
        const speed2 = 3 + levelNum;
        const speed1 = speed2 + speed_diff;

        cloned.question = `猛兽和温顺的小动物相距 ${distance} 米。猛兽的速度是每秒 ${speed1} 米在后追赶，小动物的速度是每秒 ${speed2} 米。请问猛兽需要多少秒才能追上小动物？`;
        cloned.hint = `追及公式：追及时间 = 初始距离 ÷ 速度之差。速度差代表每秒钟拉近了多少距离！这里的速度差是 ${speed1} - ${speed2} = ${speed_diff} m/s。`;
        cloned.explanation = `追及时间 = 初始距离 ${distance} ÷ 速度差 (${speed1} - ${speed2}) = ${time} 秒。`;
        cloned.correctAnswer = time;
        cloned.data = {
          type: "chase",
          distance,
          speed1,
          speed2,
          correctAnswer: time,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.Pigeonhole: {
      const isTargetSame = levelNum % 2 === 1;
      const count = 5 + levelNum;
      const pool = [
        { color: "red" as const, count: count + 2 },
        { color: "blue" as const, count: count },
        { color: "yellow" as const, count: count - 1 }
      ];

      if (isTargetSame) {
        const target = 2 + Math.floor(levelNum / 3);
        const ans = (target - 1) * 3 + 1;
        cloned.question = `暗盒里装有红、蓝、黄三种颜色的球，每种数量足够多。如果闭上眼睛往外摸球，至少要摸出几个球，才能“保证”其中有 ${target} 个球的颜色完全相同？`;
        cloned.hint = `想一想最倒霉的情况：你摸出来的红、蓝、黄每种球都正好差一个就达到 ${target} 个（也就是各有 ${target - 1} 个）。此时再多摸 1 个，就必然能凑齐 ${target} 个啦！`;
        cloned.explanation = `最不利情况（最坏运气）：每种颜色的球都摸出了 ${target - 1} 个，一共摸了 ${(target - 1) * 3} 个。此时再摸 1 个，无论是什么颜色，必定能保证有 ${target} 个球颜色相同。所以答案是：${(target - 1) * 3} + 1 = ${ans} 个。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          pool,
          targetDesc: `${target}个颜色相同的球`,
          correctAnswer: ans,
          hint: cloned.hint
        };
      } else {
        const sorted = [...pool].sort((a, b) => b.count - a.count);
        const ans = sorted[0].count + sorted[1].count + 1;
        cloned.question = `箱子里装有 ${pool[0].count} 个红球、${pool[1].count} 个蓝球和 ${pool[2].count} 个黄球。至少摸出几个球，才能“保证”三种颜色的球都至少有一个？`;
        cloned.hint = `最倒霉的情况：你把数量最多的两种颜色的球全部摸光了，却还是没有摸到数量最少的那种颜色！所以你需要摸完最大的两个数量，再加 1 个就能保证集齐三种了！`;
        cloned.explanation = `最不利情况是把数量较多的红球和蓝球全部摸完（共 ${sorted[0].count} + ${sorted[1].count} = ${sorted[0].count + sorted[1].count} 个），此时箱中只剩下黄球。再摸 1 个黄球，就集齐了三种颜色。答案：${sorted[0].count + sorted[1].count} + 1 = ${ans} 个。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          pool,
          targetDesc: `红、蓝、黄三种颜色都至少有一个`,
          correctAnswer: ans,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.ShapeCounting: {
      const isTriangle = levelNum < 6;
      if (isTriangle) {
        const segments = 2 + (levelNum % 3);
        const ans = (segments * (segments + 1)) / 2;
        cloned.question = `一个大三角形，顶点到低底边引出了若干条分割线，底边一共被分成了 ${segments} 段。请问图中一共有多少个三角形？`;
        cloned.hint = `方法一：数数底边一共有多少个线段，三角形个数就和线段个数一样多！方法二：按大小分类，基本单块有 ${segments} 个，二合一有 ${segments - 1} 个，三合一有 ${segments - 2} 个……`;
        cloned.explanation = `底边线段个数 = 1 + 2 + ... + ${segments} = ${ans} 个。每个底边线段都对应一个三角形。所以一共有 ${ans} 个三角形。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          shapeType: "triangle" as const,
          gridSize: segments,
          correctAnswer: ans,
          hint: cloned.hint
        };
      } else {
        const segments = 3 + (levelNum % 3);
        const ans = (segments * (segments + 1)) / 2;
        cloned.question = `一排长条积木由 ${segments} 个小正方形格子一字排开组成。请问这一排积木里一共有多少个长方形（包含正方形）？`;
        cloned.hint = `这和数线段完全一样！1 个格子的长方形有 ${segments} 个，2 个格子的长方形有 ${segments - 1} 个……以此类推，求 1 到 ${segments} 的连续相加和！`;
        cloned.explanation = `长方形总数 = 1 + 2 + ... + ${segments} = ${ans} 个。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          shapeType: "rectangle" as const,
          gridSize: segments,
          correctAnswer: ans,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.Permutation: {
      const isHandshake = levelNum % 2 === 1;
      if (isHandshake) {
        const people = 4 + (levelNum % 3);
        const ans = (people * (people - 1)) / 2;
        const animals = ["小猫", "小狗", "小熊", "小兔", "小鹿", "小松鼠"].slice(0, people);
        cloned.question = `森林里举办了欢乐聚会，一共有 ${people} 只小动物。为了表达友好，每两只小动物都要握手一次。请问一共需要握手多少次？`;
        cloned.hint = `每个人要和其余 ${people - 1} 个人握手，所以是 ${people} * ${people - 1}。但每次握手都被两个人共同参与、重复算了一次，所以最后要除以 2 哦！公式：N * (N - 1) ÷ 2。`;
        cloned.explanation = `握手次数 = 成员数 ${people} * (成员数 ${people} - 1) ÷ 2 = ${ans} 次。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          type: "handshakes" as const,
          items: animals,
          correctAnswer: ans,
          hint: cloned.hint
        };
      } else {
        const poolSize = 3 + (levelNum % 2);
        const digits = ["1", "2", "3", "4"].slice(0, poolSize);
        const ans = poolSize * (poolSize - 1) * (poolSize - 2);

        cloned.question = `用数字卡片 【${digits.join(", ")}】 （每张只能用一次），一共可以组成多少个不同的三位数？`;
        cloned.hint = `乘法原理分步计算！百位上有 ${poolSize} 种选法；十位上剩下 ${poolSize - 1} 种选法；个位上只剩下 ${poolSize - 2} 种选法。将它们相乘！`;
        cloned.explanation = `组数 = ${poolSize} (百位) * ${poolSize - 1} (十位) * ${poolSize - 2} (个位) = ${ans} 个。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          type: "digits" as const,
          items: digits,
          correctAnswer: ans,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.MagicSquare: {
      const baseGrid = [8, 1, 6, 3, 5, 7, 4, 9, 2];
      const masks = [
        [0, 2, 7],
        [1, 5, 6],
        [3, 4, 8],
        [2, 4, 6],
        [0, 1, 5, 8],
        [2, 3, 4, 7],
        [1, 3, 5, 7],
        [0, 3, 6, 8],
        [0, 1, 2, 4, 8],
        [1, 2, 3, 5, 7]
      ];
      const mask = masks[(levelNum - 1) % masks.length];
      const grid = baseGrid.map((v, idx) => (mask.includes(idx) ? null : v));

      cloned.question = `一个 3x3 九宫幻方盘，已知每一横行、竖列、对角线上的 3 个数之和都相等（等于 15）。请在空格中填上合适的数字使魔法阵配平。`;
      cloned.hint = `先找那一行/那一列/那一条对角线上只缺一个数的地方！例如如果知道了两个数 X 和 Y，那空格里就只能填 15 - X - Y。`;
      cloned.explanation = `通过观察和减法代入：首先从已给出两数的一行或一列入手，可求出第三个空。顺藤摸瓜即可解出全部九宫数字。`;
      cloned.correctAnswer = 15;
      cloned.data = {
        grid,
        correctAnswer: baseGrid,
        targetSum: 15,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.ClockAngle: {
      const isAngle = levelNum % 2 === 1;
      if (isAngle) {
        const hours = [3, 4, 6, 9, 2, 8, 1, 5, 10, 11][(levelNum - 1) % 10];
        const ans = Math.min((hours % 12) * 30, 360 - (hours % 12) * 30);
        cloned.question = `在时钟指向刚好 ${hours} 点整时，表盘上的时针和分针之间组成的【较小夹角】是多少度？`;
        cloned.hint = `钟表一圈一共有 12 个大格，对应 360 度。所以每个大格就是 30 度！${hours} 点整时，分针在 12 上，时针正好指向数 ${hours}。求它们之间的格子数乘上 30 吧！`;
        cloned.explanation = `每个大格代表 30 度。在 ${hours} 点整，时针和分针相差 ${hours % 12} 个大格。夹角为 ${hours % 12} * 30 = ${(hours % 12) * 30} 度。取较小角得到 ${ans} 度。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          questionType: "angle" as const,
          timeStr: `${hours}:00`,
          correctAnswer: ans,
          hint: cloned.hint
        };
      } else {
        const strikeCount = 3 + (levelNum % 3);
        const strikeSecs = (strikeCount - 1) * 3;
        const targetStrikes = 6 + (levelNum % 4);
        const ans = (targetStrikes - 1) * 3;

        cloned.question = `广场上的大钟，敲响 ${strikeCount} 下一共需要 ${strikeSecs} 秒。那么，当中午敲响 ${targetStrikes} 下时，一共需要多少秒时间？`;
        cloned.hint = `陷阱题！大钟敲击 ${strikeCount} 下，中间只有 ${strikeCount - 1} 个间隔！所以求出敲一下的“时间间隔”是：${strikeSecs} ÷ (${strikeCount} - 1)。敲 ${targetStrikes} 下则有 ${targetStrikes - 1} 个间隔！`;
        cloned.explanation = `敲击 ${strikeCount} 下，有 ${strikeCount - 1} 个时间间隔。每个间隔时间 = ${strikeSecs} ÷ ${strikeCount - 1} = 3 秒。敲击 ${targetStrikes} 下有 ${targetStrikes - 1} 个间隔，所需总时间 = (${targetStrikes} - 1) * 3 = ${ans} 秒。`;
        cloned.correctAnswer = ans;
        cloned.data = {
          questionType: "strike" as const,
          strikeCount,
          strikeSecs,
          targetStrikes,
          correctAnswer: ans,
          hint: cloned.hint
        };
      }
      break;
    }

    case WorldId.BinaryScore: {
      const totalQuestions = 10 + (levelNum % 3) * 5;
      const correctPoints = 5;
      const wrongDeduct = 2;
      const correctAnswer = totalQuestions - 1 - (levelNum % 3);
      const wrongCount = totalQuestions - correctAnswer;
      const earnedPoints = correctAnswer * correctPoints - wrongCount * wrongDeduct;

      cloned.question = `一次少儿奥数比赛一共有 ${totalQuestions} 道题。答对一题得 ${correctPoints} 分，答错一题扣 ${wrongDeduct} 分。小松鼠回答了全部问题，最后得到了 ${earnedPoints} 分。请问小松鼠一共答对了几道题？`;
      cloned.hint = `假设全部答对！如果全部答对应该得 ${totalQuestions * correctPoints} 分。但实际只得了 ${earnedPoints} 分，少拿了分数。少的分数是因为有些题答错了，答错一题不仅拿不到加分还要倒扣，这一来一回每错一题就要损失 ${correctPoints} + ${wrongDeduct} = ${correctPoints + wrongDeduct} 分！`;
      cloned.explanation = `假设全部答对：总得分 = ${totalQuestions} * ${correctPoints} = ${totalQuestions * correctPoints} 分。实际只得了 ${earnedPoints} 分，少了 ${totalQuestions * correctPoints - earnedPoints} 分。错一题损失 = ${correctPoints} + ${wrongDeduct} = ${correctPoints + wrongDeduct} 分。因此错题数 = ${totalQuestions * correctPoints - earnedPoints} ÷ ${correctPoints + wrongDeduct} = ${wrongCount} 题。答对题数 = ${totalQuestions} - ${wrongCount} = ${correctAnswer} 题。`;
      cloned.correctAnswer = correctAnswer;
      cloned.data = {
        totalQuestions,
        correctPoints,
        wrongDeduct,
        earnedPoints,
        correctAnswer,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.TruthLiar: {
      const names = ["小红狐", "小蓝兔", "小绿蛙"];
      const emojis = ["🦊", "🐰", "🐸"];

      let characters = [
        { name: names[0], emoji: emojis[0], statement: "" },
        { name: names[1], emoji: emojis[1], statement: "" },
        { name: names[2], emoji: emojis[2], statement: "" }
      ];

      let liarName = "";
      let questionType: "find_liar" | "find_honest" = "find_liar";

      if (levelNum % 3 === 0) {
        characters[0].statement = `${names[1]}在撒谎。`;
        characters[1].statement = `${names[2]}在说真话。`;
        characters[2].statement = `我们三个人中只有一个人在撒谎。`;
        liarName = names[1];
      } else if (levelNum % 3 === 1) {
        characters[0].statement = `撒谎的人在我们中间。`;
        characters[1].statement = `我是老实人，我绝对没有撒谎。`;
        characters[2].statement = `${names[0]}和${names[1]}都在撒谎！`;
        liarName = names[2];
      } else {
        characters[0].statement = `${names[2]}抢走了红苹果。`;
        characters[1].statement = `我没有抢红苹果。`;
        characters[2].statement = `${names[1]}在撒谎，其实是我抢的。`;
        liarName = names[0];
      }

      cloned.question = `已知小狐、小兔和小蛙三名选手中，正好有且只有 1 个人在撒谎，其余人在说真话。根据他们的发言，请问【谁是唯一的撒谎者】？`;
      cloned.hint = `利用假设排除法！先假设 ${names[0]} 是撒谎者，验证另外两人是否都说了真话；再假设 ${names[1]} 是撒谎者……看哪种假设下没有任何矛盾！`;
      cloned.explanation = `假设${liarName}撒谎：那么其他人说的话完全合乎情理、互不冲突。如果换成别人撒谎，就会发生矛盾。所以撒谎的人是 ${liarName}。`;
      cloned.correctAnswer = liarName;
      cloned.data = {
        characters,
        liarCount: 1,
        correctAnswer: liarName,
        questionType,
        hint: cloned.hint
      };
      break;
    }

    case WorldId.WaterPouring: {
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
      const preset = presets[(levelNum - 1) % presets.length];

      cloned.question = `魔法烧杯 A 的容量是 ${preset.capA} 升，烧杯 B 的容量是 ${preset.capB} 升。请问你能通过倒腾量出正好 ${preset.target} 升的水吗？操作控制面板来完成它！`;
      cloned.hint = `这个非常简单！例如先把大杯 ${preset.capA} 装满，然后往小杯 ${preset.capB} 里灌满，大杯里剩下来的水就是 ${preset.capA} - ${preset.capB} = ${preset.target} 升啦！`;
      cloned.explanation = `只需要将大杯装满 ${preset.capA} 升，然后往小杯倒满 ${preset.capB} 升，大杯里就剩下了 ${preset.capA} - ${preset.capB} = ${preset.target} 升水。`;
      cloned.correctAnswer = preset.target;
      cloned.data = {
        capA: preset.capA,
        capB: preset.capB,
        target: preset.target,
        hint: cloned.hint
      };
      break;
    }
  }

  return cloned;
};
