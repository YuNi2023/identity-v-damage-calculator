// js/data.js
export async function loadCharacterData() {
  + const res = await fetch('data/characters.json');
  if (!res.ok) {
    throw new Error(`キャラデータの読み込みに失敗: ${res.status}`);
  }
  return await res.json();
}

// デバッグ用に読み込み確認
loadCharacterData()
  .then(data => console.log('キャラデータ:', data))
  .catch(err => console.error(err));
