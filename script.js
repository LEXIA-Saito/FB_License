// DOM要素を取得
const transactionForm = document.getElementById('transaction-form');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const memoInput = document.getElementById('memo');
const transactionTableBody = document.querySelector('#transaction-table tbody');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpenseSpan = document.getElementById('total-expense');
const balanceSpan = document.getElementById('balance');
const currentMonthYearSpan = document.getElementById('current-month-year');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

// カテゴリ別集計関連DOM要素を取得
const categorySummaryList = document.getElementById('category-summary-list');
const currentMonthYearCategorySpan = document.getElementById('current-month-year-category');
const noExpenseMessage = document.getElementById('no-expense-message');

// ローカルストレージにデータを保存するためのキー
const localStorageKey = 'simpleHousekeepingData';

// 家計簿データ
let transactions = [];

// 編集中のトランザクションIDを保持する変数
let editingTransactionId = null;
// 編集中の行要素を保持する変数
let editingRowElement = null;

// --- 月選択機能の追加 ---
const monthSelector = document.createElement('input');
monthSelector.type = 'month';
monthSelector.id = 'month-selector';
monthSelector.style.margin = '0 0 16px 0';

// ページロード時に月別合計集計エリアの上に追加
const summarySection = document.querySelector('.summary-section');
summarySection.parentNode.insertBefore(monthSelector, summarySection);

// --- 月選択状態の管理 ---
let selectedYear, selectedMonth;

function setMonthSelectorToToday() {
    const today = new Date();
    const yyyyMM = today.toISOString().slice(0, 7);
    monthSelector.value = yyyyMM;
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth();
}

monthSelector.addEventListener('change', function() {
    const [year, month] = monthSelector.value.split('-').map(Number);
    selectedYear = year;
    selectedMonth = month - 1;
    updateAllViews();
});

// --- データの保存・読み込み ---

// ローカルストレージからデータを読み込む関数
function loadTransactions() {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
        transactions = JSON.parse(data);
        transactions.forEach(t => {
            // IDを必ずnumber型に変換
            if (typeof t.id !== 'number') {
                t.id = Number(t.id);
            }
            // 金額が数値であることを確認
            if (typeof t.amount !== 'number') {
                t.amount = parseFloat(t.amount) || 0;
            }
        });
    } else {
        transactions = [];
    }
    saveTransactions();
}

// ローカルストレージにデータを保存する関数
function saveTransactions() {
    localStorage.setItem(localStorageKey, JSON.stringify(transactions));
}

// --- データの表示（テーブル） ---

function renderTable() {
    transactionTableBody.innerHTML = '';
    // 編集中の行要素をリセット
    editingRowElement = null;

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedTransactions.forEach(transaction => {
        const row = transactionTableBody.insertRow();

        row.insertCell(0).setAttribute('data-label', '日付');
        row.cells[0].textContent = transaction.date;

        row.insertCell(1).setAttribute('data-label', 'カテゴリ');
        row.cells[1].textContent = transaction.category;

        const amountCell = row.insertCell(2);
        amountCell.setAttribute('data-label', '金額');
        const amount = transaction.amount;
        amountCell.textContent = Math.abs(amount).toLocaleString();
        if (amount > 0) {
            amountCell.style.color = '#27ae60';
        } else {
            amountCell.style.color = '#e74c3c';
        }
        amountCell.style.textAlign = 'right';

        row.insertCell(3).setAttribute('data-label', '摘要');
        row.cells[3].textContent = transaction.memo;

        const actionCell = row.insertCell(4);
        actionCell.setAttribute('data-label', '操作');
        // 編集ボタン
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = '編集';
        editButton.onclick = (event) => {
            event.stopPropagation();
            startEditing(transaction.id, row);
        };
        actionCell.appendChild(editButton);
        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            deleteTransaction(transaction.id);
        };
        actionCell.appendChild(deleteButton);

        row.addEventListener('click', () => startEditing(transaction.id, row));

        // 編集中のIDに一致する行だけセット
        if (editingTransactionId === transaction.id) {
            row.classList.add('editing-row');
            editingRowElement = row;
        }
    });
}

// --- 集計計算・表示 ---

