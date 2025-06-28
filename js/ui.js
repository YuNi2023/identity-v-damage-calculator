// js/ui.js

export function initUI(data) {
  const btnJoseph = document.getElementById('btn-joseph');
  const btnHermit = document.getElementById('btn-hermit');
  const stageSelect = document.getElementById('stage-select');
  const setup = document.getElementById('survivor-setup');
  const battle = document.getElementById('battle-screen');

  btnJoseph.addEventListener('click', () => {
    stageSelect.style.display = 'none';
    setup.style.display = 'block';
    // TODO: ジョゼフ用UI初期化
  });

  btnHermit.addEventListener('click', () => {
    stageSelect.style.display = 'none';
    setup.style.display = 'block';
    // TODO: 隠者用UI初期化
  });

  document.getElementById('btn-start').addEventListener('click', () => {
    setup.style.display = 'none';
    battle.style.display = 'block';
    // TODO: 戦闘画面初期化
  });

  // サバイバー編成リストを生成（例としてすべての survivors を列挙）
  const list = document.getElementById('survivor-list');
  Object.entries(data.survivors).forEach(([key, sv]) => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = key;
    cb.value = key;
    const label = document.createElement('label');
    label.htmlFor = key;
    label.textContent = sv.name;
    list.append(cb, label, document.createElement('br'));
  });
}
