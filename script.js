const form = document.getElementById('rsvp-form');
const list = document.getElementById('list');
const emptyMessage = document.getElementById('empty-message');

const STORAGE_KEY = 'rsvp_records';

let records = [];

try {
  records = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  );

  if (!Array.isArray(records)) records = [];
} catch {
  records = [];
}

render();

// 登録処理
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const className =
    document.getElementById('userclass').value;

  const name =
    document.getElementById('username').value.trim();

  const status =
    document.querySelector(
      'input[name="status"]:checked'
    ).value;

  if (!className || !name) return;

  // 同じクラス内で同じ名前が登録されていないか確認
  const duplicate = records.some(function(item) {
    return item.className === className &&
      item.name.trim() === name;
  });

  // 重複している場合は登録しない
  if (duplicate) {
    alert('このクラスには同じ名前がすでに登録されています。');
    return;
  }

  // 登録
  records.push({
    className: className,
    name: name,
    status: status
  });

  saveRecords();
  render();

  form.reset();

  document.querySelector(
    'input[name="status"][value="参加"]'
  ).checked = true;
});

// 削除処理
list.addEventListener('click', function(event) {
  const button = event.target.closest('.delete-button');

  if (!button) return;

  const index = Number(button.dataset.index);

  if (!Number.isInteger(index) ||
      index < 0 ||
      index >= records.length) return;

  records.splice(index, 1);

  saveRecords();
  render();
});

// データ保存
function saveRecords() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );
}

// 画面表示
function render() {
  list.innerHTML = '';

  let attendCount = 0;
  let absentCount = 0;

  records.forEach(function(item, index) {
    if (item.status === '参加') {
      attendCount++;
    } else {
      absentCount++;
    }

    const li = document.createElement('li');
    li.className = 'record-item';

    const identity = document.createElement('div');
    identity.className = 'record-identity';

    const name = document.createElement('span');
    name.className = 'record-name';
    name.textContent = item.name;

    const classBadge = document.createElement('span');
    classBadge.className = 'class-badge';
    classBadge.textContent =
      item.className || 'クラス未登録';

    identity.append(name, classBadge);

    const actions = document.createElement('div');
    actions.className = 'record-actions';

    const status = document.createElement('span');
    status.className = 'status-badge ' +
      (item.status === '参加'
        ? 'status-attend'
        : 'status-absent');

    status.textContent = item.status;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.dataset.index = index;
    deleteButton.textContent = '削除';

    actions.append(status, deleteButton);
    li.append(identity, actions);

    list.appendChild(li);
  });

  document.getElementById('attend-count')
    .textContent = attendCount;

  document.getElementById('absent-count')
    .textContent = absentCount;

  document.getElementById('total-count')
    .textContent = records.length;

  document.getElementById('list-count')
    .textContent = records.length + '件';

  emptyMessage.hidden = records.length > 0;
}