export enum WorldId {
  ChickenRabbit = "chicken_rabbit",
  Matchstick = "matchstick",
  TreePlanting = "tree_planting",
  QueueMath = "queue_math",
  SumDiff = "sum_diff",
  PatternSequence = "pattern_sequence",
  AgePuzzle = "age_puzzle",
  Overlapping = "overlapping",
  ReverseSolve = "reverse_solve",
  LogicGrid = "logic_grid",
  ProfitLoss = "profit_loss",
  MeetingChase = "meeting_chase",
  Pigeonhole = "pigeonhole",
  ShapeCounting = "shape_counting",
  Permutation = "permutation",
  MagicSquare = "magic_square",
  ClockAngle = "clock_angle",
  BinaryScore = "binary_score",
  TruthLiar = "truth_liar",
  WaterPouring = "water_pouring",
  TangPoetry = "tang_poetry",
  WeightCompare = "weight_compare",
  CubeStack = "cube_stack",
  ClockMatch = "clock_match",
  OddEvenSort = "odd_even_sort",
  SupermarketChange = "supermarket_change",
  OneStroke = "one_stroke",
  SequenceTrain = "sequence_train",
  SymmetryGrid = "symmetry_grid",
  NumberNeighbor = "number_neighbor",
  SubstitutionMath = "substitution_math"
}

export enum Subject {
  Math = "math",
  Chinese = "chinese"
}

export interface Level {
  id: string;
  worldId: WorldId;
  name: string;
  title: string;
  question: string;
  hint: string;
  explanation: string;
  correctAnswer: number | string;
  options?: string[];
  // Specific data for rendering the game module
  data: any;
}

export interface World {
  id: WorldId;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  accentColor: string;
  description: string;
  levels: Level[];
  subject?: Subject;
}

export interface UserProgress {
  completedLevels: { [levelId: string]: boolean };
  stars: { [levelId: string]: number }; // 1 to 3 stars
  unlockedWorlds: WorldId[];
  totalScore: number;
  allUnlocked?: boolean;
}
