/* 基本的なスタイルとリセット */
body {
    margin: 0;
    font-family: 'Noto Sans JP', sans-serif; /* Google Fontsとシステムフォントを指定 */
    line-height: 1.6; /* 行間を調整 */
    background-color: #eef2f7; /* ほんのり青みがかったグレー背景 */
    padding: 20px;
    color: #333; /* 基本的なテキスト色 */
}

body.darkmode {
    background-color: #23272f;
    color: #f1f1f1;
}

.container {
    max-width: 960px; /* 少し広げる */
    margin: 0 auto; /* 中央寄せ */
    padding: 20px;
}

h1 {
    text-align: center;
    color: #2c3e50; /* 濃い青系の色 */
    margin-top: 0;
    margin-bottom: 40px; /* 余白を広げる */
    font-weight: 700; /* 太字 */
    font-family: 'Roboto', sans-serif; /* タイトル用のフォント（任意） */
}

h2 {
    color: #34495e; /* 少し薄い青系の色 */
    border-bottom: none; /* 下線をなくす */
    padding-bottom: 0;
    margin-top: 30px;
    margin-bottom: 20px;
    font-weight: 700;
}

body.darkmode h1, body.darkmode h2, body.darkmode th {
    color: #f1c40f;
}

/* 各セクション共通のカードスタイル */
.section {
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 影を柔らかく */
    border-radius: 8px;
    padding: 20px; /* セクション内のパディング */
    margin-bottom: 30px; /* 各セクション間の下余白 */
}

body.darkmode .section {
    background: #2d323c;
    color: #f1f1f1;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* 最後のセクションの下余白は不要 */
.section:last-child {
    margin-bottom: 0;
}


/* フォームセクション内の調整 */
/* .form-section は .section スタイルを継承・利用 */
.form-group {
    margin-bottom: 20px; /* 余白を少し広げる */
}

.form-group label {
    display: block;
    margin-bottom: 8px; /* 余白を少し広げる */
    font-weight: 700; /* ラベルを太字に */
    color: #555;
}

body.darkmode .form-group label,
body.darkmode .form-section button,
body.darkmode .delete-button,
body.darkmode .edit-button,
body.darkmode #cancel-edit-button {
    color: #23272f;
}

body.darkmode .form-group label {
    color: #f1f1f1 !important;
}

body.darkmode .form-group input[type="date"],
body.darkmode .form-group input[type="number"],
body.darkmode .form-group input[type="text"],
body.darkmode .form-group select {
    background: #23272f;
    color: #f1f1f1;
    border: 1px solid #888;
}

.form-group input[type="date"],
.form-group input[type="number"],
.form-group input[type="text"],
.form-group select {
    width: 100%; /* 幅100%に */
    padding: 10px; /* パディングを広げる */
    border: 1px solid #bdc3c7; /* ボーダー色を調整 */
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1rem;
    transition: border-color 0.3s ease; /* フォーカス時のアニメーション */
}

body.darkmode input,
body.darkmode select {
    background: #23272f;
    color: #f1f1f1;
    border: 1px solid #888;
}

.form-group input[type="date"]:focus,
.form-group input[type="number"]:focus,
.form-group input[type="text"]:focus,
.form-group select:focus {
    border-color: #3498db; /* フォーカス時に青く光る */
    outline: none; /* デフォルトのアウトラインを消す */
}


.form-section button[type="submit"] {
    display: block;
    width: 100%;
    padding: 12px; /* パディングを広げる */
    background-color: #3498db; /* 少し明るい青 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    transition: background-color 0.3s ease;
}

body.darkmode .form-section button,
body.darkmode .delete-button,
body.darkmode .edit-button,
body.darkmode #cancel-edit-button {
    background-color: #f1c40f;
    border: none;
}

.form-section button[type="submit"]:hover {
    background-color: #2980b9; /* ホバー時 */
}


/* 集計セクション */
.summary-section {
     background-color: #ecf0f1; /* 薄いグレーの背景 */
     border: 1px solid #bdc3c7; /* 控えめなボーダー */
     /* .section スタイルを継承・利用 */
}

body.darkmode .graph-section,
body.darkmode .budget-section,
body.darkmode .category-custom-section {
    background: #23272f;
    color: #f1f1f1;
}

.summary-section h2 {
     color: #2c3e50; /* タイトル色 */
     margin-top: 0; /* 上の余白をなくす（カードスタイルとの兼ね合い） */
}

.summary-section p {
    margin: 8px 0; /* 行間の余白を調整 */
    font-size: 1.1rem;
}

.summary-section span {
    font-weight: 700; /* 太字 */
    margin-left: 5px; /* 値の左に少し余白 */
}

