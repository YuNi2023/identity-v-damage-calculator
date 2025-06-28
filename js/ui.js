// js/ui.js

export function initUI(data) {
  // ── ステージ選択要素 ──
  const btnJoseph   = document.getElementById('btn-joseph');
  const btnHermit   = document.getElementById('btn-hermit');
  const stageSelect = document.getElementById('stage-select');
  const setup       = document.getElementById('survivor-setup');
  const battle      = document.getElementById('battle-screen');

  // ── サバイバー編成リスト生成 ──
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

  // ── ステージ選択ボタン ──
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

  // ── 試合開始ボタン ──
  document.getElementById('btn-start').addEventListener('click', () => {
    setup.style.display  = 'none';
    battle.style.display = 'block';
    // ここに戦闘画面初期化（フェーズ5以降で実装）
  });
}
