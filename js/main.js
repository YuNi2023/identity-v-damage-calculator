// js/main.js

import { loadCharacterData } from './data.js';
import { initUI }             from './ui.js';

async function boot() {
  try {
    const data = await loadCharacterData();
    initUI(data);
  } catch (e) {
    console.error(e);
    document.getElementById('app').textContent = 'データ読み込みエラー';
  }
}

// アプリ起動
boot();
