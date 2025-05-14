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
// const cancelButton = document.getElementById('cancel-button'); // キャンセルボタンを追加する場合

// カテゴリ別集計関連DOM要素を取得
const categorySummaryList = document.getElementById('category-summary-list');
const currentMonthYearCategorySpan = document.getElementById('current-month-year-category');
const noExpenseMessage = document.getElementById('no-expense-message');

// グラフ関連DOM要素の取得は不要
// const monthlyBalanceChartCanvas = document.getElementById('monthly-balance-chart');


// ローカルストレージにデータを保存するためのキー
const localStorageKey = 'simpleHousekeepingData';

// 家計簿データ
let transactions = [];

// 編集中のトランザクションIDを保持する変数
let editingTransactionId = null;
// 編集中の行要素を保持する変数
let editingRowElement = null;

// Chart.js インスタンスを保持する変数も不要
// let monthlyBalanceChart = null;


// --- データの保存・読み込み ---

// ローカルストレージからデータを読み込む関数
function loadTransactions() {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
        // データが存在する場合、JSON文字列をパースして配列に代入
        transactions = JSON.parse(data);
        transactions.forEach(t => {
             // ロバスト性のためのIDチェック（必要であれば残す）
             if (typeof t.id !== 'number') {
                 // console.warn("不正なIDのデータが見つかりました。IDを再生成します。", t);
                 t.id = Date.now() + Math.random(); // 新しい一意なIDを生成
             }
             // 金額が数値であることを確認（ローカルストレージからの読み込みは文字列になることがあるため）
             if (typeof t.amount !== 'number') {
                  // console.warn("金額が数値でないデータが見つかりました。数に変換します。", t);
                  t.amount = parseFloat(t.amount) || 0; // 数値に変換できない場合は0に
             }
        });
        // console.log('データ読み込み完了:', transactions);
    } else {
        // データが存在しない場合は空の配列で初期化
        transactions = [];
         // console.log('ローカルストレージにデータはありませんでした。');
    }
    // loadTransactionsが完了したら保存し直す（データ形式の修正があった場合に適用するため）
     saveTransactions();
}

// ローカルストレージにデータを保存する関数
function saveTransactions() {
    // transactions配列をJSON文字列に変換して保存
    localStorage.setItem(localStorageKey, JSON.stringify(transactions));
    // console.log('データ保存完了:', transactions);
}


// --- データの表示（テーブル） ---

// テーブルにデータを表示する関数
function renderTable() {
    // まずテーブルの内容をクリア
    transactionTableBody.innerHTML = '';

    // データを日付の新しい順にソート
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 各データをテーブルの行として追加
    sortedTransactions.forEach(transaction => {
        const row = transactionTableBody.insertRow();

        // 各セルを作成しデータを挿入
        // レスポンシブ対応のためにdata-label属性を追加
        row.insertCell(0).setAttribute('data-label', '日付');
        row.cells[0].textContent = transaction.date;

        row.insertCell(1).setAttribute('data-label', 'カテゴリ');
        row.cells[1].textContent = transaction.category;

        const amountCell = row.insertCell(2);
        amountCell.setAttribute('data-label', '金額');
        const amount = transaction.amount; // 保存されている金額（収入は正、支出は負）

        // 表示金額は絶対値
        amountCell.textContent = Math.abs(amount).toLocaleString();

        // 金額は収入か支出かで色を変える
        if (amount > 0) { // 収入
            amountCell.style.color = '#27ae60'; // 緑
        } else { // 支出
            amountCell.style.color = '#e74c3c'; // 赤
        }
        amountCell.style.textAlign = 'right';

        row.insertCell(3).setAttribute('data-label', '摘要');
        row.cells[3].textContent = transaction.memo;

        // 操作セル（削除ボタン）
        const actionCell = row.insertCell(4);
        actionCell.setAttribute('data-label', '操作');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '削除';
        // 削除ボタンにイベントリスナーを設定
        deleteButton.onclick = (event) => {
             event.stopPropagation(); // 行クリックイベントが同時に発火するのを防ぐ
             deleteTransaction(transaction.id); // トランザクションIDを渡す
        };
        actionCell.appendChild(deleteButton);

        // 行クリックで編集を開始するイベントリスナー
        row.addEventListener('click', () => startEditing(transaction.id, row)); // トランザクションIDと行要素を渡す

        // もしこの行が現在編集中の行であれば、スタイルを適用
        if (editingTransactionId === transaction.id) {
             row.classList.add('editing-row');
             editingRowElement = row; // 編集中の行要素も更新
        }
    });
}

