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
  // 各セクションの取得
  const setup        = document.getElementById('survivor-setup');
  const countdownSec = document.getElementById('start-countdown');
  const countdownNum = document.getElementById('countdown-num');
  const stageSelect  = document.getElementById('stage-select');
  const battle       = document.getElementById('battle-screen');

  // 初期表示
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

  // 「試合開始」ボタン
  document.getElementById('btn-start').addEventListener('click', () => {
    // 編成画面を非表示
    setup.style.display = 'none';
    // カウントダウンへ
    countdownSec.style.display = 'block';

    startCountdown(
      5,
      sec => {
        // 毎秒コールバック
        countdownNum.textContent = sec;
      },
      () => {
        // カウントダウン終了後
        countdownSec.style.display = 'none';
        stageSelect.style.display  = 'block';
      }
    );
  });

  // 「ジョゼフ戦」ボタン
  document.getElementById('btn-joseph').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('joseph');
  });

  // 「隠者戦」ボタン
  document.getElementById('btn-hermit').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('hermit');
  });

  // 実際にバトル画面に切り替え、タイマー開始／DP UI を描画
  function startBattle(stageKey) {
    battle.style.display = 'block';
    // タイトル
    document.getElementById('battle-title').textContent =
      stageKey === 'joseph' ? 'ジョゼフ戦' : '隠者戦';

    // 特質クールタイマー開始
    startSkillTimers(stageKey, data);

    // ダメージ計算 UI 初期化
    initBattleUI(stageKey, data);
  }
}

/**
 * バトル画面の DPバー＆攻撃ボタンを生成
 */
export function initBattleUI(stageKey, data) {
  const statusDiv = document.getElementById('survivor-status');
  statusDiv.innerHTML = '';

  // 選択されたサバイバー
  const selected = Array.from(
    document.querySelectorAll(
      '#survivor-list input[type=checkbox]:checked'
    )
  ).map(cb => cb.value);

  selected.forEach(key => {
    const sv = data.survivors[key];

    // コンテナ
    const wrapper = document.createElement('div');
    wrapper.classList.add('sv-wrapper');
    wrapper.id        = `sv-${key}`;
    wrapper.currentDP = 0;

    // 名前
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