#total-income {
    color: #27ae60; /* 収入は緑 */
}

#total-expense {
    color: #e74c3c; /* 支出は赤 */
}

#balance {
    color: #3498db; /* 収支は青 */
    font-size: 1.3rem; /* 少し大きめに */
}


/* データ表示テーブル */
.data-section {
    overflow-x: auto; /* テーブルがはみ出る場合にスクロールバーを表示 */
    /* .section スタイルを継承・利用 */
}

.data-section table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px; /* 見出しとの余白 */
    min-width: 600px; /* 狭い画面でもテーブルが潰れすぎないように最小幅 */
}

.data-section th,
.data-section td {
    border: 1px solid #ddd;
    padding: 12px 10px; /* パディングを調整 */
    text-align: left;
}

body.darkmode .data-section th,
body.darkmode .data-section td {
    background: #23272f;
    color: #f1f1f1;
    border-color: #444;
}

.data-section th {
    background-color: #f8f8f8; /* ヘッダー背景を薄いグレーに */
    font-weight: 700;
    color: #555;
    border-bottom: 2px solid #bdc3c7; /* ヘッダーの下線を強調 */
}

.data-section td {
    border-bottom: 1px solid #eee; /* 行の区切り線 */
}

.data-section tbody tr:nth-child(even) { /* 偶数行の背景色 */
    background-color: #f9f9f9;
}

.data-section tbody tr:hover { /* ホバー時の背景色 */
    background-color: #f0f0f0; /* 少し濃いグレー */
    cursor: pointer; /* クリックできることを示すカーソル */
}

.data-section td:last-child { /* 操作列の中央寄せ */
    text-align: center;
}

.delete-button {
    background-color: #e74c3c; /* 赤色 */
    color: white;
    border: none;
    padding: 6px 12px; /* パディング調整 */
    border-radius: 4px;
    cursor: pointer; /* ボタン上では常にポインター */
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.delete-button:hover {
    background-color: #c0392b; /* ホバー時 */
}

/* 編集ボタン */
.edit-button {
    background-color: #ffc107; /* 黄色 */
    color: #212529;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 6px;
    transition: background-color 0.3s ease;
}
.edit-button:hover {
    background-color: #e0a800;
}

/* 編集中の行のスタイル */
.data-section tbody tr.editing-row {
    background-color: #ffeeba; /* 薄い黄色など、編集中の分かりやすい色 */
    /* 必要であればボーダーや影なども */
}

body.darkmode .data-section tbody tr.editing-row {
    background-color: #444a58;
}

/* キャンセルボタンのスタイル */
#cancel-edit-button {
    display: none; /* 初期は非表示 */
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    transition: background-color 0.3s ease;
    margin-top: 10px;
    width: 100%;
}
#cancel-edit-button:hover {
    background-color: #5a6268;
}

body.darkmode #budget-alert {
    color: #ff7675;
}

/* レスポンシブ対応（画面幅が狭い場合） */
@media (max-width: 600px) {
    body {
        padding: 10px; /* 全体のパディングを減らす */
    }

    .container {
        padding: 10px;
    }

    .section {
         padding: 15px; /* カードのパディングを調整 */
         margin-bottom: 20px; /* セクション間の余白を調整 */
    }

    h1 {
        font-size: 1.8rem; /* タイトルを小さく */
        margin-bottom: 30px;
    }

     h2 {
         font-size: 1.3rem; /* 見出しを小さく */
         margin-top: 20px;
         margin-bottom: 15px;
     }


    /* フォーム要素 */
     .form-group {
         margin-bottom: 15px;
     }

    .form-group input[type="date"],
    .form-group input[type="number"],
    .form-group input[type="text"],
    .form-group select,
     .form-section button[type="submit"] {
        padding: 10px; /* パディングを調整 */
        font-size: 1rem;
     }

    /* 集計セクション */
     .summary-section p {
         font-size: 1rem;
         margin: 6px 0;
     }

     #balance {
         font-size: 1.1rem;
     }


    /* データテーブルの表示方法を変更（縧に積み重ねる） */
    .data-section table,
    .data-section thead,
    .data-section tbody,
    .data-section th,
    .data-section td,
    .data-section tr {
        display: block; /* テーブル要素をブロック要素に */
    }

    .data-section table {
        min-width: auto; /* 最小幅をリセット */
    }

    .data-section thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px; /* ヘッダーを非表示に */
    }

    .data-section tr {
        border: 1px solid #ccc;
        margin-bottom: 15px; /* 行間の余白を調整 */
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 各行にも軽い影 */
        padding: 10px; /* 各行の内側余白 */
    }

    .data-section td {
        border: none; /* セル間のボーダーをなくす */
        border-bottom: 1px solid #eee; /* 行内の区切り線 */
        position: relative;
        padding-left: 50%; /* ラベル分のスペースを確保 */
        text-align: right; /* 値を右寄せ */
        font-size: 0.95rem;
    }

    .data-section td:last-child {
        border-bottom: none; /* 最後のセル（操作）の下線はなし */
    }

    .data-section td:before { /* ラベルを表示 */
        position: absolute;
        top: 10px; /* 上からの位置を調整 */
        left: 10px; /* 左からの位置を調整 */
        width: 40%; /* ラベルの幅 */
        padding-right: 10px;
        white-space: nowrap;
        font-weight: 700; /* 太字に */
        color: #555; /* ラベルの色 */
        content: attr(data-label); /* data-label属性の値を表示 */
        text-align: left; /* ラベルを左寄せ */
    }

    /* 各列のラベルを設定 */
    .data-section td:nth-of-type(1):before { content: "日付"; }
    .data-section td:nth-of-type(2):before { content: "カテゴリ"; }
    .data-section td:nth-of-type(3):before { content: "金額"; }
    .data-section td:nth-of-type(4):before { content: "摘要"; }
    .data-section td:nth-of-type(5):before { content: "操作"; }

    .data-section td:last-child { /* 操作列 */
         text-align: right;
    }

    /* 削除ボタン */
    .delete-button {
         padding: 8px 15px; /* パディングを調整 */
         font-size: 1rem;
         /* レスポンシブ時の位置調整が必要であればここに追加 */
    }

    .fab-container {
        bottom: 16px;
        right: 16px;
    }
    .fab-main {
        width: 48px;
        height: 48px;
        font-size: 1.6rem;
    }
    .fab-action {
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
    }
}

