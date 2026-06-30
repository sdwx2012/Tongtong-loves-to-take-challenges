import React from "react";
import { Star, Lock, Trophy, Play, ArrowLeft, CheckCircle2 } from "lucide-react";
import { World, Level, WorldId, UserProgress, Subject } from "../types";
import { SoundEffects } from "./SoundEffects";

interface LevelMapProps {
  worlds: World[];
  userProgress: UserProgress;
  onSelectLevel: (level: Level) => void;
  activeWorldId: WorldId | null;
  onSelectWorld: (worldId: WorldId | null) => void;
  activeSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  worlds,
  userProgress,
  onSelectLevel,
  activeWorldId,
  onSelectWorld,
  activeSubject,
  onSelectSubject
}) => {
  const currentWorld = worlds.find((w) => w.id === activeWorldId);

  const isWorldUnlocked = (worldId: WorldId) => {
    return !!userProgress.allUnlocked || userProgress.unlockedWorlds.includes(worldId);
  };

  const isLevelUnlocked = (level: Level, index: number) => {
    if (userProgress.allUnlocked) return true;
    if (index === 0) return true; // First level always unlocked
    const previousLevel = currentWorld?.levels[index - 1];
    if (!previousLevel) return true;
    return !!userProgress.completedLevels[previousLevel.id];
  };

  const handleWorldClick = (world: World) => {
    if (!isWorldUnlocked(world.id)) {
      SoundEffects.playIncorrect();
      return;
    }
    SoundEffects.playClick();
    onSelectWorld(world.id);
  };

  const handleLevelClick = (level: Level, isUnlocked: boolean) => {
    if (!isUnlocked) {
      SoundEffects.playIncorrect();
      return;
    }
    SoundEffects.playClick();
    onSelectLevel(level);
  };

  // Render the World Selection Grid (Main Map)
  if (!activeWorldId) {
    const filteredWorlds = worlds.filter((w) => {
      if (activeSubject === Subject.Chinese) {
        return w.subject === Subject.Chinese;
      } else {
        return w.subject === undefined || w.subject === Subject.Math;
      }
    });

    const isChinese = activeSubject === Subject.Chinese;

    return (
      <div className="flex flex-col gap-6 animate-fadeIn" id="level-map-worlds">
        {/* User Stats Card */}
        <div className={`bg-gradient-to-r p-6 rounded-3xl text-white border-4 shadow-[6px_6px_0px_0px_#1e3a8a] flex flex-col md:flex-row items-center justify-between gap-4 select-none relative overflow-hidden ${
          isChinese 
            ? "from-rose-500 via-pink-500 to-red-600 border-rose-200" 
            : "from-teal-500 via-blue-500 to-indigo-600 border-indigo-200"
        }`}>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -left-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-lg" />

          <div className="flex items-center gap-3.5 z-10">
            <div className="bg-white/25 p-3 rounded-2xl border-2 border-white/20 shadow-inner">
              <Trophy className="w-8 h-8 text-yellow-300 animate-bounce" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black tracking-wide">
                {isChinese ? "国学小才子" : "奥数小勇士"}
              </h2>
              <p className="text-xs text-indigo-100 font-bold mt-0.5">
                {isChinese ? "腹有诗书气自华，今天一起大声朗读吧！✨" : "今天也是脑力大爆发的一天哦！🔥"}
              </p>
            </div>
          </div>

          <div className="flex gap-6 z-10 bg-black/15 px-6 py-3 rounded-2xl border-2 border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-indigo-100 font-extrabold">总金星 ⭐️</span>
              <span className="text-2xl font-black text-yellow-300 drop-shadow-sm">
                {(Object.values(userProgress.stars) as number[]).reduce((a: number, b: number) => a + b, 0)}
              </span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-indigo-100 font-extrabold">已解锁 🧩</span>
              <span className="text-2xl font-black text-white drop-shadow-sm">
                {Object.keys(userProgress.completedLevels).length} / {worlds.reduce((acc, w) => acc + w.levels.length, 0)}
              </span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-indigo-100 font-extrabold">小金币 🪙</span>
              <span className="text-2xl font-black text-yellow-200 drop-shadow-sm">{userProgress.totalScore}</span>
            </div>
          </div>
        </div>

        {/* Subject Navigation Tabs */}
        <div className="flex flex-wrap gap-3 p-1.5 bg-slate-100 border-2 border-slate-200/60 rounded-2xl self-center md:self-start w-full md:w-auto">
          <button
            onClick={() => {
              SoundEffects.playClick();
              onSelectSubject(Subject.Math);
            }}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubject === Subject.Math
                ? "bg-indigo-600 text-white shadow-[0_3px_0_0_#3730a3]"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <span className="text-sm">🧮</span>
            <span>趣味奥数闯关</span>
          </button>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onSelectSubject(Subject.Chinese);
            }}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubject === Subject.Chinese
                ? "bg-rose-600 text-white shadow-[0_3px_0_0_#9f1239]"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <span className="text-sm">🏮</span>
            <span>唐诗三百首跟读</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center md:text-left select-none">
          <h3 className={`text-xl font-black tracking-tight flex items-center gap-1.5 justify-center md:justify-start ${
            isChinese ? "text-rose-700" : "text-indigo-700"
          }`}>
            <span>{isChinese ? "📚" : "🗺️"}</span> {isChinese ? "国学经典唐诗小岛" : "魔法奥数群岛"}
          </h3>
          <p className="text-xs text-slate-600 font-bold mt-1">
            {isChinese ? "挑选一首唐诗，点击卡片进入诗歌，开始你的背诵和跟读练习吧！" : "选择一个浮空岛，开启趣味闯关冒险之旅吧！"}
          </p>
        </div>

        {/* Islands grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorlds.map((world) => {
            const unlocked = isWorldUnlocked(world.id);
            const worldStars = world.levels.reduce((acc, level) => acc + (userProgress.stars[level.id] || 0), 0);
            const worldTotalPossible = world.levels.length * 3;

            return (
              <div
                key={world.id}
                onClick={() => handleWorldClick(world)}
                className={`group cursor-pointer rounded-3xl p-6 border-4 text-left relative overflow-hidden transition-all duration-300 transform active:scale-95 ${
                  unlocked
                    ? `bg-white hover:-translate-y-1.5 border-indigo-400 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] hover:shadow-[10px_10px_0px_0px_rgba(79,70,229,1)]`
                    : "bg-slate-100/40 border-slate-200 cursor-not-allowed opacity-75"
                }`}
              >
                {/* Decorative Island backdrop */}
                {unlocked && (
                  <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${world.color} opacity-5 blur-md`} />
                )}

                {/* Floating island details */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-[0_4px_0_0_#4338ca] border-2 border-indigo-500/10 ${
                    unlocked ? `bg-gradient-to-br ${world.color} text-white` : "bg-slate-100 text-slate-400"
                  }`}>
                    {world.icon}
                  </div>

                  {unlocked ? (
                    <div className="flex items-center gap-1 bg-teal-50 border-2 border-teal-300 text-teal-700 text-[10px] font-black px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#14b8a6]">
                      <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
                      {worldStars}/{worldTotalPossible}
                    </div>
                  ) : (
                    <div className="bg-slate-100 text-slate-400 p-2 rounded-xl border border-slate-200">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <h4 className={`text-lg font-black mt-4 ${unlocked ? "text-slate-800 group-hover:text-indigo-600 transition-colors" : "text-slate-400"}`}>
                  {world.name}
                </h4>

                <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${unlocked ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                  {world.description}
                </p>

                {/* Unlock status or play indicator */}
                {unlocked ? (
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-100 flex items-center justify-between text-xs font-black text-indigo-600">
                    <span>进入岛屿 🚀</span>
                    <Play className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform fill-indigo-500 text-indigo-500" />
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-100 text-[10px] font-black text-slate-400/60 flex items-center gap-1">
                    <span>需要解锁上一座岛屿 🏝️</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render the level selection trail for the active World
  return (
    <div className="flex flex-col gap-6 animate-fadeIn" id="level-map-levels">
      {/* Return navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            SoundEffects.playClick();
            onSelectWorld(null);
          }}
          className="px-4 py-2.5 bg-white border-3 border-indigo-400 text-indigo-600 rounded-2xl text-xs font-black hover:bg-indigo-50 flex items-center gap-1.5 active:translate-y-0.5 active:shadow-none transition-all shadow-[3px_3px_0px_0px_#4338ca]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3px]" />
          返回主地图
        </button>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-black block uppercase tracking-widest">当前群岛</span>
          <span className="text-base font-black text-indigo-600 flex items-center gap-1 justify-end">
            {currentWorld?.icon} {currentWorld?.name}
          </span>
        </div>
      </div>

      {/* Level trail landscape */}
      {currentWorld?.id === WorldId.TangPoetry ? (
        <div className="relative bg-gradient-to-b from-rose-50/60 to-orange-50/40 border-4 border-rose-300 rounded-3xl p-6 md:p-8 min-h-[420px] overflow-hidden shadow-[6px_6px_0px_0px_#9f1239] select-none">
          {/* Decorative lantern and cherry blossoms in background */}
          <div className="absolute top-4 right-6 w-16 h-16 text-rose-200/40 pointer-events-none text-6xl">🏮</div>
          <div className="absolute bottom-4 left-6 w-16 h-16 text-orange-200/30 pointer-events-none text-6xl">🌸</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-10">
            {currentWorld?.levels.map((level, index) => {
              const unlocked = isLevelUnlocked(level, index);
              const stars = userProgress.stars[level.id] || 0;
              const completed = !!userProgress.completedLevels[level.id];

              return (
                <div
                  key={level.id}
                  onClick={() => handleLevelClick(level, unlocked)}
                  className={`group rounded-2xl p-5 border-3 relative overflow-hidden transition-all duration-300 transform active:scale-95 cursor-pointer flex flex-col justify-between min-h-[170px] ${
                    unlocked
                      ? completed
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 shadow-[4px_4px_0px_0px_#047857] hover:shadow-[6px_6px_0px_0px_#047857] hover:-translate-y-1"
                        : "bg-gradient-to-br from-rose-50 to-orange-50 border-rose-400 shadow-[4px_4px_0px_0px_#be123c] hover:shadow-[6px_6px_0px_0px_#be123c] hover:-translate-y-1"
                      : "bg-slate-100 border-slate-200 shadow-[4px_4px_0px_0px_#94a3b8] opacity-75 cursor-not-allowed"
                  }`}
                >
                  <div>
                    {/* Top status bar */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                        unlocked
                          ? completed
                            ? "bg-emerald-100/60 border-emerald-300 text-emerald-700"
                            : "bg-rose-100/60 border-rose-200 text-rose-700"
                          : "bg-slate-200/50 border-slate-300 text-slate-400"
                      }`}>
                        {level.name}
                      </span>
                      {unlocked && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < stars ? "fill-yellow-400 text-yellow-500" : "text-slate-200 fill-slate-200/30"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Title & Author */}
                    <div className="mt-2 text-center">
                      <h4 className={`text-base font-black ${unlocked ? "text-slate-800" : "text-slate-400"}`}>
                        《{level.title}》
                      </h4>
                      <p className={`text-[11px] font-bold mt-0.5 ${unlocked ? "text-slate-500" : "text-slate-400"}`}>
                        {level.data?.author ? `[唐] ${level.data.author}` : "古诗"}
                      </p>
                    </div>

                    {/* Verse snippet preview */}
                    {unlocked && level.data?.content && (
                      <div className="mt-2 text-center px-1 py-1 bg-white/40 rounded-lg border border-rose-100/40">
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                          {level.data.content[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status label/button at bottom */}
                  <div className="mt-4 pt-2 border-t border-dashed border-slate-200/60 flex items-center justify-between text-[10px] font-black">
                    {unlocked ? (
                      completed ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                          完美通关
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          开始背诵 🎙️
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        通关上一关解锁
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-b from-slate-50 to-indigo-50/40 border-4 border-slate-300 rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-between overflow-hidden shadow-[6px_6px_0px_0px_#475569] select-none">
          {/* Floating clouds in background */}
          <div className="absolute top-8 left-1/4 w-20 h-6 bg-white/80 rounded-full animate-bounce opacity-80" style={{ animationDuration: "12s" }} />
          <div className="absolute top-16 right-1/4 w-24 h-7 bg-white/70 rounded-full animate-pulse opacity-70" />

          {/* Level Path winding trail behind buttons */}
          <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-12 mt-10 z-10">
            {/* Connector Winding Path line behind */}
            <div className="absolute top-8 bottom-8 w-1 border-l-4 border-dashed border-indigo-500/35 pointer-events-none" />

            {currentWorld?.levels.map((level, index) => {
              const unlocked = isLevelUnlocked(level, index);
              const stars = userProgress.stars[level.id] || 0;
              const completed = !!userProgress.completedLevels[level.id];

              // Alternate nodes left and right for aesthetic winding effect
              const offsetClass = index % 2 === 0 ? "md:translate-x-12" : "md:-translate-x-12";

              return (
                <div
                  key={level.id}
                  className={`flex flex-col md:flex-row items-center gap-4 transition-transform duration-300 ${offsetClass}`}
                >
                  {/* Level Node Button */}
                  <button
                    onClick={() => handleLevelClick(level, unlocked)}
                    className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 relative transform hover:scale-105 active:scale-95 transition-all ${
                      unlocked
                        ? completed
                          ? "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-600 shadow-[0_5px_0_0_#15803d]"
                          : "bg-indigo-600 border-indigo-800 text-white hover:bg-indigo-700 animate-pulse shadow-[0_5px_0_0_#3730a3]"
                        : "bg-slate-100/60 border-slate-200 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    {unlocked ? (
                      completed ? (
                        <CheckCircle2 className="w-8 h-8 text-white drop-shadow-sm stroke-[2.5px]" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1 fill-white drop-shadow-sm" />
                      )
                    ) : (
                      <Lock className="w-5 h-5 text-slate-300" />
                    )}

                    {/* Level text bubble below */}
                    <span className="absolute -bottom-3 bg-slate-800 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full border-2 border-slate-700 tracking-wide whitespace-nowrap">
                      {level.name}
                    </span>
                  </button>

                  {/* Level Title & Star details */}
                  <div className="bg-white border-3 border-slate-300 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#64748b] text-left w-52 md:w-60 relative flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">LEVEL {index + 1}</span>
                      {unlocked && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < stars ? "fill-yellow-400 text-yellow-500 drop-shadow-3xs" : "text-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <span className={`text-xs font-black ${unlocked ? "text-slate-800" : "text-slate-400"}`}>
                      {level.title}
                    </span>

                    {/* Prompt */}
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                      {unlocked ? "点击开启闯关原理解析 💡" : "通关上一小关即可解开 🔒"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
