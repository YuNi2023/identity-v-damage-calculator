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
 * アプリの UI を初期化し、ステージ選択～試合開始までを管理します。
 * @param {object} data - キャラデータ
 */
export function initUI(data) {
  const btnJoseph    = document.getElementById('btn-joseph');
  const btnHermit    = document.getElementById('btn-hermit');
  const stageSelect  = document.getElementById('stage-select');
  const setup        = document.getElementById('survivor-setup');
  const battle       = document.getElementById('battle-screen');
  const countdownSec = document.getElementById('start-countdown');
  const countdownNum = document.getElementById('countdown-num');

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

  // ステージ選択イベント
  btnJoseph.addEventListener('click', () => {
    stageSelect.style.display = 'none';
    setup.style.display       = 'block';
    setup.dataset.stage       = 'joseph';
  });
  btnHermit.addEventListener('click', () => {
    stageSelect.style.display = 'none';
    setup.style.display       = 'block';
    setup.dataset.stage       = 'hermit';
  });

  // 試合開始ボタン
  document.getElementById('btn-start').addEventListener('click', () => {
    // 編成画面を隠してカウントダウン画面へ
    setup.style.display   = 'none';
    countdownSec.style.display = 'block';

    // 5秒カウントダウン
    startCountdown(
      5,
      sec => {
        countdownNum.textContent = sec;
      },
      () => {
        // カウントダウン終了後
        countdownSec.style.display = 'none';
        battle.style.display       = 'block';

        // タイトル切り替え
        const title = document.getElementById('battle-title');
        title.textContent = setup.dataset.stage === 'joseph'
          ? 'ジョゼフ戦'
          : '隠者戦';

        // 特質クールタイマー起動
        startSkillTimers(setup.dataset.stage, data);

        // バトル画面を初期化
        initBattleUI(setup.dataset.stage, data);
      }
    );
  });
}

/**
 * バトル画面（DPバー・攻撃ボタン）を生成します。
 * @param {string} stageKey - 'joseph' か 'hermit'
 * @param {object} data - キャラデータ
 */
export function initBattleUI(stageKey, data) {
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

    // コンテナ
    const wrapper = document.createElement('div');
    wrapper.classList.add('sv-wrapper');
    wrapper.id = `sv-${key}`;
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
