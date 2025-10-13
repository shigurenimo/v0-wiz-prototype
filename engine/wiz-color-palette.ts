/**
 * ANSIカラー16色のパレット
 * 0: 透明（描画スキップ）
 * 1-15: ANSIカラー
 */
export const WIZ_COLOR_PALETTE = [
  "transparent", // 0: 透明
  "#800000", // 1: RED
  "#008000", // 2: GREEN
  "#808000", // 3: YELLOW
  "#000080", // 4: BLUE
  "#800080", // 5: MAGENTA
  "#008080", // 6: CYAN
  "#c0c0c0", // 7: WHITE
  "#808080", // 8: BRIGHT_BLACK
  "#ff0000", // 9: BRIGHT_RED
  "#00ff00", // 10: BRIGHT_GREEN
  "#ffff00", // 11: BRIGHT_YELLOW
  "#0000ff", // 12: BRIGHT_BLUE
  "#ff00ff", // 13: BRIGHT_MAGENTA
  "#00ffff", // 14: BRIGHT_CYAN
  "#ffffff", // 15: BRIGHT_WHITE
] as const