// --- 集計計算・表示 ---

// 月別合計集計とカテゴリ別支出集計を計算・表示する関数 (グラフ関連を削除)
function renderSummary() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    // 月別合計集計の年月表示を更新
    currentMonthYearSpan.textContent = `${currentYear}年${currentMonth + 1}月`;
    // カテゴリ別集計の年月表示も更新
    currentMonthYearCategorySpan.textContent = `${currentYear}年${currentMonth + 1}月`;


    let totalIncome = 0;
    let totalExpense = 0;
    // カテゴリ別支出合計を保持するオブジェクト
    let categoryExpenses = {};
    // 月ごとの収支データを保持するオブジェクトは不要
    // let monthlyData = {};


    // 今月の合計とカテゴリ別集計を同時に集計
    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        // Dateオブジェクトの生成に失敗した場合（不正な日付など）はスキップ
        if (isNaN(transactionDate.getTime())) {
             console.warn("不正な日付のデータが見つかりました:", transaction);
             return; // このトランザクションはスキップ
        }

        const year = transactionDate.getFullYear();
        const month = transactionDate.getMonth(); // 0-11

        // 今月の合計集計 (現在の年月に一致する場合のみ)
        if (year === currentYear && month === currentMonth) {
             const amount = transaction.amount;
             if (amount > 0) { // 収入 (amountが正の場合)
                totalIncome += amount;
             } else { // 支出 (amountが負の場合)
                const expenseAmount = Math.abs(amount); // 支出の金額（正の値）
                totalExpense += expenseAmount;

                const category = transaction.category;
                // 収入カテゴリはカテゴリ別支出集計に含めない
                if (category !== '収入') {
                    if (categoryExpenses[category]) {
                        categoryExpenses[category] += expenseAmount;
                    } else {
                        categoryExpenses[category] = expenseAmount;
                    }
                }
             }
        }

        // 月ごとの収支データを集計するロジック全体は不要
        /*
        const yearMonth = `${year}-${('0' + (month + 1)).slice(-2)}`; // "YYYY-MM" 形式
        if (!monthlyData[yearMonth]) {
            monthlyData[yearMonth] = { income: 0, expense: 0, balance: 0 };
        }
        if (amount > 0) {
             monthlyData[yearMonth].income += amount;
        } else {
             monthlyData[yearMonth].expense += Math.abs(amount);
        }
        monthlyData[yearMonth].balance = monthlyData[yearMonth].income - monthlyData[yearMonth].expense;
        */
    });


    // 月別合計結果の表示を更新
    totalIncomeSpan.textContent = totalIncome.toLocaleString();
    totalExpenseSpan.textContent = totalExpense.toLocaleString();
    // balanceSpan.textContent = balance.toLocaleString(); // ★balanceの計算は次の行で行われています★

    const balance = totalIncome - totalExpense; // ★balance の計算はここで行われています★
    balanceSpan.textContent = balance.toLocaleString(); // ★balance の表示を更新★


     if (balance < 0) {
         balanceSpan.style.color = '#e74c3c'; // 赤
     } else {
         balanceSpan.style.color = '#3498db'; // 青
     }

    // カテゴリ別支出集計の表示を更新
    renderCategorySummary(categoryExpenses); // 集計したデータを渡す

    // 月ごとの収支推移グラフを描画する関数呼び出しは不要
    // renderMonthlyBalanceChart(monthlyData);
}

