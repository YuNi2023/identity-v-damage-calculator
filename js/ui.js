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

  // --- ジョゼフ or 隠者 を呼び分け ---
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
    const wrapper = document.createElement('div');
    wrapper.classList.add('sv-wrapper');
    wrapper.id        = `sv-${key}`;
    wrapper.currentDP = 0;  // 現実世界DP

    // 名前表示
    const nameEl = document.createElement('h3');
    nameEl.textContent = data.survivors[key].name;
    wrapper.appendChild(nameEl);

    // DPバー
    const bar = document.createElement('div');
    bar.classList.add('dp-bar');
    bar.style.width = '0%';
    wrapper.appendChild(bar);

    // 通常攻撃ボタン
    const btnN = document.createElement('button');
    btnN.textContent = '通常攻撃';
    btnN.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], false);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      bar.style.width   = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnN);

    // 恐怖の一撃ボタン
    const btnF = document.createElement('button');
    btnF.textContent = '恐怖の一撃';
    btnF.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], true);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      bar.style.width   = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnF);

    statusDiv.appendChild(wrapper);
  });
}

/**
 * ジョゼフ戦固有 UI （写真世界ギミック）
 */
function initJosephUI(data) {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';

  // 写真世界発動
  const btnActivate = document.createElement('button');
  btnActivate.textContent = '写真世界発動';
  controls.appendChild(btnActivate);

  btnActivate.addEventListener('click', () => {
    controls.innerHTML = '';

    // 各キャラに photoDP と photo-bar を追加
    const wrappers = Array.from(document.querySelectorAll('.sv-wrapper'));
    wrappers.forEach(wrapper => {
      wrapper.photoDP = 0;
      const photoBar = document.createElement('div');
      photoBar.classList.add('photo-bar');
      photoBar.style.width = '0%';
      wrapper.appendChild(photoBar);
    });

    // 写真世界用通常攻撃ボタン
    const btnN = document.createElement('button');
    btnN.textContent = '写真世界 通常攻撃';
    controls.appendChild(btnN);
    btnN.addEventListener('click', () => {
      wrappers.forEach(wrapper => {
        const dp = calcAttackDP(data.dpMap['1.5'], false);
        wrapper.photoDP = Math.min(100, wrapper.photoDP + dp);
        wrapper.querySelector('.photo-bar').style.width = `${wrapper.photoDP}%`;
      });
    });

    // 写真世界用恐怖の一撃ボタン
    const btnF = document.createElement('button');
    btnF.textContent = '写真世界 恐怖の一撃';
    controls.appendChild(btnF);
    btnF.addEventListener('click', () => {
      wrappers.forEach(wrapper => {
        const dp = calcAttackDP(data.dpMap['1.5'], true);
        wrapper.photoDP = Math.min(100, wrapper.photoDP + dp);
        wrapper.querySelector('.photo-bar').style.width = `${wrapper.photoDP}%`;
      });
    });

    // 写真世界崩壊ボタン
    const btnCollapse = document.createElement('button');
    btnCollapse.textContent = '写真世界崩壊';
    controls.appendChild(btnCollapse);
    btnCollapse.addEventListener('click', () => {
      wrappers.forEach(wrapper => {
        const real = wrapper.currentDP;
        const photo = wrapper.photoDP;
        const collapsed = calcJosephCollapse(real, photo);
        wrapper.currentDP = collapsed;
        // DPバー更新
        const dpBar = wrapper.querySelector('.dp-bar');
        dpBar.style.width = `${collapsed}%`;
        // photo-bar を削除
        wrapper.removeChild(wrapper.querySelector('.photo-bar'));
      });
      // 写真世界操作ボタン群クリア
      controls.innerHTML = '';
    });
  });
}

/**
 * 隠者戦固有 UI （まだ未実装）
 */
function initHermitUI(data) {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';

  const btnAttack = document.createElement('button');
  btnAttack.textContent = 'ハンター攻撃';
  controls.appendChild(btnAttack);

  // TODO: 電荷付与・分配ロジックをここに実装
  btnAttack.addEventListener('click', () => {});
}