function renderSummary() {
    // 選択中の年月を使う
    const year = selectedYear;
    const month = selectedMonth;

    currentMonthYearSpan.textContent = `${year}年${month + 1}月`;
    currentMonthYearCategorySpan.textContent = `${year}年${month + 1}月`;

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryExpenses = {};

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (isNaN(transactionDate.getTime())) {
            console.warn("不正な日付のデータが見つかりました:", transaction);
            return;
        }
        const tYear = transactionDate.getFullYear();
        const tMonth = transactionDate.getMonth();
        if (tYear === year && tMonth === month) {
            const amount = transaction.amount;
            if (amount > 0) {
                totalIncome += amount;
            } else {
                const expenseAmount = Math.abs(amount);
                totalExpense += expenseAmount;
                const category = transaction.category;
                if (category !== '収入') {
                    if (categoryExpenses[category]) {
                        categoryExpenses[category] += expenseAmount;
                    } else {
                        categoryExpenses[category] = expenseAmount;
                    }
                }
            }
        }
    });

    totalIncomeSpan.textContent = totalIncome.toLocaleString();
    totalExpenseSpan.textContent = totalExpense.toLocaleString();
    const balance = totalIncome - totalExpense;
    balanceSpan.textContent = balance.toLocaleString();

    if (balance < 0) {
        balanceSpan.style.color = '#e74c3c';
    } else {
        balanceSpan.style.color = '#3498db';
    }

    renderCategorySummary(categoryExpenses);
}

// カテゴリ別支出集計を表示する関数
function renderCategorySummary(categoryExpenses) {
    categorySummaryList.innerHTML = '';
    // HTML側のno-expense-messageを制御
    if (Object.keys(categoryExpenses).length === 0) {
        noExpenseMessage.style.display = '';
    } else {
        noExpenseMessage.style.display = 'none';
        Object.keys(categoryExpenses).sort().forEach(category => {
            const listItem = document.createElement('li');
            const amount = categoryExpenses[category];
            listItem.innerHTML = `
                <span>${category}</span>
                <span>${amount.toLocaleString()} 円</span>
            `;
            categorySummaryList.appendChild(listItem);
        });
    }
}

// --- グラフ描画 ---
let yearlyBalanceChart = null;
let yearlyCategoryPieChart = null;

function renderYearlyCharts() {
    // 年間データ集計
    const now = new Date();
    const year = selectedYear || now.getFullYear();
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);
    const categoryTotals = {};

    transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === year) {
            const m = d.getMonth();
            if (t.amount > 0) {
                monthlyIncome[m] += t.amount;
            } else {
                monthlyExpense[m] += Math.abs(t.amount);
                // カテゴリ別集計
                if (t.category !== '収入') {
                    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
                    categoryTotals[t.category] += Math.abs(t.amount);
                }
            }
        }
    });

    // 年間収支推移グラフ
    const ctx1 = document.getElementById('yearly-balance-chart').getContext('2d');
    if (yearlyBalanceChart) yearlyBalanceChart.destroy();
    yearlyBalanceChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: Array.from({length:12}, (_,i)=>`${i+1}月`),
            datasets: [
                {
                    label: '収入',
                    data: monthlyIncome,
                    backgroundColor: '#27ae60',
                },
                {
                    label: '支出',
                    data: monthlyExpense,
                    backgroundColor: '#e74c3c',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // 年間カテゴリ別支出割合グラフ
    const ctx2 = document.getElementById('yearly-category-pie-chart').getContext('2d');
    if (yearlyCategoryPieChart) yearlyCategoryPieChart.destroy();
    yearlyCategoryPieChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#e67e22','#e74c3c','#3498db','#9b59b6','#2ecc71','#f1c40f','#34495e','#1abc9c','#95a5a6','#7f8c8d','#c0392b','#16a085','#2980b9','#8e44ad','#d35400'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' },
                title: { display: false }
            }
        }
    });
}

// アコーディオン開閉時に円グラフのリサイズを強制
const pieAccordion = document.getElementById('category-pie-accordion');
pieAccordion.addEventListener('toggle', function() {
    if (pieAccordion.open && yearlyCategoryPieChart) {
        yearlyCategoryPieChart.resize();
    }
});

