// js/ui.js

import {
  calcAttackDP,
  calcJosephCollapse,
  calcHermitShare
} from './damageCalculator.js';
import {
  startCountdown,
  startSkillTimers
} from './timer.js';

/**
 * アプリ全体の UI を初期化し、
 * 「編成→カウントダウン→ステージ選択→バトル」へつなぎます。
 */
export function initUI(data) {
  const setup        = document.getElementById('survivor-setup');
  const countdownSec = document.getElementById('start-countdown');
  const countdownNum = document.getElementById('countdown-num');
  const stageSelect  = document.getElementById('stage-select');
  const battle       = document.getElementById('battle-screen');

  // 初期表示設定
  setup.style.display        = 'block';
  countdownSec.style.display = 'none';
  stageSelect.style.display  = 'none';
  battle.style.display       = 'none';

  // サバイバー編成リスト生成
  const list = document.getElementById('survivor-list');
  Object.entries(data.survivors).forEach(([key, sv]) => {
    const cb    = document.createElement('input');
    cb.type     = 'checkbox';
    cb.id       = key;
    cb.value    = key;
    const label = document.createElement('label');
    label.htmlFor     = key;
    label.textContent = sv.name;
    list.append(cb, label, document.createElement('br'));
  });

  // 「試合開始」クリックでカウントダウンへ
  document.getElementById('btn-start').addEventListener('click', () => {
    setup.style.display        = 'none';
    countdownSec.style.display = 'block';

    startCountdown(
      5,
      sec => { countdownNum.textContent = sec; },  // 毎秒表示更新
      () => {  // カウント完了後
        countdownSec.style.display = 'none';
        stageSelect.style.display  = 'block';
      }
    );
  });

  // ステージ選択ボタン
  document.getElementById('btn-joseph').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('joseph', data);
  });
  document.getElementById('btn-hermit').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('hermit', data);
  });
}

/**
 * ステージを受け取り、特質タイマー→バトルUI 初期化へ
 */
function startBattle(stageKey, data) {
  const battle = document.getElementById('battle-screen');
  battle.style.display = 'block';

  // タイトル切り替え
  const title = document.getElementById('battle-title');
  title.textContent = stageKey === 'joseph' ? 'ジョゼフ戦' : '隠者戦';

  // 特質クールタイマー起動
  startSkillTimers(stageKey, data);

  // バトル用 UI 初期化
  initBattleUI(stageKey, data);
}

/**
 * バトル画面の共通UIと、ステージ固有UIを組み合わせて初期化
 */
export function initBattleUI(stageKey, data) {
  // --- 共通部分 ---
  initCommonBattleUI(data);

  // --- ステージ固有ギミック呼び出し ---
  if (stageKey === 'joseph') {
    initJosephUI(data);
  } else if (stageKey === 'hermit') {
    initHermitUI(data);
  }
}

/**
 * バトル画面の共通 UI（DPバー＋攻撃ボタン）だけを構築
 */
function initCommonBattleUI(data) {
  const statusDiv = document.getElementById('survivor-status');
  statusDiv.innerHTML = '';

  // 選択されたサバイバーキーを取得
  const selected = Array.from(
    document.querySelectorAll(
      '#survivor-list input[type=checkbox]:checked'
    )
  ).map(cb => cb.value);

  // 各サバイバーのステータス UI を生成
  selected.forEach(key => {
    const sv = data.survivors[key];
    const wrapper = document.createElement('div');
    wrapper.classList.add('sv-wrapper');
    wrapper.id        = `sv-${key}`;
    wrapper.currentDP = 0;

    // 名前表示
    const nameEl = document.createElement('h3');
    nameEl.textContent = sv.name;
    wrapper.appendChild(nameEl);

    // DPバー
    const bar = document.createElement('div');
    bar.classList.add('dp-bar');
    bar.style.width = '0%';
    wrapper.appendChild(bar);

    // 通常攻撃ボタン
    const btnNormal = document.createElement('button');
    btnNormal.textContent = '通常攻撃';
    btnNormal.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], false);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      bar.style.width   = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnNormal);

    // 恐怖の一撃ボタン
    const btnFear = document.createElement('button');
    btnFear.textContent = '恐怖の一撃';
    btnFear.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], true);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      bar.style.width   = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnFear);

    statusDiv.appendChild(wrapper);
  });
}

/**
 * ジョゼフ戦固有 UI （写真世界ギミックのスケルトン）
 */
function initJosephUI(data) {
  const statusDiv = document.getElementById('survivor-status');

  // 写真世界発動ボタン
  const btnPhoto = document.createElement('button');
  btnPhoto.textContent = '写真世界発動';
  statusDiv.parentNode.insertBefore(btnPhoto, statusDiv.nextSibling);

  btnPhoto.addEventListener('click', () => {
    // TODO: 各 wrapper に photoDP を追加 & photo-bar 描画
    // TODO: 写真世界用攻撃ボタン・崩壊ボタンをここに生成
  });
}

/**
 * 隠者戦固有 UI （電荷分配ギミックのスケルトン）
 */
function initHermitUI(data) {
  const statusDiv = document.getElementById('survivor-status');

  // 分配攻撃ボタン
  const btnShare = document.createElement('button');
  btnShare.textContent = 'ハンター攻撃';
  statusDiv.parentNode.insertBefore(btnShare, statusDiv.nextSibling);

  btnShare.addEventListener('click', () => {
    // TODO: Electrode 色取得 → グループ分け → calcHermitShare → DP更新
  });
}

// ※ このファイルは「feature-phase7-gimmick」ブランチ上で編集してください
