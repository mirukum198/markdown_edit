const textInput = document.getElementById('textInput');
const increaseHeadingBtn = document.getElementById('increaseHeading');
const decreaseHeadingBtn = document.getElementById('decreaseHeading');
const copyTextBtn = document.getElementById('copyText');
const clearTextBtn = document.getElementById('clearText');
const searchPatternInput = document.getElementById('searchPattern');
const replaceWithInput = document.getElementById('replaceWith');
const replaceAllBtn = document.getElementById('replaceAll');
const collapseBracketsBtn = document.getElementById('collapseBrackets');
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

increaseHeadingBtn.addEventListener('click', () => {
    const text = textInput.value;
    const result = text.replace(/^(#+)(\s)/gm, '$1#$2');
    textInput.value = result;
    showNotification('見出しレベルを上げました');
});

decreaseHeadingBtn.addEventListener('click', () => {
    const text = textInput.value;
    const result = text.replace(/^(##+)(\s)/gm, (match, hashes, space) => {
        return hashes.slice(1) + space;
    });
    textInput.value = result;
    showNotification('見出しレベルを下げました');
});

collapseBracketsBtn.addEventListener('click', () => {
    const regex = /([\[\]])\1+/g;
    const before = textInput.value;
    const count = (before.match(regex) || []).length;
    textInput.value = before.replace(regex, '$1');
    showNotification(`${count}件集約しました`);
});

replaceAllBtn.addEventListener('click', () => {
    const pattern = searchPatternInput.value;
    if (!pattern) {
        showNotification('検索する文字列を入力してください', 'error');
        return;
    }

    let regex;
    try {
        regex = new RegExp(pattern, 'gm');
    } catch (err) {
        showNotification('正規表現が不正です: ' + err.message, 'error');
        return;
    }

    // \1 形式の後方参照を $1 に変換(元の $ は先にエスケープ)
    const replacement = replaceWithInput.value
        .replace(/\$/g, '$$$$')
        .replace(/\\(\d{1,2})/g, '$$$1');

    const before = textInput.value;
    const count = (before.match(regex) || []).length;
    textInput.value = before.replace(regex, replacement);
    showNotification(`${count}件置換しました`);
});

copyTextBtn.addEventListener('click', async () => {
    const text = textInput.value;

    if (!text) {
        showNotification('コピーするテキストがありません', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showNotification('クリップボードにコピーしました');
    } catch (err) {
        textInput.select();
        document.execCommand('copy');
        showNotification('クリップボードにコピーしました');
    }
});

clearTextBtn.addEventListener('click', () => {
    if (textInput.value && !confirm('テキストをクリアしてもよろしいですか?')) {
        return;
    }
    textInput.value = '';
    showNotification('テキストをクリアしました');
});

textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        increaseHeadingBtn.click();
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        decreaseHeadingBtn.click();
    }
});