// --- データ追加 または 更新 ---
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const date = dateInput.value;
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const memo = memoInput.value.trim();

    if (!date || !category || amount <= 0 || isNaN(amount)) {
        alert('日付、カテゴリ、金額を入力してください。（金額は正の数で）');
        return;
    }

    const transactionAmount = (category === '収入') ? amount : -amount;

    if (editingTransactionId !== null) {
        transactions = transactions.map(transaction => {
            if (transaction.id === editingTransactionId) {
                return {
                    ...transaction,
                    date: date,
                    category: category,
                    amount: transactionAmount,
                    memo: memo
                };
            }
            return transaction;
        });
        endEditing();
    } else {
        const newTransaction = {
            id: Date.now() + Math.random(),
            date: date,
            category: category,
            amount: transactionAmount,
            memo: memo
        };
        transactions.push(newTransaction);
        // 追加: 新しい明細の日付が現在選択中の月と異なる場合は自動で切り替え
        const newDate = new Date(date);
        if (
            newDate.getFullYear() !== selectedYear ||
            newDate.getMonth() !== selectedMonth
        ) {
            selectedYear = newDate.getFullYear();
            selectedMonth = newDate.getMonth();
            // 月セレクターも更新
            monthSelector.value = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
        }
    }

    saveTransactions();
    updateAllViews();

    if (editingTransactionId === null) {
        transactionForm.reset();
        dateInput.valueAsDate = new Date();
        categorySelect.value = "";
    }
});

// --- データ削除 ---
function deleteTransaction(id) {
    if (confirm('この明細を削除してもよろしいですか？')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();

        if (editingTransactionId === id) {
            endEditing();
        }

        updateAllViews();
    }
}

// --- 編集機能関連 ---

function startEditing(id, rowElement) {
    if (editingRowElement) {
        editingRowElement.classList.remove('editing-row');
    }

    // idはnumber型で統一
    const transactionToEdit = transactions.find(transaction => transaction.id === id);

    if (!transactionToEdit) {
        console.error('編集対象のデータが見つかりません (ID: ' + id + ')');
        return;
    }

    dateInput.value = transactionToEdit.date;
    categorySelect.value = transactionToEdit.category;
    amountInput.value = Math.abs(transactionToEdit.amount);
    memoInput.value = transactionToEdit.memo;

    editingTransactionId = id;
    editingRowElement = rowElement;
    editingRowElement.classList.add('editing-row');

    submitButton.textContent = '更新';
    submitButton.style.backgroundColor = '#ffc107';
    submitButton.style.color = '#212529';
    cancelEditButton.style.display = '';
    transactionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function endEditing() {
    editingTransactionId = null;
    if (editingRowElement) {
        editingRowElement.classList.remove('editing-row');
        editingRowElement = null;
    }

    transactionForm.reset();
    dateInput.valueAsDate = new Date();
    categorySelect.value = "";

    submitButton.textContent = '追加';
    submitButton.style.backgroundColor = '#3498db';
    submitButton.style.color = 'white';
    cancelEditButton.style.display = 'none';
}

// キャンセルボタンのイベント
cancelEditButton.addEventListener('click', endEditing);

// --- ダークモード切替 ---
const darkModeBtn = document.getElementById('toggle-darkmode');
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('darkmode');
    if(document.body.classList.contains('darkmode')){
        darkModeBtn.textContent = '☀️';
        localStorage.setItem('darkmode', '1');
    }else{
        darkModeBtn.textContent = '🌙';
        localStorage.setItem('darkmode', '0');
    }
});
if(localStorage.getItem('darkmode')==='1'){
    document.body.classList.add('darkmode');
    darkModeBtn.textContent = '☀️';
}

// --- カテゴリカスタマイズ ---
const categoryCustomForm = document.getElementById('category-custom-form');
const newCategoryNameInput = document.getElementById('new-category-name');
const addCategoryBtn = document.getElementById('add-category-btn');
const customCategoryList = document.getElementById('custom-category-list');
let customCategories = JSON.parse(localStorage.getItem('customCategories')||'[]');
function saveCustomCategories(){localStorage.setItem('customCategories',JSON.stringify(customCategories));}
function renderCategorySelects(){
    // 入力フォーム
    categorySelect.innerHTML = '<option value="">選択してください</option>';
    const baseCats = [
        '収入','食費','日用品','交通費','娯楽・趣味','交際費','衣服・美容','健康・医療','教養・教育','住宅','水道光熱費','通信費','保険料','税金・社会保険','その他支出'
    ];
    const allCats = baseCats.concat(customCategories);
    allCats.forEach(cat=>{
        const opt = document.createElement('option');
        opt.value = cat; opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
    // 予算カテゴリセレクト
    budgetCategorySelect.innerHTML = '';
    allCats.filter(c=>c!=='収入').forEach(cat=>{
        const opt = document.createElement('option');
        opt.value = cat; opt.textContent = cat;
        budgetCategorySelect.appendChild(opt);
    });
}
addCategoryBtn.addEventListener('click',()=>{
    const name = newCategoryNameInput.value.trim();
    if(name && !customCategories.includes(name)){
        customCategories.push(name);
        saveCustomCategories();
        renderCategorySelects();
        renderCustomCategoryList();
        newCategoryNameInput.value='';
    }
});
function renderCustomCategoryList(){
    customCategoryList.innerHTML = '';
    customCategories.forEach((cat,i)=>{
        const li = document.createElement('li');
        li.textContent = cat;
        const delBtn = document.createElement('button');
        delBtn.textContent = '削除';
        delBtn.onclick = ()=>{
            customCategories.splice(i,1);
            saveCustomCategories();
            renderCategorySelects();
            renderCustomCategoryList();
        };
        li.appendChild(delBtn);
        customCategoryList.appendChild(li);
    });
}
// --- 日付入力の初期値を選択中の月の1日に ---
function setDateInputToMonthFirst(){
    if(selectedYear && selectedMonth>=0){
        dateInput.value = `${selectedYear}-${String(selectedMonth+1).padStart(2,'0')}-01`;
    }else{
        dateInput.valueAsDate = new Date();
    }
}
// --- 初期化・再描画フック ---
function updateAllViews() {
    renderTable();
    renderSummary();
    renderYearlyCharts();
    renderCategorySelects();
    renderCustomCategoryList();
    checkBudgetAlert();
    setDateInputToMonthFirst();
}

// --- ページのロード時の初期化処理 ---
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
    setMonthSelectorToToday();
    updateAllViews();
    endEditing();
});

