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

/** 初期画面からバトル画面までのフロー */
export function initUI(data) {
  const setup        = document.getElementById('survivor-setup');
  const countdownSec = document.getElementById('start-countdown');
  const countdownNum = document.getElementById('countdown-num');
  const stageSelect  = document.getElementById('stage-select');
  const battle       = document.getElementById('battle-screen');

  setup.style.display        = 'block';
  countdownSec.style.display = 'none';
  stageSelect.style.display  = 'none';
  battle.style.display       = 'none';

  // 編成リスト
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

  // 試合開始
  document.getElementById('btn-start').addEventListener('click', () => {
    setup.style.display        = 'none';
    countdownSec.style.display = 'block';

    startCountdown(
      5,
      sec => { countdownNum.textContent = sec; },
      () => {
        countdownSec.style.display = 'none';
        stageSelect.style.display  = 'block';
      }
    );
  });

  // ステージ選択
  document.getElementById('btn-joseph').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('joseph', data);
  });
  document.getElementById('btn-hermit').addEventListener('click', () => {
    stageSelect.style.display = 'none';
    startBattle('hermit', data);
  });
}

function startBattle(stageKey, data) {
  const battle = document.getElementById('battle-screen');
  battle.style.display = 'block';

  document.getElementById('battle-title').textContent =
    stageKey === 'joseph' ? 'ジョゼフ戦' : '隠者戦';

  startSkillTimers(stageKey, data);
  initBattleUI(stageKey, data);
}

/** 共通DPバー＋ステージ固有UI呼び出し */
export function initBattleUI(stageKey, data) {
  initCommonBattleUI(data);
  if (stageKey === 'joseph') {
    initJosephUI(data);
  } else if (stageKey === 'hermit') {
    initHermitUI(data);
  }
}

/** 共通部分: アイコン＋DPバー＋攻撃ボタン */
function initCommonBattleUI(data) {
  const statusDiv = document.getElementById('survivor-status');
  statusDiv.innerHTML = '';

  const selected = Array.from(
    document.querySelectorAll('#survivor-list input:checked')
  ).map(cb => cb.value);

  selected.forEach(key => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('sv-wrapper');
    wrapper.id        = `sv-${key}`;
    wrapper.currentDP = 0;  // 現実世界DP

    // アイコン
    const icon = document.createElement('img');
    icon.src = `assets/images/${key}.png`;
    icon.alt = key;
    icon.classList.add('survivor-icon');
    wrapper.appendChild(icon);

    // 名前
    const nameEl = document.createElement('h3');
    nameEl.textContent = data.survivors[key].name;
    wrapper.appendChild(nameEl);

    // DPバー
    const dpBar = document.createElement('div');
    dpBar.classList.add('dp-bar');
    dpBar.style.width = '0%';
    wrapper.appendChild(dpBar);

    // 通常攻撃
    const btnN = document.createElement('button');
    btnN.textContent = '通常攻撃';
    btnN.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], false);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      dpBar.style.width  = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnN);

    // 恐怖の一撃
    const btnF = document.createElement('button');
    btnF.textContent = '恐怖の一撃';
    btnF.addEventListener('click', () => {
      const dp = calcAttackDP(data.dpMap['1.0'], true);
      wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
      dpBar.style.width  = `${wrapper.currentDP}%`;
    });
    wrapper.appendChild(btnF);

    statusDiv.appendChild(wrapper);
  });
}

/** 写真世界ギミック */
function initJosephUI(data) {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';

  // 発動ボタン
  const btnAct = document.createElement('button');
  btnAct.textContent = '写真世界発動';
  controls.appendChild(btnAct);

  btnAct.addEventListener('click', () => {
    controls.innerHTML = '';

    const wrappers = Array.from(document.querySelectorAll('.sv-wrapper'));

    // ミラーアイコン ＋ photoDP 初期化
    wrappers.forEach(w => {
      w.photoDP = 0;
      const mirror = w.querySelector('img').cloneNode();
      mirror.classList.add('mirror-icon');
      w.appendChild(mirror);

      // 写真世界用バー
      const pbar = document.createElement('div');
      pbar.classList.add('photo-bar');
      pbar.style.width = '0%';
      w.appendChild(pbar);
    });

    // 写真世界 用 通常攻撃
    const btnPN = document.createElement('button');
    btnPN.textContent = '写真世界 通常攻撃';
    controls.appendChild(btnPN);
    btnPN.addEventListener('click', () => {
      wrappers.forEach(w => {
        const dp = calcAttackDP(data.dpMap['1.5'], false);
        w.photoDP = Math.min(100, w.photoDP + dp);
        w.querySelector('.photo-bar').style.width = `${w.photoDP}%`;
      });
    });

    // 写真世界 用 恐怖の一撃
    const btnPF = document.createElement('button');
    btnPF.textContent = '写真世界 恐怖の一撃';
    controls.appendChild(btnPF);
    btnPF.addEventListener('click', () => {
      wrappers.forEach(w => {
        const dp = calcAttackDP(data.dpMap['1.5'], true);
        w.photoDP = Math.min(100, w.photoDP + dp);
        w.querySelector('.photo-bar').style.width = `${w.photoDP}%`;
      });
    });

    // 写真世界 崩壊
    const btnCol = document.createElement('button');
    btnCol.textContent = '写真世界崩壊';
    controls.appendChild(btnCol);
    btnCol.addEventListener('click', () => {
      wrappers.forEach(w => {
        const real  = w.currentDP;
        const photo = w.photoDP;
        const col   = calcJosephCollapse(real, photo);
        w.currentDP = col;
        w.querySelector('.dp-bar').style.width = `${col}%`;
        // ミラーアイコン & pbar を削除
        w.removeChild(w.querySelector('.mirror-icon'));
        w.removeChild(w.querySelector('.photo-bar'));
      });
      controls.innerHTML = '';
    });
  });
}

/** 隠者戦ギミック（未実装） */
function initHermitUI(data) {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = 'ハンター攻撃';
  controls.appendChild(btn);
  btn.addEventListener('click', () => {});
}
