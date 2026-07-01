// Palette de feedback partagée entre tous les composants de jeu, pour éviter que chaque
// format dérive vers des verts/rouges légèrement différents au fil des sessions de génération.
export const FEEDBACK = {
  correct: "bg-green-50 border-green-400 text-green-800",
  incorrect: "bg-red-50 border-red-400 text-red-800",
  neutralDisabled: "bg-white border-gray-100 text-gray-300",
  neutralActive: "bg-white border-gray-200 active:bg-gray-50",
} as const;