// 年間グラフも更新

// --- Google Drive連携 ---
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // Google Cloud Consoleで取得
const API_KEY = 'YOUR_API_KEY'; // Google Cloud Consoleで取得
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const googleAuthBtn = document.getElementById('google-auth-btn');
const googleSaveBtn = document.getElementById('google-save-btn');
const googleLoadBtn = document.getElementById('google-load-btn');
let gapiInited = false;
let isSignedIn = false;

function updateGoogleUI() {
    googleSaveBtn.style.display = isSignedIn ? '' : 'none';
    googleLoadBtn.style.display = isSignedIn ? '' : 'none';
    googleAuthBtn.textContent = isSignedIn ? 'Googleサインアウト' : 'Google連携';
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        gapiInited = true;
        isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        updateGoogleUI();
        gapi.auth2.getAuthInstance().isSignedIn.listen(val => {
            isSignedIn = val;
            updateGoogleUI();
        });
    });
}
window.handleClientLoad = handleClientLoad;

document.addEventListener('DOMContentLoaded', () => {
    if (window.gapi) handleClientLoad();
});

googleAuthBtn.addEventListener('click', () => {
    if (!gapiInited) return;
    if (isSignedIn) {
        gapi.auth2.getAuthInstance().signOut();
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
});

googleSaveBtn.addEventListener('click', async () => {
    if (!isSignedIn) return;
    const fileContent = JSON.stringify({transactions, budgets, customCategories});
    const file = new Blob([fileContent], {type: 'application/json'});
    const metadata = {
        name: 'saitou_kakeibo_data.json',
        mimeType: 'application/json'
    };
    const accessToken = gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);
    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form
    });
    alert('Google Driveに保存しました');
});

googleLoadBtn.addEventListener('click', async () => {
    if (!isSignedIn) return;
    // ファイル検索
    const res = await gapi.client.drive.files.list({q: "name='saitou_kakeibo_data.json' and trashed=false"});
    if (res.result.files.length === 0) { alert('Driveにデータがありません'); return; }
    const fileId = res.result.files[0].id;
    const fileRes = await gapi.client.drive.files.get({fileId, alt:'media'});
    const data = fileRes.body ? JSON.parse(fileRes.body) : fileRes.result;
    if (data.transactions) transactions = data.transactions;
    if (data.budgets) budgets = data.budgets;
    if (data.customCategories) customCategories = data.customCategories;
    saveTransactions();
    saveBudgets();
    saveCustomCategories();
    updateAllViews();
    alert('Google Driveから読込完了');
});

// FAB展開・格納の制御
const fabMain = document.getElementById('fab-main');
const fabContainer = document.querySelector('.fab-container');
const fabActions = document.getElementById('fab-actions');

fabMain.addEventListener('click', function(e) {
    e.stopPropagation();
    fabContainer.classList.toggle('open');
});
// FAB以外をクリックしたら閉じる
window.addEventListener('click', function(e) {
    if (!fabContainer.contains(e.target)) {
        fabContainer.classList.remove('open');
    }
});
// FAB内のボタンをクリックしても閉じないように
fabActions.addEventListener('click', function(e) {
    e.stopPropagation();
});
