// js/damageCalculator.js

/**
 * 通常攻撃ダメージを計算
 * @param {number} baseDP - 基本ダメージポイント (例: 50, 60, 75, 100)
 * @param {boolean} isSpecial - 恐怖の一撃／引き留める (+50DP) の場合は true
 * @returns {number} 計算後のDP
 */
export function calcAttackDP(baseDP, isSpecial = false) {
  const extra = isSpecial ? 50 : 0;
  return baseDP + extra;
}

/**
 * ジョゼフの写真世界崩壊後の体力DPを計算
 * @param {number} realDP - 現実世界でのDP
 * @param {number} photoDP - 写真世界でのDP
 * @returns {number} 崩壊後のDP (小数点切り捨て)
 */
export function calcJosephCollapse(realDP, photoDP) {
  return Math.floor((realDP + photoDP) / 2);
}

/**
 * 隠者の分配ダメージを計算
 * @param {number} baseDP - 隠者の基本攻撃DP (通常 60, CT+ は変動)
 * @param {number} count - 分配人数
 * @returns {number} 1人あたりのDP
 */
export function calcHermitShare(baseDP, count) {
  if (count < 1) {
    throw new Error('分配人数は1以上である必要があります');
  }
  return baseDP / count;
}

// --- 以下、動作確認用のログ（後で削除してOK） ---
console.log('calcAttackDP:', calcAttackDP(50), calcAttackDP(50, true));
console.log('calcJosephCollapse:', calcJosephCollapse(100, 50));
console.log('calcHermitShare:', calcHermitShare(60, 3));