/* 不要なコメントや重複を整理し、カテゴリ別集計リストのメッセージ表示用liタグのスタイルを追加 */

.category-summary-list li {
    color: #333;
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1rem;
}

body.darkmode .category-summary-list li {
    color: #f1f1f1;
    border-bottom: 1px solid #444;
}

.category-summary-list li:last-child {
    border-bottom: none;
}

.fixed-header-buttons {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1000;
    display: flex;
    gap: 12px;
}

/* FAB（フローティングアクションボタン）スタイル */
.fab-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.fab-main {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #3498db;
    color: #fff;
    font-size: 2rem;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: background 0.2s;
}
.fab-main:hover {
    background: #217dbb;
}
.fab-actions {
    display: flex !important;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 12px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px) scale(0.8);
    transition: opacity 0.25s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1);
}
.fab-container.open .fab-actions {
    opacity: 1;
    pointer-events: auto;
    transform: none;
}
.fab-action {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    color: #3498db;
    font-size: 1.4rem;
    border: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s, transform 0.25s cubic-bezier(.4,2,.6,1);
    opacity: 1;
    transform: none;
}
.fab-action:hover {
    background: #3498db;
    color: #fff;
}
.fab-action:nth-child(1) {
    transition-delay: 0.05s;
}
.fab-action:nth-child(2) {
    transition-delay: 0.12s;
}
@media (max-width: 600px) {
    .fab-container {
        bottom: 16px;
        right: 16px;
    }
    .fab-main {
        width: 48px;
        height: 48px;
        font-size: 1.6rem;
    }
    .fab-action {
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
    }
}

/* ボタンの共通デザインをsubmit-button風に統一 */
button,
input[type="button"],
input[type="submit"] {
    display: inline-block;
    padding: 12px 24px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    margin: 4px 0;
}
button:hover,
input[type="button"]:hover,
input[type="submit"]:hover {
    background-color: #217dbb;
    color: #fff;
}

/* 追加・設定・キャンセルなどのボタンも統一 */
#submit-button,
#cancel-edit-button,
#add-category-btn,
#set-category-budget,
#google-save-btn,
#google-load-btn {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 0;
}
#cancel-edit-button {
    background: #6c757d;
    color: #fff;
}
#cancel-edit-button:hover {
    background: #495057;
}

/* FABやFAB内のボタンは例外として個別デザインを維持 */
.fab-main, .fab-action {
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border-radius: 50%;
    font-size: 1.4rem;
    font-weight: 700;
    padding: 0;
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
}

@media (max-width: 600px) {
    button,
    input[type="button"],
    input[type="submit"] {
        font-size: 1rem;
        padding: 10px 0;
    }
    #submit-button,
    #cancel-edit-button,
    #add-category-btn,
    #set-category-budget,
    #google-save-btn,
    #google-load-btn {
        width: 100%;
        font-size: 1rem;
        padding: 10px 0;
    }
}