// カテゴリ別支出集計を表示する関数
function renderCategorySummary(categoryExpenses) { // 引数を受け取る
    // リストをクリア
    categorySummaryList.innerHTML = '';

    // カテゴリ名をアルファベット順でソート
    const sortedCategories = Object.keys(categoryExpenses).sort();

    if (sortedCategories.length === 0) {
        // 支出が全くない場合
        // カテゴリが「収入」のみの場合もここに該当
        noExpenseMessage.style.display = 'block'; // メッセージを表示
    } else {
         noExpenseMessage.style.display = 'none'; // メッセージを非表示
        // 各カテゴリと合計額をリストアイテムとして追加
        sortedCategories.forEach(category => {
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


// 月ごとの収支を計算しグラフを描画する関数 renderMonthlyBalanceChart 全体は不要
/*
function renderMonthlyBalanceChart(monthlyData) {
    // ... (関数の中身全体を削除またはコメントアウト) ...
}
*/


// --- データ追加 または 更新 ---
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // console.log('フォーム送信イベント発生');

    const date = dateInput.value;
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const memo = memoInput.value.trim();

    if (!date || !category || amount <= 0 || isNaN(amount)) { // ★NaNチェックを追加★
        alert('日付、カテゴリ、金額を入力してください。（金額は正の数で）');
        // console.warn('必須入力チェック失敗');
        return;
    }

    const transactionAmount = (category === '収入') ? amount : -amount; // 収入は正、支出は負

    if (editingTransactionId !== null) {
        // --- 更新処理 ---
        // console.log('更新処理実行 (ID:', editingTransactionId, ')');
        transactions = transactions.map(transaction => {
            if (transaction.id === editingTransactionId) {
                return {
                    ...transaction, // 元のidを残す
                    date: date,
                    category: category,
                    amount: transactionAmount, // 更新された金額と収支区分
                    memo: memo
                };
            }
            return transaction; // それ以外のデータはそのまま
        });

        // 編集モードを終了
        endEditing();

    } else {
        // --- 追加処理 ---
        // console.log('追加処理実行');
        const newTransaction = {
            id: Date.now() + Math.random(), // ★ユニーク性を高めるため乱数を追加★
            date: date,
            category: category,
            amount: transactionAmount,
            memo: memo
        };
        transactions.push(newTransaction);
        // console.log('新しいデータ:', newTransaction);
    }

    saveTransactions();

    // 表示を更新（renderSummaryがカテゴリ別も更新、グラフは削除）
    renderTable();
    renderSummary(); // renderSummary() がカテゴリ別集計を更新します

    // 追加処理後は endEditing() が呼ばれないので、ここでフォームリセット
    if (editingTransactionId === null) {
         transactionForm.reset();
         dateInput.valueAsDate = new Date(); // 日付を今日に戻す
         categorySelect.value = ""; // カテゴリを選択してください に戻す
    }
});


// --- データ削除 ---
function deleteTransaction(id) {
    // console.log('削除処理開始 (ID:', id, ')');
    if (confirm('この明細を削除してもよろしいですか？')) {
        transactions = transactions.filter(transaction => String(transaction.id) !== String(id)); // ★ID比較を文字列で★
        saveTransactions();

        // 削除したデータが編集中のものだった場合、編集モードを終了
        if (editingTransactionId === id) {
             endEditing();
        }

        // 表示を更新（renderSummaryがカテゴリ別も更新、グラフは削除）
        renderTable();
        renderSummary(); // renderSummary() がカテゴリ別集計を更新します
        // console.log('削除処理完了');
    } else {
        // console.log('削除キャンセル');
    }
}


// --- 編集機能関連 ---

// 編集モードを開始する関数
function startEditing(id, rowElement) {
    // console.log('編集開始 (ID:', id, ')');
    // まず、他の行が編集モードになっていたら解除
    if (editingRowElement) {
        editingRowElement.classList.remove('editing-row');
    }

    // 編集対象のデータを見つける
    // idを数値ではなく文字列として扱う場合があるため、比較前に型を揃える
    const transactionToEdit = transactions.find(transaction => String(transaction.id) === String(id));

    if (!transactionToEdit) {
        console.error('編集対象のデータが見つかりません (ID: ' + id + ')');
        return;
    }

    // フォームにデータを読み込む
    dateInput.value = transactionToEdit.date;
    categorySelect.value = transactionToEdit.category;
    amountInput.value = Math.abs(transactionToEdit.amount);
    memoInput.value = transactionToEdit.memo;

    // 編集中のIDと行要素を記録
    editingTransactionId = id;
    editingRowElement = rowElement;

    // 編集中の行にスタイルを適用
    editingRowElement.classList.add('editing-row');

    // ボタンのテキストを変更
    submitButton.textContent = '更新';
    submitButton.style.backgroundColor = '#ffc107';
    submitButton.style.color = '#212529';

    transactionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // console.log('編集モード開始');
}

// 編集モードを終了する関数
function endEditing() {
    // console.log('編集モード終了');
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
}


// キャンセルボタンのイベントリスナーは削除またはコメントアウト
/*
const cancelButton = document.getElementById('cancel-button');
if (cancelButton) {
    cancelButton.addEventListener('click', function() {
        endEditing();
    });
}
*/


// --- ページのロード時の初期化処理 ---
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOMContentLoaded fired');
    loadTransactions();

    // 初期表示（テーブルと集計）をレンダリング
    renderTable();
    renderSummary(); // カテゴリ別集計もここで初期表示される

    dateInput.valueAsDate = new Date();

    endEditing();
});