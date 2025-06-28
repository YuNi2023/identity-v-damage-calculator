// js/timer.js

/**
 * 指定秒数のカウントダウン表示を行い、終了後 callback を呼ぶ
 * @param {number} seconds 
 * @param {function} onTick 毎秒呼ばれる (残秒数)
 * @param {function} onComplete カウントダウン終了後呼ばれる
 */
export function startCountdown(seconds, onTick, onComplete) {
  let current = seconds;
  onTick(current);
  const id = setInterval(() => {
    current--;
    if (current > 0) {
      onTick(current);
    } else {
      clearInterval(id);
      onComplete();
    }
  }, 1000);
}

/**
 * 特質のクールタイマーを開始する例
 * data.hunters から CT 情報を受け取り、
 * id が skill-X の要素を操作して表示を更新するような実装をここに書きます。
 */
export function startSkillTimers(hunterKey, data) {
  // 例：data.hunters[hunterKey].skillCTs をループして表示
}
