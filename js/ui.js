// js/ui.js

import {
  calcAttackDP,
  calcJosephCollapse,
  calcHermitShare
} from './damageCalculator.js';

export function initUI(data) {
  // ── ステージ選択要素 ──
  const btnJoseph   = document.getElementById('btn-joseph');
  const btnHermit   = document.getElementById('btn-hermit');
  const stageSelect = document.getElementById('stage-select');
  const setup       = document.getElementById('survivor-setup');
  const battle      = document.getElementById('battle-screen');

  // サバイバー編成リスト生成
  const list = document.getElementById('survivor-list');
  Object.entries(data.survivors).forEach(([key, sv]) => {
    const cb    = document.createElement('input');
    cb.type     = 'checkbox';
    cb.id       = key;
    cb.value    = key;
    const label = document.createElement('label');
    label.htmlFor    = key;
    label.textContent= sv.name;
    list.append(cb, label, document.createElement('br'));
  });

  // ステージ選択
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

  // 試合開始
  document.getElementById('btn-start').addEventListener('click', () => {
    setup.style.display  = 'none';
    battle.style.display = 'block';

    // タイトル表示
    const title = document.getElementById('battle-title');
    title.textContent = setup.dataset.stage === 'joseph' ? 'ジョゼフ戦' : '隠者戦';

    // サバイバー状態エリア
    const statusDiv = document.getElementById('survivor-status');
    statusDiv.innerHTML = '';

    // 選択されたサバイバー
    const selected = Array.from(
      document.querySelectorAll('#survivor-list input[type=checkbox]:checked')
    ).map(cb => cb.value);

    // 各サバイバーに UI を生成
    selected.forEach(key => {
      const sv = data.survivors[key];
      const wrapper = document.createElement('div');
      wrapper.classList.add('sv-wrapper');
      wrapper.id = `sv-${key}`;
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

      // 通常攻撃
      const btnNormal = document.createElement('button');
      btnNormal.textContent = '通常攻撃';
      btnNormal.addEventListener('click', () => {
        const dp = calcAttackDP(data.dpMap['1.0'], false);
        wrapper.currentDP = Math.min(100, wrapper.currentDP + dp);
        bar.style.width   = `${wrapper.currentDP}%`;
      });
      wrapper.appendChild(btnNormal);

      // 恐怖の一撃
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
  });
}
